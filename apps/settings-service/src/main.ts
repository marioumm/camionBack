import { NestFactory } from '@nestjs/core';
import { SettingsServiceModule } from './settings-service.module';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';


dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SettingsServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.TCP_BIND_HOST || '0.0.0.0',
        port: Number(process.env.SETTINGS_TCP_PORT),
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,         
    }),
  );
  await app.listen();

}
bootstrap();
