/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError } from 'rxjs';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { CartItem } from './entities/cart.entity';
import { GoogleTranslateHelper } from './google-translate.helper';

@Injectable()
export class CartServiceService {
  private readonly logger = new Logger(CartServiceService.name);
  private WC_BASE_URL = process.env.WC_BASE_URL;

  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,
    @Inject('USERS_SERVICE')
    private readonly usersClient: ClientProxy,
    @Inject('AFFILIATE_SERVICE')
    private readonly affiliateClient: ClientProxy,
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
  ) { }

  private async sendNotification(userId: string, title: string, body: string) {
    try {
      const { deviceToken } = await firstValueFrom(
        this.usersClient.send({ cmd: 'get-user-device-token' }, { userId }).pipe(
          timeout(3000),
          catchError(() => {
            this.logger.warn(`No notification token found for user ${userId}`);
            return [{ deviceToken: null }];
          }),
        ),
      );

      if (!deviceToken) return;

      await firstValueFrom(
        this.notificationsClient.send({ cmd: 'send_push_notification' }, {
          token: deviceToken,
          title,
          body,
          userId,
        }).pipe(
          timeout(3000),
          catchError((err) => {
            this.logger.error(`Failed to send notification: ${err.message}`);
            return [];
          }),
        ),
      );
    } catch (err) {
      this.logger.error('Error sending notification', err.stack);
    }
  }


  private async verifyUserExists(userId: string) {
    if (!userId) throw new UnauthorizedException('Missing User ID');
    const user = await firstValueFrom(
      this.usersClient.send({ cmd: 'users.getUserById' }, { id: userId }).pipe(
        timeout(3000),
        catchError(() => {
          throw new UnauthorizedException('User does not exist (timeout)');
        }),
      ),
    );
    if (!user) throw new UnauthorizedException('User does not exist');
  }

  private async fetchCoupon(code: string) {
    try {
      return await firstValueFrom(
        this.affiliateClient
          .send(
            { cmd: 'affiliate.getCouponByCode' },
            { code: code.trim().toUpperCase() },
          )
          .pipe(
            timeout(3000),
            catchError((err) => {
              console.error(
                '[CartService] fetchCoupon error:',
                JSON.stringify(err),
                err,
              );

              const statusCode =
                err?.statusCode ||
                err?.status ||
                err?.error?.statusCode ||
                err?.error?.status;

              const message =
                err?.message ||
                err?.error?.message ||
                err?.error?.response?.message ||
                err?.response?.message ||
                err?.response;

              if (typeof statusCode === 'number' && message) {
                if (statusCode === 404) throw new NotFoundException(message);
                if (statusCode === 409) throw new ConflictException(message);
                if (statusCode === 400) throw new BadRequestException(message);
                if (statusCode === 401)
                  throw new UnauthorizedException(message);
                throw new BadRequestException(message);
              }

              if (err instanceof RpcException) {
                throw new InternalServerErrorException(
                  'Microservice RPC exception: ' + (err.message || ''),
                );
              }

              if (
                err instanceof NotFoundException ||
                err instanceof ConflictException ||
                err instanceof BadRequestException ||
                err instanceof UnauthorizedException
              )
                throw err;

              throw new InternalServerErrorException(
                'Affiliate service error: ' +
                (message || JSON.stringify(err) || ''),
              );
            }),
          ),
      );
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof ConflictException ||
        err instanceof BadRequestException ||
        err instanceof UnauthorizedException
      )
        throw err;
      console.error('[CartService] fetchCoupon outer error:', err);
      throw new InternalServerErrorException('Failed to fetch coupon');
    }
  }

  async fetchProductFromWoo(productId: string) {
    try {
      const url = `${this.WC_BASE_URL}/products/sync/${productId}`;
      const res = await axios.get(url);
      const data = res.data;
      console.log(res);

      return {
        id: data.id,
        title: data.name,
        image: data.images?.[0]?.src || null,
        price: data.prices.sale_price || data.prices.price || '0',
      };
    } catch (error) {
      throw new NotFoundException('Product not found in WooCommerce');
    }
  }

  private getCartFilter(userId?: string, guestId?: string) {
    if (userId) return { userId };
    if (guestId) return { guestId };
    throw new BadRequestException('Missing user or guest identifier');
  }
  
  async addToCart(dto: AddToCartDto, userId?: string, guestId?: string) {
    try {
      if (userId) {
        await this.verifyUserExists(userId);
      }
  
      if (!dto.productId) throw new BadRequestException('Missing productId');
      if (!dto.quantity || dto.quantity <= 0)
        throw new BadRequestException('Quantity must be greater than 0');
  
      const product = await this.fetchProductFromWoo(dto.productId);
      if (!product)
        throw new NotFoundException('Product not found in WooCommerce');
  
      const filter = this.getCartFilter(userId, guestId);
      const existing = await this.cartRepository.findOne({
        where: { ...filter, productId: dto.productId },
      });
  
      let savedItem;
      if (existing) {
        existing.quantity += dto.quantity;
        existing.title = product.title;
        existing.image = product.image;
        existing.price = String(product.price);
        savedItem = await this.cartRepository.save(existing);
      } else {
        savedItem = await this.cartRepository.save({
          userId,
          guestId,
          productId: product.id,
          quantity: dto.quantity,
          title: product.title,
          image: product.image,
          price: String(product.price),
          variation: dto.variation,
        });
      }
  
      const totalPrice = Number(savedItem.price) * savedItem.quantity;
  
      if (userId) {
        await this.sendNotification(
          userId,
          'Product added to cart successfully 🛒',
          `${product.title} added to cart successfully.`
        );
      }
  
      return { ...savedItem, totalPrice };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
      )
        throw error;
      this.logger.error('Failed to add to cart', error.stack);
      throw new InternalServerErrorException('Failed to add to cart');
    }
  }

  async isProductInCart(userId?: string, guestId?: string, productId?: string) {
    if (userId) await this.verifyUserExists(userId);
    if (!productId) throw new BadRequestException('Missing productId');
    
    const filter = this.getCartFilter(userId, guestId);
    const item = await this.cartRepository.findOne({
      where: { ...filter, productId },
    });
    return { exists: !!item };
  }

  async updateQuantity(dto: UpdateCartItemDto, userId?: string, guestId?: string) {
    if (userId) await this.verifyUserExists(userId);
    if (!dto.productId) throw new BadRequestException('Missing productId');
    if (!dto.quantity || dto.quantity <= 0)
      throw new BadRequestException('Quantity must be greater than 0');
  
    const filter = this.getCartFilter(userId, guestId);
    const item = await this.cartRepository.findOne({
      where: { ...filter, productId: dto.productId },
    });
    if (!item) throw new NotFoundException('Cart item not found');
  
    item.quantity = dto.quantity;
    const saved = await this.cartRepository.save(item);
    const totalPrice = Number(saved.price) * saved.quantity;
    return { ...saved, totalPrice };
  }

