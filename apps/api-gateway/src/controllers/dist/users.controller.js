"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.UserController = void 0;
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
var common_1 = require("@nestjs/common");
var user_entity_1 = require("apps/users-service/src/entities/user.entity");
var src_1 = require("libs/auth/src");
var current_user_decorator_1 = require("libs/auth/src/current-user.decorator");
var owner_or_admin_decorator_1 = require("libs/auth/src/owner-or-admin.decorator");
var roles_decorator_1 = require("libs/auth/src/roles.decorator");
var roles_guard_1 = require("libs/auth/src/roles.guard");
var rxjs_1 = require("rxjs");
var UserController = /** @class */ (function () {
    function UserController(usersClient, notificationClient) {
        this.usersClient = usersClient;
        this.notificationClient = notificationClient;
    }
    UserController.prototype.register = function (body) {
        return this.usersClient.send({ cmd: 'register_user' }, body);
    };
    UserController.prototype.loginAdmin = function (body) {
        return this.usersClient.send({ cmd: 'login_admin' }, body);
    };
    UserController.prototype.login = function (body) {
        return this.usersClient.send({ cmd: 'login_user' }, body);
    };
    UserController.prototype.verifyOTP = function (dto, guestId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersClient.send({ cmd: 'verify_user' }, __assign(__assign({}, dto), { guestId: guestId }))];
            });
        });
    };
    UserController.prototype.createUser = function (body) {
        return this.usersClient.send({ cmd: 'create_user' }, body);
    };
    UserController.prototype.getAllUsers = function () {
        return this.usersClient.send({ cmd: 'get_users' }, {});
    };
    UserController.prototype.getUserById = function (id) {
        return this.usersClient.send({ cmd: 'get_user_by_id' }, id);
    };
    UserController.prototype.findUsersByFilters = function (body) {
        return this.usersClient.send({ cmd: 'find_user_by_identifier' }, body);
    };
    UserController.prototype.updateUser = function (id, updateData) {
        return this.usersClient.send({ cmd: 'update_user' }, { id: id, updateData: updateData });
    };
    UserController.prototype.deleteUser = function (id) {
        return this.usersClient.send({ cmd: 'delete_user' }, id);
    };
    UserController.prototype.storeNotificationToken = function (body, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, rxjs_1.firstValueFrom(this.usersClient.send({ cmd: 'save_notification_token' }, { userId: userId, token: body.token }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.getMyNotifications = function (userId) {
        return this.notificationClient.send({ cmd: 'get_user_notifications' }, { userId: userId });
    };
    UserController.prototype.getUserAddress = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, rxjs_1.firstValueFrom(this.usersClient.send({ cmd: 'getUserAddress' }, userId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.updateUserAddress = function (addressDto, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, rxjs_1.firstValueFrom(this.usersClient.send({ cmd: 'updateUserAddress' }, { userId: userId, addressDto: addressDto }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.countAllUsers = function () {
        return this.usersClient.send({ cmd: 'count_all_users' }, {});
    };
    UserController.prototype.countActiveUsers = function () {
        return this.usersClient.send({ cmd: 'count_active_users' }, {});
    };
    __decorate([
        common_1.Post('auth/register'),
        __param(0, common_1.Body())
    ], UserController.prototype, "register");
    __decorate([
        common_1.Post('auth/login_admin'),
        __param(0, common_1.Body())
    ], UserController.prototype, "loginAdmin");
    __decorate([
        common_1.Post('auth/login'),
        __param(0, common_1.Body())
    ], UserController.prototype, "login");
    __decorate([
        common_1.Post('verify'),
        __param(0, common_1.Body()),
        __param(1, common_1.Headers('x-guest-id'))
    ], UserController.prototype, "verifyOTP");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN),
        common_1.Post(),
        __param(0, common_1.Body())
    ], UserController.prototype, "createUser");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN),
        common_1.Get()
    ], UserController.prototype, "getAllUsers");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard),
        common_1.Get(':id'),
        __param(0, common_1.Param('id'))
    ], UserController.prototype, "getUserById");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN),
        common_1.Post('find'),
        __param(0, common_1.Body())
    ], UserController.prototype, "findUsersByFilters");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        common_1.Patch(':id'),
        __param(0, common_1.Param('id')), __param(1, common_1.Body())
    ], UserController.prototype, "updateUser");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        owner_or_admin_decorator_1.OwnerOrAdmin(),
        common_1.Delete(':id'),
        __param(0, common_1.Param('id'))
    ], UserController.prototype, "deleteUser");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard),
        common_1.Post('notifications/token'),
        __param(0, common_1.Body()),
        __param(1, current_user_decorator_1.CurrentUserId())
    ], UserController.prototype, "storeNotificationToken");
    __decorate([
        common_1.Get('notifications/me'),
        common_1.UseGuards(src_1.JwtAuthGuard),
        __param(0, current_user_decorator_1.CurrentUserId())
    ], UserController.prototype, "getMyNotifications");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard),
        common_1.Get('address/me'),
        __param(0, current_user_decorator_1.CurrentUserId())
    ], UserController.prototype, "getUserAddress");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard),
        common_1.Post('address/update'),
        __param(0, common_1.Body()),
        __param(1, current_user_decorator_1.CurrentUserId())
    ], UserController.prototype, "updateUserAddress");
    __decorate([
        common_1.Get('/count/all'),
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN)
    ], UserController.prototype, "countAllUsers");
    __decorate([
        common_1.Get('/count/active'),
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN)
    ], UserController.prototype, "countActiveUsers");
    UserController = __decorate([
        common_1.Controller('users'),
        __param(0, common_1.Inject('USERS_SERVICE')),
        __param(1, common_1.Inject('NOTIFICATIONS_SERVICE'))
    ], UserController);
    return UserController;
}());
exports.UserController = UserController;
