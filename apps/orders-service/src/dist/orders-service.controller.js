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
exports.OrdersController = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
var common_1 = require("@nestjs/common");
var microservices_1 = require("@nestjs/microservices");
var order_entity_1 = require("./entities/order.entity");
var cart_entity_1 = require("apps/cart-service/src/entities/cart.entity");
var typeorm_1 = require("@nestjs/typeorm");
var OrdersController = /** @class */ (function () {
    function OrdersController(ordersService, cartRepository, orderRepository) {
        this.ordersService = ordersService;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
    }
    OrdersController.prototype.createOrder = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, dto, items, order, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        userId = data.userId, dto = __rest(data, ["userId"]);
                        return [4 /*yield*/, this.cartRepository.find({ where: { userId: userId } })];
                    case 1:
                        items = _a.sent();
                        if (!items || !items.length)
                            throw toRpc('Cart is empty');
                        return [4 /*yield*/, this.ordersService.createOrder(userId, items, dto)];
                    case 2:
                        order = _a.sent();
                        return [2 /*return*/, {
                                status: 200,
                                message: 'Order created. Please complete payment.',
                                data: {
                                    orderId: order.id,
                                    order: order
                                }
                            }];
                    case 3:
                        error_1 = _a.sent();
                        throw toRpc(error_1, 'Failed to create order');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrdersController.prototype.getOrder = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var order, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ordersService.getOrderById(id)];
                    case 1:
                        order = _a.sent();
                        return [2 /*return*/, this.mapOrderResponse(order)];
                    case 2:
                        error_2 = _a.sent();
                        throw toRpc(error_2, 'Failed to get order by id');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersController.prototype.getOrdersByUser = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var orders, error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ordersService.getOrdersByUser(data.userId)];
                    case 1:
                        orders = _a.sent();
                        return [2 /*return*/, orders.map(function (order) { return _this.mapOrderResponse(order); })];
                    case 2:
                        error_3 = _a.sent();
                        throw toRpc(error_3, 'Failed to get orders by user');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersController.prototype.markAsPaid = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var order, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ordersService.markAsPaid(id)];
                    case 1:
                        order = _a.sent();
                        if (!order)
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Order not found' });
                        return [2 /*return*/, this.mapOrderResponse(order)];
                    case 2:
                        error_4 = _a.sent();
                        throw toRpc(error_4, 'Failed to mark order as paid');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersController.prototype.markOrderPaidByTransaction = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var order, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ordersService.markOrderPaidByTransaction(data.transactionId, data.paymentData)];
                    case 1:
                        order = _a.sent();
                        return [2 /*return*/, this.mapOrderResponse(order)];
                    case 2:
                        error_5 = _a.sent();
                        throw toRpc(error_5, 'Failed to mark order as paid by transaction');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersController.prototype.cancelOrderByTransaction = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var order, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ordersService.cancelOrderByTransaction(data.transactionId, data.reason)];
                    case 1:
                        order = _a.sent();
                        return [2 /*return*/, this.mapOrderResponse(order)];
                    case 2:
                        error_6 = _a.sent();
                        throw toRpc(error_6, 'Failed to cancel order by transaction');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersController.prototype.markAsDelivered = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var order, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ordersService.markAsDelivered(id)];
                    case 1:
                        order = _a.sent();
                        if (!order)
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Order not found' });
                        return [2 /*return*/, this.mapOrderResponse(order)];
                    case 2:
                        error_7 = _a.sent();
                        throw toRpc(error_7, 'Failed to mark order as delivered');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersController.prototype.deleteOrder = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ordersService.deleteOrder(id)];
                    case 1:
                        result = _a.sent();
                        if (!result.affected)
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'Order not found' });
                        return [2 /*return*/, { message: 'Order deleted successfully.' }];
                    case 2:
                        error_8 = _a.sent();
                        throw toRpc(error_8, 'Failed to delete order');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersController.prototype.getOrdersByStatus = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var orders, error_9;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ordersService.getOrdersByStatus(data.userId, data.status)];
                    case 1:
                        orders = _a.sent();
                        return [2 /*return*/, orders.map(function (order) { return _this.mapOrderResponse(order); })];
                    case 2:
                        error_9 = _a.sent();
                        throw toRpc(error_9, 'Failed to get orders by status');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersController.prototype.getAllOrders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var orders, error_10;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ordersService.getAllOrders()];
                    case 1:
                        orders = _a.sent();
                        return [2 /*return*/, orders.map(function (order) { return _this.mapOrderResponse(order); })];
                    case 2:
                        error_10 = _a.sent();
                        throw toRpc(error_10, 'Failed to get all orders');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersController.prototype.getOrderWithItems = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderRepository.findOne({
                            where: { id: data.orderId, userId: data.userId }
                        })];
                    case 1:
                        order = _a.sent();
                        return [2 /*return*/, order ? {
                                id: order.id,
                                userId: order.userId,
                                status: order.isDelivered ? 'delivered' : (order.isPaid ? 'paid' : order.wcOrderStatus),
                                isDelivered: order.isDelivered,
                                isPaid: order.isPaid,
                                items: Array.isArray(order.items) ? order.items : []
                            } : null];
                }
            });
        });
    };
    OrdersController.prototype.getUserCompletedOrders = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var orders;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderRepository.find({
                            where: { userId: data.userId, isDelivered: true }
                        })];
                    case 1:
                        orders = _a.sent();
                        return [2 /*return*/, orders.map(function (order) { return ({
                                id: order.id,
                                userId: order.userId,
                                status: 'delivered',
                                isDelivered: order.isDelivered,
                                isPaid: order.isPaid,
                                deliveredAt: order.deliveredAt,
                                items: Array.isArray(order.items) ? order.items : []
                            }); })];
                }
            });
        });
    };
    OrdersController.prototype.countAllOrders = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ordersService.countAllOrders()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OrdersController.prototype.countCompletedOrders = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ordersService.countCompletedOrders()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OrdersController.prototype.countPendingOrders = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ordersService.countPendingOrders()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OrdersController.prototype.countCancelledOrders = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ordersService.countCancelledOrders()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OrdersController.prototype.mapOrderResponse = function (order) {
        var _a;
        return {
            id: order.id,
            wcOrderId: order.wcOrderId,
            userId: order.userId,
            wcOrderStatus: order.wcOrderStatus,
            wcPaymentStatus: order.wcPaymentStatus,
            wcOrderKey: order.wcOrderKey,
            total: order.total,
            currency: order.currency,
            items: order.items,
            customer_data: order.customerData,
            payment_method: order.paymentMethod,
            payment_data: order.paymentData,
            isPaid: order.isPaid,
            isDelivered: order.isDelivered,
            createdAt: order.createdAt,
            paidAt: order.paidAt,
            deliveredAt: order.deliveredAt,
            skipCashPaymentUrl: order.skipCashPaymentUrl,
            skipCashTransactionId: order.skipCashTransactionId,
            customerName: order.customerData.first_name + " " + order.customerData.last_name,
            customerEmail: order.customerData.email,
            customerPhone: order.customerData.phone,
            itemsCount: ((_a = order.items) === null || _a === void 0 ? void 0 : _a.length) || 0,
            trackingUrl: "/track-order/" + order.wcOrderId,
            statusDisplay: this.getStatusDisplay(order)
        };
    };
    OrdersController.prototype.getStatusDisplay = function (order) {
        if (order.isDelivered)
            return 'Delivered ✅';
        if (order.isPaid && order.wcOrderStatus === 'completed')
            return 'Completed 📦';
        if (order.isPaid && order.wcOrderStatus === 'processing')
            return 'Processing 🔄';
        if (order.isPaid)
            return 'Paid 💳';
        if (order.wcOrderStatus === 'pending')
            return 'Pending Payment ⏳';
        if (order.wcOrderStatus === 'cancelled')
            return 'Cancelled ❌';
        return order.wcOrderStatus || 'Unknown';
    };
    __decorate([
        microservices_1.MessagePattern({ cmd: 'create_order' }),
        __param(0, microservices_1.Payload())
    ], OrdersController.prototype, "createOrder");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'get_order_by_id' }),
        __param(0, microservices_1.Payload())
    ], OrdersController.prototype, "getOrder");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'get_orders_by_user' }),
        __param(0, microservices_1.Payload())
    ], OrdersController.prototype, "getOrdersByUser");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'mark_order_paid' }),
        __param(0, microservices_1.Payload())
    ], OrdersController.prototype, "markAsPaid");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'mark_order_paid_by_transaction' }),
        __param(0, microservices_1.Payload())
    ], OrdersController.prototype, "markOrderPaidByTransaction");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'cancel_order_by_transaction' }),
        __param(0, microservices_1.Payload())
    ], OrdersController.prototype, "cancelOrderByTransaction");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'mark_order_delivered' }),
        __param(0, microservices_1.Payload())
    ], OrdersController.prototype, "markAsDelivered");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'delete_order' }),
        __param(0, microservices_1.Payload())
    ], OrdersController.prototype, "deleteOrder");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'get_orders_by_status' }),
        __param(0, microservices_1.Payload())
    ], OrdersController.prototype, "getOrdersByStatus");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'get_all_orders' })
    ], OrdersController.prototype, "getAllOrders");
    __decorate([
        microservices_1.MessagePattern('get_order_with_items'),
        __param(0, microservices_1.Payload())
    ], OrdersController.prototype, "getOrderWithItems");
    __decorate([
        microservices_1.MessagePattern('get_user_completed_orders'),
        __param(0, microservices_1.Payload())
    ], OrdersController.prototype, "getUserCompletedOrders");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'count_all_orders' })
    ], OrdersController.prototype, "countAllOrders");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'count_completed_orders' })
    ], OrdersController.prototype, "countCompletedOrders");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'count_pending_orders' })
    ], OrdersController.prototype, "countPendingOrders");
    __decorate([
        microservices_1.MessagePattern({ cmd: 'count_cancelled_orders' })
    ], OrdersController.prototype, "countCancelledOrders");
    OrdersController = __decorate([
        common_1.Controller(),
        common_1.UsePipes(new common_1.ValidationPipe({
            exceptionFactory: function (errors) {
                return new microservices_1.RpcException({
                    statusCode: 400,
                    message: 'Validation failed',
                    details: errors
                });
            }
        })),
        __param(1, typeorm_1.InjectRepository(cart_entity_1.CartItem)),
        __param(2, typeorm_1.InjectRepository(order_entity_1.Order))
    ], OrdersController);
    return OrdersController;
}());
exports.OrdersController = OrdersController;
function toRpc(error, fallbackMsg) {
    var _a;
    if (error instanceof microservices_1.RpcException)
        return error;
    var statusCode = ((_a = error === null || error === void 0 ? void 0 : error.getStatus) === null || _a === void 0 ? void 0 : _a.call(error)) || 500;
    var message = (error === null || error === void 0 ? void 0 : error.message) || fallbackMsg || 'Orders microservice error';
    return new microservices_1.RpcException({ statusCode: statusCode, message: message });
}
