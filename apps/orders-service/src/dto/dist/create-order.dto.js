"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateOrderDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var ShippingAddressDto = /** @class */ (function () {
    function ShippingAddressDto() {
    }
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], ShippingAddressDto.prototype, "first_name");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], ShippingAddressDto.prototype, "last_name");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], ShippingAddressDto.prototype, "address_1");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], ShippingAddressDto.prototype, "address_2");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], ShippingAddressDto.prototype, "city");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], ShippingAddressDto.prototype, "state");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], ShippingAddressDto.prototype, "postcode");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], ShippingAddressDto.prototype, "country");
    return ShippingAddressDto;
}());
var CustomerDataDto = /** @class */ (function () {
    function CustomerDataDto() {
    }
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CustomerDataDto.prototype, "first_name");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CustomerDataDto.prototype, "last_name");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsEmail()
    ], CustomerDataDto.prototype, "email");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CustomerDataDto.prototype, "phone");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CustomerDataDto.prototype, "address_1");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CustomerDataDto.prototype, "address_2");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CustomerDataDto.prototype, "city");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CustomerDataDto.prototype, "state");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CustomerDataDto.prototype, "postcode");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CustomerDataDto.prototype, "country");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.ValidateNested(),
        class_transformer_1.Type(function () { return ShippingAddressDto; })
    ], CustomerDataDto.prototype, "shipping_address");
    __decorate([
        class_validator_1.IsOptional()
    ], CustomerDataDto.prototype, "shipping_option");
    return CustomerDataDto;
}());
var PaymentDataDto = /** @class */ (function () {
    function PaymentDataDto() {
    }
    __decorate([
        class_validator_1.IsString()
    ], PaymentDataDto.prototype, "key");
    __decorate([
        class_validator_1.IsString()
    ], PaymentDataDto.prototype, "value");
    return PaymentDataDto;
}());
var CreateOrderDto = /** @class */ (function () {
    function CreateOrderDto() {
    }
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.ValidateNested(),
        class_transformer_1.Type(function () { return CustomerDataDto; })
    ], CreateOrderDto.prototype, "customer_data");
    __decorate([
        class_validator_1.IsString()
    ], CreateOrderDto.prototype, "payment_method");
    __decorate([
        class_validator_1.IsArray(),
        class_validator_1.ValidateNested({ each: true }),
        class_transformer_1.Type(function () { return PaymentDataDto; })
    ], CreateOrderDto.prototype, "payment_data");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CreateOrderDto.prototype, "success_url");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CreateOrderDto.prototype, "cancel_url");
    return CreateOrderDto;
}());
exports.CreateOrderDto = CreateOrderDto;
