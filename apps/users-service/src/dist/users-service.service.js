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
exports.UsersService = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var microservices_1 = require("@nestjs/microservices");
var user_entity_1 = require("./entities/user.entity");
var typeorm_2 = require("typeorm");
var bcrypt = require("bcrypt");
var rxjs_1 = require("rxjs");
var UsersService = /** @class */ (function () {
    function UsersService(userRepository, jwtService, otpService, notificationsClient, cartClient, wishlistClient) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.otpService = otpService;
        this.notificationsClient = notificationsClient;
        this.cartClient = cartClient;
        this.wishlistClient = wishlistClient;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    UsersService_1 = UsersService;
    UsersService.prototype.sendNotification = function (userId, title, body) {
        return __awaiter(this, void 0, void 0, function () {
            var user, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: { id: userId },
                                select: ['notificationToken']
                            })];
                    case 1:
                        user = _a.sent();
                        if (!(user === null || user === void 0 ? void 0 : user.notificationToken))
                            return [2 /*return*/];
                        return [4 /*yield*/, this.notificationsClient.send({ cmd: 'send_push_notification' }, { token: user.notificationToken, userId: userId, title: title, body: body }).toPromise()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.error('Failed to send notification:', err_1);
                        throw new microservices_1.RpcException({
                            statusCode: 500,
                            message: 'Failed to send notification'
                        });
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.saveNotificationToken = function (userId, token) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne({ where: { id: userId } })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'User not found' });
                        }
                        user.notificationToken = token;
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { message: 'Notification token saved successfully' }];
                }
            });
        });
    };
    UsersService.prototype.getUserDeviceToken = function (userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var user, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: { id: userId },
                                select: ['id', 'notificationToken']
                            })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'User not found' });
                        }
                        return [2 /*return*/, { deviceToken: (_a = user.notificationToken) !== null && _a !== void 0 ? _a : null }];
                    case 2:
                        error_1 = _b.sent();
                        throw toRpc(error_1, 'Get user device token failed');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.register = function (dto) {
        return __awaiter(this, void 0, Promise, function () {
            var existing, user, savedUser, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!dto.email || !dto.phone) {
                            throw new microservices_1.RpcException({
                                statusCode: 400,
                                message: 'Email and Phone number are required'
                            });
                        }
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: [{ email: dto.email }, { phone: dto.phone }]
                            })];
                    case 1:
                        existing = _a.sent();
                        if (existing) {
                            throw new microservices_1.RpcException({
                                statusCode: 409,
                                message: 'User already exists'
                            });
                        }
                        user = this.userRepository.create(dto);
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 2:
                        savedUser = _a.sent();
                        return [4 /*yield*/, this.sendNotification(savedUser.id, 'Welcome to Camion!', 'Your registration was successful. Enjoy our services!')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, savedUser];
                    case 4:
                        error_2 = _a.sent();
                        throw toRpc(error_2, 'Registration failed');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.loginAdmin = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isPasswordValid, payload, token, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!dto.email || !dto.password) {
                            throw new microservices_1.RpcException({
                                statusCode: 400,
                                message: 'Email and password are required'
                            });
                        }
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: { email: dto.email }
                            })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new microservices_1.RpcException({
                                statusCode: 401,
                                message: 'Invalid credentials'
                            });
                        }
                        return [4 /*yield*/, bcrypt.compare(dto.password, user.password)];
                    case 2:
                        isPasswordValid = _a.sent();
                        if (!isPasswordValid) {
                            throw new microservices_1.RpcException({
                                statusCode: 401,
                                message: 'Invalid credentials'
                            });
                        }
                        // Check if admin
                        if (user.role !== user_entity_1.UserRole.ADMIN) {
                            throw new microservices_1.RpcException({
                                statusCode: 403,
                                message: 'Access denied. Admins only.'
                            });
                        }
                        payload = {
                            sub: user.id,
                            email: user.email,
                            role: user.role
                        };
                        token = this.jwtService.sign(payload);
                        return [2 /*return*/, {
                                success: true,
                                msg: "Admin Login",
                                accessToken: token,
                                admin: user
                            }];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Login error at login', error_3);
                        throw toRpc(error_3, 'Login failed');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.login = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var user, SPECIAL_EMAIL, SPECIAL_PHONE, FIXED_OTP, OTP, i, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        if (!dto.email || !dto.phone) {
                            throw new microservices_1.RpcException({
                                statusCode: 400,
                                message: 'Email and phone are required'
                            });
                        }
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: { email: dto.email, phone: dto.phone }
                            })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new microservices_1.RpcException({
                                statusCode: 401,
                                message: 'Invalid credentials'
                            });
                        }
                        SPECIAL_EMAIL = process.env.SPECIAL_USER_EMAIL;
                        SPECIAL_PHONE = process.env.SPECIAL_USER_PHONE;
                        if (!(dto.email === SPECIAL_EMAIL && dto.phone === SPECIAL_PHONE)) return [3 /*break*/, 3];
                        FIXED_OTP = process.env.FIXED_OTP || '111111';
                        user.code = FIXED_OTP;
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                msg: "Check your fixed OTP code!",
                                isSpecialUser: true
                            }];
                    case 3:
                        OTP = '';
                        for (i = 0; i < 6; i++) {
                            OTP += Math.floor(Math.random() * 10);
                        }
                        user.code = OTP;
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.otpService.sendSms(user.phone, "Camion Verification code " + OTP)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, { success: true, msg: "Check Code on " + user.phone + "!" }];
                    case 6:
                        error_4 = _a.sent();
                        console.error('Login error at login');
                        throw toRpc(error_4, 'Login failed');
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.verifyOTP = function (dto, guestId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isFirstLogin, payload, token, err_2, error_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        if (!dto.email || !dto.phone) {
                            throw new microservices_1.RpcException({
                                statusCode: 400,
                                message: 'Email and phone are required'
                            });
                        }
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: { email: dto.email, phone: dto.phone }
                            })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new microservices_1.RpcException({
                                statusCode: 401,
                                message: 'Invalid credentials'
                            });
                        if (user.code !== dto.code)
                            throw new microservices_1.RpcException({
                                statusCode: 401,
                                message: 'Invalid OTP code'
                            });
                        user.code = '';
                        isFirstLogin = user.isFirstLogin;
                        if (!user.isFirstLogin) return [3 /*break*/, 3];
                        user.isFirstLogin = false;
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        payload = {
                            sub: user.id,
                            email: user.email,
                            phone: user.phone,
                            role: user.role
                        };
                        token = this.jwtService.sign(payload);
                        if (!guestId) return [3 /*break*/, 8];
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, , 8]);
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.cartClient.send({ cmd: 'merge_guest_cart' }, { guestId: guestId, userId: user.id }).pipe(rxjs_1.timeout(3000), rxjs_1.catchError(function (err) {
                                _this.logger.warn("Failed to merge guest cart: " + err.message);
                                return rxjs_1.of(null);
                            })))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.wishlistClient.send({ cmd: 'merge_guest_wishlist' }, { guestId: guestId, userId: user.id }).pipe(rxjs_1.timeout(3000), rxjs_1.catchError(function (err) {
                                _this.logger.warn("Failed to merge guest wishlist: " + err.message);
                                return rxjs_1.of(null);
                            })))];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        err_2 = _a.sent();
                        this.logger.error('Error merging guest data', err_2);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/, { accessToken: token, user: user, isFirstLogin: isFirstLogin }];
                    case 9:
                        error_5 = _a.sent();
                        throw toRpc(error_5, 'OTP verification failed');
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.createUser = function (dto) {
        return __awaiter(this, void 0, Promise, function () {
            var existing, _a, existing, user, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        if (!(dto.role == user_entity_1.UserRole.ADMIN)) return [3 /*break*/, 3];
                        if (!dto.email || !dto.password) {
                            throw new microservices_1.RpcException({
                                statusCode: 401,
                                message: 'Invalid Credentials!'
                            });
                        }
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: [{ email: dto.email }]
                            })];
                    case 1:
                        existing = _b.sent();
                        if (existing)
                            throw new microservices_1.RpcException({
                                statusCode: 409,
                                message: 'User already exists'
                            });
                        _a = dto;
                        return [4 /*yield*/, bcrypt.hash(dto.password, 10)];
                    case 2:
                        _a.password = _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        if (!dto.email || !dto.phone) {
                            throw new microservices_1.RpcException({
                                statusCode: 401,
                                message: 'Invalid Credentials!'
                            });
                        }
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: [{ email: dto.email }, { phone: dto.phone }]
                            })];
                    case 4:
                        existing = _b.sent();
                        if (existing)
                            throw new microservices_1.RpcException({
                                statusCode: 409,
                                message: 'User already exists'
                            });
                        _b.label = 5;
                    case 5:
                        user = this.userRepository.create(dto);
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7:
                        error_6 = _b.sent();
                        throw toRpc(error_6, 'Create user failed');
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.getUsers = function () {
        return __awaiter(this, void 0, Promise, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userRepository.find()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        throw toRpc(error_7, 'Get users failed');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.getUserById = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var user, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userRepository.findOne({ where: { id: id } })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'User not found' });
                        return [2 /*return*/, user];
                    case 2:
                        error_8 = _a.sent();
                        throw toRpc(error_8, 'Get user by id failed');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.findUsersByFilters = function (filters) {
        return __awaiter(this, void 0, Promise, function () {
            var where, pattern, commonFilters_1, combinedWhere, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        where = [];
                        if (filters.identifier) {
                            pattern = typeorm_2.ILike("%" + filters.identifier + "%");
                            where.push({ email: pattern }, { phone: pattern }, { fullName: pattern });
                        }
                        commonFilters_1 = {};
                        if (filters.role)
                            commonFilters_1.role = filters.role;
                        if (typeof filters.isActive === 'boolean')
                            commonFilters_1.isActive = filters.isActive;
                        if (filters.joinedAfter && filters.joinedBefore)
                            commonFilters_1.createdAt = typeorm_2.Between(new Date(filters.joinedAfter), new Date(filters.joinedBefore));
                        else if (filters.joinedAfter)
                            commonFilters_1.createdAt = typeorm_2.MoreThanOrEqual(new Date(filters.joinedAfter));
                        else if (filters.joinedBefore)
                            commonFilters_1.createdAt = typeorm_2.LessThanOrEqual(new Date(filters.joinedBefore));
                        combinedWhere = where.length > 0
                            ? where.map(function (w) { return (__assign(__assign({}, w), commonFilters_1)); })
                            : [commonFilters_1];
                        return [4 /*yield*/, this.userRepository.find({ where: combinedWhere })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_9 = _a.sent();
                        throw toRpc(error_9, 'Find users by filters failed');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.updateUser = function (id, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getUserById(id)];
                    case 1:
                        user = _a.sent();
                        Object.assign(user, updateData);
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_10 = _a.sent();
                        throw toRpc(error_10, 'Update user failed');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.updateUserRole = function (userId, role) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne({ where: { id: userId } })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'User not found' });
                        user.role = role;
                        return [2 /*return*/, this.userRepository.save(user)];
                }
            });
        });
    };
    UsersService.prototype.deleteUser = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var result, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.userRepository["delete"](id)];
                    case 1:
                        result = _a.sent();
                        if (result.affected === 0) {
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'User not found' });
                        }
                        return [4 /*yield*/, this.sendNotification(id, 'Account Deleted', 'Your account has been successfully deleted.')];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_11 = _a.sent();
                        throw toRpc(error_11, 'Delete user failed');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.approveAffiliateAndGenerateToken = function (userId, role) {
        return __awaiter(this, void 0, void 0, function () {
            var user, payload, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne({ where: { id: userId } })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'User not found' });
                        user.role = role;
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 2:
                        _a.sent();
                        payload = {
                            sub: user.id,
                            email: user.email,
                            phone: user.phone,
                            role: user.role
                        };
                        token = this.jwtService.sign(payload);
                        return [2 /*return*/, { token: token, user: user }];
                }
            });
        });
    };
    UsersService.prototype.generateTokenForUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, payload, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne({ where: { id: userId } })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'User not found' });
                        payload = {
                            sub: user.id,
                            email: user.email,
                            phone: user.phone,
                            role: user.role
                        };
                        token = this.jwtService.sign(payload);
                        return [2 /*return*/, { token: token }];
                }
            });
        });
    };
    UsersService.prototype.getUserAddress = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne({ where: { id: userId } })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'User not found' });
                        }
                        return [2 /*return*/, user.address || null];
                }
            });
        });
    };
    UsersService.prototype.updateUserAddress = function (userId, addressDto) {
        return __awaiter(this, void 0, Promise, function () {
            var user, requestBody, response, shippingOptions, option;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne({ where: { id: userId } })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new microservices_1.RpcException({ statusCode: 404, message: 'User not found' });
                        }
                        // update user address
                        user.address = addressDto;
                        requestBody = {
                            items: [],
                            shippingAddress: {
                                first_name: addressDto.first_name,
                                last_name: addressDto.last_name,
                                address_1: addressDto.address_1,
                                address_2: addressDto.address_2,
                                city: addressDto.city,
                                state: addressDto.state,
                                postcode: addressDto.postcode,
                                country: addressDto.country
                            }
                        };
                        return [4 /*yield*/, fetch("https://buckydrop.camion-app.com/api/shipping/calculate", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(requestBody)
                            })];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new microservices_1.RpcException({ statusCode: response.status, message: "Failed to fetch shipping option" });
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        shippingOptions = _a.sent();
                        option = shippingOptions[0];
                        if (!option) {
                            throw new microservices_1.RpcException({ statusCode: 404, message: "No shipping options available" });
                        }
                        // assign only needed fields
                        user.address.shipping_option = {
                            method_id: option.instance_id,
                            title: option.title,
                            cost: option.cost
                        };
                        return [2 /*return*/, this.userRepository.save(user)];
                }
            });
        });
    };
    UsersService.prototype.countAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userRepository.count()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_12 = _a.sent();
                        throw toRpc(error_12, 'Failed to count users');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.countActiveUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userRepository.count({ where: { isActive: true } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_13 = _a.sent();
                        throw toRpc(error_13, 'Failed to count active users');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    var UsersService_1;
    UsersService = UsersService_1 = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(user_entity_1.User)),
        __param(3, common_1.Inject('NOTIFICATIONS_SERVICE')),
        __param(4, common_1.Inject('CART_SERVICE')),
        __param(5, common_1.Inject('WISHLIST_SERVICE'))
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
function toRpc(error, fallbackMsg) {
    var _a;
    if (error instanceof microservices_1.RpcException)
        return error;
    var statusCode = ((_a = error === null || error === void 0 ? void 0 : error.getStatus) === null || _a === void 0 ? void 0 : _a.call(error)) || 500;
    var message = (error === null || error === void 0 ? void 0 : error.message) || fallbackMsg || 'Internal server error';
    return new microservices_1.RpcException({ statusCode: statusCode, message: message });
}
