import { Module } from '@nestjs/common';
import { WishlistServiceController } from './wishlist-service.controller';
import { WishlistServiceService } from './wishlist-service.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistItem } from './entities/wishlist.entity';
import { AuthModule } from '@app/auth';
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
    TypeOrmModule.forFeature([WishlistItem]),
    AuthModule,
    ClientsModule.registerAsync([
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
    ]),
  ],
  controllers: [WishlistServiceController],
  providers: [WishlistServiceService],
})
export class WishlistServiceModule { }
