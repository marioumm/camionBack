"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UsersServiceModule = void 0;
var common_1 = require("@nestjs/common");
var users_service_controller_1 = require("./users-service.controller");
var users_service_service_1 = require("./users-service.service");
var typeorm_1 = require("@nestjs/typeorm");
var config_1 = require("@nestjs/config");
var user_entity_1 = require("./entities/user.entity");
var jwt_1 = require("@nestjs/jwt");
var otp_service_1 = require("./otp-service");
var auth_1 = require("@app/auth");
var microservices_1 = require("@nestjs/microservices");
var schedule_1 = require("@nestjs/schedule");
var axios_1 = require("@nestjs/axios");
var UsersServiceModule = /** @class */ (function () {
    function UsersServiceModule() {
    }
    UsersServiceModule = __decorate([
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
                typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
                schedule_1.ScheduleModule.forRoot(),
                jwt_1.JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: { expiresIn: '7d' }
                }),
                auth_1.AuthModule,
                axios_1.HttpModule,
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
                ]),
            ],
            controllers: [users_service_controller_1.UsersServiceController],
            providers: [users_service_service_1.UsersService, otp_service_1.OTPService]
        })
    ], UsersServiceModule);
    return UsersServiceModule;
}());
exports.UsersServiceModule = UsersServiceModule;
