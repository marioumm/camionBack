import { IsEmail,IsPhoneNumber,Matches, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  @Matches(/^\+?\d+$/, {
    message: 'Phone must be numeric and optionally start with +',
  })
  phone?: string;
}