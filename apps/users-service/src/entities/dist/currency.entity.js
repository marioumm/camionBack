"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Currency = void 0;
var typeorm_1 = require("typeorm");
var Currency = /** @class */ (function () {
    function Currency() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn('uuid')
    ], Currency.prototype, "id");
    __decorate([
        typeorm_1.Column({ unique: true, length: 3 })
    ], Currency.prototype, "code");
    __decorate([
        typeorm_1.Column({ length: 50 })
    ], Currency.prototype, "name");
    __decorate([
        typeorm_1.Column({ length: 10 })
    ], Currency.prototype, "symbol");
    __decorate([
        typeorm_1.Column({
            type: 'decimal',
            precision: 15,
            scale: 6,
            "default": 1.000000
        })
    ], Currency.prototype, "rate");
    __decorate([
        typeorm_1.Column({ "default": true, name: 'is_active' })
    ], Currency.prototype, "isActive");
    __decorate([
        typeorm_1.CreateDateColumn({ name: 'created_at' })
    ], Currency.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn({ name: 'updated_at' })
    ], Currency.prototype, "updatedAt");
    Currency = __decorate([
        typeorm_1.Entity('currencies')
    ], Currency);
    return Currency;
}());
exports.Currency = Currency;
