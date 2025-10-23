import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  code: string;

  @Min(0.1)
  @Max(5)
  discountPercentage: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionPercentage?: number;
}
