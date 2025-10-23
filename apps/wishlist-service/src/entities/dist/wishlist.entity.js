"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.WishlistItem = void 0;
var typeorm_1 = require("typeorm");
var WishlistItem = /** @class */ (function () {
    function WishlistItem() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn('uuid')
    ], WishlistItem.prototype, "id");
    __decorate([
        typeorm_1.Column({ nullable: true, type: 'varchar' })
    ], WishlistItem.prototype, "userId");
    __decorate([
        typeorm_1.Column({ nullable: true, type: 'varchar' })
    ], WishlistItem.prototype, "guestId");
    __decorate([
        typeorm_1.Column()
    ], WishlistItem.prototype, "productId");
    __decorate([
        typeorm_1.Column()
    ], WishlistItem.prototype, "productName");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], WishlistItem.prototype, "productImage");
    __decorate([
        typeorm_1.Column('varchar', { "default": '0' })
    ], WishlistItem.prototype, "price");
    __decorate([
        typeorm_1.CreateDateColumn()
    ], WishlistItem.prototype, "createdAt");
    WishlistItem = __decorate([
        typeorm_1.Entity(),
        typeorm_1.Index(['userId']),
        typeorm_1.Index(['guestId'])
    ], WishlistItem);
    return WishlistItem;
}());
exports.WishlistItem = WishlistItem;
