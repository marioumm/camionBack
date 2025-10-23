/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Affiliate, AffiliateStatus } from './entities/affiliate.entity';
import { Coupon } from './entities/coupon.entity';
import { CreateAffiliateRequestDto } from './dto/create-affiliate-request.dto';
import { ReviewAffiliateRequestDto } from './dto/review-affiliate-request.dto ';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateAffiliateDto } from './dto/update-affiliate.dto';
import { SearchCouponsDto } from './dto/search-coupons.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UserRole } from 'apps/users-service/src/entities/user.entity';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { AffiliateTransaction } from './entities/affiliate_transactions.entity';
import { AdminCreateCouponDto } from './dto/admin-create-coupon.dto';
import { UpdateCouponCommissionDto } from './dto/update-coupon-commission.dto';

@Injectable()
export class AffiliateServiceService {
  private readonly logger = new Logger(AffiliateServiceService.name);

  constructor(
    @InjectRepository(Affiliate)
    private readonly affiliateRepository: Repository<Affiliate>,
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    @InjectRepository(AffiliateTransaction)
    private readonly affiliateTransactionRepository: Repository<AffiliateTransaction>,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('NOTIFICATIONS_SERVICE') private readonly notificationsClient: ClientProxy,
  ) { }

  private async sendNotification(userId: string, title: string, body: string) {
    try {
      const { deviceToken } = await firstValueFrom(
        this.userClient.send({ cmd: 'get-user-device-token' }, { userId }).pipe(
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

  async createAffiliateRequest(dto: CreateAffiliateRequestDto, userId: string) {
    try {
      const existing = await this.affiliateRepository.findOne({ where: { userId } });

      if (existing) {
        if (existing.status === AffiliateStatus.REJECTED) {
          existing.fullName = dto.fullName;
          existing.gender = dto.gender;
          existing.nationality = dto.nationality;
          existing.bio = dto.bio;
          existing.status = AffiliateStatus.PENDING;

          const updatedAffiliate = await this.affiliateRepository.save(existing);
          return updatedAffiliate;
        }
        throw new RpcException({
          statusCode: 409,
          message: 'You already submitted a request or you are an affiliate',
        });
      }

      const affiliate = this.affiliateRepository.create({
        userId: userId,
        fullName: dto.fullName,
        gender: dto.gender,
        nationality: dto.nationality,
        bio: dto.bio,
        status: AffiliateStatus.PENDING,
        totalEarnings: 0,
        couponsCreated: 0,
      });

      const savedAffiliate = await this.affiliateRepository.save(affiliate);

      await this.sendNotification(
        userId,
        'Affiliate Request Received',
        'We have received your affiliate request and it will be reviewed soon.'
      );

      await this.sendNotification(
        userId,
        'Affiliate Request Created',
        `Your affiliate request has been created successfully. Your status is ${savedAffiliate.status}.`
      );

      return savedAffiliate;
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: error?.message || 'Failed to create affiliate request',
      });
    }
  }

  async getPendingRequests() {
    try {
      return await this.affiliateRepository.find({ where: { status: AffiliateStatus.PENDING } });
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: error?.message || 'Failed to get pending requests' });
    }
  }

