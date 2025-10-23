"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CartItem = void 0;
// apps/cart-service/src/entities/cart.entity.ts
var typeorm_1 = require("typeorm");
var CartItem = /** @class */ (function () {
    function CartItem() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn('uuid')
    ], CartItem.prototype, "id");
    __decorate([
        typeorm_1.Column({ nullable: true, type: 'varchar' })
    ], CartItem.prototype, "userId");
    __decorate([
        typeorm_1.Column({ nullable: true, type: 'varchar' })
    ], CartItem.prototype, "guestId");
    __decorate([
        typeorm_1.Column()
    ], CartItem.prototype, "productId");
    __decorate([
        typeorm_1.Column()
    ], CartItem.prototype, "quantity");
    __decorate([
        typeorm_1.Column('json', { "default": function () { return "'[]'"; } })
    ], CartItem.prototype, "variation");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], CartItem.prototype, "title");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], CartItem.prototype, "image");
    __decorate([
        typeorm_1.Column({ type: 'varchar', nullable: true })
    ], CartItem.prototype, "price");
    __decorate([
        typeorm_1.Column({ nullable: true, type: 'varchar' })
    ], CartItem.prototype, "couponCode");
    __decorate([
        typeorm_1.Column({ type: 'float', nullable: true, "default": 0 })
    ], CartItem.prototype, "discountPercentage");
    __decorate([
        typeorm_1.CreateDateColumn()
    ], CartItem.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn()
    ], CartItem.prototype, "updatedAt");
    CartItem = __decorate([
        typeorm_1.Entity(),
        typeorm_1.Index(['userId']),
        typeorm_1.Index(['guestId'])
    ], CartItem);
    return CartItem;
}());
exports.CartItem = CartItem;
