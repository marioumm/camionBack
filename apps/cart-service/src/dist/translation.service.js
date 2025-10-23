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
exports.TranslationService = void 0;
// apps/cart-service/src/services/translation.service.ts
var common_1 = require("@nestjs/common");
var axios_1 = require("axios");
var TranslationService = /** @class */ (function () {
    function TranslationService() {
        this.logger = new common_1.Logger(TranslationService_1.name);
        this.apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
        this.apiUrl = 'https://translation.googleapis.com/language/translate/v2';
    }
    TranslationService_1 = TranslationService;
    TranslationService.prototype.translateText = function (text, targetLang) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, Promise, function () {
            var response, translatedText, error_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!text || !targetLang || targetLang === 'en') {
                            return [2 /*return*/, text];
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1["default"].post(this.apiUrl, {
                                q: text,
                                target: targetLang,
                                format: 'text'
                            }, {
                                params: {
                                    key: this.apiKey
                                },
                                timeout: 5000
                            })];
                    case 2:
                        response = _e.sent();
                        translatedText = (_d = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.translations) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.translatedText;
                        return [2 /*return*/, translatedText || text];
                    case 3:
                        error_1 = _e.sent();
                        this.logger.error("Translation failed for \"" + text + "\" to " + targetLang + ":", error_1.message);
                        return [2 /*return*/, text];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TranslationService.prototype.translateBatch = function (texts, targetLang) {
        var _a, _b;
        return __awaiter(this, void 0, Promise, function () {
            var response, translations, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!targetLang || targetLang === 'en' || !texts.length) {
                            return [2 /*return*/, texts];
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1["default"].post(this.apiUrl, {
                                q: texts,
                                target: targetLang,
                                format: 'text'
                            }, {
                                params: {
                                    key: this.apiKey
                                },
                                timeout: 10000
                            })];
                    case 2:
                        response = _c.sent();
                        translations = ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.translations) || [];
                        return [2 /*return*/, translations.map(function (t, i) { return (t === null || t === void 0 ? void 0 : t.translatedText) || texts[i]; })];
                    case 3:
                        error_2 = _c.sent();
                        this.logger.error("Batch translation failed to " + targetLang + ":", error_2.message);
                        return [2 /*return*/, texts];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TranslationService.prototype.translateCartItem = function (item, targetLang) {
        return __awaiter(this, void 0, Promise, function () {
            var translatedTitle, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!targetLang || targetLang === 'en') {
                            return [2 /*return*/, item];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.translateText(item.title || '', targetLang)];
                    case 2:
                        translatedTitle = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, item), { title: translatedTitle, originalTitle: item.title })];
                    case 3:
                        error_3 = _a.sent();
                        this.logger.error("Failed to translate cart item:", error_3);
                        return [2 /*return*/, item];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TranslationService.prototype.translateCartItems = function (items, targetLang) {
        return __awaiter(this, void 0, Promise, function () {
            var titles, translatedTitles_1, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!targetLang || targetLang === 'en' || !items.length) {
                            return [2 /*return*/, items];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        titles = items.map(function (item) { return item.title || ''; });
                        return [4 /*yield*/, this.translateBatch(titles, targetLang)];
                    case 2:
                        translatedTitles_1 = _a.sent();
                        return [2 /*return*/, items.map(function (item, index) { return (__assign(__assign({}, item), { title: translatedTitles_1[index], originalTitle: item.title })); })];
                    case 3:
                        error_4 = _a.sent();
                        this.logger.error("Failed to translate cart items:", error_4);
                        return [2 /*return*/, items];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    var TranslationService_1;
    TranslationService = TranslationService_1 = __decorate([
        common_1.Injectable()
    ], TranslationService);
    return TranslationService;
}());
exports.TranslationService = TranslationService;
