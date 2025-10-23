"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Coupon = void 0;
var typeorm_1 = require("typeorm");
var affiliate_entity_1 = require("./affiliate.entity");
var Coupon = /** @class */ (function () {
    function Coupon() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn('uuid')
    ], Coupon.prototype, "id");
    __decorate([
        typeorm_1.Column({ unique: true })
    ], Coupon.prototype, "code");
    __decorate([
        typeorm_1.Column({ "default": true })
    ], Coupon.prototype, "isActive");
    __decorate([
        typeorm_1.ManyToOne(function () { return affiliate_entity_1.Affiliate; }, function (affiliate) { return affiliate.coupons; }, { onDelete: 'CASCADE' })
    ], Coupon.prototype, "affiliate");
    __decorate([
        typeorm_1.Column('float')
    ], Coupon.prototype, "discountPercentage");
    __decorate([
        typeorm_1.Column('float', { "default": 5.0 })
    ], Coupon.prototype, "commissionPercentage");
    __decorate([
        typeorm_1.CreateDateColumn({ type: 'timestamp' })
    ], Coupon.prototype, "createdAt");
    Coupon = __decorate([
        typeorm_1.Entity('coupons')
    ], Coupon);
    return Coupon;
}());
exports.Coupon = Coupon;
