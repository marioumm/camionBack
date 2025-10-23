import { IsString, IsOptional, IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ShippingOptionDto {
  @IsString()
  method_id: string;

  @IsString()
  title: string;

  @IsString()
  cost: string;
}

class ShippingAddressDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address_1: string;

  @IsOptional()
  @IsString()
  address_2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postcode: string;

  @IsString()
  country: string;
}

export class UpdateAddressDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address_1: string;

  @IsOptional()
  @IsString()
  address_2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postcode: string;

  @IsString()
  country: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shipping_address?: ShippingAddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ShippingOptionDto)
  shipping_option?: ShippingOptionDto;
}
