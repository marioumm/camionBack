// apps/wishlist-service/src/wishlist-service.service.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { WishlistItem } from './entities/wishlist.entity';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { RemoveFromWishlistDto } from './dto/remove-from-wishlist.dto';
import { firstValueFrom, timeout, catchError, of } from 'rxjs';
import { GoogleTranslateHelper } from './google-translate.helper';

@Injectable()
export class WishlistServiceService {
  constructor(
    @InjectRepository(WishlistItem)
    private readonly wishlistRepository: Repository<WishlistItem>,
    @Inject('USERS_SERVICE')
    private readonly usersClient: ClientProxy,
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
  ) {}

  private readonly logger = new Logger(WishlistServiceService.name);

  private async sendNotification(userId: string, title: string, body: string) {
    try {
      const { deviceToken } = await firstValueFrom(
        this.usersClient.send({ cmd: 'get-user-device-token' }, { userId }).pipe(
          timeout(3000),
          catchError(() => {
            this.logger.warn(`No notification token found for user ${userId}`);
            return of({ deviceToken: null });
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
            return of(null);
          }),
        ),
      );
    } catch (err) {
      this.logger.error('Error sending notification', err.stack);
    }
  }

  private getWishlistFilter(userId?: string, guestId?: string) {
    if (userId) return { userId };
    if (guestId) return { guestId };
    throw new RpcException({ statusCode: 400, message: 'Missing user or guest identifier' });
  }

  async addToWishlist(userId: string | undefined, guestId: string | undefined, dto: AddToWishlistDto) {
    try {
      const filter = this.getWishlistFilter(userId, guestId);
      
      const exists = await this.wishlistRepository.findOne({
        where: { ...filter, productId: dto.productId },
      });
      
      if (exists) return exists;

      const item = this.wishlistRepository.create({ 
        ...dto, 
        userId: userId || null,
        guestId: guestId || null,
      });

      if (userId) {
        await this.sendNotification(
          userId,
          'Item added to wishlist ❤️',
          `${dto.productName} has been added to your wishlist.`
        );
      }

      return await this.wishlistRepository.save(item);
    } catch (error) {
      throw toRpc(error, 'Failed to add to wishlist');
    }
  }

  async isProductInWishlist(userId: string | undefined, guestId: string | undefined, productId: string) {
    try {
      const filter = this.getWishlistFilter(userId, guestId);
      
      const wishlistItem = await this.wishlistRepository.findOne({
        where: { ...filter, productId },
      });
      
      return { exists: !!wishlistItem };
    } catch (error) {
      throw toRpc(error, 'Failed to check product in wishlist');
    }
  }

  async removeFromWishlist(userId: string | undefined, guestId: string | undefined, dto: RemoveFromWishlistDto) {
    try {
      const filter = this.getWishlistFilter(userId, guestId);
      
      const item = await this.wishlistRepository.findOne({
        where: { ...filter, productId: dto.productId },
      });
      
      if (!item) throw new RpcException({ statusCode: 404, message: 'Item not found in wishlist' });

      if (userId) {
        await this.sendNotification(
          userId,
          'Item removed from wishlist ❌',
          `${item.productName} has been removed from your wishlist.`
        );
      }

      return await this.wishlistRepository.remove(item);
    } catch (error) {
      throw toRpc(error, 'Failed to remove from wishlist');
    }
  }

  async getWishlist(userId?: string, guestId?: string, lang?: string) {
    try {
      const filter = this.getWishlistFilter(userId, guestId);
      const items = await this.wishlistRepository.find({ where: filter });

      if (!lang || lang === 'en') {
        return items;
      }

      const productNames = items.map(item => item.productName || '');
      
      const translatedNames = await GoogleTranslateHelper.translateBatch(
        productNames,
        lang,
        'en'
      );

      return items.map((item, index) => ({
        ...item,
        productName: translatedNames[index],
        originalProductName: item.productName,
      }));
    } catch (error) {
      throw toRpc(error, 'Failed to retrieve wishlist');
    }
  }

  async mergeGuestWishlistToUser(guestId: string, userId: string) {
    try {
      const guestItems = await this.wishlistRepository.find({ where: { guestId } });
      
      if (!guestItems.length) {
        return { message: 'No guest wishlist items to merge' };
      }

      for (const guestItem of guestItems) {
        const userItem = await this.wishlistRepository.findOne({
          where: { userId, productId: guestItem.productId },
        });

        if (!userItem) {
          guestItem.userId = userId;
          guestItem.guestId = null;
          await this.wishlistRepository.save(guestItem);
        }
      }

      await this.wishlistRepository.delete({ guestId });

      return { message: 'Guest wishlist merged successfully', itemsCount: guestItems.length };
    } catch (error) {
      this.logger.error('Failed to merge guest wishlist', error.stack);
      throw new RpcException({ statusCode: 500, message: 'Failed to merge guest wishlist' });
    }
  }
}

function toRpc(error: any, fallbackMsg?: string) {
  if (error instanceof RpcException) return error;
  const statusCode = error?.getStatus?.() || 500;
  const message = error?.message || fallbackMsg || 'Wishlist microservice error';
  return new RpcException({ statusCode, message });
}
