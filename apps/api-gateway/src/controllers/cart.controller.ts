// apps/api-gateway/src/cart/cart.controller.ts
import {
  Body,
  Controller,
  Delete,
  Inject,
  Patch,
  Post,
  UseGuards,
  HttpException,
  InternalServerErrorException,
  Get,
  Headers,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CheckProductInCartDto } from 'apps/cart-service/src/dto/check-product-in-cart.dto';
import { RemoveFromCartDto } from 'apps/cart-service/src/dto/remove-from-cart.dto';
import { UpdateCartItemDto } from 'apps/cart-service/src/dto/update-cart-item.dto';
import { AddToCartDto } from 'apps/cart-service/src/dto/add-to-cart.dto';
import { OptionalJwtAuthGuard } from 'libs/auth/src/optional-auth.guard';
import { OptionalUserId } from 'libs/auth/src/optional-user-id.decorator';

@Controller('cart')
@UseGuards(OptionalJwtAuthGuard)
export class CartController {
  constructor(
    @Inject('CART_SERVICE') private readonly cartClient: ClientProxy,
  ) {}

  private async callCart(pattern: any, data: any) {
    try {
      return await firstValueFrom(this.cartClient.send(pattern, data));
    } catch (err: any) {
      const statusCode =
        err?.statusCode ||
        err?.status ||
        err?.error?.statusCode ||
        err?.error?.status;
      const message =
        err?.message || err?.error?.message || err?.error?.response?.message;
      if (typeof statusCode === 'number' && message) {
        throw new HttpException(message, statusCode);
      }
      if (err instanceof HttpException) throw err;
      console.error('[GATEWAY] RAW ERROR FROM CART:', JSON.stringify(err), err);
      throw new InternalServerErrorException('Cart service unavailable');
    }
  }

  private getIdentifier(
    userId: string | undefined,
    guestId: string | undefined,
  ) {
    if (userId) return { userId };
    if (guestId) return { guestId };
    throw new HttpException('Missing user or guest identifier', 400);
  }

  @Post('add')
  async addToCart(
    @Body() dto: AddToCartDto,
    @OptionalUserId() userId: string | undefined,
    @Headers('x-guest-id') guestId: string | undefined,
  ) {
    const identifier = this.getIdentifier(userId, guestId);
    return this.callCart({ cmd: 'add_to_cart' }, { ...dto, ...identifier });
  }

  @Post('check-product')
  async checkProductInCart(
    @Body() dto: CheckProductInCartDto,
    @OptionalUserId() userId: string | undefined,
    @Headers('x-guest-id') guestId: string | undefined,
  ) {
    const identifier = this.getIdentifier(userId, guestId);
    return this.callCart(
      { cmd: 'cart.isProductInCart' },
      { productId: dto.productId, ...identifier },
    );
  }

  @Post('apply-coupon')
  async applyCouponToCart(
    @Body() dto: { couponCode: string },
    @OptionalUserId() userId: string | undefined,
    @Headers('x-guest-id') guestId: string | undefined,
  ) {
    const identifier = this.getIdentifier(userId, guestId);
    return this.callCart(
      { cmd: 'apply_coupon_to_cart' },
      { couponCode: dto.couponCode, ...identifier },
    );
  }

  @Patch('update')
  async updateQuantity(
    @Body() dto: UpdateCartItemDto,
    @OptionalUserId() userId: string | undefined,
    @Headers('x-guest-id') guestId: string | undefined,
  ) {
    const identifier = this.getIdentifier(userId, guestId);
    return this.callCart(
      { cmd: 'update_cart_quantity' },
      { ...dto, ...identifier },
    );
  }

  @Delete('remove')
  async removeFromCart(
    @Body() dto: RemoveFromCartDto,
    @OptionalUserId() userId: string | undefined,
    @Headers('x-guest-id') guestId: string | undefined,
  ) {
    const identifier = this.getIdentifier(userId, guestId);
    return this.callCart(
      { cmd: 'remove_from_cart' },
      { ...dto, ...identifier },
    );
  }

  @Get('get')
  async getCart(
    @OptionalUserId() userId: string | undefined,
    @Headers('x-guest-id') guestId: string | undefined,
    @Headers('accept-language') acceptLanguage?: string,
    @Query('lang') queryLang?: string,
  ) {
    const identifier = this.getIdentifier(userId, guestId);

    const lang = queryLang || this.extractLanguage(acceptLanguage);

    return this.callCart({ cmd: 'get_cart' }, { ...identifier, lang });
  }

  private extractLanguage(acceptLanguage?: string): string {
    if (!acceptLanguage) return 'en';

    const lang = acceptLanguage.split(',')[0].split('-')[0].trim();

    return lang || 'en';
  }

  @Delete('clear')
  async clearCart(
    @OptionalUserId() userId: string | undefined,
    @Headers('x-guest-id') guestId: string | undefined,
  ) {
    const identifier = this.getIdentifier(userId, guestId);
    return this.callCart({ cmd: 'clear_cart' }, identifier);
  }
}
