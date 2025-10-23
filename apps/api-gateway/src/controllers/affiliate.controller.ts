import {
  Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAffiliateRequestDto } from 'apps/affiliate-service/src/dto/create-affiliate-request.dto';
import { CreateCouponDto } from 'apps/affiliate-service/src/dto/create-coupon.dto';
import { ReviewAffiliateRequestDto } from 'apps/affiliate-service/src/dto/review-affiliate-request.dto ';
import { SearchCouponsDto } from 'apps/affiliate-service/src/dto/search-coupons.dto';
import { UserRole } from 'apps/users-service/src/entities/user.entity';
import { JwtAuthGuard } from 'libs/auth/src';
import { Roles } from 'libs/auth/src/roles.decorator';
import { RolesGuard } from 'libs/auth/src/roles.guard';
import { CurrentAffiliateId } from 'libs/auth/src/current-affiliate-id.decorator';
import { CurrentUserId } from 'libs/auth/src/current-user.decorator';
import { AdminCreateCouponDto } from 'apps/affiliate-service/src/dto/admin-create-coupon.dto';
import { UpdateCouponCommissionDto } from 'apps/affiliate-service/src/dto/update-coupon-commission.dto';

@Controller('affiliates')
export class AffiliateController {
  constructor(
    @Inject('AFFILIATE_SERVICE') private readonly affiliateClient: ClientProxy,
  ) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post('request')
  requestAffiliate(
    @Body() dto: CreateAffiliateRequestDto,
    @CurrentUserId() userId: string,
  ) {
    return this.affiliateClient.send(
      { cmd: 'create_affiliate_request' },
      { ...dto, userId },
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('requests/pending')
  getPendingRequests() {
    return this.affiliateClient.send({ cmd: 'get_pending_affiliate_requests' }, {});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AFFILIATE, UserRole.USER)
  @Get('me/status')
  getAffiliateStatus(@CurrentUserId() userId: string) {
    return this.affiliateClient.send({ cmd: 'get_affiliate_status' }, { userId });
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('requests/review')
  reviewRequest(@Body() dto: ReviewAffiliateRequestDto) {
    return this.affiliateClient.send({ cmd: 'review_affiliate_request' }, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AFFILIATE)
  @Post('coupon')
  createCoupon(
    @Body() dto: CreateCouponDto,
    @CurrentAffiliateId() affiliateId: string,
  ) {
    return this.affiliateClient.send({ cmd: 'create_coupon' }, { ...dto, affiliateId });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AFFILIATE)
  @Get('coupon/me')
  getCoupons(@CurrentAffiliateId() affiliateId: string) {
    return this.affiliateClient.send({ cmd: 'get_coupons_by_affiliate' }, { affiliateId });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('coupon/search')
  searchCoupons(@Body() dto: SearchCouponsDto) {
    return this.affiliateClient.send({ cmd: 'search_coupons' }, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('coupon/:id')
  deleteCoupon(@Param('id') couponId: string) {
    return this.affiliateClient.send({ cmd: 'delete_coupon' }, couponId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AFFILIATE)
  @Patch(':id')
  updateAffiliate(@Param('id') id: string, @Body() dto: any) {
    return this.affiliateClient.send({ cmd: 'update_affiliate' }, { id, ...dto });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.AFFILIATE)
  @Delete(':id')
  deleteAffiliate(@Param('id') id: string) {
    return this.affiliateClient.send({ cmd: 'delete_affiliate' }, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('coupons/all')
  getAllCoupons() {
    return this.affiliateClient.send({ cmd: 'get_all_coupons' }, {});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AFFILIATE)
  @Get('wallet')
  getWalletBalance(@CurrentUserId() userId: string) {
    return this.affiliateClient.send({ cmd: 'affiliate.getWalletBalance' }, { userId });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AFFILIATE)
  @Get('wallet/transactions')
  getWalletTransactions(@CurrentUserId() userId: string) {
    return this.affiliateClient.send({ cmd: 'affiliate.getWalletTransactions' }, { userId });
  }

  @Get('/count/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  countAllAffiliates() {
    return this.affiliateClient.send({ cmd: 'count_all_affiliates' }, {});
  }

  @Get('/count/approved')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  countApprovedAffiliates() {
    return this.affiliateClient.send({ cmd: 'count_approved_affiliates' }, {});
  }

  @Get('/count/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  countPendingAffiliates() {
    return this.affiliateClient.send({ cmd: 'count_pending_affiliates' }, {});
  }

  @Get('/count/rejected')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  countRejectedAffiliates() {
    return this.affiliateClient.send({ cmd: 'count_rejected_affiliates' }, {});
  }

  @Get('/count/coupons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  countAllCoupons() {
    return this.affiliateClient.send({ cmd: 'count_all_coupons' }, {});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/coupon')
  adminCreateCoupon(@Body() dto: AdminCreateCouponDto) {
    return this.affiliateClient.send({ cmd: 'admin_create_coupon' }, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('coupon/commission')
  updateCouponCommission(@Body() dto: UpdateCouponCommissionDto) {
    return this.affiliateClient.send({ cmd: 'update_coupon_commission' }, dto);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllAffiliates() {
    return this.affiliateClient.send({ cmd: 'get_all_affiliates' }, {});
  }


}
