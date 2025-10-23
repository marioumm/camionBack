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
exports.WishlistServiceService = void 0;
// apps/wishlist-service/src/wishlist-service.service.ts
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var microservices_1 = require("@nestjs/microservices");
var wishlist_entity_1 = require("./entities/wishlist.entity");
var rxjs_1 = require("rxjs");
var google_translate_helper_1 = require("./google-translate.helper");
var WishlistServiceService = /** @class */ (function () {
    function WishlistServiceService(wishlistRepository, usersClient, notificationsClient) {
        this.wishlistRepository = wishlistRepository;
        this.usersClient = usersClient;
        this.notificationsClient = notificationsClient;
        this.logger = new common_1.Logger(WishlistServiceService_1.name);
    }
    WishlistServiceService_1 = WishlistServiceService;
    WishlistServiceService.prototype.sendNotification = function (userId, title, body) {
        return __awaiter(this, void 0, void 0, function () {
            var deviceToken, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.usersClient.send({ cmd: 'get-user-device-token' }, { userId: userId }).pipe(rxjs_1.timeout(3000), rxjs_1.catchError(function () {
                                _this.logger.warn("No notification token found for user " + userId);
                                return rxjs_1.of({ deviceToken: null });
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
                                return rxjs_1.of(null);
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
    WishlistServiceService.prototype.getWishlistFilter = function (userId, guestId) {
        if (userId)
            return { userId: userId };
        if (guestId)
            return { guestId: guestId };
        throw new microservices_1.RpcException({ statusCode: 400, message: 'Missing user or guest identifier' });
    };
    WishlistServiceService.prototype.addToWishlist = function (userId, guestId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, exists, item, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        filter = this.getWishlistFilter(userId, guestId);
                        return [4 /*yield*/, this.wishlistRepository.findOne({
                                where: __assign(__assign({}, filter), { productId: dto.productId })
                            })];
                    case 1:
                        exists = _a.sent();
                        if (exists)
                            return [2 /*return*/, exists];
                        item = this.wishlistRepository.create(__assign(__assign({}, dto), { userId: userId || null, guestId: guestId || null }));
                        if (!userId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sendNotification(userId, 'Item added to wishlist ❤️', dto.productName + " has been added to your wishlist.")];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.wishlistRepository.save(item)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5:
                        error_1 = _a.sent();
                        throw toRpc(error_1, 'Failed to add to wishlist');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    WishlistServiceService.prototype.isProductInWishlist = function (userId, guestId, productId) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, wishlistItem, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        filter = this.getWishlistFilter(userId, guestId);
                        return [4 /*yield*/, this.wishlistRepository.findOne({
                                where: __assign(__assign({}, filter), { productId: productId })
                            })];
                    case 1:
                        wishlistItem = _a.sent();
                        return [2 /*return*/, { exists: !!wishlistItem }];
                    case 2:
                        error_2 = _a.sent();
                        throw toRpc(error_2, 'Failed to check product in wishlist');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WishlistServiceService.prototype.removeFromWishlist = function (userId, guestId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, item, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        filter = this.getWishlistFilter(userId, guestId);
                        return [4 /*yield*/, this.wishlistRepository.findOne({
                                where: __assign(__assign({}, filter), { productId: dto.productId })
                            })];
                    case 1:
                        item = _a.sent();
                        if (!item)
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Item not found in wishlist' });
                        if (!userId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sendNotification(userId, 'Item removed from wishlist ❌', item.productName + " has been removed from your wishlist.")];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.wishlistRepository.remove(item)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5:
                        error_3 = _a.sent();
                        throw toRpc(error_3, 'Failed to remove from wishlist');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    WishlistServiceService.prototype.getWishlist = function (userId, guestId, lang) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, items, productNames, translatedNames_1, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        filter = this.getWishlistFilter(userId, guestId);
                        return [4 /*yield*/, this.wishlistRepository.find({ where: filter })];
                    case 1:
                        items = _a.sent();
                        if (!lang || lang === 'en') {
                            return [2 /*return*/, items];
                        }
                        productNames = items.map(function (item) { return item.productName || ''; });
                        return [4 /*yield*/, google_translate_helper_1.GoogleTranslateHelper.translateBatch(productNames, lang, 'en')];
                    case 2:
                        translatedNames_1 = _a.sent();
                        return [2 /*return*/, items.map(function (item, index) { return (__assign(__assign({}, item), { productName: translatedNames_1[index], originalProductName: item.productName })); })];
                    case 3:
                        error_4 = _a.sent();
                        throw toRpc(error_4, 'Failed to retrieve wishlist');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WishlistServiceService.prototype.mergeGuestWishlistToUser = function (guestId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var guestItems, _i, guestItems_1, guestItem, userItem, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.wishlistRepository.find({ where: { guestId: guestId } })];
                    case 1:
                        guestItems = _a.sent();
                        if (!guestItems.length) {
                            return [2 /*return*/, { message: 'No guest wishlist items to merge' }];
                        }
                        _i = 0, guestItems_1 = guestItems;
                        _a.label = 2;
                    case 2:
                        if (!(_i < guestItems_1.length)) return [3 /*break*/, 6];
                        guestItem = guestItems_1[_i];
                        return [4 /*yield*/, this.wishlistRepository.findOne({
                                where: { userId: userId, productId: guestItem.productId }
                            })];
                    case 3:
                        userItem = _a.sent();
                        if (!!userItem) return [3 /*break*/, 5];
                        guestItem.userId = userId;
                        guestItem.guestId = null;
                        return [4 /*yield*/, this.wishlistRepository.save(guestItem)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [4 /*yield*/, this.wishlistRepository["delete"]({ guestId: guestId })];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, { message: 'Guest wishlist merged successfully', itemsCount: guestItems.length }];
                    case 8:
                        error_5 = _a.sent();
                        this.logger.error('Failed to merge guest wishlist', error_5.stack);
                        throw new microservices_1.RpcException({ statusCode: 500, message: 'Failed to merge guest wishlist' });
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    var WishlistServiceService_1;
    WishlistServiceService = WishlistServiceService_1 = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(wishlist_entity_1.WishlistItem)),
        __param(1, common_1.Inject('USERS_SERVICE')),
        __param(2, common_1.Inject('NOTIFICATIONS_SERVICE'))
    ], WishlistServiceService);
    return WishlistServiceService;
}());
exports.WishlistServiceService = WishlistServiceService;
function toRpc(error, fallbackMsg) {
    var _a;
    if (error instanceof microservices_1.RpcException)
        return error;
    var statusCode = ((_a = error === null || error === void 0 ? void 0 : error.getStatus) === null || _a === void 0 ? void 0 : _a.call(error)) || 500;
    var message = (error === null || error === void 0 ? void 0 : error.message) || fallbackMsg || 'Wishlist microservice error';
    return new microservices_1.RpcException({ statusCode: statusCode, message: message });
}
