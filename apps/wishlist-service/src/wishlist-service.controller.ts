// apps/wishlist-service/src/wishlist-service.controller.ts
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { WishlistServiceService } from './wishlist-service.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { RemoveFromWishlistDto } from './dto/remove-from-wishlist.dto';

function mapException(error: any) {
  if (error instanceof RpcException) return error;
  if (
    error instanceof NotFoundException ||
    error instanceof BadRequestException ||
    error instanceof ConflictException ||
    error instanceof UnauthorizedException
  ) {
    return new RpcException({
      statusCode: error.getStatus(),
      message: error.message,
    });
  }

  return new RpcException({
    statusCode: 500,
    message: error?.message || 'Unknown error from wishlist microservice',
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
export class WishlistServiceController {
  constructor(private readonly wishlistService: WishlistServiceService) {}

  @MessagePattern({ cmd: 'add_to_wishlist' })
  async addToWishlist(@Payload() data: { userId?: string; guestId?: string } & AddToWishlistDto) {
    try {
      const { userId, guestId, ...dto } = data;
      return await this.wishlistService.addToWishlist(userId, guestId, dto);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'wishlist.isProductInWishlist' })
  async isProductInWishlist(
    @Payload() data: { userId?: string; guestId?: string; productId: string },
  ) {
    try {
      return await this.wishlistService.isProductInWishlist(data.userId, data.guestId, data.productId);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'remove_from_wishlist' })
  async removeFromWishlist(@Payload() data: { userId?: string; guestId?: string } & RemoveFromWishlistDto) {
    try {
      const { userId, guestId, ...dto } = data;
      return await this.wishlistService.removeFromWishlist(userId, guestId, dto);
    } catch (error) {
      throw mapException(error);
    }
  }

@MessagePattern({ cmd: 'get_wishlist' })
async getWishlist(@Payload() data: { userId?: string; guestId?: string; lang?: string }) {
  try {
    return await this.wishlistService.getWishlist(data.userId, data.guestId, data.lang);
  } catch (error) {
    throw mapException(error);
  }
}

  @MessagePattern({ cmd: 'merge_guest_wishlist' })
  async mergeGuestWishlist(@Payload() { guestId, userId }: { guestId: string; userId: string }) {
    try {
      return await this.wishlistService.mergeGuestWishlistToUser(guestId, userId);
    } catch (error) {
      throw mapException(error);
    }
  }
}
