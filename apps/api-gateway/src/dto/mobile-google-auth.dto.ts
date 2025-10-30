import { IsNotEmpty, IsString } from 'class-validator';

export class MobileGoogleAuthDto {
  @IsNotEmpty()
  @IsString()
  idToken: string;
}
