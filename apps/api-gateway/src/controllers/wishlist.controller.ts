import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  UseGuards,
  Headers,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AddToWishlistDto } from 'apps/wishlist-service/src/dto/add-to-wishlist.dto';
import { CheckProductInWishlistDto } from 'apps/wishlist-service/src/dto/check-product-in-wishlist.dto';
import { RemoveFromWishlistDto } from 'apps/wishlist-service/src/dto/remove-from-wishlist.dto';
import { OptionalJwtAuthGuard } from 'libs/auth/src/optional-auth.guard';
import { OptionalUserId } from 'libs/auth/src/optional-user-id.decorator';

@Controller('wishlist')
@UseGuards(OptionalJwtAuthGuard)
export class WishlistController {
  constructor(
    @Inject('WISHLIST_SERVICE') private readonly wishlistClient: ClientProxy,
  ) {}

  private getIdentifier(
    userId: string | undefined,
    guestId: string | undefined,
  ) {
    if (userId) return { userId };
    if (guestId) return { guestId };
    throw new Error('Missing user or guest identifier');
  }

  private extractLanguage(acceptLanguage?: string): string {
    if (!acceptLanguage) return 'en';
    const lang = acceptLanguage.split(',')[0].split('-')[0].trim();
    return lang || 'en';
  }

  @Post('add')
  addToWishlist(
    @Body() body: AddToWishlistDto,
    @OptionalUserId() userId: string | undefined,
    @Headers('x-guest-id') guestId: string | undefined,
  ) {
    const identifier = this.getIdentifier(userId, guestId);
    return this.wishlistClient.send(
      { cmd: 'add_to_wishlist' },
      { ...body, ...identifier },
    );
  }

  @Post('check-product')
  checkProductInWishlist(
    @Body() dto: CheckProductInWishlistDto,
    @OptionalUserId() userId: string | undefined,
    @Headers('x-guest-id') guestId: string | undefined,
  ) {
    const identifier = this.getIdentifier(userId, guestId);
    return this.wishlistClient.send(
      { cmd: 'wishlist.isProductInWishlist' },
      { productId: dto.productId, ...identifier },
    );
  }

  @Delete('remove')
  removeFromWishlist(
    @Body() body: RemoveFromWishlistDto,
    @OptionalUserId() userId: string | undefined,
    @Headers('x-guest-id') guestId: string | undefined,
  ) {
    const identifier = this.getIdentifier(userId, guestId);
    return this.wishlistClient.send(
      { cmd: 'remove_from_wishlist' },
      { ...body, ...identifier },
    );
  }

  @Get('get')
  getWishlist(
    @OptionalUserId() userId: string | undefined,
    @Headers('x-guest-id') guestId: string | undefined,
    @Headers('accept-language') acceptLanguage?: string,
    @Query('lang') queryLang?: string,
  ) {
    const identifier = this.getIdentifier(userId, guestId);
    const lang = queryLang || this.extractLanguage(acceptLanguage);

    return this.wishlistClient.send(
      { cmd: 'get_wishlist' },
      { ...identifier, lang },
    );
  }
}
