/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller, UsePipes, ValidationPipe, NotFoundException,
  ConflictException, BadRequestException, UnauthorizedException,
} from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AffiliateServiceService } from './affiliate-service.service';
import { CreateAffiliateRequestDto } from './dto/create-affiliate-request.dto';
import { ReviewAffiliateRequestDto } from './dto/review-affiliate-request.dto ';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateAffiliateDto } from './dto/update-affiliate.dto';
import { SearchCouponsDto } from './dto/search-coupons.dto';
import { AdminCreateCouponDto } from './dto/admin-create-coupon.dto';
import { UpdateCouponCommissionDto } from './dto/update-coupon-commission.dto';

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
    message: error?.message || 'Unknown error from affiliate microservice',
  });
}

@UsePipes(new ValidationPipe({
  exceptionFactory: (errors) =>
    new RpcException({
      statusCode: 400,
      message: 'Validation failed',
      details: errors,
    }),
}))
@Controller()
export class AffiliateServiceController {
  constructor(private readonly affiliateService: AffiliateServiceService) { }

  @MessagePattern({ cmd: 'create_affiliate_request' })
  async handleAffiliateRequest(@Payload() data: CreateAffiliateRequestDto & { userId: string }) {
    try {
      const { userId, ...dto } = data;
      return await this.affiliateService.createAffiliateRequest(dto as CreateAffiliateRequestDto, userId);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'get_pending_affiliate_requests' })
  async handleGetPendingRequests() {
    try {
      return await this.affiliateService.getPendingRequests();
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'get_affiliate_status' })
  async handleGetAffiliateStatus(@Payload() data: { userId: string }) {
    try {
      return await this.affiliateService.getAffiliateStatus(data.userId);
    } catch (error) {
      throw mapException(error);
    }
  }


  @MessagePattern({ cmd: 'review_affiliate_request' })
  async handleReviewRequest(@Payload() dto: ReviewAffiliateRequestDto) {
    try {
      return await this.affiliateService.reviewAffiliateRequest(dto);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'create_coupon' })
  async handleCreateCoupon(@Payload() data: { affiliateId: string } & CreateCouponDto) {
    try {
      const { affiliateId, ...dto } = data;
      return await this.affiliateService.createCoupon(affiliateId, dto);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'get_coupons_by_affiliate' })
  async handleGetCouponsByAffiliate(@Payload() data: { affiliateId: string }) {
    try {
      return await this.affiliateService.getCouponsByAffiliate(data.affiliateId);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'search_coupons' })
  async searchCoupons(@Payload() dto: SearchCouponsDto) {
    try {
      return await this.affiliateService.searchCoupons(dto);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'delete_coupon' })
  async deleteCoupon(@Payload() id: string) {
    try {
      return await this.affiliateService.deleteCoupon(id);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'update_affiliate' })
  async handleUpdateAffiliate(@Payload() dto: UpdateAffiliateDto) {
    try {
      return await this.affiliateService.updateAffiliate(dto);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'delete_affiliate' })
  async handleDeleteAffiliate(@Payload() id: string) {
    try {
      return await this.affiliateService.deleteAffiliate(id);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'get_all_coupons' })
  async handleGetAllCoupons() {
    try {
      return await this.affiliateService.getAllCoupons();
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern('affiliate.addCommission')
  async handleAddCommission(data: { couponCode: string; saleAmount: number }) {
    try {
      const { couponCode, saleAmount } = data;
      return await this.affiliateService.addAffiliateCommission(couponCode, saleAmount);
    } catch (error) {
      throw mapException(error);
    }

  }

  @MessagePattern({ cmd: 'affiliate.getWalletBalance' })
  async handleGetWalletBalance(@Payload() data: { userId: string }) {
    try {
      return await this.affiliateService.getWalletBalance(data.userId);
    } catch (err) {
      throw mapException(err);
    }
  }

  @MessagePattern({ cmd: 'affiliate.getWalletTransactions' })
  async handleGetWalletTransactions(@Payload() data: { userId: string }) {
    try {
      return await this.affiliateService.getWalletTransactions(data.userId);
    } catch (err) {
      throw mapException(err);
    }
  }

  @MessagePattern({ cmd: 'affiliate.getCouponByCode' })
  async getCouponByCode(@Payload() data: { code: string }) {
    return this.affiliateService.getCouponByCode(data.code);
  }

  @MessagePattern({ cmd: 'count_all_affiliates' })
  async countAllAffiliates() {
    return await this.affiliateService.countAllAffiliates();
  }

  @MessagePattern({ cmd: 'count_approved_affiliates' })
  async countApprovedAffiliates() {
    return await this.affiliateService.countApprovedAffiliates();
  }

  @MessagePattern({ cmd: 'count_pending_affiliates' })
  async countPendingAffiliates() {
    return await this.affiliateService.countPendingAffiliates();
  }

  @MessagePattern({ cmd: 'count_rejected_affiliates' })
  async countRejectedAffiliates() {
    return await this.affiliateService.countRejectedAffiliates();
  }

  @MessagePattern({ cmd: 'count_all_coupons' })
  async countAllCoupons() {
    return await this.affiliateService.countAllCoupons();
  }

  @MessagePattern({ cmd: 'admin_create_coupon' })
  async handleAdminCreateCoupon(@Payload() dto: AdminCreateCouponDto) {
    try {
      return await this.affiliateService.adminCreateCoupon(dto);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'update_coupon_commission' })
  async handleUpdateCouponCommission(@Payload() dto: UpdateCouponCommissionDto) {
    try {
      return await this.affiliateService.updateCouponCommission(dto);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'get_all_affiliates' })
  async handleGetAllAffiliates() {
    try {
      return await this.affiliateService.getAllAffiliates();
    } catch (error) {
      throw mapException(error);
    }
  }



}
