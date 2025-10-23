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
exports.AffiliateServiceController = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
var common_1 = require("@nestjs/common");
var microservices_1 = require("@nestjs/microservices");
function mapException(error) {
    if (error instanceof common_1.NotFoundException ||
        error instanceof common_1.ConflictException ||
        error instanceof common_1.BadRequestException ||
        error instanceof common_1.UnauthorizedException) {
        return new microservices_1.RpcException({
            statusCode: error.getStatus(),
            message: error.message
        });
    }
    return new microservices_1.RpcException({
        statusCode: 500,
        message: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error from affiliate microservice'
    });
}
var AffiliateServiceController = /** @class */ (function () {
    function AffiliateServiceController(affiliateService) {
        this.affiliateService = affiliateService;
    }
    AffiliateServiceController.prototype.handleAffiliateRequest = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, dto, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = data.userId, dto = __rest(data, ["userId"]);
                        return [4 /*yield*/, this.affiliateService.createAffiliateRequest(dto, userId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        throw mapException(error_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceController.prototype.handleGetPendingRequests = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateService.getPendingRequests()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        throw mapException(error_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceController.prototype.handleGetAffiliateStatus = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateService.getAffiliateStatus(data.userId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        throw mapException(error_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceController.prototype.handleReviewRequest = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateService.reviewAffiliateRequest(dto)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        throw mapException(error_4);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceController.prototype.handleCreateCoupon = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var affiliateId, dto, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        affiliateId = data.affiliateId, dto = __rest(data, ["affiliateId"]);
                        return [4 /*yield*/, this.affiliateService.createCoupon(affiliateId, dto)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        throw mapException(error_5);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceController.prototype.handleGetCouponsByAffiliate = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateService.getCouponsByAffiliate(data.affiliateId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        throw mapException(error_6);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceController.prototype.searchCoupons = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateService.searchCoupons(dto)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        throw mapException(error_7);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceController.prototype.deleteCoupon = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateService.deleteCoupon(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_8 = _a.sent();
                        throw mapException(error_8);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceController.prototype.handleUpdateAffiliate = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateService.updateAffiliate(dto)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_9 = _a.sent();
                        throw mapException(error_9);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceController.prototype.handleDeleteAffiliate = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateService.deleteAffiliate(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_10 = _a.sent();
                        throw mapException(error_10);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceController.prototype.handleGetAllCoupons = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateService.getAllCoupons()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_11 = _a.sent();
                        throw mapException(error_11);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceController.prototype.handleAddCommission = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var couponCode, saleAmount, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        couponCode = data.couponCode, saleAmount = data.saleAmount;
                        return [4 /*yield*/, this.affiliateService.addAffiliateCommission(couponCode, saleAmount)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_12 = _a.sent();
                        throw mapException(error_12);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceController.prototype.handleGetWalletBalance = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateService.getWalletBalance(data.userId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_1 = _a.sent();
                        throw mapException(err_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceController.prototype.handleGetWalletTransactions = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateService.getWalletTransactions(data.userId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_2 = _a.sent();
                        throw mapException(err_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceController.prototype.getCouponByCode = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.affiliateService.getCouponByCode(data.code)];
            });
        });
    };
    AffiliateServiceController.prototype.countAllAffiliates = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.affiliateService.countAllAffiliates()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AffiliateServiceController.prototype.countApprovedAffiliates = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.affiliateService.countApprovedAffiliates()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AffiliateServiceController.prototype.countPendingAffiliates = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.affiliateService.countPendingAffiliates()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AffiliateServiceController.prototype.countRejectedAffiliates = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.affiliateService.countRejectedAffiliates()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AffiliateServiceController.prototype.countAllCoupons = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.affiliateService.countAllCoupons()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AffiliateServiceController.prototype.handleAdminCreateCoupon = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateService.adminCreateCoupon(dto)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_13 = _a.sent();
                        throw mapException(error_13);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceController.prototype.handleUpdateCouponCommission = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateService.updateCouponCommission(dto)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_14 = _a.sent();
                        throw mapException(error_14);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AffiliateServiceController.prototype.handleGetAllAffiliates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.affiliateService.getAllAffiliates()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_15 = _a.sent();
                        throw mapException(error_15);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        microservices_1.MessagePattern({ cmd: 'create_affiliate_request' }),
        __param(0, microservices_1.Payload())
    ], AffiliateServiceController.prototype, "handleAffiliateRequest");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'get_pending_affiliate_requests' })
    ], AffiliateServiceController.prototype, "handleGetPendingRequests");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'get_affiliate_status' }),
        __param(0, microservices_1.Payload())
    ], AffiliateServiceController.prototype, "handleGetAffiliateStatus");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'review_affiliate_request' }),
        __param(0, microservices_1.Payload())
    ], AffiliateServiceController.prototype, "handleReviewRequest");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'create_coupon' }),
        __param(0, microservices_1.Payload())
    ], AffiliateServiceController.prototype, "handleCreateCoupon");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'get_coupons_by_affiliate' }),
        __param(0, microservices_1.Payload())
    ], AffiliateServiceController.prototype, "handleGetCouponsByAffiliate");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'search_coupons' }),
        __param(0, microservices_1.Payload())
    ], AffiliateServiceController.prototype, "searchCoupons");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'delete_coupon' }),
        __param(0, microservices_1.Payload())
    ], AffiliateServiceController.prototype, "deleteCoupon");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'update_affiliate' }),
        __param(0, microservices_1.Payload())
    ], AffiliateServiceController.prototype, "handleUpdateAffiliate");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'delete_affiliate' }),
        __param(0, microservices_1.Payload())
    ], AffiliateServiceController.prototype, "handleDeleteAffiliate");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'get_all_coupons' })
    ], AffiliateServiceController.prototype, "handleGetAllCoupons");
    __decorate([
        microservices_1.MessagePattern('affiliate.addCommission')
    ], AffiliateServiceController.prototype, "handleAddCommission");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'affiliate.getWalletBalance' }),
        __param(0, microservices_1.Payload())
    ], AffiliateServiceController.prototype, "handleGetWalletBalance");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'affiliate.getWalletTransactions' }),
        __param(0, microservices_1.Payload())
    ], AffiliateServiceController.prototype, "handleGetWalletTransactions");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'affiliate.getCouponByCode' }),
        __param(0, microservices_1.Payload())
    ], AffiliateServiceController.prototype, "getCouponByCode");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'count_all_affiliates' })
    ], AffiliateServiceController.prototype, "countAllAffiliates");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'count_approved_affiliates' })
    ], AffiliateServiceController.prototype, "countApprovedAffiliates");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'count_pending_affiliates' })
    ], AffiliateServiceController.prototype, "countPendingAffiliates");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'count_rejected_affiliates' })
    ], AffiliateServiceController.prototype, "countRejectedAffiliates");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'count_all_coupons' })
    ], AffiliateServiceController.prototype, "countAllCoupons");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'admin_create_coupon' }),
        __param(0, microservices_1.Payload())
    ], AffiliateServiceController.prototype, "handleAdminCreateCoupon");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'update_coupon_commission' }),
        __param(0, microservices_1.Payload())
    ], AffiliateServiceController.prototype, "handleUpdateCouponCommission");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'get_all_affiliates' })
    ], AffiliateServiceController.prototype, "handleGetAllAffiliates");
    AffiliateServiceController = __decorate([
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
    ], AffiliateServiceController);
    return AffiliateServiceController;
}());
exports.AffiliateServiceController = AffiliateServiceController;
