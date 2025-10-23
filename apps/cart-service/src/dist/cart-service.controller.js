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
exports.CartServiceController = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
var common_1 = require("@nestjs/common");
var microservices_1 = require("@nestjs/microservices");
var common_2 = require("@nestjs/common");
function mapException(error) {
    if (error instanceof common_2.NotFoundException ||
        error instanceof common_2.ConflictException ||
        error instanceof common_2.BadRequestException ||
        error instanceof common_2.UnauthorizedException) {
        return new microservices_1.RpcException({
            statusCode: error.getStatus(),
            message: error.message
        });
    }
    return new microservices_1.RpcException({
        statusCode: 500,
        message: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error from cart microservice'
    });
}
var CartServiceController = /** @class */ (function () {
    function CartServiceController(cartService) {
        this.cartService = cartService;
    }
    CartServiceController.prototype.addToCart = function (_a) {
        var userId = _a.userId, guestId = _a.guestId, dto = __rest(_a, ["userId", "guestId"]);
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.cartService.addToCart(dto, userId, guestId)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_1 = _b.sent();
                        throw mapException(error_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CartServiceController.prototype.isProductInCart = function (_a) {
        var userId = _a.userId, guestId = _a.guestId, productId = _a.productId;
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.cartService.isProductInCart(userId, guestId, productId)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_2 = _b.sent();
                        throw mapException(error_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CartServiceController.prototype.applyCouponToCart = function (_a) {
        var userId = _a.userId, guestId = _a.guestId, couponCode = _a.couponCode;
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.cartService.applyCouponToCart(userId, guestId, couponCode)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_3 = _b.sent();
                        throw mapException(error_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CartServiceController.prototype.updateQuantity = function (_a) {
        var userId = _a.userId, guestId = _a.guestId, dto = __rest(_a, ["userId", "guestId"]);
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.cartService.updateQuantity(dto, userId, guestId)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_4 = _b.sent();
                        throw mapException(error_4);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CartServiceController.prototype.removeFromCart = function (_a) {
        var userId = _a.userId, guestId = _a.guestId, dto = __rest(_a, ["userId", "guestId"]);
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.cartService.removeFromCart(dto, userId, guestId)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_5 = _b.sent();
                        throw mapException(error_5);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CartServiceController.prototype.getCart = function (_a) {
        var userId = _a.userId, guestId = _a.guestId, lang = _a.lang;
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.cartService.getCart(userId, guestId, lang)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_6 = _b.sent();
                        throw mapException(error_6);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CartServiceController.prototype.clearCart = function (_a) {
        var userId = _a.userId, guestId = _a.guestId;
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.cartService.clearCart(userId, guestId)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_7 = _b.sent();
                        throw mapException(error_7);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CartServiceController.prototype.mergeGuestCart = function (_a) {
        var guestId = _a.guestId, userId = _a.userId;
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.cartService.mergeGuestCartToUser(guestId, userId)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_8 = _b.sent();
                        throw mapException(error_8);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        microservices_1.MessagePattern({ cmd: 'add_to_cart' }),
        __param(0, microservices_1.Payload())
    ], CartServiceController.prototype, "addToCart");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'cart.isProductInCart' }),
        __param(0, microservices_1.Payload())
    ], CartServiceController.prototype, "isProductInCart");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'apply_coupon_to_cart' }),
        __param(0, microservices_1.Payload())
    ], CartServiceController.prototype, "applyCouponToCart");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'update_cart_quantity' }),
        __param(0, microservices_1.Payload())
    ], CartServiceController.prototype, "updateQuantity");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'remove_from_cart' }),
        __param(0, microservices_1.Payload())
    ], CartServiceController.prototype, "removeFromCart");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'get_cart' }),
        __param(0, microservices_1.Payload())
    ], CartServiceController.prototype, "getCart");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'clear_cart' }),
        __param(0, microservices_1.Payload())
    ], CartServiceController.prototype, "clearCart");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'merge_guest_cart' }),
        __param(0, microservices_1.Payload())
    ], CartServiceController.prototype, "mergeGuestCart");
    CartServiceController = __decorate([
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
    ], CartServiceController);
    return CartServiceController;
}());
exports.CartServiceController = CartServiceController;
