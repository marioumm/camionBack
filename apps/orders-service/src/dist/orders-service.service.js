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
exports.OrdersService = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var order_entity_1 = require("./entities/order.entity");
var microservices_1 = require("@nestjs/microservices");
var axios_1 = require("axios");
var crypto = require("crypto");
var rxjs_1 = require("rxjs");
var OrdersService = /** @class */ (function () {
    function OrdersService(orderRepository, notificationsClient, usersClient, affiliateClient) {
        this.orderRepository = orderRepository;
        this.notificationsClient = notificationsClient;
        this.usersClient = usersClient;
        this.affiliateClient = affiliateClient;
        this.logger = new common_1.Logger(OrdersService_1.name);
        this.WC_BASE_URL = process.env.WC_BASE_URL;
        this.SKIPCASH_BASE_URL = process.env.SKIPCASH_BASE_URL;
    }
    OrdersService_1 = OrdersService;
    OrdersService.prototype.sendNotification = function (userId, title, body) {
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
    OrdersService.prototype.createWCOrder = function (dto, items) {
        return __awaiter(this, void 0, void 0, function () {
            var url, wcItems, order_data, res, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        url = this.WC_BASE_URL + "/checkout/complete";
                        wcItems = items.map(function (item) {
                            var _a;
                            return ({
                                product_id: Number(item.productId),
                                quantity: item.quantity,
                                variation: ((_a = item.variation) === null || _a === void 0 ? void 0 : _a.map(function (v) { return ({
                                    attribute: v.attribute,
                                    value: v.value
                                }); })) || []
                            });
                        });
                        if (!wcItems)
                            throw new microservices_1.RpcException('Cart is empty, Please add items to cart');
                        order_data = {
                            items: wcItems,
                            customer_data: dto.customer_data,
                            payment_method: "cod",
                            payment_data: dto.payment_data
                        };
                        return [4 /*yield*/, axios_1["default"].post(url, order_data)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 2:
                        error_1 = _a.sent();
                        throw new common_1.NotFoundException("Error in WooCommerce Create Order: " + error_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersService.prototype.cancelWCOrder = function (orderID) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        url = this.WC_BASE_URL + "/checkout/" + orderID;
                        return [4 /*yield*/, axios_1["default"]["delete"](url)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 2:
                        error_2 = _a.sent();
                        throw new common_1.NotFoundException("Error in WooCommerce Create Order: " + error_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersService.prototype.createSkipCashPayment = function (orderId, amount, customerData) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function () {
            var url, payload, signature, res, error_3, customMessage;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _h.trys.push([0, 2, , 3]);
                        url = this.SKIPCASH_BASE_URL + "/api/v1/payments";
                        payload = {
                            Uid: this.generateUUID(),
                            KeyId: process.env.SKIPCASH_KEY_ID,
                            Amount: amount.toFixed(2),
                            FirstName: customerData.first_name,
                            LastName: customerData.last_name,
                            Phone: customerData.phone,
                            Email: customerData.email,
                            Street: customerData.address_1,
                            City: customerData.city,
                            State: customerData.state,
                            Country: customerData.country,
                            PostalCode: customerData.postcode,
                            TransactionId: String(orderId),
                            Custom1: ""
                        };
                        signature = this.generateSkipCashSignature(payload);
                        return [4 /*yield*/, axios_1["default"].post(url, payload, {
                                headers: {
                                    'Authorization': signature,
                                    'Content-Type': 'application/json'
                                }
                            })];
                    case 1:
                        res = _h.sent();
                        return [2 /*return*/, res.data];
                    case 2:
                        error_3 = _h.sent();
                        this.logger.error("SkipCash payment failed: " + error_3.message);
                        customMessage = 'Please check your information and try again';
                        if (((_a = error_3.response) === null || _a === void 0 ? void 0 : _a.status) === 400) {
                            if ((_d = (_c = (_b = error_3.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.errorMessage) === null || _d === void 0 ? void 0 : _d.includes('Signature')) {
                                customMessage = 'Payment verification failed. Please review your details and try again';
                            }
                            else {
                                customMessage = 'Invalid payment details. Please check your information and try again';
                            }
                        }
                        else if (((_e = error_3.response) === null || _e === void 0 ? void 0 : _e.status) === 401) {
                            customMessage = 'Payment authentication failed. Please try again';
                        }
                        else if (((_f = error_3.response) === null || _f === void 0 ? void 0 : _f.status) === 422) {
                            customMessage = 'Payment information is incomplete. Please fill all required fields';
                        }
                        else if (((_g = error_3.response) === null || _g === void 0 ? void 0 : _g.status) === 500) {
                            customMessage = 'Payment service temporarily unavailable. Please try again in a few minutes';
                        }
                        throw new common_1.NotFoundException(customMessage);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersService.prototype.generateSkipCashSignature = function (payload) {
        var orderedFields = [
            'Uid', 'KeyId', 'Amount', 'FirstName', 'LastName',
            'Phone', 'Email', 'Street', 'City', 'State',
            'Country', 'PostalCode', 'TransactionId', 'Custom1'
        ];
        var nonEmptyFields = orderedFields
            .filter(function (key) { return payload[key] && payload[key] !== ''; })
            .map(function (key) { return key + "=" + String(payload[key]).trim(); })
            .join(',');
        console.log('Signature Base String:', nonEmptyFields);
        var signature = crypto
            .createHmac('sha256', process.env.SKIPCASH_KEY_SECRET || '')
            .update(nonEmptyFields)
            .digest('base64');
        return signature;
    };
    OrdersService.prototype.generateUUID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    OrdersService.prototype.createOrder = function (userId, items, dto) {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            var customerData, updatedDto, res, total, discountPercentage, discount, totalAfterDiscount, totalAfterDiscountNum, shippingCostNum, totalAfterDiscountAndShipping, skipCashPayment, order, couponCode, err_2, error_4;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 13, , 14]);
                        customerData = dto.customer_data;
                        if (!!customerData) return [3 /*break*/, 2];
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.usersClient.send({ cmd: 'getUserAddress' }, userId).pipe(rxjs_1.timeout(3000), rxjs_1.catchError(function () {
                                _this.logger.warn("User " + userId + " address not found");
                                return [null];
                            })))];
                    case 1:
                        customerData = _b.sent();
                        if (!customerData) {
                            throw new microservices_1.RpcException('User address data is required');
                        }
                        _b.label = 2;
                    case 2:
                        if (!dto.customer_data) return [3 /*break*/, 4];
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.usersClient.send({ cmd: 'updateUserAddress' }, { userId: userId, addressDto: dto.customer_data }))];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        updatedDto = __assign(__assign({}, dto), { customer_data: customerData });
                        return [4 /*yield*/, this.createWCOrder(updatedDto, items)];
                    case 5:
                        res = _b.sent();
                        total = parseFloat(items.reduce(function (sum, item) { var _a, _b; return sum + (Number((_a = item.price) !== null && _a !== void 0 ? _a : 0) * Number((_b = item.quantity) !== null && _b !== void 0 ? _b : 1)); }, 0).toFixed(2));
                        discountPercentage = items.length > 0 ? (_a = items[0].discountPercentage) !== null && _a !== void 0 ? _a : 0 : 0;
                        discount = parseFloat(((total * discountPercentage) / 100).toFixed(2));
                        totalAfterDiscount = parseFloat((total - discount).toFixed(2));
                        totalAfterDiscountNum = totalAfterDiscount;
                        shippingCostNum = parseFloat(Number(customerData.shipping_option.cost).toFixed(2));
                        totalAfterDiscountAndShipping = parseFloat((totalAfterDiscountNum + shippingCostNum).toFixed(2));
                        return [4 /*yield*/, this.createSkipCashPayment(res.data.order_id, totalAfterDiscountAndShipping, customerData)];
                    case 6:
                        skipCashPayment = _b.sent();
                        order = this.orderRepository.create({
                            wcOrderId: res.data.order_id,
                            wcOrderStatus: res.data.order_status,
                            wcPaymentStatus: res.data.payment_status,
                            wcOrderKey: res.data.order_key,
                            total: totalAfterDiscount.toFixed(2),
                            shippingCost: shippingCostNum.toFixed(2),
                            userId: userId,
                            items: items,
                            customerData: customerData,
                            paymentMethod: 'skipcash',
                            paymentData: dto.payment_data,
                            isPaid: false,
                            isDelivered: false,
                            skipCashTransactionId: skipCashPayment.resultObj.transactionId,
                            skipCashPaymentUrl: skipCashPayment.resultObj.payUrl
                        });
                        return [4 /*yield*/, this.orderRepository.save(order)];
                    case 7:
                        _b.sent();
                        couponCode = items.length > 0 ? items[0].couponCode : undefined;
                        if (!couponCode) return [3 /*break*/, 11];
                        _b.label = 8;
                    case 8:
                        _b.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.affiliateClient.send('affiliate.addCommission', {
                                couponCode: couponCode,
                                saleAmount: totalAfterDiscount
                            }).pipe(rxjs_1.timeout(5000)))];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        err_2 = _b.sent();
                        this.logger.warn("Failed to add affiliate commission: " + (err_2.message || err_2));
                        return [3 /*break*/, 11];
                    case 11: return [4 /*yield*/, this.sendNotification(userId, 'Order Created 🛒', "Your order (" + order.wcOrderId + ") total: " + totalAfterDiscount.toFixed(2) + " has been created successfully.")];
                    case 12:
                        _b.sent();
                        return [2 /*return*/, order];
                    case 13:
                        error_4 = _b.sent();
                        throw toRpc(error_4, 'Failed to create order');
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    OrdersService.prototype.getOrderById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var order, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.orderRepository.findOne({ where: { id: id } })];
                    case 1:
                        order = _a.sent();
                        if (!order)
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Order not found' });
                        return [2 /*return*/, order];
                    case 2:
                        error_5 = _a.sent();
                        throw toRpc(error_5, 'Failed to get order by id');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersService.prototype.getOrdersByUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.orderRepository.find({
                                where: { userId: userId },
                                order: { createdAt: 'DESC' }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        throw toRpc(error_6, 'Failed to get orders by user');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersService.prototype.markAsPaid = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var order, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getOrderById(id)];
                    case 1:
                        order = _a.sent();
                        order.isPaid = true;
                        order.paidAt = new Date();
                        return [4 /*yield*/, this.sendNotification(order.userId, 'Order Paid 💵', "Your order (" + order.wcOrderId + ") has been marked as paid.")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.orderRepository.save(order)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_7 = _a.sent();
                        throw toRpc(error_7, 'Failed to mark order as paid');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    OrdersService.prototype.markOrderPaidByTransaction = function (transactionId, paymentData) {
        return __awaiter(this, void 0, void 0, function () {
            var order, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.orderRepository.findOne({
                                where: { skipCashTransactionId: transactionId }
                            })];
                    case 1:
                        order = _a.sent();
                        if (!order) {
                            throw new microservices_1.RpcException({
                                statusCode: 404,
                                message: "Order not found for transaction: " + transactionId
                            });
                        }
                        order.isPaid = true;
                        order.paidAt = new Date();
                        order.paymentData = paymentData;
                        order.wcPaymentStatus = 'paid';
                        return [4 /*yield*/, this.orderRepository.save(order)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.sendNotification(order.userId, 'Payment Confirmed 💳', "Your payment for order (" + order.wcOrderId + ") has been confirmed successfully.")];
                    case 3:
                        _a.sent();
                        this.logger.log("Order " + order.id + " marked as paid via webhook");
                        return [2 /*return*/, order];
                    case 4:
                        error_8 = _a.sent();
                        throw toRpc(error_8, 'Failed to mark order as paid');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    OrdersService.prototype.cancelOrderByTransaction = function (transactionId, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var order, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.orderRepository.findOne({
                                where: { skipCashTransactionId: transactionId }
                            })];
                    case 1:
                        order = _a.sent();
                        if (!order) {
                            throw new microservices_1.RpcException({
                                statusCode: 404,
                                message: "Order not found for transaction: " + transactionId
                            });
                        }
                        order.wcOrderStatus = 'cancelled';
                        order.wcPaymentStatus = 'failed';
                        return [4 /*yield*/, this.orderRepository.save(order)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.sendNotification(order.userId, 'Order Cancelled ❌', "Your order (" + order.wcOrderId + ") has been cancelled due to payment failure.")];
                    case 3:
                        _a.sent();
                        this.logger.log("Order " + order.id + " cancelled: " + reason);
                        return [2 /*return*/, order];
                    case 4:
                        error_9 = _a.sent();
                        throw toRpc(error_9, 'Failed to cancel order');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    OrdersService.prototype.markAsDelivered = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var order, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getOrderById(id)];
                    case 1:
                        order = _a.sent();
                        order.isDelivered = true;
                        order.deliveredAt = new Date();
                        return [4 /*yield*/, this.sendNotification(order.userId, 'Order Delivered 🚚', "Your order (" + order.wcOrderId + ") has been delivered.")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.orderRepository.save(order)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_10 = _a.sent();
                        throw toRpc(error_10, 'Failed to mark order as delivered');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    OrdersService.prototype.deleteOrder = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.orderRepository["delete"](id)];
                    case 1:
                        result = _a.sent();
                        if (result.affected === 0) {
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Order not found' });
                        }
                        return [4 /*yield*/, this.sendNotification(id, 'Order Deleted 🗑️', "Your order (" + id + ") has been deleted successfully.")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { affected: result.affected }];
                    case 3:
                        error_11 = _a.sent();
                        throw toRpc(error_11, 'Failed to delete order');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrdersService.prototype.getOrdersByStatus = function (userId, status) {
        return __awaiter(this, void 0, void 0, function () {
            var filters, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        filters = { userId: userId };
                        if (status === 'complete' || status === 'completed') {
                            filters.wcOrderStatus = 'completed';
                        }
                        else if (status === 'paid') {
                            filters.isPaid = true;
                        }
                        else if (status === 'delivered') {
                            filters.isDelivered = true;
                        }
                        else if (status === 'pending') {
                            filters.isPaid = false;
                            filters.isDelivered = false;
                        }
                        return [4 /*yield*/, this.orderRepository.find({
                                where: filters,
                                order: { createdAt: 'DESC' }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_12 = _a.sent();
                        throw toRpc(error_12, 'Failed to get orders by status');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersService.prototype.getAllOrders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.orderRepository.find({
                                order: { createdAt: 'DESC' }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_13 = _a.sent();
                        throw toRpc(error_13, 'Failed to get all orders');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersService.prototype.countAllOrders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.orderRepository.count()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_14 = _a.sent();
                        throw toRpc(error_14, 'Failed to count all orders');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersService.prototype.countCompletedOrders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.orderRepository.count({ where: { isPaid: true, isDelivered: true } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_15 = _a.sent();
                        throw toRpc(error_15, 'Failed to count completed orders');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersService.prototype.countPendingOrders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.orderRepository.count({ where: { isPaid: false, isDelivered: false } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_16 = _a.sent();
                        throw toRpc(error_16, 'Failed to count pending orders');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersService.prototype.countCancelledOrders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.orderRepository.count({ where: { wcOrderStatus: 'cancelled' } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_17 = _a.sent();
                        throw toRpc(error_17, 'Failed to count cancelled orders');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    var OrdersService_1;
    OrdersService = OrdersService_1 = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(order_entity_1.Order)),
        __param(1, common_1.Inject('NOTIFICATIONS_SERVICE')),
        __param(2, common_1.Inject('USERS_SERVICE')),
        __param(3, common_1.Inject('AFFILIATE_SERVICE'))
    ], OrdersService);
    return OrdersService;
}());
exports.OrdersService = OrdersService;
function toRpc(error, fallbackMsg) {
    var _a;
    if (error instanceof microservices_1.RpcException)
        return error;
    var statusCode = ((_a = error === null || error === void 0 ? void 0 : error.getStatus) === null || _a === void 0 ? void 0 : _a.call(error)) || 500;
    var message = (error === null || error === void 0 ? void 0 : error.message) || fallbackMsg || 'Orders microservice error';
    return new microservices_1.RpcException({ statusCode: statusCode, message: message });
}
