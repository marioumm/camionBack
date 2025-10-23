import { Module } from '@nestjs/common';
import { SettingsServiceController } from './settings-service.controller';
import { SettingsServiceService } from './settings-service.service';
import { S3Service } from './s3.service';
import { ConfigModule } from '@nestjs/config'; 

@Module({
  imports: [
      ConfigModule.forRoot({
      isGlobal: true, 
    }),
  ],
  controllers: [SettingsServiceController],
  providers: [SettingsServiceService , S3Service],
})
export class SettingsServiceModule {}
