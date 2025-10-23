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
exports.__esModule = true;
exports.WishlistController = void 0;
var common_1 = require("@nestjs/common");
var optional_auth_guard_1 = require("libs/auth/src/optional-auth.guard");
var optional_user_id_decorator_1 = require("libs/auth/src/optional-user-id.decorator");
var WishlistController = /** @class */ (function () {
    function WishlistController(wishlistClient) {
        this.wishlistClient = wishlistClient;
    }
    WishlistController.prototype.getIdentifier = function (userId, guestId) {
        if (userId)
            return { userId: userId };
        if (guestId)
            return { guestId: guestId };
        throw new Error('Missing user or guest identifier');
    };
    WishlistController.prototype.extractLanguage = function (acceptLanguage) {
        if (!acceptLanguage)
            return 'en';
        var lang = acceptLanguage.split(',')[0].split('-')[0].trim();
        return lang || 'en';
    };
    WishlistController.prototype.addToWishlist = function (body, userId, guestId) {
        var identifier = this.getIdentifier(userId, guestId);
        return this.wishlistClient.send({ cmd: 'add_to_wishlist' }, __assign(__assign({}, body), identifier));
    };
    WishlistController.prototype.checkProductInWishlist = function (dto, userId, guestId) {
        var identifier = this.getIdentifier(userId, guestId);
        return this.wishlistClient.send({ cmd: 'wishlist.isProductInWishlist' }, __assign({ productId: dto.productId }, identifier));
    };
    WishlistController.prototype.removeFromWishlist = function (body, userId, guestId) {
        var identifier = this.getIdentifier(userId, guestId);
        return this.wishlistClient.send({ cmd: 'remove_from_wishlist' }, __assign(__assign({}, body), identifier));
    };
    WishlistController.prototype.getWishlist = function (userId, guestId, acceptLanguage, queryLang) {
        var identifier = this.getIdentifier(userId, guestId);
        var lang = queryLang || this.extractLanguage(acceptLanguage);
        return this.wishlistClient.send({ cmd: 'get_wishlist' }, __assign(__assign({}, identifier), { lang: lang }));
    };
    __decorate([
        common_1.Post('add'),
        __param(0, common_1.Body()),
        __param(1, optional_user_id_decorator_1.OptionalUserId()),
        __param(2, common_1.Headers('x-guest-id'))
    ], WishlistController.prototype, "addToWishlist");
    __decorate([
        common_1.Post('check-product'),
        __param(0, common_1.Body()),
        __param(1, optional_user_id_decorator_1.OptionalUserId()),
        __param(2, common_1.Headers('x-guest-id'))
    ], WishlistController.prototype, "checkProductInWishlist");
    __decorate([
        common_1.Delete('remove'),
        __param(0, common_1.Body()),
        __param(1, optional_user_id_decorator_1.OptionalUserId()),
        __param(2, common_1.Headers('x-guest-id'))
    ], WishlistController.prototype, "removeFromWishlist");
    __decorate([
        common_1.Get('get'),
        __param(0, optional_user_id_decorator_1.OptionalUserId()),
        __param(1, common_1.Headers('x-guest-id')),
        __param(2, common_1.Headers('accept-language')),
        __param(3, common_1.Query('lang'))
    ], WishlistController.prototype, "getWishlist");
    WishlistController = __decorate([
        common_1.Controller('wishlist'),
        common_1.UseGuards(optional_auth_guard_1.OptionalJwtAuthGuard),
        __param(0, common_1.Inject('WISHLIST_SERVICE'))
    ], WishlistController);
    return WishlistController;
}());
exports.WishlistController = WishlistController;
