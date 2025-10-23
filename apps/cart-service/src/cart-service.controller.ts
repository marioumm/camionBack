/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { CartServiceService } from './cart-service.service';

function mapException(error: any) {
  if (
    error instanceof NotFoundException ||
    error instanceof ConflictException ||
    error instanceof BadRequestException ||
    error instanceof UnauthorizedException
  ) {
    return new RpcException({
      statusCode: error.getStatus(),
      message: error.message,
    });
  }
  return new RpcException({
    statusCode: 500,
    message: error?.message || 'Unknown error from cart microservice',
  });
}

@UsePipes(
  new ValidationPipe({
    exceptionFactory: (errors) =>
      new RpcException({
        statusCode: 400,
        message: 'Validation failed',
        details: errors,
      }),
  }),
)
@Controller()
export class CartServiceController {
  constructor(private readonly cartService: CartServiceService) {}

  @MessagePattern({ cmd: 'add_to_cart' })
  async addToCart(
    @Payload()
    {
      userId,
      guestId,
      ...dto
    }: AddToCartDto & { userId?: string; guestId?: string },
  ) {
    try {
      return await this.cartService.addToCart(
        dto as AddToCartDto,
        userId,
        guestId,
      );
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'cart.isProductInCart' })
  async isProductInCart(
    @Payload()
    {
      userId,
      guestId,
      productId,
    }: {
      userId?: string;
      guestId?: string;
      productId: string;
    },
  ) {
    try {
      return await this.cartService.isProductInCart(userId, guestId, productId);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'apply_coupon_to_cart' })
  async applyCouponToCart(
    @Payload()
    {
      userId,
      guestId,
      couponCode,
    }: {
      userId?: string;
      guestId?: string;
      couponCode: string;
    },
  ) {
    try {
      return await this.cartService.applyCouponToCart(
        userId,
        guestId,
        couponCode,
      );
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'update_cart_quantity' })
  async updateQuantity(
    @Payload()
    {
      userId,
      guestId,
      ...dto
    }: UpdateCartItemDto & { userId?: string; guestId?: string },
  ) {
    try {
      return await this.cartService.updateQuantity(
        dto as UpdateCartItemDto,
        userId,
        guestId,
      );
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'remove_from_cart' })
  async removeFromCart(
    @Payload()
    {
      userId,
      guestId,
      ...dto
    }: RemoveFromCartDto & { userId?: string; guestId?: string },
  ) {
    try {
      return await this.cartService.removeFromCart(
        dto as RemoveFromCartDto,
        userId,
        guestId,
      );
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'get_cart' })
  async getCart(
    @Payload()
    {
      userId,
      guestId,
      lang,
    }: {
      userId?: string;
      guestId?: string;
      lang?: string;
    },
  ) {
    try {
      return await this.cartService.getCart(userId, guestId, lang);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'clear_cart' })
  async clearCart(
    @Payload() { userId, guestId }: { userId?: string; guestId?: string },
  ) {
    try {
      return await this.cartService.clearCart(userId, guestId);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'merge_guest_cart' })
  async mergeGuestCart(
    @Payload() { guestId, userId }: { guestId: string; userId: string },
  ) {
    try {
      return await this.cartService.mergeGuestCartToUser(guestId, userId);
    } catch (error) {
      throw mapException(error);
    }
  }
}
