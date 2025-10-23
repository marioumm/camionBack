import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      validationSchema: Joi.object({
        NOTIFICATION_SERVICE_HOST: Joi.string(),
        NOTIFICATION_TCP_PORT: Joi.number().default(4010),
        FIREBASE_CREDENTIALS_BASE64: Joi.string().required(),
      }),
    }),
  ],
})
export class AppConfigModule {}
