"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.User = exports.UserRole = void 0;
var typeorm_1 = require("typeorm");
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
    UserRole["AFFILIATE"] = "affiliate";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var User = /** @class */ (function () {
    function User() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn('uuid')
    ], User.prototype, "id");
    __decorate([
        typeorm_1.Column({ unique: true })
    ], User.prototype, "email");
    __decorate([
        typeorm_1.Column({ nullable: true, unique: true })
    ], User.prototype, "phone");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], User.prototype, "password");
    __decorate([
        typeorm_1.Column()
    ], User.prototype, "fullName");
    __decorate([
        typeorm_1.Column({ "default": true })
    ], User.prototype, "isActive");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], User.prototype, "code");
    __decorate([
        typeorm_1.Column({
            type: 'enum',
            "enum": UserRole,
            "default": UserRole.USER
        })
    ], User.prototype, "role");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], User.prototype, "notificationToken");
    __decorate([
        typeorm_1.Column({ type: 'jsonb', nullable: true })
    ], User.prototype, "address");
    __decorate([
        typeorm_1.Column({ "default": true })
    ], User.prototype, "isFirstLogin");
    __decorate([
        typeorm_1.CreateDateColumn({ type: 'timestamp' })
    ], User.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn({ type: 'timestamp' })
    ], User.prototype, "updatedAt");
    User = __decorate([
        typeorm_1.Entity('users')
    ], User);
    return User;
}());
exports.User = User;
