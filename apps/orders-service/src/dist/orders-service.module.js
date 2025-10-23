"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OrdersServiceModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var typeorm_1 = require("@nestjs/typeorm");
var order_entity_1 = require("./entities/order.entity");
var auth_1 = require("@app/auth");
var orders_service_controller_1 = require("./orders-service.controller");
var orders_service_service_1 = require("./orders-service.service");
var cart_entity_1 = require("apps/cart-service/src/entities/cart.entity");
var microservices_1 = require("@nestjs/microservices");
var OrdersServiceModule = /** @class */ (function () {
    function OrdersServiceModule() {
    }
    OrdersServiceModule = __decorate([
        common_1.Module({
            imports: [
                config_1.ConfigModule.forRoot({ isGlobal: true }),
                typeorm_1.TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: process.env.POSTGRES_HOST,
                    port: Number(process.env.POSTGRES_PORT),
                    username: process.env.POSTGRES_USER,
                    password: process.env.POSTGRES_PASSWORD,
                    database: process.env.POSTGRES_DB,
                    autoLoadEntities: true,
                    synchronize: true
                }),
                typeorm_1.TypeOrmModule.forFeature([order_entity_1.Order, cart_entity_1.CartItem]),
                auth_1.AuthModule,
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
                        name: 'AFFILIATE_SERVICE',
                        useFactory: function (config) { return ({
                            transport: microservices_1.Transport.TCP,
                            options: {
                                host: config.get('AFFILIATE_HOST'),
                                port: Number(config.get('AFFILIATE_TCP_PORT'))
                            }
                        }); },
                        inject: [config_1.ConfigService]
                    },
                ]),
            ],
            controllers: [orders_service_controller_1.OrdersController],
            providers: [orders_service_service_1.OrdersService]
        })
    ], OrdersServiceModule);
    return OrdersServiceModule;
}());
exports.OrdersServiceModule = OrdersServiceModule;
