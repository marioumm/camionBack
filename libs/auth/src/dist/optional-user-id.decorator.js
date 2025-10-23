"use strict";
exports.__esModule = true;
exports.OptionalUserId = void 0;
var common_1 = require("@nestjs/common");
exports.OptionalUserId = common_1.createParamDecorator(function (data, ctx) {
    var request = ctx.switchToHttp().getRequest();
    var user = request.user;
    return (user === null || user === void 0 ? void 0 : user.sub) || (user === null || user === void 0 ? void 0 : user.id) || undefined;
});
