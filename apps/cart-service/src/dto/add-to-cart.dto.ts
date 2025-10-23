import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';

class VariationDto {
  @IsString()
  @IsNotEmpty()
  attribute: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariationDto)
  variation: VariationDto[];
}
