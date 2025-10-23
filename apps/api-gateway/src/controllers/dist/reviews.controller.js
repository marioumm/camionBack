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
exports.ReviewsController = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
var auth_1 = require("@app/auth");
var common_1 = require("@nestjs/common");
var current_user_decorator_1 = require("libs/auth/src/current-user.decorator");
var rxjs_1 = require("rxjs");
var ReviewsController = /** @class */ (function () {
    function ReviewsController(reviewsClient) {
        this.reviewsClient = reviewsClient;
    }
    ReviewsController.prototype.createReview = function (user, createReviewDto) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, rxjs_1.firstValueFrom(this.reviewsClient.send('create_review', __assign({ userId: user.id }, createReviewDto)))];
                    case 1:
                        response = _a.sent();
                        if (response.status !== 201) {
                            throw new Error(response.message);
                        }
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    ReviewsController.prototype.addComment = function (user, createCommentDto) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, rxjs_1.firstValueFrom(this.reviewsClient.send('add_comment', __assign({ userId: user.id }, createCommentDto)))];
                    case 1:
                        response = _a.sent();
                        if (response.status !== 201) {
                            throw new Error(response.message);
                        }
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    ReviewsController.prototype.getProductReviews = function (productId, page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, rxjs_1.firstValueFrom(this.reviewsClient.send('get_product_reviews', {
                            productId: productId,
                            page: page,
                            limit: limit
                        }))];
                    case 1:
                        response = _a.sent();
                        if (response.status !== 200) {
                            throw new Error(response.message);
                        }
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    ReviewsController.prototype.canReview = function (user, productId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, rxjs_1.firstValueFrom(this.reviewsClient.send('can_user_review', {
                            userId: user.id,
                            productId: productId
                        }))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    ReviewsController.prototype.getUserReviews = function (user, page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, rxjs_1.firstValueFrom(this.reviewsClient.send('get_user_reviews', {
                            userId: user.id,
                            page: page,
                            limit: limit
                        }))];
                    case 1:
                        response = _a.sent();
                        if (response.status !== 200) {
                            throw new Error(response.message);
                        }
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    ReviewsController.prototype.deleteComment = function (user, commentId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, rxjs_1.firstValueFrom(this.reviewsClient.send('delete_comment', {
                            userId: user.id,
                            commentId: commentId
                        }))];
                    case 1:
                        response = _a.sent();
                        if (response.status !== 200) {
                            throw new Error(response.message);
                        }
                        return [2 /*return*/, { message: 'Comment deleted successfully' }];
                }
            });
        });
    };
    __decorate([
        common_1.Post(),
        common_1.UseGuards(auth_1.JwtAuthGuard),
        __param(0, current_user_decorator_1.CurrentUserId()),
        __param(1, common_1.Body())
    ], ReviewsController.prototype, "createReview");
    __decorate([
        common_1.Post('comment'),
        common_1.UseGuards(auth_1.JwtAuthGuard),
        __param(0, current_user_decorator_1.CurrentUserId()),
        __param(1, common_1.Body())
    ], ReviewsController.prototype, "addComment");
    __decorate([
        common_1.Get('product/:productId'),
        __param(0, common_1.Param('productId', common_1.ParseIntPipe)),
        __param(1, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
        __param(2, common_1.Query('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe))
    ], ReviewsController.prototype, "getProductReviews");
    __decorate([
        common_1.Get('can-review/:productId'),
        common_1.UseGuards(auth_1.JwtAuthGuard),
        __param(0, current_user_decorator_1.CurrentUserId()),
        __param(1, common_1.Param('productId', common_1.ParseIntPipe))
    ], ReviewsController.prototype, "canReview");
    __decorate([
        common_1.Get('user'),
        common_1.UseGuards(auth_1.JwtAuthGuard),
        __param(0, current_user_decorator_1.CurrentUserId()),
        __param(1, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
        __param(2, common_1.Query('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe))
    ], ReviewsController.prototype, "getUserReviews");
    __decorate([
        common_1.Delete('comment/:commentId'),
        common_1.UseGuards(auth_1.JwtAuthGuard),
        __param(0, current_user_decorator_1.CurrentUserId()),
        __param(1, common_1.Param('commentId'))
    ], ReviewsController.prototype, "deleteComment");
    ReviewsController = __decorate([
        common_1.Controller('api/reviews'),
        __param(0, common_1.Inject('REVIEWS_SERVICE'))
    ], ReviewsController);
    return ReviewsController;
}());
exports.ReviewsController = ReviewsController;
