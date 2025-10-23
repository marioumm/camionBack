"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Affiliate = exports.AffiliateStatus = void 0;
var typeorm_1 = require("typeorm");
var coupon_entity_1 = require("./coupon.entity");
var affiliate_transactions_entity_1 = require("./affiliate_transactions.entity");
var AffiliateStatus;
(function (AffiliateStatus) {
    AffiliateStatus["PENDING"] = "pending";
    AffiliateStatus["APPROVED"] = "approved";
    AffiliateStatus["REJECTED"] = "rejected";
})(AffiliateStatus = exports.AffiliateStatus || (exports.AffiliateStatus = {}));
var Affiliate = /** @class */ (function () {
    function Affiliate() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn('uuid')
    ], Affiliate.prototype, "id");
    __decorate([
        typeorm_1.Column({ unique: true })
    ], Affiliate.prototype, "userId");
    __decorate([
        typeorm_1.Column()
    ], Affiliate.prototype, "fullName");
    __decorate([
        typeorm_1.Column()
    ], Affiliate.prototype, "gender");
    __decorate([
        typeorm_1.Column()
    ], Affiliate.prototype, "nationality");
    __decorate([
        typeorm_1.Column({ type: 'enum', "enum": AffiliateStatus, "default": AffiliateStatus.PENDING })
    ], Affiliate.prototype, "status");
    __decorate([
        typeorm_1.Column({ type: 'float', "default": 0 })
    ], Affiliate.prototype, "totalEarnings");
    __decorate([
        typeorm_1.Column({ type: 'int', "default": 0 })
    ], Affiliate.prototype, "couponsCreated");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Affiliate.prototype, "bio");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Affiliate.prototype, "referralLink");
    __decorate([
        typeorm_1.Column({ type: 'float', "default": 0 })
    ], Affiliate.prototype, "walletBalance");
    __decorate([
        typeorm_1.OneToMany(function () { return affiliate_transactions_entity_1.AffiliateTransaction; }, function (transaction) { return transaction.affiliate; })
    ], Affiliate.prototype, "transactions");
    __decorate([
        typeorm_1.OneToMany(function () { return coupon_entity_1.Coupon; }, function (coupon) { return coupon.affiliate; })
    ], Affiliate.prototype, "coupons");
    __decorate([
        typeorm_1.CreateDateColumn()
    ], Affiliate.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn()
    ], Affiliate.prototype, "updatedAt");
    Affiliate = __decorate([
        typeorm_1.Entity('affiliates')
    ], Affiliate);
    return Affiliate;
}());
exports.Affiliate = Affiliate;
