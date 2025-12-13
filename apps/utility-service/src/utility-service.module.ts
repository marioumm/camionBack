import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UtilityServiceController } from './utility-service.controller';
import { UtilityServiceService } from './utility-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [UtilityServiceController],
  providers: [UtilityServiceService],
})
export class UtilityServiceModule {}
