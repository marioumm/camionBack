"use strict";
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
exports.S3Service = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
var common_1 = require("@nestjs/common");
var client_s3_1 = require("@aws-sdk/client-s3");
var S3Service = /** @class */ (function () {
    function S3Service(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(S3Service_1.name);
        this.s3Client = new client_s3_1.S3Client({
            region: this.configService.get('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')
            }
        });
        this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME');
    }
    S3Service_1 = S3Service;
    S3Service.prototype.uploadFile = function (key, buffer, contentType) {
        return __awaiter(this, void 0, Promise, function () {
            var command, fileUrl, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        command = new client_s3_1.PutObjectCommand({
                            Bucket: this.bucketName,
                            Key: key,
                            Body: buffer,
                            ContentType: contentType
                        });
                        return [4 /*yield*/, this.s3Client.send(command)];
                    case 1:
                        _a.sent();
                        fileUrl = "https://" + this.bucketName + ".s3." + this.configService.get('AWS_REGION') + ".amazonaws.com/" + key;
                        this.logger.log("File uploaded successfully: " + fileUrl);
                        return [2 /*return*/, fileUrl];
                    case 2:
                        error_1 = _a.sent();
                        this.logger.error('Error uploading file to S3:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    S3Service.prototype.deleteFile = function (key) {
        return __awaiter(this, void 0, Promise, function () {
            var command, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        command = new client_s3_1.DeleteObjectCommand({
                            Bucket: this.bucketName,
                            Key: key
                        });
                        return [4 /*yield*/, this.s3Client.send(command)];
                    case 1:
                        _a.sent();
                        this.logger.log("File deleted successfully: " + key);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        this.logger.error('Error deleting file from S3:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    S3Service.prototype.getFileUrl = function (key) {
        return "https://" + this.bucketName + ".s3." + this.configService.get('AWS_REGION') + ".amazonaws.com/" + key;
    };
    var S3Service_1;
    S3Service = S3Service_1 = __decorate([
        common_1.Injectable()
    ], S3Service);
    return S3Service;
}()); // `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`
exports.S3Service = S3Service;
