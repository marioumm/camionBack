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
exports.OrdersController = void 0;
var auth_1 = require("@app/auth");
var common_1 = require("@nestjs/common");
var user_entity_1 = require("apps/users-service/src/entities/user.entity");
var current_user_decorator_1 = require("libs/auth/src/current-user.decorator");
var roles_decorator_1 = require("libs/auth/src/roles.decorator");
var OrdersController = /** @class */ (function () {
    function OrdersController(orderClient) {
        this.orderClient = orderClient;
    }
    OrdersController.prototype.createOrder = function (dto, userId) {
        return this.orderClient.send({ cmd: 'create_order' }, __assign(__assign({}, dto), { userId: userId }));
    };
    OrdersController.prototype.getOrder = function (id) {
        return this.orderClient.send({ cmd: 'get_order_by_id' }, id);
    };
    OrdersController.prototype.getOrdersByUser = function (userId) {
        return this.orderClient.send({ cmd: 'get_orders_by_user' }, { userId: userId });
    };
    OrdersController.prototype.markOrderPaid = function (id) {
        return this.orderClient.send({ cmd: 'mark_order_paid' }, id);
    };
    OrdersController.prototype.markOrderDelivered = function (id) {
        return this.orderClient.send({ cmd: 'mark_order_delivered' }, id);
    };
    OrdersController.prototype.deleteOrder = function (id) {
        return this.orderClient.send({ cmd: 'delete_order' }, id);
    };
    OrdersController.prototype.getOrdersByStatus = function (userId, status) {
        return this.orderClient.send({ cmd: 'get_orders_by_status' }, { userId: userId, status: status });
    };
    OrdersController.prototype.getAllOrders = function () {
        return this.orderClient.send({ cmd: 'get_all_orders' }, {});
    };
    OrdersController.prototype.countAllOrders = function () {
        return this.orderClient.send({ cmd: 'count_all_orders' }, {});
    };
    OrdersController.prototype.countCompletedOrders = function () {
        return this.orderClient.send({ cmd: 'count_completed_orders' }, {});
    };
    OrdersController.prototype.countPendingOrders = function () {
        return this.orderClient.send({ cmd: 'count_pending_orders' }, {});
    };
    OrdersController.prototype.countCancelledOrders = function () {
        return this.orderClient.send({ cmd: 'count_cancelled_orders' }, {});
    };
    __decorate([
        common_1.UseGuards(auth_1.JwtAuthGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.USER),
        common_1.Post('/complete'),
        __param(0, common_1.Body()), __param(1, current_user_decorator_1.CurrentUserId())
    ], OrdersController.prototype, "createOrder");
    __decorate([
        common_1.UseGuards(auth_1.JwtAuthGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.USER, user_entity_1.UserRole.ADMIN),
        common_1.Get('/:id'),
        __param(0, common_1.Param('id'))
    ], OrdersController.prototype, "getOrder");
    __decorate([
        common_1.UseGuards(auth_1.JwtAuthGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.USER, user_entity_1.UserRole.ADMIN),
        common_1.Get('/user/:userId'),
        __param(0, common_1.Param('userId'))
    ], OrdersController.prototype, "getOrdersByUser");
    __decorate([
        common_1.UseGuards(auth_1.JwtAuthGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN),
        common_1.Patch('/:id/paid'),
        __param(0, common_1.Param('id'))
    ], OrdersController.prototype, "markOrderPaid");
    __decorate([
        common_1.UseGuards(auth_1.JwtAuthGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN),
        common_1.Patch('/:id/delivered'),
        __param(0, common_1.Param('id'))
    ], OrdersController.prototype, "markOrderDelivered");
    __decorate([
        common_1.UseGuards(auth_1.JwtAuthGuard),
        common_1.Delete('/:id'),
        __param(0, common_1.Param('id'))
    ], OrdersController.prototype, "deleteOrder");
    __decorate([
        common_1.Get('status/:status'),
        common_1.UseGuards(auth_1.JwtAuthGuard),
        __param(0, current_user_decorator_1.CurrentUserId()),
        __param(1, common_1.Param('status'))
    ], OrdersController.prototype, "getOrdersByStatus");
    __decorate([
        common_1.Get(),
        common_1.UseGuards(auth_1.JwtAuthGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN)
    ], OrdersController.prototype, "getAllOrders");
    __decorate([
        common_1.Get('/count/all'),
        common_1.UseGuards(auth_1.JwtAuthGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN)
    ], OrdersController.prototype, "countAllOrders");
    __decorate([
        common_1.Get('/count/completed'),
        common_1.UseGuards(auth_1.JwtAuthGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN)
    ], OrdersController.prototype, "countCompletedOrders");
    __decorate([
        common_1.Get('/count/pending'),
        common_1.UseGuards(auth_1.JwtAuthGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN)
    ], OrdersController.prototype, "countPendingOrders");
    __decorate([
        common_1.Get('/count/cancelled'),
        common_1.UseGuards(auth_1.JwtAuthGuard),
        roles_decorator_1.Roles(user_entity_1.UserRole.ADMIN)
    ], OrdersController.prototype, "countCancelledOrders");
    OrdersController = __decorate([
        common_1.Controller('checkout'),
        __param(0, common_1.Inject('ORDERS_SERVICE'))
    ], OrdersController);
    return OrdersController;
}());
exports.OrdersController = OrdersController;
