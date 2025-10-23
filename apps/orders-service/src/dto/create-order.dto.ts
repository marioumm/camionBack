import { IsArray, IsString, ValidateNested, IsOptional, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

class ShippingAddressDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  address_1?: string;

  @IsOptional()
  @IsString()
  address_2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  postcode?: string;

  @IsOptional()
  @IsString()
  country?: string;
}

class CustomerDataDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  couponCode?: string


  @IsOptional()
  @IsString()
  address_1?: string;

  @IsOptional()
  @IsString()
  address_2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  postcode?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shipping_address?: ShippingAddressDto;

  @IsOptional()
  shipping_option?: any;
}

class PaymentDataDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class CreateOrderDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerDataDto)
  customer_data?: CustomerDataDto;

  @IsString()
  payment_method: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDataDto)
  payment_data: PaymentDataDto[];

  @IsOptional()
  @IsString()
  success_url?: string;

  @IsOptional()
  @IsString()
  cancel_url?: string;
}
