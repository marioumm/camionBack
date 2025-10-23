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
exports.__esModule = true;
exports.SettingsController = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var rxjs_1 = require("rxjs");
require("multer");
var SettingsController = /** @class */ (function () {
    function SettingsController(settingsClient) {
        this.settingsClient = settingsClient;
    }
    SettingsController.prototype.uploadLogo = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var allowedTypes, bufferArray, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!file) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'No file uploaded',
                                    error: 'File is required'
                                }];
                        }
                        allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                        if (!allowedTypes.includes(file.mimetype)) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Invalid file type',
                                    error: 'Only images are allowed (jpg, png, gif, webp)'
                                }];
                        }
                        if (file.size > 2 * 1024 * 1024) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'File too large',
                                    error: 'Maximum file size is 2MB'
                                }];
                        }
                        console.log('File received for S3 upload:', {
                            originalname: file.originalname,
                            mimetype: file.mimetype,
                            size: file.size,
                            hasBuffer: !!file.buffer
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        bufferArray = Array.from(file.buffer);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.settingsClient.send({ cmd: 'upload_logo' }, {
                                buffer: bufferArray,
                                originalname: file.originalname,
                                mimetype: file.mimetype
                            }))];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_1 = _a.sent();
                        console.error('S3 Upload error:', error_1);
                        return [2 /*return*/, {
                                success: false,
                                message: 'S3 upload failed',
                                error: error_1.message
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SettingsController.prototype.getCurrentLogo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.settingsClient.send({ cmd: 'get_logo_path' }, {}))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Get S3 logo error:', error_2);
                        return [2 /*return*/, {
                                success: false,
                                message: 'Failed to get logo from S3',
                                error: error_2.message
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SettingsController.prototype.deleteLogo = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.settingsClient.send({ cmd: 'delete_logo' }, body))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Delete S3 logo error:', error_3);
                        return [2 /*return*/, {
                                success: false,
                                message: 'Failed to delete logo from S3',
                                error: error_3.message
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        common_1.Post('upload-logo'),
        common_1.UseInterceptors(platform_express_1.FileInterceptor('logo')),
        __param(0, common_1.UploadedFile())
    ], SettingsController.prototype, "uploadLogo");
    __decorate([
        common_1.Get('logo')
    ], SettingsController.prototype, "getCurrentLogo");
    __decorate([
        common_1.Delete('logo'),
        __param(0, common_1.Body())
    ], SettingsController.prototype, "deleteLogo");
    SettingsController = __decorate([
        common_1.Controller('admin/settings'),
        __param(0, common_1.Inject('SETTINGS_SERVICE'))
    ], SettingsController);
    return SettingsController;
}());
exports.SettingsController = SettingsController;