  async getAffiliateStatus(userId: string) {
    try {
      const affiliate = await this.affiliateRepository.findOne({
        where: { userId },
        select: ['id', 'fullName', 'status'],
      });

      if (!affiliate) {
        throw new RpcException({ statusCode: 404, message: 'Affiliate request not found' });
      }

      if (affiliate.status === AffiliateStatus.APPROVED) {
        try {
          const resp = await firstValueFrom(
            this.userClient.send({ cmd: 'generate-token' }, { userId })
          );
          return {
            affiliateId: affiliate.id,
            fullName: affiliate.fullName,
            status: affiliate.status,
            type: 'affiliate',
            token: resp?.token
          };
        } catch (err) {
          return {
            affiliateId: affiliate.id,
            fullName: affiliate.fullName,
            status: affiliate.status,
            type: 'affiliate'
          };
        }
      }

      await this.sendNotification(
        userId,
        'Affiliate Status Check',
        `Your affiliate status is currently ${affiliate.status}.`
      );

      return {
        affiliateId: affiliate.id,
        fullName: affiliate.fullName,
        status: affiliate.status
      };
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: error?.message || 'Failed to get affiliate status' });
    }
  }

  async getCouponByCode(code: string) {
    try {
      const coupon = await this.couponRepository.findOne({ where: { code, isActive: true } });
      if (!coupon) throw new RpcException({ statusCode: 404, message: 'Coupon not found' });
      return { code: coupon.code, discountPercentage: coupon.discountPercentage };
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: error?.message || 'Failed to get coupon by code' });
    }
  }

  async reviewAffiliateRequest(dto: ReviewAffiliateRequestDto) {
    const affiliate = await this.affiliateRepository.findOne({ where: { id: dto.affiliateId } });
    if (!affiliate) throw new RpcException({ statusCode: 404, message: 'Affiliate not found' });

    affiliate.status = dto.status;
    const savedAffiliate = await this.affiliateRepository.save(affiliate);

    if (dto.status === AffiliateStatus.APPROVED) {
      await this.userClient.send(
        { cmd: 'update-user-role' },
        { userId: affiliate.userId, role: UserRole.AFFILIATE },
      ).toPromise();

      await this.sendNotification(
        affiliate.userId,
        'Affiliate Request Approved',
        `Your affiliate request has been approved. You can now start creating coupons.`
      );
    } else if (dto.status === AffiliateStatus.REJECTED) {
      await this.sendNotification(
        affiliate.userId,
        'Affiliate Request Rejected',
        'We regret to inform you that your affiliate request has been rejected. You can reapply after 30 days.'
      );
    }
    return savedAffiliate;
  }

  async createCoupon(affiliateId: string, dto: CreateCouponDto) {
    try {
      const affiliate = await this.affiliateRepository.findOne({
        where: { id: affiliateId, status: AffiliateStatus.APPROVED },
      });
      if (!affiliate) {
        throw new RpcException({ statusCode: 404, message: 'Affiliate not found or not approved' });
      }
      const existing = await this.couponRepository.findOne({ where: { code: dto.code } });
      if (existing) throw new RpcException({ statusCode: 409, message: 'Coupon code already exists' });
      const coupon = this.couponRepository.create({
        code: dto.code,
        discountPercentage: dto.discountPercentage,
        affiliate,
      });
      affiliate.couponsCreated += 1;
      await this.affiliateRepository.save(affiliate);

      await this.sendNotification(
        affiliate.userId,
        'Coupon Created',
        `A new coupon with code ${dto.code} has been created successfully.`
      );

      return this.couponRepository.save(coupon);
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: error?.message || 'Failed to create coupon' });
    }
  }

  async getCouponsByAffiliate(affiliateId: string) {
    try {
      const affiliate = await this.affiliateRepository.findOne({
        where: { id: affiliateId, status: AffiliateStatus.APPROVED },
      });

      if (!affiliate) {
        throw new RpcException({
          statusCode: 404,
          message: 'Affiliate not found or not approved',
        });
      }

      const coupons = await this.couponRepository.find({
        where: { affiliate: { id: affiliateId } },
        relations: ['affiliate'],
      });

      return coupons;
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: error?.message || 'Failed to get coupons by affiliate',
      });
    }
  }

  async searchCoupons(filters: SearchCouponsDto) {
    try {
      const query = this.couponRepository.createQueryBuilder('coupon')
        .leftJoinAndSelect('coupon.affiliate', 'affiliate');
      if (filters.code) {
        query.andWhere('LOWER(coupon.code) LIKE LOWER(:code)', { code: `%${filters.code}%` });
      }
      return await query.getMany();
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: error?.message || 'Failed to search coupons' });
    }
  }

  async deleteCoupon(couponId: string) {
    try {
      const coupon = await this.couponRepository.findOne({
        where: { id: couponId },
        relations: ['affiliate'],
      });
      if (!coupon) throw new RpcException({ statusCode: 404, message: 'Coupon not found' });
      if (coupon.affiliate) {
        coupon.affiliate.couponsCreated = Math.max(0, coupon.affiliate.couponsCreated - 1);
        await this.affiliateRepository.save(coupon.affiliate);
      }

      await this.sendNotification(
        coupon.affiliate.userId,
        'Coupon Deleted',
        `The coupon with code ${coupon.code} has been deleted successfully.`
      );

      return this.couponRepository.remove(coupon);
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: error?.message || 'Failed to delete coupon' });
    }
  }

  async getAllCoupons() {
    try {
      return await this.couponRepository.find({ relations: ['affiliate'] });
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: error?.message || 'Failed to get all coupons' });
    }
  }

  async addAffiliateCommission(couponCode: string, saleAmount: number) {
    const coupon = await this.couponRepository.findOne({
      where: { code: couponCode, isActive: true },
      relations: ['affiliate'],
    });

    if (!coupon || !coupon.affiliate) {
      throw new RpcException({ statusCode: 404, message: 'Coupon or affiliate not found' });
    }

    const affiliate = coupon.affiliate;

    const commissionRate = coupon.commissionPercentage || 5.0;
    const commission = saleAmount * (commissionRate / 100);

    affiliate.walletBalance += commission;
    affiliate.totalEarnings += commission;

    await this.affiliateRepository.save(affiliate);

    const transaction = this.affiliateTransactionRepository.create({
      affiliate,
      amount: commission,
      description: `Commission (${commissionRate}%) from coupon ${couponCode} on sale ${saleAmount}`,
    });
    await this.affiliateTransactionRepository.save(transaction);

    await this.sendNotification(
      affiliate.userId,
      'New Commission Added',
      `You earned ${commission.toFixed(2)} (${commissionRate}%) from coupon ${couponCode}.`
    );

    return { commission, walletBalance: affiliate.walletBalance };
  }

  async getWalletBalance(userId: string) {
    const affiliate = await this.affiliateRepository.findOne({ where: { userId } });
    if (!affiliate) throw new RpcException({ statusCode: 404, message: 'Affiliate not found' });
    return {
      walletBalance: affiliate.walletBalance,
    };
  }

  async getWalletTransactions(userId: string) {
    const affiliate = await this.affiliateRepository.findOne({
      where: { userId },
      relations: ['transactions'],
    });
    if (!affiliate) throw new RpcException({ statusCode: 404, message: 'Affiliate not found' });

    return affiliate.transactions.map(txn => ({
      id: txn.id,
      amount: txn.amount,
      description: txn.description,
      createdAt: txn.createdAt,
    }));
  }

  async updateAffiliate(dto: UpdateAffiliateDto) {
    try {
      const affiliate = await this.affiliateRepository.findOne({ where: { id: dto.id } });
      if (!affiliate) throw new RpcException({ statusCode: 404, message: 'Affiliate not found' });
      Object.assign(affiliate, {
        bio: dto.bio ?? affiliate.bio,
        referralLink: dto.referralLink ?? affiliate.referralLink,
      });

      await this.sendNotification(
        affiliate.userId,
        'Affiliate Updated',
        `Your affiliate profile has been updated successfully.`
      );

      return this.affiliateRepository.save(affiliate);
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: error?.message || 'Failed to update affiliate' });
    }
  }

  async deleteAffiliate(id: string) {
    try {
      const affiliate = await this.affiliateRepository.findOne({ where: { id } });
      if (!affiliate) throw new RpcException({ statusCode: 404, message: 'Affiliate not found' });
      if (affiliate.status !== AffiliateStatus.REJECTED) {
        throw new RpcException({ statusCode: 400, message: 'Only rejected affiliates can be deleted' });
      }
      await this.userClient.send(
        { cmd: 'update-user-role' },
        { userId: affiliate.userId, role: UserRole.USER },
      ).toPromise();
      await this.sendNotification(
        affiliate.userId,
        'Affiliate Deleted',
        `Your affiliate account has been deleted successfully.`
      );
      return this.affiliateRepository.remove(affiliate);
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: error?.message || 'Failed to delete affiliate' });
    }
  }

  async countAllAffiliates() {
    try {
      return await this.affiliateRepository.count();
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: error?.message || 'Failed to count affiliates' });
    }
  }

  async countApprovedAffiliates() {
    try {
      return await this.affiliateRepository.count({ where: { status: AffiliateStatus.APPROVED } });
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: error?.message || 'Failed to count approved affiliates' });
    }
  }

  async countPendingAffiliates() {
    try {
      return await this.affiliateRepository.count({ where: { status: AffiliateStatus.PENDING } });
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: error?.message || 'Failed to count pending affiliates' });
    }
  }

  async countRejectedAffiliates() {
    try {
      return await this.affiliateRepository.count({ where: { status: AffiliateStatus.REJECTED } });
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: error?.message || 'Failed to count rejected affiliates' });
    }
  }

  async countAllCoupons() {
    try {
      return await this.couponRepository.count();
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: error?.message || 'Failed to count coupons' });
    }
  }

  async adminCreateCoupon(dto: AdminCreateCouponDto) {
    try {
      const affiliate = await this.affiliateRepository.findOne({
        where: { id: dto.affiliateId, status: AffiliateStatus.APPROVED },
      });
      if (!affiliate) {
        throw new RpcException({ statusCode: 404, message: 'Affiliate not found or not approved' });
      }

      const existing = await this.couponRepository.findOne({ where: { code: dto.code } });
      if (existing) throw new RpcException({ statusCode: 409, message: 'Coupon code already exists' });

      const coupon = this.couponRepository.create({
        code: dto.code,
        discountPercentage: dto.discountPercentage,
        commissionPercentage: dto.commissionPercentage,
        affiliate,
      });

      affiliate.couponsCreated += 1;
      await this.affiliateRepository.save(affiliate);

      await this.sendNotification(
        affiliate.userId,
        'New Coupon Created',
        `Admin created coupon ${dto.code} for you with ${dto.commissionPercentage}% commission rate.`
      );

      return this.couponRepository.save(coupon);
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: error?.message || 'Failed to create coupon by admin' });
    }
  }

  async updateCouponCommission(dto: UpdateCouponCommissionDto) {
    try {
      const coupon = await this.couponRepository.findOne({
        where: { id: dto.couponId },
        relations: ['affiliate'],
      });

      if (!coupon) {
        throw new RpcException({ statusCode: 404, message: 'Coupon not found' });
      }

      const oldRate = coupon.commissionPercentage || 5.0;
      coupon.commissionPercentage = dto.commissionPercentage;

      const updatedCoupon = await this.couponRepository.save(coupon);

      await this.sendNotification(
        coupon.affiliate.userId,
        'Commission Rate Updated',
        `Commission rate for coupon ${coupon.code} updated from ${oldRate}% to ${dto.commissionPercentage}%.`
      );

      return updatedCoupon;
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: error?.message || 'Failed to update coupon commission' });
    }
  }

  async getAllAffiliates() {
    try {
      return await this.affiliateRepository.find();
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: error?.message || 'Failed to get all affiliates'
      });
    }
  }


}
