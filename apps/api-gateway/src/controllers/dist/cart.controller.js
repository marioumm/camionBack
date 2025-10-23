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
exports.CartController = void 0;
// apps/api-gateway/src/cart/cart.controller.ts
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var optional_auth_guard_1 = require("libs/auth/src/optional-auth.guard");
var optional_user_id_decorator_1 = require("libs/auth/src/optional-user-id.decorator");
var CartController = /** @class */ (function () {
    function CartController(cartClient) {
        this.cartClient = cartClient;
    }
    CartController.prototype.callCart = function (pattern, data) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var err_1, statusCode, message;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.cartClient.send(pattern, data))];
                    case 1: return [2 /*return*/, _f.sent()];
                    case 2:
                        err_1 = _f.sent();
                        statusCode = (err_1 === null || err_1 === void 0 ? void 0 : err_1.statusCode) || (err_1 === null || err_1 === void 0 ? void 0 : err_1.status) || ((_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.error) === null || _a === void 0 ? void 0 : _a.statusCode) || ((_b = err_1 === null || err_1 === void 0 ? void 0 : err_1.error) === null || _b === void 0 ? void 0 : _b.status);
                        message = (err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || ((_c = err_1 === null || err_1 === void 0 ? void 0 : err_1.error) === null || _c === void 0 ? void 0 : _c.message) || ((_e = (_d = err_1 === null || err_1 === void 0 ? void 0 : err_1.error) === null || _d === void 0 ? void 0 : _d.response) === null || _e === void 0 ? void 0 : _e.message);
                        if (typeof statusCode === 'number' && message) {
                            throw new common_1.HttpException(message, statusCode);
                        }
                        if (err_1 instanceof common_1.HttpException)
                            throw err_1;
                        console.error('[GATEWAY] RAW ERROR FROM CART:', JSON.stringify(err_1), err_1);
                        throw new common_1.InternalServerErrorException('Cart service unavailable');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CartController.prototype.getIdentifier = function (userId, guestId) {
        if (userId)
            return { userId: userId };
        if (guestId)
            return { guestId: guestId };
        throw new common_1.HttpException('Missing user or guest identifier', 400);
    };
    CartController.prototype.addToCart = function (dto, userId, guestId) {
        return __awaiter(this, void 0, void 0, function () {
            var identifier;
            return __generator(this, function (_a) {
                identifier = this.getIdentifier(userId, guestId);
                return [2 /*return*/, this.callCart({ cmd: 'add_to_cart' }, __assign(__assign({}, dto), identifier))];
            });
        });
    };
    CartController.prototype.checkProductInCart = function (dto, userId, guestId) {
        return __awaiter(this, void 0, void 0, function () {
            var identifier;
            return __generator(this, function (_a) {
                identifier = this.getIdentifier(userId, guestId);
                return [2 /*return*/, this.callCart({ cmd: 'cart.isProductInCart' }, __assign({ productId: dto.productId }, identifier))];
            });
        });
    };
    CartController.prototype.applyCouponToCart = function (dto, userId, guestId) {
        return __awaiter(this, void 0, void 0, function () {
            var identifier;
            return __generator(this, function (_a) {
                identifier = this.getIdentifier(userId, guestId);
                return [2 /*return*/, this.callCart({ cmd: 'apply_coupon_to_cart' }, __assign({ couponCode: dto.couponCode }, identifier))];
            });
        });
    };
    CartController.prototype.updateQuantity = function (dto, userId, guestId) {
        return __awaiter(this, void 0, void 0, function () {
            var identifier;
            return __generator(this, function (_a) {
                identifier = this.getIdentifier(userId, guestId);
                return [2 /*return*/, this.callCart({ cmd: 'update_cart_quantity' }, __assign(__assign({}, dto), identifier))];
            });
        });
    };
    CartController.prototype.removeFromCart = function (dto, userId, guestId) {
        return __awaiter(this, void 0, void 0, function () {
            var identifier;
            return __generator(this, function (_a) {
                identifier = this.getIdentifier(userId, guestId);
                return [2 /*return*/, this.callCart({ cmd: 'remove_from_cart' }, __assign(__assign({}, dto), identifier))];
            });
        });
    };
    CartController.prototype.getCart = function (userId, guestId, acceptLanguage, queryLang) {
        return __awaiter(this, void 0, void 0, function () {
            var identifier, lang;
            return __generator(this, function (_a) {
                identifier = this.getIdentifier(userId, guestId);
                lang = queryLang || this.extractLanguage(acceptLanguage);
                return [2 /*return*/, this.callCart({ cmd: 'get_cart' }, __assign(__assign({}, identifier), { lang: lang }))];
            });
        });
    };
    CartController.prototype.extractLanguage = function (acceptLanguage) {
        if (!acceptLanguage)
            return 'en';
        var lang = acceptLanguage.split(',')[0].split('-')[0].trim();
        return lang || 'en';
    };
    CartController.prototype.clearCart = function (userId, guestId) {
        return __awaiter(this, void 0, void 0, function () {
            var identifier;
            return __generator(this, function (_a) {
                identifier = this.getIdentifier(userId, guestId);
                return [2 /*return*/, this.callCart({ cmd: 'clear_cart' }, identifier)];
            });
        });
    };
    __decorate([
        common_1.Post('add'),
        __param(0, common_1.Body()),
        __param(1, optional_user_id_decorator_1.OptionalUserId()),
        __param(2, common_1.Headers('x-guest-id'))
    ], CartController.prototype, "addToCart");
    __decorate([
        common_1.Post('check-product'),
        __param(0, common_1.Body()),
        __param(1, optional_user_id_decorator_1.OptionalUserId()),
        __param(2, common_1.Headers('x-guest-id'))
    ], CartController.prototype, "checkProductInCart");
    __decorate([
        common_1.Post('apply-coupon'),
        __param(0, common_1.Body()),
        __param(1, optional_user_id_decorator_1.OptionalUserId()),
        __param(2, common_1.Headers('x-guest-id'))
    ], CartController.prototype, "applyCouponToCart");
    __decorate([
        common_1.Patch('update'),
        __param(0, common_1.Body()),
        __param(1, optional_user_id_decorator_1.OptionalUserId()),
        __param(2, common_1.Headers('x-guest-id'))
    ], CartController.prototype, "updateQuantity");
    __decorate([
        common_1.Delete('remove'),
        __param(0, common_1.Body()),
        __param(1, optional_user_id_decorator_1.OptionalUserId()),
        __param(2, common_1.Headers('x-guest-id'))
    ], CartController.prototype, "removeFromCart");
    __decorate([
        common_1.Get('get'),
        __param(0, optional_user_id_decorator_1.OptionalUserId()),
        __param(1, common_1.Headers('x-guest-id')),
        __param(2, common_1.Headers('accept-language')),
        __param(3, common_1.Query('lang'))
    ], CartController.prototype, "getCart");
    __decorate([
        common_1.Delete('clear'),
        __param(0, optional_user_id_decorator_1.OptionalUserId()),
        __param(1, common_1.Headers('x-guest-id'))
    ], CartController.prototype, "clearCart");
    CartController = __decorate([
        common_1.Controller('cart'),
        common_1.UseGuards(optional_auth_guard_1.OptionalJwtAuthGuard),
        __param(0, common_1.Inject('CART_SERVICE'))
    ], CartController);
    return CartController;
}());
exports.CartController = CartController;
