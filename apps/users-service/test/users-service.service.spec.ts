import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UsersService } from '../src/users-service.service';
import { EmailService } from '../src/email.service';
import { OTPService } from '../src/otp-service';
import { User, UserRole } from '../src/entities/user.entity';
import { LoginDto } from '../src/dto/login.dto';
import { VerifyDto } from '../src/dto/verifyOTP.dto';
import { of } from 'rxjs';

describe('UsersService - Email-Only Authentication', () => {
  let service: UsersService;
  let userRepository: any;
  let emailService: EmailService;
  let jwtService: JwtService;
  let notificationsClient: ClientProxy;
  let cartClient: ClientProxy;
  let wishlistClient: ClientProxy;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    phone: '+1234567890',
    password: '',
    fullName: 'Test User',
    isActive: true,
    code: '123456',
    role: UserRole.USER,
    notificationToken: undefined,
    address: undefined,
    isFirstLogin: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
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

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    emailService = module.get<EmailService>(EmailService);
    jwtService = module.get<JwtService>(JwtService);
    notificationsClient = module.get<ClientProxy>('NOTIFICATIONS_SERVICE');
    cartClient = module.get<ClientProxy>('CART_SERVICE');
    wishlistClient = module.get<ClientProxy>('WISHLIST_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login - Email-Only', () => {
    it('should throw error if email is missing', async () => {
      const loginDto: LoginDto = {
        email: '',
      };

      await expect(service.login(loginDto)).rejects.toThrow(RpcException);
      await expect(service.login(loginDto)).rejects.toMatchObject({
        message: expect.stringContaining('Email is required'),
      });
    });

    it('should throw error if user not found by email', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
      };

      userRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(RpcException);
      await expect(service.login(loginDto)).rejects.toMatchObject({
        message: expect.stringContaining('Invalid credentials'),
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
    });

    it('should generate and send OTP for valid email', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
      };

      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(result.success).toBe(true);
      expect(result.msg).toContain('Check code sent to test@example.com');
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(emailService.sendOtp).toHaveBeenCalledWith(
        'test@example.com',
        expect.stringMatching(/^\d{6}$/),
      );
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should use fixed OTP for special user email', async () => {
      process.env.SPECIAL_USER_EMAIL = 'special@example.com';
      process.env.FIXED_OTP = '999999';

      const loginDto: LoginDto = {
        email: 'special@example.com',
      };

      const specialUser = { ...mockUser, email: 'special@example.com' };
      userRepository.findOne.mockResolvedValue(specialUser);
      userRepository.save.mockResolvedValue(specialUser);

      const result = await service.login(loginDto);

      expect(result.success).toBe(true);
      expect(result.isSpecialUser).toBe(true);
      expect(result.msg).toContain('Check your fixed OTP code');
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ code: '999999' }),
      );
      expect(emailService.sendOtp).not.toHaveBeenCalled();

      delete process.env.SPECIAL_USER_EMAIL;
      delete process.env.FIXED_OTP;
    });

    it('should not send SMS (commented out path)', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
      };

      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      await service.login(loginDto);

      // Verify SMS is NOT called (commented out in implementation)
      // OTPService.sendSms should not be invoked
      expect(emailService.sendOtp).toHaveBeenCalled();
    });

    it('should generate 6-digit OTP', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
      };

      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      await service.login(loginDto);

      const saveCall = userRepository.save.mock.calls[0][0];
      expect(saveCall.code).toMatch(/^\d{6}$/);
      expect(saveCall.code.length).toBe(6);
    });
  });

  describe('verifyOTP - Email-Only', () => {
    it('should throw error if email is missing', async () => {
      const verifyDto: VerifyDto = {
        email: '',
        code: '123456',
      };

      await expect(service.verifyOTP(verifyDto)).rejects.toThrow(RpcException);
      await expect(service.verifyOTP(verifyDto)).rejects.toMatchObject({
        message: expect.stringContaining('Email is required'),
      });
    });

    it('should throw error if user not found by email', async () => {
      const verifyDto: VerifyDto = {
        email: 'nonexistent@example.com',
        code: '123456',
      };

      userRepository.findOne.mockResolvedValue(null);

      await expect(service.verifyOTP(verifyDto)).rejects.toThrow(RpcException);
      await expect(service.verifyOTP(verifyDto)).rejects.toMatchObject({
        message: expect.stringContaining('Invalid credentials'),
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
    });

    it('should throw error if OTP code is invalid', async () => {
      const verifyDto: VerifyDto = {
        email: 'test@example.com',
        code: 'wrong-code',
      };

      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.verifyOTP(verifyDto)).rejects.toThrow(RpcException);
      await expect(service.verifyOTP(verifyDto)).rejects.toMatchObject({
        message: expect.stringContaining('Invalid OTP code'),
      });
    });

    it('should verify OTP and return access token', async () => {
      const verifyDto: VerifyDto = {
        email: 'test@example.com',
        code: '123456',
      };

      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue({
        ...mockUser,
        isFirstLogin: false,
      });

      const result = await service.verifyOTP(verifyDto);

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user).toBeDefined();
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
        }),
      );
    });

    it('should clear OTP code after verification', async () => {
      const verifyDto: VerifyDto = {
        email: 'test@example.com',
        code: '123456',
      };

      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue({
        ...mockUser,
        code: '',
        isFirstLogin: false,
      });

      await service.verifyOTP(verifyDto);

      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ code: '' }),
      );
    });

    it('should set isFirstLogin to false on first verification', async () => {
      const verifyDto: VerifyDto = {
        email: 'test@example.com',
        code: '123456',
      };

      const firstLoginUser = { ...mockUser, isFirstLogin: true };
      userRepository.findOne.mockResolvedValue(firstLoginUser);
      userRepository.save.mockResolvedValue({
        ...firstLoginUser,
        isFirstLogin: false,
      });

      await service.verifyOTP(verifyDto);

      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ isFirstLogin: false }),
      );
    });

    it('should merge guest cart and wishlist if guestId provided', async () => {
      const verifyDto: VerifyDto = {
        email: 'test@example.com',
        code: '123456',
      };

      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue({
        ...mockUser,
        isFirstLogin: false,
      });

      cartClient.send = jest.fn().mockReturnValue(of({ success: true }));
      wishlistClient.send = jest.fn().mockReturnValue(of({ success: true }));

      await service.verifyOTP(verifyDto, 'guest-123');

      expect(cartClient.send).toHaveBeenCalledWith(
        { cmd: 'merge_guest_cart' },
        { guestId: 'guest-123', userId: mockUser.id },
      );
      expect(wishlistClient.send).toHaveBeenCalledWith(
        { cmd: 'merge_guest_wishlist' },
        { guestId: 'guest-123', userId: mockUser.id },
      );
    });

    it('should not require phone field for verification', async () => {
      const verifyDto: VerifyDto = {
        email: 'test@example.com',
        code: '123456',
        // phone intentionally omitted
      };

      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue({
        ...mockUser,
        isFirstLogin: false,
      });

      const result = await service.verifyOTP(verifyDto);

      expect(result.accessToken).toBeDefined();
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });

  describe('EmailService Integration', () => {
    it('should call EmailService.sendOtp with correct parameters', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
      };

      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      await service.login(loginDto);

      expect(emailService.sendOtp).toHaveBeenCalledWith(
        'test@example.com',
        expect.stringMatching(/^\d{6}$/),
      );
    });

    it('should handle EmailService errors gracefully', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
      };

      userRepository.findOne.mockResolvedValue(mockUser);
      (emailService.sendOtp as any).mockRejectedValue(
        new Error('SendGrid API error'),
      );

      await expect(service.login(loginDto)).rejects.toThrow();
    });
  });
});