async getCart(userId?: string, guestId?: string, lang?: string) {
  try {
    if (userId) await this.verifyUserExists(userId);
    
    const filter = this.getCartFilter(userId, guestId);
    const items = await this.cartRepository.find({ where: filter });
    
    if (!lang || lang === 'en') {
      return items.map((item) => ({
        ...item,
        totalPrice: Number(item.price) * item.quantity,
      }));
    }

    const translatedItems = await Promise.all(
      items.map(async (item) => {
        const textsToTranslate: string[] = [];
        
        if (item.title) {
          textsToTranslate.push(item.title);
        }
        
        const variationTexts: string[] = [];
        if (item.variation && Array.isArray(item.variation)) {
          item.variation.forEach(v => {
            if (v.attribute) variationTexts.push(v.attribute);
            if (v.value) variationTexts.push(v.value);
          });
        }
        textsToTranslate.push(...variationTexts);

        const translatedTexts = await GoogleTranslateHelper.translateBatch(
          textsToTranslate,
          lang,
          'en'
        );

        let translatedTitle = item.title;
        let translatedVariation = item.variation;
        
        if (item.title) {
          translatedTitle = translatedTexts[0];
        }

        if (item.variation && Array.isArray(item.variation)) {
          const variationStartIndex = item.title ? 1 : 0;
          let textIndex = variationStartIndex;
          
          translatedVariation = item.variation.map(v => ({
            attribute: v.attribute ? translatedTexts[textIndex++] : v.attribute,
            value: v.value ? translatedTexts[textIndex++] : v.value,
          }));
        }

        return {
          ...item,
          title: translatedTitle,
          variation: translatedVariation,
          originalTitle: item.title,
          originalVariation: item.variation,
          totalPrice: Number(item.price) * item.quantity,
        };
      })
    );

    return translatedItems;
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }
    this.logger.error('Failed to get cart', error.stack);
    throw new InternalServerErrorException('Failed to get cart');
  }
}


  async removeFromCart(dto: RemoveFromCartDto, userId?: string, guestId?: string) {
    if (userId) await this.verifyUserExists(userId);
    if (!dto.productId) throw new BadRequestException('Missing productId');
  
    const filter = this.getCartFilter(userId, guestId);
    const item = await this.cartRepository.findOne({
      where: { ...filter, productId: dto.productId },
    });
    if (!item) throw new NotFoundException('Cart item not found');
  
    await this.cartRepository.remove(item);
  
    if (userId) {
      await this.sendNotification(
        userId,
        'Item removed from cart 🛒',
        `${item.title} has been removed from your cart.`
      );
    }
    return { message: 'Item removed successfully' };
  }

  async clearCart(userId?: string, guestId?: string) {
    if (userId) await this.verifyUserExists(userId);
    
    const filter = this.getCartFilter(userId, guestId);
    const items = await this.cartRepository.find({ where: filter });
    if (!items.length) throw new NotFoundException('Cart is already empty');
  
    await this.cartRepository.remove(items);
  
    if (userId) {
      await this.sendNotification(
        userId,
        'Cart cleared 🧹',
        'Your cart has been cleared successfully.'
      );
    }
    return { message: 'Cart cleared successfully' };
  }

  async applyCouponToCart(userId?: string, guestId?: string, couponCode?: string) {
    try {
      if (userId) await this.verifyUserExists(userId);
      
      if (!couponCode) {
        throw new BadRequestException('Coupon code is required');
      }
      
      const filter = this.getCartFilter(userId, guestId);
      const cartItems = await this.cartRepository.find({ where: filter });
      if (!cartItems.length) throw new NotFoundException('Cart is empty');
  
      const coupon = await this.fetchCoupon(couponCode);
      if (!coupon) throw new NotFoundException('Invalid coupon code');
  
      await Promise.all(
        cartItems.map(async (item) => {
          item.couponCode = couponCode; 
          item.discountPercentage = coupon.discountPercentage;
          await this.cartRepository.save(item);
        })
      );
  
      const total = cartItems.reduce((sum, i) => {
        const priceNum = i.price ? parseFloat(i.price) : 0;
        return sum + priceNum * i.quantity;
      }, 0);
  
      const discount = (total * coupon.discountPercentage) / 100;
      const totalAfterDiscount = total - discount;
  
      return { cartItems, total, discount, totalAfterDiscount, coupon };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
      )
        throw error;
      this.logger.error('Failed to apply coupon', error.stack);
      throw new InternalServerErrorException('Failed to apply coupon');
    }
  }
  

  async mergeGuestCartToUser(guestId: string, userId: string) {
    try {
      const guestItems = await this.cartRepository.find({ where: { guestId } });
      
      if (!guestItems.length) {
        return { message: 'No guest cart items to merge' };
      }
  
      for (const guestItem of guestItems) {
        const userItem = await this.cartRepository.findOne({
          where: { userId, productId: guestItem.productId },
        });
  
        if (userItem) {
          userItem.quantity += guestItem.quantity;
          await this.cartRepository.save(userItem);
        } else {
          guestItem.userId = userId;
          guestItem.guestId = undefined; 
          await this.cartRepository.save(guestItem);
        }
      }
  
      await this.cartRepository.delete({ guestId });
  
      return { message: 'Guest cart merged successfully', itemsCount: guestItems.length };
    } catch (error) {
      this.logger.error('Failed to merge guest cart', error.stack);
      throw new InternalServerErrorException('Failed to merge guest cart');
    }
  }
  
}