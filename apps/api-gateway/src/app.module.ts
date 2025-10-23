import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { UserController } from "./controllers/users.controller";
import { CartController } from "./controllers/cart.controller";
import { AffiliateController } from "./controllers/affiliate.controller";
import { WishlistController } from "./controllers/wishlist.controller";
import { AuthModule } from "@app/auth";
import { OrdersController } from "./controllers/order.controller";
import { HealthController } from "./controllers/health.controller";
import { WebhookController } from "./controllers/webhook.controller";
import { SettingsController } from "./controllers/settings.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

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
        name: 'AFFILIATE_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('AFFILIATE_HOST'),
            port: Number(config.get('AFFILIATE_TCP_PORT')),
          },
        }),
        inject: [ConfigService],
        imports: [ConfigModule],
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
      {
        name: 'ORDERS_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('ORDER_SERVICE_HOST'),
            port: Number(config.get('ORDERS_TCP_PORT')),
          },
        }),
        inject: [ConfigService],
      },
    ]),
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
        name: 'SETTINGS_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('SETTINGS_SERVICE_HOST'),
            port: Number(config.get('SETTINGS_TCP_PORT')),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    AuthModule
  ],
  controllers: [
    UserController,
    CartController,
    OrdersController,
    AffiliateController,
    WishlistController,
    WebhookController,
    SettingsController,
    HealthController
  ],
})
export class AppModule { }
