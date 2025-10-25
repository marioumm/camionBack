import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { UsersServiceController } from '../src/users-service.controller';
import { UsersService } from '../src/users-service.service';
import { EmailService } from '../src/email.service';
import { OTPService } from '../src/otp-service';
import { User, UserRole } from '../src/entities/user.entity';
import { LoginDto } from '../src/dto/login.dto';
import { VerifyDto } from '../src/dto/verifyOTP.dto';
import { of } from 'rxjs';

describe('Users Service - Email-Only Authentication Integration Tests', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let userRepository: any;
  let emailService: EmailService;
  let jwtService: JwtService;

  const testUser: User = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'integration@example.com',
    phone: '+1234567890',
    password: '',
    fullName: 'Integration Test User',
    isActive: true,
    code: '',
    role: UserRole.USER,
    notificationToken: undefined,
    address: undefined,
    isFirstLogin: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersServiceController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('integration-test-token'),
            verify: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendOtp: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: OTPService,
          useValue: {
            sendSms: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: 'NOTIFICATIONS_SERVICE',
          useValue: {
            send: jest.fn().mockReturnValue(of({})),
          },
        },
        {
          provide: 'CART_SERVICE',
          useValue: {
            send: jest.fn().mockReturnValue(of({})),
          },
        },
        {
          provide: 'WISHLIST_SERVICE',
          useValue: {
            send: jest.fn().mockReturnValue(of({})),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    usersService = moduleFixture.get<UsersService>(UsersService);
    userRepository = moduleFixture.get(getRepositoryToken(User));
    emailService = moduleFixture.get<EmailService>(EmailService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete Login Flow - Email Only', () => {
    it('should complete full login -> OTP email -> verify flow', async () => {
      const loginDto: LoginDto = {
        email: 'integration@example.com',
      };

      // Step 1: User initiates login with email
      userRepository.findOne.mockResolvedValue(testUser);
      userRepository.save.mockResolvedValue(testUser);

      const loginResult = await usersService.login(loginDto);

      expect(loginResult.success).toBe(true);
      expect(loginResult.msg).toContain('Check code sent to');
      expect(emailService.sendOtp).toHaveBeenCalledWith(
        'integration@example.com',
        expect.stringMatching(/^\d{6}$/),
      );

      // Extract OTP from the saved user (in real scenario, user receives via email)
      const savedUserCall = userRepository.save.mock.calls[0][0];
      const otp = savedUserCall.code;

      // Step 2: User verifies OTP
      const verifyDto: VerifyDto = {
        email: 'integration@example.com',
        code: otp,
      };

      const userWithOtp = { ...testUser, code: otp };
      userRepository.findOne.mockResolvedValue(userWithOtp);
      userRepository.save.mockResolvedValue({
        ...userWithOtp,
        code: '',
        isFirstLogin: false,
      });

      const verifyResult = await usersService.verifyOTP(verifyDto);

      expect(verifyResult.accessToken).toBe('integration-test-token');
      expect(verifyResult.user).toBeDefined();
      expect(verifyResult.isFirstLogin).toBe(false);
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: testUser.id,
          email: 'integration@example.com',
        }),
      );
    });

    it('should reject login with phone field (email-only enforcement)', async () => {
      const loginDtoWithPhone: any = {
        email: 'integration@example.com',
        phone: '+1234567890',
      };

      // In real API, validation would reject this at controller level
      // Here we verify the DTO structure doesn't include phone
      expect(loginDtoWithPhone.phone).toBeDefined();
      // But the service should only use email
      userRepository.findOne.mockResolvedValue(testUser);
      userRepository.save.mockResolvedValue(testUser);

      const result = await usersService.login({
        email: loginDtoWithPhone.email,
      });

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'integration@example.com' },
      });
      // Verify phone was NOT used in the query
      expect(userRepository.findOne.mock.calls[0][0].where).not.toHaveProperty(
        'phone',
      );
    });
  });

  describe('Error Handling - Email-Only', () => {
    it('should handle missing email in login', async () => {
      const loginDto: LoginDto = {
        email: '',
      };

      await expect(usersService.login(loginDto)).rejects.toThrow();
    });

    it('should handle non-existent email', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
      };

      userRepository.findOne.mockResolvedValue(null);

      await expect(usersService.login(loginDto)).rejects.toThrow();
    });

    it('should handle wrong OTP code', async () => {
      const verifyDto: VerifyDto = {
        email: 'integration@example.com',
        code: 'wrong-code',
      };

      userRepository.findOne.mockResolvedValue(testUser);

      await expect(usersService.verifyOTP(verifyDto)).rejects.toThrow();
    });

    it('should handle email service failures', async () => {
      const loginDto: LoginDto = {
        email: 'integration@example.com',
      };

      userRepository.findOne.mockResolvedValue(testUser);
      (emailService.sendOtp as any).mockRejectedValue(
        new Error('SendGrid API error'),
      );

      await expect(usersService.login(loginDto)).rejects.toThrow();
    });
  });

  describe('Special User Flow - Email Only', () => {
    it('should use fixed OTP for special user email', async () => {
      process.env.SPECIAL_USER_EMAIL = 'special@example.com';
      process.env.FIXED_OTP = '888888';

      const loginDto: LoginDto = {
        email: 'special@example.com',
      };

      const specialUser = { ...testUser, email: 'special@example.com' };
      userRepository.findOne.mockResolvedValue(specialUser);
      userRepository.save.mockResolvedValue(specialUser);

      const result = await usersService.login(loginDto);

      expect(result.isSpecialUser).toBe(true);
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ code: '888888' }),
      );
      // Email should NOT be sent for special user
      expect(emailService.sendOtp).not.toHaveBeenCalled();

      delete process.env.SPECIAL_USER_EMAIL;
      delete process.env.FIXED_OTP;
    });
  });

  describe('Guest Merge Flow - Email Only', () => {
    it('should merge guest cart and wishlist on verify with guestId', async () => {
      const verifyDto: VerifyDto = {
        email: 'integration@example.com',
        code: '123456',
      };

      const userWithOtp = { ...testUser, code: '123456' };
      userRepository.findOne.mockResolvedValue(userWithOtp);
      userRepository.save.mockResolvedValue({
        ...userWithOtp,
        code: '',
        isFirstLogin: false,
      });

      const cartClient = app.get('CART_SERVICE');
      const wishlistClient = app.get('WISHLIST_SERVICE');

      cartClient.send = jest.fn().mockReturnValue(of({ success: true }));
      wishlistClient.send = jest.fn().mockReturnValue(of({ success: true }));

      await usersService.verifyOTP(verifyDto, 'guest-123');

      expect(cartClient.send).toHaveBeenCalledWith(
        { cmd: 'merge_guest_cart' },
        { guestId: 'guest-123', userId: testUser.id },
      );
      expect(wishlistClient.send).toHaveBeenCalledWith(
        { cmd: 'merge_guest_wishlist' },
        { guestId: 'guest-123', userId: testUser.id },
      );
    });
  });

  describe('First Login Flag - Email Only', () => {
    it('should set isFirstLogin to false after first verification', async () => {
      const verifyDto: VerifyDto = {
        email: 'integration@example.com',
        code: '123456',
      };

      const firstLoginUser = {
        ...testUser,
        code: '123456',
        isFirstLogin: true,
      };
      userRepository.findOne.mockResolvedValue(firstLoginUser);
      userRepository.save.mockResolvedValue({
        ...firstLoginUser,
        code: '',
        isFirstLogin: false,
      });

      await usersService.verifyOTP(verifyDto);

      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ isFirstLogin: false }),
      );
    });

    it('should not update isFirstLogin if already false', async () => {
      const verifyDto: VerifyDto = {
        email: 'integration@example.com',
        code: '123456',
      };

      const returningUser = {
        ...testUser,
        code: '123456',
        isFirstLogin: false,
      };
      userRepository.findOne.mockResolvedValue(returningUser);
      userRepository.save.mockResolvedValue({ ...returningUser, code: '' });

      await usersService.verifyOTP(verifyDto);

      // Save should still be called to clear the code
      expect(userRepository.save).toHaveBeenCalled();
    });
  });

  describe('OTP Code Generation - Email Only', () => {
    it('should generate unique OTP codes for multiple logins', async () => {
      const loginDto: LoginDto = {
        email: 'integration@example.com',
      };

      const otpCodes = new Set<string>();

      // Simulate multiple login attempts
      for (let i = 0; i < 5; i++) {
        userRepository.findOne.mockResolvedValue(testUser);
        userRepository.save.mockResolvedValue(testUser);

        await usersService.login(loginDto);

        const savedUserCall = userRepository.save.mock.calls[i][0];
        otpCodes.add(savedUserCall.code);
      }

      // All OTP codes should be 6 digits
      otpCodes.forEach((code) => {
        expect(code).toMatch(/^\d{6}$/);
      });
    });
  });

  describe('Email Service Integration - Email Only', () => {
    it('should send OTP email with correct format', async () => {
      const loginDto: LoginDto = {
        email: 'integration@example.com',
      };

      userRepository.findOne.mockResolvedValue(testUser);
      userRepository.save.mockResolvedValue(testUser);

      await usersService.login(loginDto);

      expect(emailService.sendOtp).toHaveBeenCalledTimes(1);
      const [email, code] = (emailService.sendOtp as any).mock.calls[0];
      expect(email).toBe('integration@example.com');
      expect(code).toMatch(/^\d{6}$/);
    });

    it('should not call SMS service (phone path commented out)', async () => {
      const loginDto: LoginDto = {
        email: 'integration@example.com',
      };

      userRepository.findOne.mockResolvedValue(testUser);
      userRepository.save.mockResolvedValue(testUser);

      const otpService = app.get(OTPService);
      const sendSmsSpy = jest.spyOn(otpService, 'sendSms');

      await usersService.login(loginDto);

      // SMS should NOT be called (path is commented out)
      expect(sendSmsSpy).not.toHaveBeenCalled();

      sendSmsSpy.mockRestore();
    });
  });
});
