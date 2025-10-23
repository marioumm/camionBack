"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var microservices_1 = require("@nestjs/microservices");
var users_controller_1 = require("./controllers/users.controller");
var cart_controller_1 = require("./controllers/cart.controller");
var affiliate_controller_1 = require("./controllers/affiliate.controller");
var wishlist_controller_1 = require("./controllers/wishlist.controller");
var auth_1 = require("@app/auth");
var order_controller_1 = require("./controllers/order.controller");
var health_controller_1 = require("./controllers/health.controller");
var webhook_controller_1 = require("./controllers/webhook.controller");
var settings_controller_1 = require("./controllers/settings.controller");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        common_1.Module({
            imports: [
                config_1.ConfigModule.forRoot({ isGlobal: true }),
                microservices_1.ClientsModule.registerAsync([
                    {
                        name: 'USERS_SERVICE',
                        useFactory: function (config) { return ({
                            transport: microservices_1.Transport.TCP,
                            options: {
                                host: config.get('USERS_HOST'),
                                port: Number(config.get('USERS_TCP_PORT'))
                            }
                        }); },
                        inject: [config_1.ConfigService]
                    },
                    {
                        name: 'AFFILIATE_SERVICE',
                        useFactory: function (config) { return ({
                            transport: microservices_1.Transport.TCP,
                            options: {
                                host: config.get('AFFILIATE_HOST'),
                                port: Number(config.get('AFFILIATE_TCP_PORT'))
                            }
                        }); },
                        inject: [config_1.ConfigService],
                        imports: [config_1.ConfigModule]
                    },
                    {
                        name: 'CART_SERVICE',
                        useFactory: function (config) { return ({
                            transport: microservices_1.Transport.TCP,
                            options: {
                                host: config.get('CART_HOST'),
                                port: Number(config.get('CART_TCP_PORT'))
                            }
                        }); },
                        inject: [config_1.ConfigService]
                    },
                    {
                        name: 'WISHLIST_SERVICE',
                        useFactory: function (config) { return ({
                            transport: microservices_1.Transport.TCP,
                            options: {
                                host: config.get('WISHLIST_SERVICE_HOST'),
                                port: Number(config.get('WISHLIST_TCP_PORT'))
                            }
                        }); },
                        inject: [config_1.ConfigService]
                    },
                    {
                        name: 'ORDERS_SERVICE',
                        useFactory: function (config) { return ({
                            transport: microservices_1.Transport.TCP,
                            options: {
                                host: config.get('ORDER_SERVICE_HOST'),
                                port: Number(config.get('ORDERS_TCP_PORT'))
                            }
                        }); },
                        inject: [config_1.ConfigService]
                    },
                ]),
                microservices_1.ClientsModule.registerAsync([
                    {
                        name: 'NOTIFICATIONS_SERVICE',
                        useFactory: function (config) { return ({
                            transport: microservices_1.Transport.TCP,
                            options: {
                                host: config.get('NOTIFICATION_SERVICE_HOST'),
                                port: Number(config.get('NOTIFICATION_TCP_PORT'))
                            }
                        }); },
                        inject: [config_1.ConfigService]
                    },
                    {
                        name: 'SETTINGS_SERVICE',
                        useFactory: function (config) { return ({
                            transport: microservices_1.Transport.TCP,
                            options: {
                                host: config.get('SETTINGS_SERVICE_HOST'),
                                port: Number(config.get('SETTINGS_TCP_PORT'))
                            }
                        }); },
                        inject: [config_1.ConfigService]
                    },
                ]),
                auth_1.AuthModule
            ],
            controllers: [
                users_controller_1.UserController,
                cart_controller_1.CartController,
                order_controller_1.OrdersController,
                affiliate_controller_1.AffiliateController,
                wishlist_controller_1.WishlistController,
                webhook_controller_1.WebhookController,
                settings_controller_1.SettingsController,
                health_controller_1.HealthController
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
