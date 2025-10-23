import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express'; 
// import { JwtAuthGuard } from '@app/auth';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';


dotenv.config();
dotenv.config({ path: __dirname + '../../../.env' });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);



  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );


  await app.listen(process.env.API_GATEWAY_HTTP_PORT || 5000);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.TCP_HOST,
      port: parseInt(process.env.API_GATEWAY_TCP_PORT || '4000'),
    },
  });

  app.use(
    '/orders/stripe-webhook',
    bodyParser.raw({ type: 'application/json' }),
  );


  await app.startAllMicroservices();
}
bootstrap();
