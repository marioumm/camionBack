import { IsString, IsNumber, Min, Max } from 'class-validator';

export class UpdateCouponCommissionDto {
  @IsString()
  couponId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  commissionPercentage: number;
}
