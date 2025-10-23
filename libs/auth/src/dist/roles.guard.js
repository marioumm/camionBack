"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RolesGuard = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// shared/guards/roles.guard.ts
var common_1 = require("@nestjs/common");
var roles_decorator_1 = require("./roles.decorator");
var owner_or_admin_decorator_1 = require("./owner-or-admin.decorator");
var user_entity_1 = require("apps/users-service/src/entities/user.entity");
var RolesGuard = /** @class */ (function () {
    function RolesGuard(reflector) {
        this.reflector = reflector;
    }
    RolesGuard.prototype.canActivate = function (context) {
        var request = context.switchToHttp().getRequest();
        var user = request.user;
        var targetUserId = request.params.id;
        var isOwnerOrAdmin = this.reflector.getAllAndOverride(owner_or_admin_decorator_1.OWNER_OR_ADMIN_KEY, [context.getHandler(), context.getClass()]);
        if (isOwnerOrAdmin) {
            if (user.role === user_entity_1.UserRole.ADMIN) {
                return true;
            }
            if (user.sub === targetUserId || user.id === targetUserId) {
                return true;
            }
            return false;
        }
        var requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        return requiredRoles.includes(user.role);
    };
    RolesGuard = __decorate([
        common_1.Injectable()
    ], RolesGuard);
    return RolesGuard;
}());
exports.RolesGuard = RolesGuard;
