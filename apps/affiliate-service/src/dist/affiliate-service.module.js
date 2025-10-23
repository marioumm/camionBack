"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AffiliateServiceModule = void 0;
var common_1 = require("@nestjs/common");
var affiliate_service_controller_1 = require("./affiliate-service.controller");
var affiliate_service_service_1 = require("./affiliate-service.service");
var config_1 = require("@nestjs/config");
var typeorm_1 = require("@nestjs/typeorm");
var affiliate_entity_1 = require("./entities/affiliate.entity");
var coupon_entity_1 = require("./entities/coupon.entity");
var auth_1 = require("@app/auth");
var microservices_1 = require("@nestjs/microservices");
var affiliate_transactions_entity_1 = require("./entities/affiliate_transactions.entity");
var AffiliateServiceModule = /** @class */ (function () {
    function AffiliateServiceModule() {
    }
    AffiliateServiceModule = __decorate([
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
                typeorm_1.TypeOrmModule.forFeature([affiliate_entity_1.Affiliate, coupon_entity_1.Coupon, affiliate_transactions_entity_1.AffiliateTransaction]),
                auth_1.AuthModule,
                microservices_1.ClientsModule.register([
                    {
                        name: 'USER_SERVICE',
                        transport: microservices_1.Transport.TCP,
                        options: {
                            host: process.env.USERS_HOST,
                            port: Number(process.env.USERS_TCP_PORT)
                        }
                    },
                ]),
                microservices_1.ClientsModule.register([
                    {
                        name: 'NOTIFICATIONS_SERVICE',
                        transport: microservices_1.Transport.TCP,
                        options: {
                            host: process.env.NOTIFICATION_SERVICE_HOST,
                            port: Number(process.env.NOTIFICATION_TCP_PORT)
                        }
                    },
                ]),
            ],
            controllers: [affiliate_service_controller_1.AffiliateServiceController],
            providers: [affiliate_service_service_1.AffiliateServiceService]
        })
    ], AffiliateServiceModule);
    return AffiliateServiceModule;
}());
exports.AffiliateServiceModule = AffiliateServiceModule;
