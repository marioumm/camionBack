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
exports.AffiliateController = void 0;
var common_1 = require("@nestjs/common");
var user_entity_1 = require("apps/users-service/src/entities/user.entity");
var src_1 = require("libs/auth/src");
var roles_decorator_1 = require("libs/auth/src/roles.decorator");
var roles_guard_1 = require("libs/auth/src/roles.guard");
var current_affiliate_id_decorator_1 = require("libs/auth/src/current-affiliate-id.decorator");
var current_user_decorator_1 = require("libs/auth/src/current-user.decorator");
var AffiliateController = /** @class */ (function () {
    function AffiliateController(affiliateClient) {
        this.affiliateClient = affiliateClient;
    }
    AffiliateController.prototype.requestAffiliate = function (dto, userId) {
        return this.affiliateClient.send({ cmd: 'create_affiliate_request' }, __assign(__assign({}, dto), { userId: userId }));
    };
    AffiliateController.prototype.getPendingRequests = function () {
        return this.affiliateClient.send({ cmd: 'get_pending_affiliate_requests' }, {});
    };
    AffiliateController.prototype.getAffiliateStatus = function (userId) {
        return this.affiliateClient.send({ cmd: 'get_affiliate_status' }, { userId: userId });
    };
    AffiliateController.prototype.reviewRequest = function (dto) {
        return this.affiliateClient.send({ cmd: 'review_affiliate_request' }, dto);
    };
    AffiliateController.prototype.createCoupon = function (dto, affiliateId) {
        return this.affiliateClient.send({ cmd: 'create_coupon' }, __assign(__assign({}, dto), { affiliateId: affiliateId }));
    };
    AffiliateController.prototype.getCoupons = function (affiliateId) {
        return this.affiliateClient.send({ cmd: 'get_coupons_by_affiliate' }, { affiliateId: affiliateId });
    };
    AffiliateController.prototype.searchCoupons = function (dto) {
        return this.affiliateClient.send({ cmd: 'search_coupons' }, dto);
    };
    AffiliateController.prototype.deleteCoupon = function (couponId) {
        return this.affiliateClient.send({ cmd: 'delete_coupon' }, couponId);
    };
    AffiliateController.prototype.updateAffiliate = function (id, dto) {
        return this.affiliateClient.send({ cmd: 'update_affiliate' }, __assign({ id: id }, dto));
    };
    AffiliateController.prototype.deleteAffiliate = function (id) {
        return this.affiliateClient.send({ cmd: 'delete_affiliate' }, id);
    };
    AffiliateController.prototype.getAllCoupons = function () {
        return this.affiliateClient.send({ cmd: 'get_all_coupons' }, {});
    };
    AffiliateController.prototype.getWalletBalance = function (userId) {
        return this.affiliateClient.send({ cmd: 'affiliate.getWalletBalance' }, { userId: userId });
    };
    AffiliateController.prototype.getWalletTransactions = function (userId) {
        return this.affiliateClient.send({ cmd: 'affiliate.getWalletTransactions' }, { userId: userId });
    };
    AffiliateController.prototype.countAllAffiliates = function () {
        return this.affiliateClient.send({ cmd: 'count_all_affiliates' }, {});
    };
    AffiliateController.prototype.countApprovedAffiliates = function () {
        return this.affiliateClient.send({ cmd: 'count_approved_affiliates' }, {});
    };
    AffiliateController.prototype.countPendingAffiliates = function () {
        return this.affiliateClient.send({ cmd: 'count_pending_affiliates' }, {});
    };
    AffiliateController.prototype.countRejectedAffiliates = function () {
        return this.affiliateClient.send({ cmd: 'count_rejected_affiliates' }, {});
    };
    AffiliateController.prototype.countAllCoupons = function () {
        return this.affiliateClient.send({ cmd: 'count_all_coupons' }, {});
    };
    AffiliateController.prototype.adminCreateCoupon = function (dto) {
        return this.affiliateClient.send({ cmd: 'admin_create_coupon' }, dto);
    };
    AffiliateController.prototype.updateCouponCommission = function (dto) {
        return this.affiliateClient.send({ cmd: 'update_coupon_commission' }, dto);
    };
    AffiliateController.prototype.getAllAffiliates = function () {
        return this.affiliateClient.send({ cmd: 'get_all_affiliates' }, {});
    };
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.USER),
        common_1.Post('request'),
        __param(0, common_1.Body()),
        __param(1, current_user_decorator_1.CurrentUserId())
    ], AffiliateController.prototype, "requestAffiliate");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN),
        common_1.Get('requests/pending')
    ], AffiliateController.prototype, "getPendingRequests");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.AFFILIATE, user_entity_1.UserRole.USER),
        common_1.Get('me/status'),
        __param(0, current_user_decorator_1.CurrentUserId())
    ], AffiliateController.prototype, "getAffiliateStatus");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN),
        common_1.Post('requests/review'),
        __param(0, common_1.Body())
    ], AffiliateController.prototype, "reviewRequest");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.AFFILIATE),
        common_1.Post('coupon'),
        __param(0, common_1.Body()),
        __param(1, current_affiliate_id_decorator_1.CurrentAffiliateId())
    ], AffiliateController.prototype, "createCoupon");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.AFFILIATE),
        common_1.Get('coupon/me'),
        __param(0, current_affiliate_id_decorator_1.CurrentAffiliateId())
    ], AffiliateController.prototype, "getCoupons");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN),
        common_1.Post('coupon/search'),
        __param(0, common_1.Body())
    ], AffiliateController.prototype, "searchCoupons");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN),
        common_1.Delete('coupon/:id'),
        __param(0, common_1.Param('id'))
    ], AffiliateController.prototype, "deleteCoupon");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.AFFILIATE),
        common_1.Patch(':id'),
        __param(0, common_1.Param('id')), __param(1, common_1.Body())
    ], AffiliateController.prototype, "updateAffiliate");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.AFFILIATE),
        common_1.Delete(':id'),
        __param(0, common_1.Param('id'))
    ], AffiliateController.prototype, "deleteAffiliate");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN),
        common_1.Get('coupons/all')
    ], AffiliateController.prototype, "getAllCoupons");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.AFFILIATE),
        common_1.Get('wallet'),
        __param(0, current_user_decorator_1.CurrentUserId())
    ], AffiliateController.prototype, "getWalletBalance");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.AFFILIATE),
        common_1.Get('wallet/transactions'),
        __param(0, current_user_decorator_1.CurrentUserId())
    ], AffiliateController.prototype, "getWalletTransactions");
    __decorate([
        common_1.Get('/count/all'),
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN)
    ], AffiliateController.prototype, "countAllAffiliates");
    __decorate([
        common_1.Get('/count/approved'),
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN)
    ], AffiliateController.prototype, "countApprovedAffiliates");
    __decorate([
        common_1.Get('/count/pending'),
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN)
    ], AffiliateController.prototype, "countPendingAffiliates");
    __decorate([
        common_1.Get('/count/rejected'),
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN)
    ], AffiliateController.prototype, "countRejectedAffiliates");
    __decorate([
        common_1.Get('/count/coupons'),
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN)
    ], AffiliateController.prototype, "countAllCoupons");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN),
        common_1.Post('admin/coupon'),
        __param(0, common_1.Body())
    ], AffiliateController.prototype, "adminCreateCoupon");
    __decorate([
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN),
        common_1.Patch('coupon/commission'),
        __param(0, common_1.Body())
    ], AffiliateController.prototype, "updateCouponCommission");
    __decorate([
        common_1.Get('all'),
        common_1.UseGuards(src_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN)
    ], AffiliateController.prototype, "getAllAffiliates");
    AffiliateController = __decorate([
        common_1.Controller('affiliates'),
        __param(0, common_1.Inject('AFFILIATE_SERVICE'))
    ], AffiliateController);
    return AffiliateController;
}());
exports.AffiliateController = AffiliateController;
