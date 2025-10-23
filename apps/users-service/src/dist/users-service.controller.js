"use strict";
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.UsersServiceController = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
var common_1 = require("@nestjs/common");
var microservices_1 = require("@nestjs/microservices");
function mapException(error) {
    if (error instanceof microservices_1.RpcException)
        return error;
    if (error instanceof common_1.NotFoundException ||
        error instanceof common_1.BadRequestException ||
        error instanceof common_1.UnauthorizedException ||
        error instanceof common_1.ConflictException) {
        return new microservices_1.RpcException({
            statusCode: error.getStatus(),
            message: error.message
        });
    }
    return new microservices_1.RpcException({
        statusCode: 500,
        message: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error from users microservice'
    });
}
var UsersServiceController = /** @class */ (function () {
    function UsersServiceController(usersService) {
        this.usersService = usersService;
    }
    UsersServiceController.prototype.register = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersService.register(dto)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        throw mapException(error_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersServiceController.prototype.login = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersService.login(dto)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        throw mapException(error_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersServiceController.prototype.loginAdmin = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersService.loginAdmin(dto)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        throw mapException(error_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersServiceController.prototype.createUser = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersService.createUser(dto)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        throw mapException(error_4);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersServiceController.prototype.verifyOTP = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var guestId, dto, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        guestId = data.guestId, dto = __rest(data, ["guestId"]);
                        return [4 /*yield*/, this.usersService.verifyOTP(dto, guestId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        throw mapException(error_5);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersServiceController.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersService.getUsers()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        throw mapException(error_6);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersServiceController.prototype.getUserById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersService.getUserById(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        throw mapException(error_7);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersServiceController.prototype.handleGetUserById = function (_a) {
        var id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersService.getUserById(id)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_8 = _b.sent();
                        throw mapException(error_8);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersServiceController.prototype.findUsersByFilters = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersService.findUsersByFilters(filters)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_9 = _a.sent();
                        throw mapException(error_9);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersServiceController.prototype.updateUser = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var id, updateData, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = payload.id, updateData = payload.updateData;
                        return [4 /*yield*/, this.usersService.updateUser(id, updateData)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_10 = _a.sent();
                        throw mapException(error_10);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersServiceController.prototype.updateUserRole = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersService.updateUserRole(data.userId, data.role)];
            });
        });
    };
    UsersServiceController.prototype.handleApproveAffiliate = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersService.approveAffiliateAndGenerateToken(data.userId, data.role)];
            });
        });
    };
    UsersServiceController.prototype.handleGenerateToken = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersService.generateTokenForUser(data.userId)];
            });
        });
    };
    UsersServiceController.prototype.saveNotificationToken = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersService.saveNotificationToken(data.userId, data.token)];
            });
        });
    };
    UsersServiceController.prototype.getUserDeviceToken = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersService.getUserDeviceToken(payload.userId)];
            });
        });
    };
    UsersServiceController.prototype.deleteUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersService.deleteUser(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { message: 'User deleted successfully' }];
                    case 2:
                        error_11 = _a.sent();
                        throw mapException(error_11);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersServiceController.prototype.updateUserAddress = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, addressDto, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = data.userId, addressDto = data.addressDto;
                        return [4 /*yield*/, this.usersService.updateUserAddress(userId, addressDto)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_12 = _a.sent();
                        throw mapException(error_12);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersServiceController.prototype.getUserAddress = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.getUserAddress(userId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UsersServiceController.prototype.countAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.countAllUsers()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UsersServiceController.prototype.countActiveUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.countActiveUsers()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    __decorate([
        microservices_1.MessagePattern({ cmd: 'register_user' }),
        __param(0, microservices_1.Payload())
    ], UsersServiceController.prototype, "register");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'login_user' }),
        __param(0, microservices_1.Payload())
    ], UsersServiceController.prototype, "login");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'login_admin' }),
        __param(0, microservices_1.Payload())
    ], UsersServiceController.prototype, "loginAdmin");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'create_user' }),
        __param(0, microservices_1.Payload())
    ], UsersServiceController.prototype, "createUser");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'verify_user' }),
        __param(0, microservices_1.Payload())
    ], UsersServiceController.prototype, "verifyOTP");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'get_users' })
    ], UsersServiceController.prototype, "getAllUsers");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'get_user_by_id' }),
        __param(0, microservices_1.Payload())
    ], UsersServiceController.prototype, "getUserById");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'users.getUserById' }),
        __param(0, microservices_1.Payload())
    ], UsersServiceController.prototype, "handleGetUserById");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'find_user_by_identifier' }),
        __param(0, microservices_1.Payload())
    ], UsersServiceController.prototype, "findUsersByFilters");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'update_user' }),
        __param(0, microservices_1.Payload())
    ], UsersServiceController.prototype, "updateUser");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'update-user-role' })
    ], UsersServiceController.prototype, "updateUserRole");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'approve-affiliate' }),
        __param(0, microservices_1.Payload())
    ], UsersServiceController.prototype, "handleApproveAffiliate");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'generate-token' }),
        __param(0, microservices_1.Payload())
    ], UsersServiceController.prototype, "handleGenerateToken");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'save_notification_token' }),
        __param(0, microservices_1.Payload())
    ], UsersServiceController.prototype, "saveNotificationToken");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'get-user-device-token' }),
        __param(0, microservices_1.Payload())
    ], UsersServiceController.prototype, "getUserDeviceToken");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'delete_user' }),
        __param(0, microservices_1.Payload())
    ], UsersServiceController.prototype, "deleteUser");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'updateUserAddress' }),
        __param(0, microservices_1.Payload())
    ], UsersServiceController.prototype, "updateUserAddress");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'getUserAddress' }),
        __param(0, microservices_1.Payload())
    ], UsersServiceController.prototype, "getUserAddress");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'count_all_users' })
    ], UsersServiceController.prototype, "countAllUsers");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'count_active_users' })
    ], UsersServiceController.prototype, "countActiveUsers");
    UsersServiceController = __decorate([
        common_1.UsePipes(new common_1.ValidationPipe({
            exceptionFactory: function (errors) {
                return new microservices_1.RpcException({
                    statusCode: 400,
                    message: 'Validation failed',
                    details: errors
                });
            }
        })),
        common_1.Controller()
    ], UsersServiceController);
    return UsersServiceController;
}());
exports.UsersServiceController = UsersServiceController;
