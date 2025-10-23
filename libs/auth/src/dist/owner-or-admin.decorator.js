"use strict";
exports.__esModule = true;
exports.OwnerOrAdmin = exports.OWNER_OR_ADMIN_KEY = void 0;
var common_1 = require("@nestjs/common");
exports.OWNER_OR_ADMIN_KEY = 'owner-or-admin';
exports.OwnerOrAdmin = function () { return common_1.SetMetadata(exports.OWNER_OR_ADMIN_KEY, true); };
