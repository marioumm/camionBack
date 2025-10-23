import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { AuthModule } from '@app/auth';
import { OrdersController } from './orders-service.controller';
import { OrdersService } from './orders-service.service';
import { CartItem } from 'apps/cart-service/src/entities/cart.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Order,CartItem]),
    AuthModule,
    ClientsModule.registerAsync([
      {
        name: 'USERS_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('USERS_HOST'),
            port: Number(config.get('USERS_TCP_PORT')),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'NOTIFICATIONS_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('NOTIFICATION_SERVICE_HOST'),
            port: Number(config.get('NOTIFICATION_TCP_PORT')),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'AFFILIATE_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('AFFILIATE_HOST'),
            port: Number(config.get('AFFILIATE_TCP_PORT')),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersServiceModule {}
