"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateAddressDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var ShippingOptionDto = /** @class */ (function () {
    function ShippingOptionDto() {
    }
    __decorate([
        class_validator_1.IsString()
    ], ShippingOptionDto.prototype, "method_id");
    __decorate([
        class_validator_1.IsString()
    ], ShippingOptionDto.prototype, "method_title");
    __decorate([
        class_validator_1.IsString()
    ], ShippingOptionDto.prototype, "cost");
    return ShippingOptionDto;
}());
var ShippingAddressDto = /** @class */ (function () {
    function ShippingAddressDto() {
    }
    __decorate([
        class_validator_1.IsString()
    ], ShippingAddressDto.prototype, "first_name");
    __decorate([
        class_validator_1.IsString()
    ], ShippingAddressDto.prototype, "last_name");
    __decorate([
        class_validator_1.IsEmail()
    ], ShippingAddressDto.prototype, "email");
    __decorate([
        class_validator_1.IsString()
    ], ShippingAddressDto.prototype, "phone");
    __decorate([
        class_validator_1.IsString()
    ], ShippingAddressDto.prototype, "address_1");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], ShippingAddressDto.prototype, "address_2");
    __decorate([
        class_validator_1.IsString()
    ], ShippingAddressDto.prototype, "city");
    __decorate([
        class_validator_1.IsString()
    ], ShippingAddressDto.prototype, "state");
    __decorate([
        class_validator_1.IsString()
    ], ShippingAddressDto.prototype, "postcode");
    __decorate([
        class_validator_1.IsString()
    ], ShippingAddressDto.prototype, "country");
    return ShippingAddressDto;
}());
var UpdateAddressDto = /** @class */ (function () {
    function UpdateAddressDto() {
    }
    __decorate([
        class_validator_1.IsString()
    ], UpdateAddressDto.prototype, "first_name");
    __decorate([
        class_validator_1.IsString()
    ], UpdateAddressDto.prototype, "last_name");
    __decorate([
        class_validator_1.IsEmail()
    ], UpdateAddressDto.prototype, "email");
    __decorate([
        class_validator_1.IsString()
    ], UpdateAddressDto.prototype, "phone");
    __decorate([
        class_validator_1.IsString()
    ], UpdateAddressDto.prototype, "address_1");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], UpdateAddressDto.prototype, "address_2");
    __decorate([
        class_validator_1.IsString()
    ], UpdateAddressDto.prototype, "city");
    __decorate([
        class_validator_1.IsString()
    ], UpdateAddressDto.prototype, "state");
    __decorate([
        class_validator_1.IsString()
    ], UpdateAddressDto.prototype, "postcode");
    __decorate([
        class_validator_1.IsString()
    ], UpdateAddressDto.prototype, "country");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.ValidateNested(),
        class_transformer_1.Type(function () { return ShippingAddressDto; })
    ], UpdateAddressDto.prototype, "shipping_address");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.ValidateNested(),
        class_transformer_1.Type(function () { return ShippingOptionDto; })
    ], UpdateAddressDto.prototype, "shipping_option");
    return UpdateAddressDto;
}());
exports.UpdateAddressDto = UpdateAddressDto;
