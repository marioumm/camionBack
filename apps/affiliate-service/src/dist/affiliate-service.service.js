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
exports.__esModule = true;
exports.AffiliateServiceService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var affiliate_entity_1 = require("./entities/affiliate.entity");
var coupon_entity_1 = require("./entities/coupon.entity");
var microservices_1 = require("@nestjs/microservices");
var user_entity_1 = require("apps/users-service/src/entities/user.entity");
var rxjs_1 = require("rxjs");
var affiliate_transactions_entity_1 = require("./entities/affiliate_transactions.entity");
var AffiliateServiceService = /** @class */ (function () {
    function AffiliateServiceService(affiliateRepository, couponRepository, affiliateTransactionRepository, userClient, notificationsClient) {
        this.affiliateRepository = affiliateRepository;
        this.couponRepository = couponRepository;
        this.affiliateTransactionRepository = affiliateTransactionRepository;
        this.userClient = userClient;
        this.notificationsClient = notificationsClient;
        this.logger = new common_1.Logger(AffiliateServiceService_1.name);
    }
    AffiliateServiceService_1 = AffiliateServiceService;
    AffiliateServiceService.prototype.sendNotification = function (userId, title, body) {
        return __awaiter(this, void 0, void 0, function () {
            var deviceToken, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.userClient.send({ cmd: 'get-user-device-token' }, { userId: userId }).pipe(rxjs_1.timeout(3000), rxjs_1.catchError(function () {
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
    AffiliateServiceService.prototype.createAffiliateRequest = function (dto, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, updatedAffiliate, affiliate, savedAffiliate, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.affiliateRepository.findOne({ where: { userId: userId } })];
                    case 1:
                        existing = _a.sent();
                        if (!existing) return [3 /*break*/, 4];
                        if (!(existing.status === affiliate_entity_1.AffiliateStatus.REJECTED)) return [3 /*break*/, 3];
                        existing.fullName = dto.fullName;
                        existing.gender = dto.gender;
                        existing.nationality = dto.nationality;
                        existing.bio = dto.bio;
                        existing.status = affiliate_entity_1.AffiliateStatus.PENDING;
                        return [4 /*yield*/, this.affiliateRepository.save(existing)];
                    case 2:
                        updatedAffiliate = _a.sent();
                        return [2 /*return*/, updatedAffiliate];
                    case 3: throw new microservices_1.RpcException({
                        statusCode: 409,
                        message: 'You already submitted a request or you are an affiliate'
                    });
                    case 4:
                        affiliate = this.affiliateRepository.create({
                            userId: userId,
                            fullName: dto.fullName,
                            gender: dto.gender,
                            nationality: dto.nationality,
                            bio: dto.bio,
                            status: affiliate_entity_1.AffiliateStatus.PENDING,
                            totalEarnings: 0,
                            couponsCreated: 0
                        });
                        return [4 /*yield*/, this.affiliateRepository.save(affiliate)];
                    case 5:
                        savedAffiliate = _a.sent();
                        return [4 /*yield*/, this.sendNotification(userId, 'Affiliate Request Received', 'We have received your affiliate request and it will be reviewed soon.')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.sendNotification(userId, 'Affiliate Request Created', "Your affiliate request has been created successfully. Your status is " + savedAffiliate.status + ".")];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, savedAffiliate];
                    case 8:
                        error_1 = _a.sent();
                        throw new microservices_1.RpcException({
                            statusCode: 500,
                            message: (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'Failed to create affiliate request'
                        });
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.getPendingRequests = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateRepository.find({ where: { status: affiliate_entity_1.AffiliateStatus.PENDING } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        throw new microservices_1.RpcException({ statusCode: 500, message: (error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || 'Failed to get pending requests' });
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.getAffiliateStatus = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var affiliate, resp, err_2, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.affiliateRepository.findOne({
                                where: { userId: userId },
                                select: ['id', 'fullName', 'status']
                            })];
                    case 1:
                        affiliate = _a.sent();
                        if (!affiliate) {
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Affiliate request not found' });
                        }
                        if (!(affiliate.status === affiliate_entity_1.AffiliateStatus.APPROVED)) return [3 /*break*/, 5];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.userClient.send({ cmd: 'generate-token' }, { userId: userId }))];
                    case 3:
                        resp = _a.sent();
                        return [2 /*return*/, {
                                affiliateId: affiliate.id,
                                fullName: affiliate.fullName,
                                status: affiliate.status,
                                type: 'affiliate',
                                token: resp === null || resp === void 0 ? void 0 : resp.token
                            }];
                    case 4:
                        err_2 = _a.sent();
                        return [2 /*return*/, {
                                affiliateId: affiliate.id,
                                fullName: affiliate.fullName,
                                status: affiliate.status,
                                type: 'affiliate'
                            }];
                    case 5: return [4 /*yield*/, this.sendNotification(userId, 'Affiliate Status Check', "Your affiliate status is currently " + affiliate.status + ".")];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, {
                                affiliateId: affiliate.id,
                                fullName: affiliate.fullName,
                                status: affiliate.status
                            }];
                    case 7:
                        error_3 = _a.sent();
                        throw new microservices_1.RpcException({ statusCode: 500, message: (error_3 === null || error_3 === void 0 ? void 0 : error_3.message) || 'Failed to get affiliate status' });
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.getCouponByCode = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var coupon, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.couponRepository.findOne({ where: { code: code, isActive: true } })];
                    case 1:
                        coupon = _a.sent();
                        if (!coupon)
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Coupon not found' });
                        return [2 /*return*/, { code: coupon.code, discountPercentage: coupon.discountPercentage }];
                    case 2:
                        error_4 = _a.sent();
                        throw new microservices_1.RpcException({ statusCode: 500, message: (error_4 === null || error_4 === void 0 ? void 0 : error_4.message) || 'Failed to get coupon by code' });
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.reviewAffiliateRequest = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var affiliate, savedAffiliate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.affiliateRepository.findOne({ where: { id: dto.affiliateId } })];
                    case 1:
                        affiliate = _a.sent();
                        if (!affiliate)
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Affiliate not found' });
                        affiliate.status = dto.status;
                        return [4 /*yield*/, this.affiliateRepository.save(affiliate)];
                    case 2:
                        savedAffiliate = _a.sent();
                        if (!(dto.status === affiliate_entity_1.AffiliateStatus.APPROVED)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.userClient.send({ cmd: 'update-user-role' }, { userId: affiliate.userId, role: user_entity_1.UserRole.AFFILIATE }).toPromise()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.sendNotification(affiliate.userId, 'Affiliate Request Approved', "Your affiliate request has been approved. You can now start creating coupons.")];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        if (!(dto.status === affiliate_entity_1.AffiliateStatus.REJECTED)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.sendNotification(affiliate.userId, 'Affiliate Request Rejected', 'We regret to inform you that your affiliate request has been rejected. You can reapply after 30 days.')];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/, savedAffiliate];
                }
            });
        });
    };
    AffiliateServiceService.prototype.createCoupon = function (affiliateId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var affiliate, existing, coupon, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.affiliateRepository.findOne({
                                where: { id: affiliateId, status: affiliate_entity_1.AffiliateStatus.APPROVED }
                            })];
                    case 1:
                        affiliate = _a.sent();
                        if (!affiliate) {
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Affiliate not found or not approved' });
                        }
                        return [4 /*yield*/, this.couponRepository.findOne({ where: { code: dto.code } })];
                    case 2:
                        existing = _a.sent();
                        if (existing)
                            throw new microservices_1.RpcException({ statusCode: 409, message: 'Coupon code already exists' });
                        coupon = this.couponRepository.create({
                            code: dto.code,
                            discountPercentage: dto.discountPercentage,
                            affiliate: affiliate
                        });
                        affiliate.couponsCreated += 1;
                        return [4 /*yield*/, this.affiliateRepository.save(affiliate)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.sendNotification(affiliate.userId, 'Coupon Created', "A new coupon with code " + dto.code + " has been created successfully.")];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, this.couponRepository.save(coupon)];
                    case 5:
                        error_5 = _a.sent();
                        throw new microservices_1.RpcException({ statusCode: 500, message: (error_5 === null || error_5 === void 0 ? void 0 : error_5.message) || 'Failed to create coupon' });
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.getCouponsByAffiliate = function (affiliateId) {
        return __awaiter(this, void 0, void 0, function () {
            var affiliate, coupons, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.affiliateRepository.findOne({
                                where: { id: affiliateId, status: affiliate_entity_1.AffiliateStatus.APPROVED }
                            })];
                    case 1:
                        affiliate = _a.sent();
                        if (!affiliate) {
                            throw new microservices_1.RpcException({
                                statusCode: 404,
                                message: 'Affiliate not found or not approved'
                            });
                        }
                        return [4 /*yield*/, this.couponRepository.find({
                                where: { affiliate: { id: affiliateId } },
                                relations: ['affiliate']
                            })];
                    case 2:
                        coupons = _a.sent();
                        return [2 /*return*/, coupons];
                    case 3:
                        error_6 = _a.sent();
                        throw new microservices_1.RpcException({
                            statusCode: 500,
                            message: (error_6 === null || error_6 === void 0 ? void 0 : error_6.message) || 'Failed to get coupons by affiliate'
                        });
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.searchCoupons = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var query, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = this.couponRepository.createQueryBuilder('coupon')
                            .leftJoinAndSelect('coupon.affiliate', 'affiliate');
                        if (filters.code) {
                            query.andWhere('LOWER(coupon.code) LIKE LOWER(:code)', { code: "%" + filters.code + "%" });
                        }
                        return [4 /*yield*/, query.getMany()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        throw new microservices_1.RpcException({ statusCode: 500, message: (error_7 === null || error_7 === void 0 ? void 0 : error_7.message) || 'Failed to search coupons' });
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.deleteCoupon = function (couponId) {
        return __awaiter(this, void 0, void 0, function () {
            var coupon, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.couponRepository.findOne({
                                where: { id: couponId },
                                relations: ['affiliate']
                            })];
                    case 1:
                        coupon = _a.sent();
                        if (!coupon)
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Coupon not found' });
                        if (!coupon.affiliate) return [3 /*break*/, 3];
                        coupon.affiliate.couponsCreated = Math.max(0, coupon.affiliate.couponsCreated - 1);
                        return [4 /*yield*/, this.affiliateRepository.save(coupon.affiliate)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.sendNotification(coupon.affiliate.userId, 'Coupon Deleted', "The coupon with code " + coupon.code + " has been deleted successfully.")];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, this.couponRepository.remove(coupon)];
                    case 5:
                        error_8 = _a.sent();
                        throw new microservices_1.RpcException({ statusCode: 500, message: (error_8 === null || error_8 === void 0 ? void 0 : error_8.message) || 'Failed to delete coupon' });
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.getAllCoupons = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.couponRepository.find({ relations: ['affiliate'] })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_9 = _a.sent();
                        throw new microservices_1.RpcException({ statusCode: 500, message: (error_9 === null || error_9 === void 0 ? void 0 : error_9.message) || 'Failed to get all coupons' });
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.addAffiliateCommission = function (couponCode, saleAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var coupon, affiliate, commissionRate, commission, transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.couponRepository.findOne({
                            where: { code: couponCode, isActive: true },
                            relations: ['affiliate']
                        })];
                    case 1:
                        coupon = _a.sent();
                        if (!coupon || !coupon.affiliate) {
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Coupon or affiliate not found' });
                        }
                        affiliate = coupon.affiliate;
                        commissionRate = coupon.commissionPercentage || 5.0;
                        commission = saleAmount * (commissionRate / 100);
                        affiliate.walletBalance += commission;
                        affiliate.totalEarnings += commission;
                        return [4 /*yield*/, this.affiliateRepository.save(affiliate)];
                    case 2:
                        _a.sent();
                        transaction = this.affiliateTransactionRepository.create({
                            affiliate: affiliate,
                            amount: commission,
                            description: "Commission (" + commissionRate + "%) from coupon " + couponCode + " on sale " + saleAmount
                        });
                        return [4 /*yield*/, this.affiliateTransactionRepository.save(transaction)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.sendNotification(affiliate.userId, 'New Commission Added', "You earned " + commission.toFixed(2) + " (" + commissionRate + "%) from coupon " + couponCode + ".")];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, { commission: commission, walletBalance: affiliate.walletBalance }];
                }
            });
        });
    };
    AffiliateServiceService.prototype.getWalletBalance = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var affiliate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.affiliateRepository.findOne({ where: { userId: userId } })];
                    case 1:
                        affiliate = _a.sent();
                        if (!affiliate)
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Affiliate not found' });
                        return [2 /*return*/, {
                                walletBalance: affiliate.walletBalance
                            }];
                }
            });
        });
    };
    AffiliateServiceService.prototype.getWalletTransactions = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var affiliate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.affiliateRepository.findOne({
                            where: { userId: userId },
                            relations: ['transactions']
                        })];
                    case 1:
                        affiliate = _a.sent();
                        if (!affiliate)
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Affiliate not found' });
                        return [2 /*return*/, affiliate.transactions.map(function (txn) { return ({
                                id: txn.id,
                                amount: txn.amount,
                                description: txn.description,
                                createdAt: txn.createdAt
                            }); })];
                }
            });
        });
    };
    AffiliateServiceService.prototype.updateAffiliate = function (dto) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var affiliate, error_10;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.affiliateRepository.findOne({ where: { id: dto.id } })];
                    case 1:
                        affiliate = _c.sent();
                        if (!affiliate)
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Affiliate not found' });
                        Object.assign(affiliate, {
                            bio: (_a = dto.bio) !== null && _a !== void 0 ? _a : affiliate.bio,
                            referralLink: (_b = dto.referralLink) !== null && _b !== void 0 ? _b : affiliate.referralLink
                        });
                        return [4 /*yield*/, this.sendNotification(affiliate.userId, 'Affiliate Updated', "Your affiliate profile has been updated successfully.")];
                    case 2:
                        _c.sent();
                        return [2 /*return*/, this.affiliateRepository.save(affiliate)];
                    case 3:
                        error_10 = _c.sent();
                        throw new microservices_1.RpcException({ statusCode: 500, message: (error_10 === null || error_10 === void 0 ? void 0 : error_10.message) || 'Failed to update affiliate' });
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.deleteAffiliate = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var affiliate, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.affiliateRepository.findOne({ where: { id: id } })];
                    case 1:
                        affiliate = _a.sent();
                        if (!affiliate)
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Affiliate not found' });
                        if (affiliate.status !== affiliate_entity_1.AffiliateStatus.REJECTED) {
                            throw new microservices_1.RpcException({ statusCode: 400, message: 'Only rejected affiliates can be deleted' });
                        }
                        return [4 /*yield*/, this.userClient.send({ cmd: 'update-user-role' }, { userId: affiliate.userId, role: user_entity_1.UserRole.USER }).toPromise()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.sendNotification(affiliate.userId, 'Affiliate Deleted', "Your affiliate account has been deleted successfully.")];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this.affiliateRepository.remove(affiliate)];
                    case 4:
                        error_11 = _a.sent();
                        throw new microservices_1.RpcException({ statusCode: 500, message: (error_11 === null || error_11 === void 0 ? void 0 : error_11.message) || 'Failed to delete affiliate' });
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.countAllAffiliates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateRepository.count()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_12 = _a.sent();
                        throw new microservices_1.RpcException({ statusCode: 500, message: (error_12 === null || error_12 === void 0 ? void 0 : error_12.message) || 'Failed to count affiliates' });
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.countApprovedAffiliates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateRepository.count({ where: { status: affiliate_entity_1.AffiliateStatus.APPROVED } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_13 = _a.sent();
                        throw new microservices_1.RpcException({ statusCode: 500, message: (error_13 === null || error_13 === void 0 ? void 0 : error_13.message) || 'Failed to count approved affiliates' });
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.countPendingAffiliates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateRepository.count({ where: { status: affiliate_entity_1.AffiliateStatus.PENDING } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_14 = _a.sent();
                        throw new microservices_1.RpcException({ statusCode: 500, message: (error_14 === null || error_14 === void 0 ? void 0 : error_14.message) || 'Failed to count pending affiliates' });
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.countRejectedAffiliates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateRepository.count({ where: { status: affiliate_entity_1.AffiliateStatus.REJECTED } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_15 = _a.sent();
                        throw new microservices_1.RpcException({ statusCode: 500, message: (error_15 === null || error_15 === void 0 ? void 0 : error_15.message) || 'Failed to count rejected affiliates' });
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.countAllCoupons = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.couponRepository.count()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_16 = _a.sent();
                        throw new microservices_1.RpcException({ statusCode: 500, message: (error_16 === null || error_16 === void 0 ? void 0 : error_16.message) || 'Failed to count coupons' });
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.adminCreateCoupon = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var affiliate, existing, coupon, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.affiliateRepository.findOne({
                                where: { id: dto.affiliateId, status: affiliate_entity_1.AffiliateStatus.APPROVED }
                            })];
                    case 1:
                        affiliate = _a.sent();
                        if (!affiliate) {
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Affiliate not found or not approved' });
                        }
                        return [4 /*yield*/, this.couponRepository.findOne({ where: { code: dto.code } })];
                    case 2:
                        existing = _a.sent();
                        if (existing)
                            throw new microservices_1.RpcException({ statusCode: 409, message: 'Coupon code already exists' });
                        coupon = this.couponRepository.create({
                            code: dto.code,
                            discountPercentage: dto.discountPercentage,
                            commissionPercentage: dto.commissionPercentage,
                            affiliate: affiliate
                        });
                        affiliate.couponsCreated += 1;
                        return [4 /*yield*/, this.affiliateRepository.save(affiliate)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.sendNotification(affiliate.userId, 'New Coupon Created', "Admin created coupon " + dto.code + " for you with " + dto.commissionPercentage + "% commission rate.")];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, this.couponRepository.save(coupon)];
                    case 5:
                        error_17 = _a.sent();
                        throw new microservices_1.RpcException({ statusCode: 500, message: (error_17 === null || error_17 === void 0 ? void 0 : error_17.message) || 'Failed to create coupon by admin' });
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.updateCouponCommission = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var coupon, oldRate, updatedCoupon, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.couponRepository.findOne({
                                where: { id: dto.couponId },
                                relations: ['affiliate']
                            })];
                    case 1:
                        coupon = _a.sent();
                        if (!coupon) {
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Coupon not found' });
                        }
                        oldRate = coupon.commissionPercentage || 5.0;
                        coupon.commissionPercentage = dto.commissionPercentage;
                        return [4 /*yield*/, this.couponRepository.save(coupon)];
                    case 2:
                        updatedCoupon = _a.sent();
                        return [4 /*yield*/, this.sendNotification(coupon.affiliate.userId, 'Commission Rate Updated', "Commission rate for coupon " + coupon.code + " updated from " + oldRate + "% to " + dto.commissionPercentage + "%.")];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, updatedCoupon];
                    case 4:
                        error_18 = _a.sent();
                        throw new microservices_1.RpcException({ statusCode: 500, message: (error_18 === null || error_18 === void 0 ? void 0 : error_18.message) || 'Failed to update coupon commission' });
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceService.prototype.getAllAffiliates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateRepository.find()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_19 = _a.sent();
                        throw new microservices_1.RpcException({
                            statusCode: 500,
                            message: (error_19 === null || error_19 === void 0 ? void 0 : error_19.message) || 'Failed to get all affiliates'
                        });
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    var AffiliateServiceService_1;
    AffiliateServiceService = AffiliateServiceService_1 = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(affiliate_entity_1.Affiliate)),
        __param(1, typeorm_1.InjectRepository(coupon_entity_1.Coupon)),
        __param(2, typeorm_1.InjectRepository(affiliate_transactions_entity_1.AffiliateTransaction)),
        __param(3, common_1.Inject('USER_SERVICE')),
        __param(4, common_1.Inject('NOTIFICATIONS_SERVICE'))
    ], AffiliateServiceService);
    return AffiliateServiceService;
}());
exports.AffiliateServiceService = AffiliateServiceService;
