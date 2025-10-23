"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OwnerOrAdminGuard = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// shared/guards/owner-or-admin.guard.ts
var common_1 = require("@nestjs/common");
var OwnerOrAdminGuard = /** @class */ (function () {
    function OwnerOrAdminGuard(reflector) {
        this.reflector = reflector;
    }
    OwnerOrAdminGuard.prototype.canActivate = function (context) {
        var request = context.switchToHttp().getRequest();
        var user = request.user;
        var targetUserId = request.params.id;
        if (user.role === 'admin') {
            return true;
        }
        if (user.sub === targetUserId) {
            return true;
        }
        return false;
    };
    OwnerOrAdminGuard = __decorate([
        common_1.Injectable()
    ], OwnerOrAdminGuard);
    return OwnerOrAdminGuard;
}());
exports.OwnerOrAdminGuard = OwnerOrAdminGuard;
