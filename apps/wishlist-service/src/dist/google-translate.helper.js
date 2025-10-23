"use strict";
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
exports.GoogleTranslateHelper = void 0;
var axios_1 = require("axios");
var GoogleTranslateHelper = /** @class */ (function () {
    function GoogleTranslateHelper() {
    }
    GoogleTranslateHelper.translateBatch = function (texts, targetLang, sourceLang) {
        if (sourceLang === void 0) { sourceLang = 'en'; }
        return __awaiter(this, void 0, Promise, function () {
            var cachedResults, textsToTranslate, cacheIndices, response, translations, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (targetLang === 'en' || !texts.length) {
                            return [2 /*return*/, texts];
                        }
                        cachedResults = [];
                        textsToTranslate = [];
                        cacheIndices = [];
                        texts.forEach(function (text, index) {
                            var cacheKey = text + "_" + targetLang;
                            var cached = _this.cache.get(cacheKey);
                            if (cached && Date.now() - cached.timestamp < _this.CACHE_TTL) {
                                cachedResults[index] = cached.text;
                            }
                            else {
                                textsToTranslate.push(text);
                                cacheIndices.push(index);
                            }
                        });
                        if (!textsToTranslate.length) {
                            return [2 /*return*/, cachedResults];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1["default"].post(this.API_URL, {
                                q: textsToTranslate,
                                source: sourceLang,
                                target: targetLang,
                                format: 'text'
                            }, {
                                params: {
                                    key: this.API_KEY
                                },
                                timeout: 5000
                            })];
                    case 2:
                        response = _a.sent();
                        translations = response.data.data.translations.map(function (t) { return t.translatedText; });
                        translations.forEach(function (translation, i) {
                            var originalText = textsToTranslate[i];
                            var cacheKey = originalText + "_" + targetLang;
                            _this.cache.set(cacheKey, { text: translation, timestamp: Date.now() });
                            cachedResults[cacheIndices[i]] = translation;
                        });
                        return [2 /*return*/, cachedResults];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Google Translate Batch Error:', error_1.message);
                        return [2 /*return*/, texts];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    GoogleTranslateHelper.cleanCache = function () {
        var now = Date.now();
        for (var _i = 0, _a = this.cache.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (now - value.timestamp > this.CACHE_TTL) {
                this.cache["delete"](key);
            }
        }
    };
    GoogleTranslateHelper.API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
    GoogleTranslateHelper.API_URL = 'https://translation.googleapis.com/language/translate/v2';
    GoogleTranslateHelper.cache = new Map();
    GoogleTranslateHelper.CACHE_TTL = 5 * 60 * 1000;
    return GoogleTranslateHelper;
}());
exports.GoogleTranslateHelper = GoogleTranslateHelper;
setInterval(function () { return GoogleTranslateHelper.cleanCache(); }, 10 * 60 * 1000);
