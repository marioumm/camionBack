import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';

async function bootstrap() {
 const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.NOTIFICATION_SERVICE_HOST,
      port: Number(process.env.NOTIFICATION_TCP_PORT || ""),
    },
  });

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
