import { IsEmail,  IsOptional, IsPhoneNumber, IsString } from 'class-validator';


export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('EG') 
  phone?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

}
