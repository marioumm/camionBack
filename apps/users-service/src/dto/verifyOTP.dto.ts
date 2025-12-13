import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class VerifyDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  @Matches(/^\+?\d+$/, {
    message: 'Phone must be numeric and optionally start with +',
  })
  phone?: string;

  @IsString()
  @IsNotEmpty({ message: 'OTP code is required' })
  code: string;
}