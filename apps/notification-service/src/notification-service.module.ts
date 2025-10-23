import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [AppConfigModule, NotificationModule],
})
export class AppModule {}
