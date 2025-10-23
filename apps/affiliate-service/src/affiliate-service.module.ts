import { Module } from '@nestjs/common';
import { AffiliateServiceController } from './affiliate-service.controller';
import { AffiliateServiceService } from './affiliate-service.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Affiliate } from './entities/affiliate.entity';
import { Coupon } from './entities/coupon.entity';
import { AuthModule } from '@app/auth';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AffiliateTransaction } from './entities/affiliate_transactions.entity';

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
    TypeOrmModule.forFeature([Affiliate, Coupon , AffiliateTransaction]),
    AuthModule,

    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USERS_HOST,
          port: Number(process.env.USERS_TCP_PORT),
        },
      },
    ]),

    ClientsModule.register([
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NOTIFICATION_SERVICE_HOST,
          port: Number(process.env.NOTIFICATION_TCP_PORT),
        },
      },
    ]),
  ],
  controllers: [AffiliateServiceController],
  providers: [AffiliateServiceService],
})
export class AffiliateServiceModule { }
