"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Order = void 0;
var typeorm_1 = require("typeorm");
var Order = /** @class */ (function () {
    function Order() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn('uuid')
    ], Order.prototype, "id");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Order.prototype, "wcOrderId");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Order.prototype, "wcOrderKey");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Order.prototype, "wcOrderStatus");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Order.prototype, "wcPaymentStatus");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Order.prototype, "currency");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Order.prototype, "total");
    __decorate([
        typeorm_1.Column({ "default": 0 })
    ], Order.prototype, "shippingCost");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Order.prototype, "userId");
    __decorate([
        typeorm_1.Column({ type: 'jsonb', nullable: true, "default": function () { return "'[]'"; } })
    ], Order.prototype, "items");
    __decorate([
        typeorm_1.Column({ type: 'jsonb', nullable: true })
    ], Order.prototype, "customerData");
    __decorate([
        typeorm_1.Column({ type: 'varchar', nullable: true })
    ], Order.prototype, "paymentMethod");
    __decorate([
        typeorm_1.Column({ type: 'jsonb', nullable: true, "default": function () { return "'[]'"; } })
    ], Order.prototype, "paymentData");
    __decorate([
        typeorm_1.Column({ "default": false })
    ], Order.prototype, "isPaid");
    __decorate([
        typeorm_1.Column({ type: 'timestamp', nullable: true })
    ], Order.prototype, "paidAt");
    __decorate([
        typeorm_1.Column({ "default": false })
    ], Order.prototype, "isDelivered");
    __decorate([
        typeorm_1.Column({ type: 'timestamp', nullable: true })
    ], Order.prototype, "deliveredAt");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Order.prototype, "skipCashPaymentUrl");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Order.prototype, "skipCashTransactionId");
    __decorate([
        typeorm_1.CreateDateColumn()
    ], Order.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn()
    ], Order.prototype, "updatedAt");
    Order = __decorate([
        typeorm_1.Entity('orders')
    ], Order);
    return Order;
}());
exports.Order = Order;
