import { IsString, IsNumber, Min, Max } from 'class-validator';

export class AdminCreateCouponDto {
  @IsString()
  affiliateId: string;

  @IsString()
  code: string;

  @IsNumber()
  @Min(0.1)
  @Max(100)
  discountPercentage: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  commissionPercentage: number;
}
