import { Module } from '@nestjs/common';
import { UsersServiceController } from './users-service.controller';
import { UsersService } from './users-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { OTPService } from './otp-service';
import { AuthModule } from '@app/auth';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';


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
    TypeOrmModule.forFeature([User]),
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    AuthModule,
    HttpModule,
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
        name: 'CART_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('CART_HOST'),
            port: Number(config.get('CART_TCP_PORT')),
          },
        }),
        inject: [ConfigService],
      },

      {
        name: 'WISHLIST_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('WISHLIST_SERVICE_HOST'),
            port: Number(config.get('WISHLIST_TCP_PORT')),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UsersServiceController ],
  providers: [UsersService, OTPService ],
})
export class UsersServiceModule { }
