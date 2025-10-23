"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SettingsServiceModule = void 0;
var common_1 = require("@nestjs/common");
var settings_service_controller_1 = require("./settings-service.controller");
var settings_service_service_1 = require("./settings-service.service");
var s3_service_1 = require("./s3.service");
var config_1 = require("@nestjs/config");
var SettingsServiceModule = /** @class */ (function () {
    function SettingsServiceModule() {
    }
    SettingsServiceModule = __decorate([
        common_1.Module({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true
                }),
            ],
            controllers: [settings_service_controller_1.SettingsServiceController],
            providers: [settings_service_service_1.SettingsServiceService, s3_service_1.S3Service]
        })
    ], SettingsServiceModule);
    return SettingsServiceModule;
}());
exports.SettingsServiceModule = SettingsServiceModule;
