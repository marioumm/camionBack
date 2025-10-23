"use strict";
exports.__esModule = true;
exports.GuestOrUserId = void 0;
var common_1 = require("@nestjs/common");
var uuid_1 = require("uuid");
exports.GuestOrUserId = common_1.createParamDecorator(function (data, ctx) {
    var request = ctx.switchToHttp().getRequest();
    var user = request.user;
    if ((user === null || user === void 0 ? void 0 : user.sub) || (user === null || user === void 0 ? void 0 : user.id)) {
        return { userId: user.sub || user.id };
    }
    var guestId = request.headers['x-guest-id'] || request.query.guestId;
    if (!guestId) {
        guestId = "guest_" + uuid_1.v4();
    }
    return { guestId: guestId };
});
