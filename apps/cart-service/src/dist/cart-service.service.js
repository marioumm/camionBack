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
exports.CartServiceService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
var common_1 = require("@nestjs/common");
var axios_1 = require("axios");
var typeorm_1 = require("@nestjs/typeorm");
var microservices_1 = require("@nestjs/microservices");
var rxjs_1 = require("rxjs");
var cart_entity_1 = require("./entities/cart.entity");
var google_translate_helper_1 = require("./google-translate.helper");
var CartServiceService = /** @class */ (function () {
    function CartServiceService(cartRepository, usersClient, affiliateClient, notificationsClient) {
        this.cartRepository = cartRepository;
        this.usersClient = usersClient;
        this.affiliateClient = affiliateClient;
        this.notificationsClient = notificationsClient;
        this.logger = new common_1.Logger(CartServiceService_1.name);
        this.WC_BASE_URL = process.env.WC_BASE_URL;
    }
    CartServiceService_1 = CartServiceService;
    CartServiceService.prototype.sendNotification = function (userId, title, body) {
        return __awaiter(this, void 0, void 0, function () {
            var deviceToken, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.usersClient.send({ cmd: 'get-user-device-token' }, { userId: userId }).pipe(rxjs_1.timeout(3000), rxjs_1.catchError(function () {
                                _this.logger.warn("No notification token found for user " + userId);
                                return [{ deviceToken: null }];
                            })))];
                    case 1:
                        deviceToken = (_a.sent()).deviceToken;
                        if (!deviceToken)
                            return [2 /*return*/];
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.notificationsClient.send({ cmd: 'send_push_notification' }, {
                                token: deviceToken,
                                title: title,
                                body: body,
                                userId: userId
                            }).pipe(rxjs_1.timeout(3000), rxjs_1.catchError(function (err) {
                                _this.logger.error("Failed to send notification: " + err.message);
                                return [];
                            })))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        this.logger.error('Error sending notification', err_1.stack);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CartServiceService.prototype.verifyUserExists = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userId)
                            throw new common_1.UnauthorizedException('Missing User ID');
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.usersClient.send({ cmd: 'users.getUserById' }, { id: userId }).pipe(rxjs_1.timeout(3000), rxjs_1.catchError(function () {
                                throw new common_1.UnauthorizedException('User does not exist (timeout)');
                            })))];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new common_1.UnauthorizedException('User does not exist');
                        return [2 /*return*/];
                }
            });
        });
    };
    CartServiceService.prototype.fetchCoupon = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.affiliateClient
                                .send({ cmd: 'affiliate.getCouponByCode' }, { code: code.trim().toUpperCase() })
                                .pipe(rxjs_1.timeout(3000), rxjs_1.catchError(function (err) {
                                var _a, _b, _c, _d, _e, _f;
                                console.error('[CartService] fetchCoupon error:', JSON.stringify(err), err);
                                var statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || (err === null || err === void 0 ? void 0 : err.status) || ((_a = err === null || err === void 0 ? void 0 : err.error) === null || _a === void 0 ? void 0 : _a.statusCode) || ((_b = err === null || err === void 0 ? void 0 : err.error) === null || _b === void 0 ? void 0 : _b.status);
                                var message = (err === null || err === void 0 ? void 0 : err.message) || ((_c = err === null || err === void 0 ? void 0 : err.error) === null || _c === void 0 ? void 0 : _c.message) || ((_e = (_d = err === null || err === void 0 ? void 0 : err.error) === null || _d === void 0 ? void 0 : _d.response) === null || _e === void 0 ? void 0 : _e.message) || ((_f = err === null || err === void 0 ? void 0 : err.response) === null || _f === void 0 ? void 0 : _f.message) || (err === null || err === void 0 ? void 0 : err.response);
                                if (typeof statusCode === 'number' && message) {
                                    if (statusCode === 404)
                                        throw new common_1.NotFoundException(message);
                                    if (statusCode === 409)
                                        throw new common_1.ConflictException(message);
                                    if (statusCode === 400)
                                        throw new common_1.BadRequestException(message);
                                    if (statusCode === 401)
                                        throw new common_1.UnauthorizedException(message);
                                    throw new common_1.BadRequestException(message);
                                }
                                if (err instanceof microservices_1.RpcException) {
                                    throw new common_1.InternalServerErrorException('Microservice RPC exception: ' + (err.message || ''));
                                }
                                if (err instanceof common_1.NotFoundException ||
                                    err instanceof common_1.ConflictException ||
                                    err instanceof common_1.BadRequestException ||
                                    err instanceof common_1.UnauthorizedException)
                                    throw err;
                                throw new common_1.InternalServerErrorException('Affiliate service error: ' +
                                    (message || JSON.stringify(err) || ''));
                            })))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_2 = _a.sent();
                        if (err_2 instanceof common_1.NotFoundException ||
                            err_2 instanceof common_1.ConflictException ||
                            err_2 instanceof common_1.BadRequestException ||
                            err_2 instanceof common_1.UnauthorizedException)
                            throw err_2;
                        console.error('[CartService] fetchCoupon outer error:', err_2);
                        throw new common_1.InternalServerErrorException('Failed to fetch coupon');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CartServiceService.prototype.fetchProductFromWoo = function (productId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var url, res, data, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        url = this.WC_BASE_URL + "/products/sync/" + productId;
                        return [4 /*yield*/, axios_1["default"].get(url)];
                    case 1:
                        res = _c.sent();
                        data = res.data;
                        console.log(res);
                        return [2 /*return*/, {
                                id: data.id,
                                title: data.name,
                                image: ((_b = (_a = data.images) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.src) || null,
                                price: data.prices.sale_price || data.prices.price || '0'
                            }];
                    case 2:
                        error_1 = _c.sent();
                        throw new common_1.NotFoundException('Product not found in WooCommerce');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CartServiceService.prototype.getCartFilter = function (userId, guestId) {
        if (userId)
            return { userId: userId };
        if (guestId)
            return { guestId: guestId };
        throw new common_1.BadRequestException('Missing user or guest identifier');
    };
    CartServiceService.prototype.addToCart = function (dto, userId, guestId) {
        return __awaiter(this, void 0, void 0, function () {
            var product, filter, existing, savedItem, totalPrice, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        if (!userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.verifyUserExists(userId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!dto.productId)
                            throw new common_1.BadRequestException('Missing productId');
                        if (!dto.quantity || dto.quantity <= 0)
                            throw new common_1.BadRequestException('Quantity must be greater than 0');
                        return [4 /*yield*/, this.fetchProductFromWoo(dto.productId)];
                    case 3:
                        product = _a.sent();
                        if (!product)
                            throw new common_1.NotFoundException('Product not found in WooCommerce');
                        filter = this.getCartFilter(userId, guestId);
                        return [4 /*yield*/, this.cartRepository.findOne({
                                where: __assign(__assign({}, filter), { productId: dto.productId })
                            })];
                    case 4:
                        existing = _a.sent();
                        savedItem = void 0;
                        if (!existing) return [3 /*break*/, 6];
                        existing.quantity += dto.quantity;
                        existing.title = product.title;
                        existing.image = product.image;
                        existing.price = String(product.price);
                        return [4 /*yield*/, this.cartRepository.save(existing)];
                    case 5:
                        savedItem = _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.cartRepository.save({
                            userId: userId,
                            guestId: guestId,
                            productId: product.id,
                            quantity: dto.quantity,
                            title: product.title,
                            image: product.image,
                            price: String(product.price),
                            variation: dto.variation
                        })];
                    case 7:
                        savedItem = _a.sent();
                        _a.label = 8;
                    case 8:
                        totalPrice = Number(savedItem.price) * savedItem.quantity;
                        if (!userId) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.sendNotification(userId, 'Product added to cart successfully 🛒', product.title + " added to cart successfully.")];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [2 /*return*/, __assign(__assign({}, savedItem), { totalPrice: totalPrice })];
                    case 11:
                        error_2 = _a.sent();
                        if (error_2 instanceof common_1.BadRequestException ||
                            error_2 instanceof common_1.UnauthorizedException ||
                            error_2 instanceof common_1.NotFoundException ||
                            error_2 instanceof common_1.ConflictException)
                            throw error_2;
                        this.logger.error('Failed to add to cart', error_2.stack);
                        throw new common_1.InternalServerErrorException('Failed to add to cart');
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    CartServiceService.prototype.isProductInCart = function (userId, guestId, productId) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.verifyUserExists(userId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!productId)
                            throw new common_1.BadRequestException('Missing productId');
                        filter = this.getCartFilter(userId, guestId);
                        return [4 /*yield*/, this.cartRepository.findOne({
                                where: __assign(__assign({}, filter), { productId: productId })
                            })];
                    case 3:
                        item = _a.sent();
                        return [2 /*return*/, { exists: !!item }];
                }
            });
        });
    };
    CartServiceService.prototype.updateQuantity = function (dto, userId, guestId) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, item, saved, totalPrice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.verifyUserExists(userId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!dto.productId)
                            throw new common_1.BadRequestException('Missing productId');
                        if (!dto.quantity || dto.quantity <= 0)
                            throw new common_1.BadRequestException('Quantity must be greater than 0');
                        filter = this.getCartFilter(userId, guestId);
                        return [4 /*yield*/, this.cartRepository.findOne({
                                where: __assign(__assign({}, filter), { productId: dto.productId })
                            })];
                    case 3:
                        item = _a.sent();
                        if (!item)
                            throw new common_1.NotFoundException('Cart item not found');
                        item.quantity = dto.quantity;
                        return [4 /*yield*/, this.cartRepository.save(item)];
                    case 4:
                        saved = _a.sent();
                        totalPrice = Number(saved.price) * saved.quantity;
                        return [2 /*return*/, __assign(__assign({}, saved), { totalPrice: totalPrice })];
                }
            });
        });
    };
    CartServiceService.prototype.getCart = function (userId, guestId, lang) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, items, translatedItems, error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.verifyUserExists(userId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        filter = this.getCartFilter(userId, guestId);
                        return [4 /*yield*/, this.cartRepository.find({ where: filter })];
                    case 3:
                        items = _a.sent();
                        if (!lang || lang === 'en') {
                            return [2 /*return*/, items.map(function (item) { return (__assign(__assign({}, item), { totalPrice: Number(item.price) * item.quantity })); })];
                        }
                        return [4 /*yield*/, Promise.all(items.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                var textsToTranslate, variationTexts, translatedTexts, translatedTitle, translatedVariation, variationStartIndex, textIndex_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            textsToTranslate = [];
                                            if (item.title) {
                                                textsToTranslate.push(item.title);
                                            }
                                            variationTexts = [];
                                            if (item.variation && Array.isArray(item.variation)) {
                                                item.variation.forEach(function (v) {
                                                    if (v.attribute)
                                                        variationTexts.push(v.attribute);
                                                    if (v.value)
                                                        variationTexts.push(v.value);
                                                });
                                            }
                                            textsToTranslate.push.apply(textsToTranslate, variationTexts);
                                            return [4 /*yield*/, google_translate_helper_1.GoogleTranslateHelper.translateBatch(textsToTranslate, lang, 'en')];
                                        case 1:
                                            translatedTexts = _a.sent();
                                            translatedTitle = item.title;
                                            translatedVariation = item.variation;
                                            if (item.title) {
                                                translatedTitle = translatedTexts[0];
                                            }
                                            if (item.variation && Array.isArray(item.variation)) {
                                                variationStartIndex = item.title ? 1 : 0;
                                                textIndex_1 = variationStartIndex;
                                                translatedVariation = item.variation.map(function (v) { return ({
                                                    attribute: v.attribute ? translatedTexts[textIndex_1++] : v.attribute,
                                                    value: v.value ? translatedTexts[textIndex_1++] : v.value
                                                }); });
                                            }
                                            return [2 /*return*/, __assign(__assign({}, item), { title: translatedTitle, variation: translatedVariation, originalTitle: item.title, originalVariation: item.variation, totalPrice: Number(item.price) * item.quantity })];
                                    }
                                });
                            }); }))];
                    case 4:
                        translatedItems = _a.sent();
                        return [2 /*return*/, translatedItems];
                    case 5:
                        error_3 = _a.sent();
                        if (error_3 instanceof common_1.BadRequestException ||
                            error_3 instanceof common_1.UnauthorizedException ||
                            error_3 instanceof common_1.NotFoundException) {
                            throw error_3;
                        }
                        this.logger.error('Failed to get cart', error_3.stack);
                        throw new common_1.InternalServerErrorException('Failed to get cart');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CartServiceService.prototype.removeFromCart = function (dto, userId, guestId) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.verifyUserExists(userId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!dto.productId)
                            throw new common_1.BadRequestException('Missing productId');
                        filter = this.getCartFilter(userId, guestId);
                        return [4 /*yield*/, this.cartRepository.findOne({
                                where: __assign(__assign({}, filter), { productId: dto.productId })
                            })];
                    case 3:
                        item = _a.sent();
                        if (!item)
                            throw new common_1.NotFoundException('Cart item not found');
                        return [4 /*yield*/, this.cartRepository.remove(item)];
                    case 4:
                        _a.sent();
                        if (!userId) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.sendNotification(userId, 'Item removed from cart 🛒', item.title + " has been removed from your cart.")];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, { message: 'Item removed successfully' }];
                }
            });
        });
    };
    CartServiceService.prototype.clearCart = function (userId, guestId) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.verifyUserExists(userId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        filter = this.getCartFilter(userId, guestId);
                        return [4 /*yield*/, this.cartRepository.find({ where: filter })];
                    case 3:
                        items = _a.sent();
                        if (!items.length)
                            throw new common_1.NotFoundException('Cart is already empty');
                        return [4 /*yield*/, this.cartRepository.remove(items)];
                    case 4:
                        _a.sent();
                        if (!userId) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.sendNotification(userId, 'Cart cleared 🧹', 'Your cart has been cleared successfully.')];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, { message: 'Cart cleared successfully' }];
                }
            });
        });
    };
    CartServiceService.prototype.applyCouponToCart = function (userId, guestId, couponCode) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, cartItems, coupon_1, total, discount, totalAfterDiscount, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        if (!userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.verifyUserExists(userId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!couponCode) {
                            throw new common_1.BadRequestException('Coupon code is required');
                        }
                        filter = this.getCartFilter(userId, guestId);
                        return [4 /*yield*/, this.cartRepository.find({ where: filter })];
                    case 3:
                        cartItems = _a.sent();
                        if (!cartItems.length)
                            throw new common_1.NotFoundException('Cart is empty');
                        return [4 /*yield*/, this.fetchCoupon(couponCode)];
                    case 4:
                        coupon_1 = _a.sent();
                        if (!coupon_1)
                            throw new common_1.NotFoundException('Invalid coupon code');
                        return [4 /*yield*/, Promise.all(cartItems.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            item.couponCode = couponCode;
                                            item.discountPercentage = coupon_1.discountPercentage;
                                            return [4 /*yield*/, this.cartRepository.save(item)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 5:
                        _a.sent();
                        total = cartItems.reduce(function (sum, i) {
                            var priceNum = i.price ? parseFloat(i.price) : 0;
                            return sum + priceNum * i.quantity;
                        }, 0);
                        discount = (total * coupon_1.discountPercentage) / 100;
                        totalAfterDiscount = total - discount;
                        return [2 /*return*/, { cartItems: cartItems, total: total, discount: discount, totalAfterDiscount: totalAfterDiscount, coupon: coupon_1 }];
                    case 6:
                        error_4 = _a.sent();
                        if (error_4 instanceof common_1.BadRequestException ||
                            error_4 instanceof common_1.UnauthorizedException ||
                            error_4 instanceof common_1.NotFoundException ||
                            error_4 instanceof common_1.ConflictException)
                            throw error_4;
                        this.logger.error('Failed to apply coupon', error_4.stack);
                        throw new common_1.InternalServerErrorException('Failed to apply coupon');
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    CartServiceService.prototype.mergeGuestCartToUser = function (guestId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var guestItems, _i, guestItems_1, guestItem, userItem, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, this.cartRepository.find({ where: { guestId: guestId } })];
                    case 1:
                        guestItems = _a.sent();
                        if (!guestItems.length) {
                            return [2 /*return*/, { message: 'No guest cart items to merge' }];
                        }
                        _i = 0, guestItems_1 = guestItems;
                        _a.label = 2;
                    case 2:
                        if (!(_i < guestItems_1.length)) return [3 /*break*/, 8];
                        guestItem = guestItems_1[_i];
                        return [4 /*yield*/, this.cartRepository.findOne({
                                where: { userId: userId, productId: guestItem.productId }
                            })];
                    case 3:
                        userItem = _a.sent();
                        if (!userItem) return [3 /*break*/, 5];
                        userItem.quantity += guestItem.quantity;
                        return [4 /*yield*/, this.cartRepository.save(userItem)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        guestItem.userId = userId;
                        guestItem.guestId = undefined;
                        return [4 /*yield*/, this.cartRepository.save(guestItem)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [4 /*yield*/, this.cartRepository["delete"]({ guestId: guestId })];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, { message: 'Guest cart merged successfully', itemsCount: guestItems.length }];
                    case 10:
                        error_5 = _a.sent();
                        this.logger.error('Failed to merge guest cart', error_5.stack);
                        throw new common_1.InternalServerErrorException('Failed to merge guest cart');
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    var CartServiceService_1;
    CartServiceService = CartServiceService_1 = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(cart_entity_1.CartItem)),
        __param(1, common_1.Inject('USERS_SERVICE')),
        __param(2, common_1.Inject('AFFILIATE_SERVICE')),
        __param(3, common_1.Inject('NOTIFICATIONS_SERVICE'))
    ], CartServiceService);
    return CartServiceService;
}());
exports.CartServiceService = CartServiceService;
