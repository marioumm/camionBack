/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable , Logger  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { User, UserRole } from './entities/user.entity';
import {
  Repository,
  Between,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  FindOptionsWhere,
} from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { OTPService } from './otp-service';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verifyOTP.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginAdminDto } from './dto/login-admin.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { catchError, firstValueFrom, of, timeout } from 'rxjs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name); 
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private otpService: OTPService,
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
    @Inject('CART_SERVICE') 
    private readonly cartClient: ClientProxy,
    @Inject('WISHLIST_SERVICE') 
    private readonly wishlistClient: ClientProxy,
  ) { }

  private async sendNotification(userId: string, title: string, body: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: ['notificationToken'],
      });

      if (!user?.notificationToken) return;

      await this.notificationsClient.send(
        { cmd: 'send_push_notification' },
        { token: user.notificationToken, userId, title, body }
      ).toPromise();
    } catch (err) {
      console.error('Failed to send notification:', err);
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to send notification',
      });
    }
  }

  async saveNotificationToken(userId: string, token: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new RpcException({ statusCode: 404, message: 'User not found' });
    }

    user.notificationToken = token;
    await this.userRepository.save(user);

    return { message: 'Notification token saved successfully' };
  }

  async getUserDeviceToken(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: ['id', 'notificationToken'],
      });
      if (!user) {
        throw new RpcException({ statusCode: 404, message: 'User not found' });
      }
      return { deviceToken: user.notificationToken ?? null };
    } catch (error) {
      throw toRpc(error, 'Get user device token failed');
    }
  }

  async register(dto: RegisterDto): Promise<User> {
    try {
      if (!dto.email || !dto.phone) {
        throw new RpcException({
          statusCode: 400,
          message: 'Email and Phone number are required',
        });
      }
      const existing = await this.userRepository.findOne({
        where: [{ email: dto.email }, { phone: dto.phone }],
      });
      if (existing) {
        throw new RpcException({
          statusCode: 409,
          message: 'User already exists',
        });
      }
      const user = this.userRepository.create(dto);
      const savedUser = await this.userRepository.save(user);

      await this.sendNotification(
        savedUser.id,
        'Welcome to Camion!',
        'Your registration was successful. Enjoy our services!'
      );

      return savedUser;

    } catch (error) {
      throw toRpc(error, 'Registration failed');
    }
  }

  async loginAdmin(dto: LoginAdminDto) {
    try {
      if (!dto.email || !dto.password) {
        throw new RpcException({
          statusCode: 400,
          message: 'Email and password are required',
        });
      }

      const user = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (!user) {
        throw new RpcException({
          statusCode: 401,
          message: 'Invalid credentials',
        });
      }

      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new RpcException({
          statusCode: 401,
          message: 'Invalid credentials',
        });
      }

      // Check if admin
      if (user.role !== UserRole.ADMIN) {
        throw new RpcException({
          statusCode: 403,
          message: 'Access denied. Admins only.',
        });
      }
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };
      const token = this.jwtService.sign(payload);

      return {
        success: true,
        msg: `Admin Login`,
        accessToken: token,
        admin: user,
      };
    } catch (error) {
      console.error('Login error at login', error);
      throw toRpc(error, 'Login failed');
    }
  }

  async login(dto: LoginDto) {
    try {
      if (!dto.email || !dto.phone) {
        throw new RpcException({
          statusCode: 400,
          message: 'Email and phone are required',
        });
      }

      const user = await this.userRepository.findOne({
        where: { email: dto.email, phone: dto.phone },
      });

      if (!user) {
        throw new RpcException({
          statusCode: 401,
          message: 'Invalid credentials',
        });
      }

      const SPECIAL_EMAIL = process.env.SPECIAL_USER_EMAIL;
      const SPECIAL_PHONE = process.env.SPECIAL_USER_PHONE;

      if (dto.email === SPECIAL_EMAIL && dto.phone === SPECIAL_PHONE) {
        const FIXED_OTP = process.env.FIXED_OTP || '111111';
        user.code = FIXED_OTP;
        await this.userRepository.save(user);

        return {
          success: true,
          msg: `Check your fixed OTP code!`,
          isSpecialUser: true
        };
      }

      let OTP = '';
      for (let i = 0; i < 6; i++) {
        OTP += Math.floor(Math.random() * 10);
      }
      user.code = OTP;

      await this.userRepository.save(user);

      await this.otpService.sendSms(
        user.phone,
        `Camion Verification code ${OTP}`,
      );
      return { success: true, msg: `Check Code on ${user.phone}!` };

    } catch (error) {
      console.error('Login error at login');
      throw toRpc(error, 'Login failed');
    }
  }


async verifyOTP(dto: VerifyDto, guestId?: string) {
  try {
    if (!dto.email || !dto.phone) {
      throw new RpcException({
        statusCode: 400,
        message: 'Email and phone are required',
      });
    }

    const user = await this.userRepository.findOne({
      where: { email: dto.email, phone: dto.phone },
    });

    if (!user)
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    if (user.code !== dto.code)
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid OTP code',
      });

    user.code = '';
    const isFirstLogin = user.isFirstLogin;

    if (user.isFirstLogin) {
      user.isFirstLogin = false;
      await this.userRepository.save(user);
    }
    const payload = {
      sub: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    if (guestId) {
      try {
        await firstValueFrom(
          this.cartClient.send({ cmd: 'merge_guest_cart' }, { guestId, userId: user.id }).pipe(
            timeout(3000),
            catchError((err) => {
              this.logger.warn(`Failed to merge guest cart: ${err.message}`);
              return of(null);
            }),
          ),
        );

        await firstValueFrom(
          this.wishlistClient.send({ cmd: 'merge_guest_wishlist' }, { guestId, userId: user.id }).pipe(
            timeout(3000),
            catchError((err) => {
              this.logger.warn(`Failed to merge guest wishlist: ${err.message}`);
              return of(null);
            }),
          ),
        );
      } catch (err) {
        this.logger.error('Error merging guest data', err);
      }
    }

    return { accessToken: token, user, isFirstLogin };
  } catch (error) {
    throw toRpc(error, 'OTP verification failed');
  }
}


  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      if (dto.role == UserRole.ADMIN) {
        if (!dto.email || !dto.password) {
          throw new RpcException({
            statusCode: 401,
            message: 'Invalid Credentials!',
          });
        }
        const existing = await this.userRepository.findOne({
          where: [{ email: dto.email }],
        });
        if (existing)
          throw new RpcException({
            statusCode: 409,
            message: 'User already exists',
          });
        dto.password = await bcrypt.hash(dto.password, 10);
      } else {
        if (!dto.email || !dto.phone) {
          throw new RpcException({
            statusCode: 401,
            message: 'Invalid Credentials!',
          });
        }
        const existing = await this.userRepository.findOne({
          where: [{ email: dto.email }, { phone: dto.phone }],
        });
        if (existing)
          throw new RpcException({
            statusCode: 409,
            message: 'User already exists',
          });
      }
      const user = this.userRepository.create(dto);
      return await this.userRepository.save(user);
    } catch (error) {
      throw toRpc(error, 'Create user failed');
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw toRpc(error, 'Get users failed');
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user)
        throw new RpcException({ statusCode: 404, message: 'User not found' });
      return user;
    } catch (error) {
      throw toRpc(error, 'Get user by id failed');
    }
  }

  async findUsersByFilters(filters: FilterUsersDto): Promise<User[]> {
    try {
      const where: FindOptionsWhere<User>[] = [];
      if (filters.identifier) {
        const pattern = ILike(`%${filters.identifier}%`);
        where.push(
          { email: pattern },
          { phone: pattern },
          { fullName: pattern },
        );
      }
      const commonFilters: Partial<FindOptionsWhere<User>> = {};
      if (filters.role) commonFilters.role = filters.role;
      if (typeof filters.isActive === 'boolean')
        commonFilters.isActive = filters.isActive;
      if (filters.joinedAfter && filters.joinedBefore)
        commonFilters.createdAt = Between(
          new Date(filters.joinedAfter),
          new Date(filters.joinedBefore),
        );
      else if (filters.joinedAfter)
        commonFilters.createdAt = MoreThanOrEqual(
          new Date(filters.joinedAfter),
        );
      else if (filters.joinedBefore)
        commonFilters.createdAt = LessThanOrEqual(
          new Date(filters.joinedBefore),
        );
      const combinedWhere =
        where.length > 0
          ? where.map((w) => ({ ...w, ...commonFilters }))
          : [commonFilters];
      return await this.userRepository.find({ where: combinedWhere });
    } catch (error) {
      throw toRpc(error, 'Find users by filters failed');
    }
  }

  async updateUser(id: string, updateData: UpdateUserDto) {
    try {
      const user = await this.getUserById(id);
      Object.assign(user, updateData);
      return await this.userRepository.save(user);
    } catch (error) {
      throw toRpc(error, 'Update user failed');
    }
  }

  async updateUserRole(userId: string, role: UserRole) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new RpcException({ statusCode: 404, message: 'User not found' });
    user.role = role;
    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new RpcException({ statusCode: 404, message: 'User not found' });
      }
      await this.sendNotification(
        id,
        'Account Deleted',
        'Your account has been successfully deleted.'
      );
    } catch (error) {
      throw toRpc(error, 'Delete user failed');
    }
  }

  async approveAffiliateAndGenerateToken(userId: string, role: UserRole) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new RpcException({ statusCode: 404, message: 'User not found' });

    user.role = role;
    await this.userRepository.save(user);

    const payload = {
      sub: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    return { token, user };
  }

  async generateTokenForUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new RpcException({ statusCode: 404, message: 'User not found' });

    const payload = {
      sub: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    return { token };
  }


  async getUserAddress(userId: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new RpcException({ statusCode: 404, message: 'User not found' });
    }
    return user.address || null;
  }

  async updateUserAddress(userId: string, addressDto: UpdateAddressDto): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new RpcException({ statusCode: 404, message: 'User not found' });
    }

    // update user address
    user.address = addressDto;
    // build request body as API expects
    const requestBody = {
      items: [],
      shippingAddress: {
        first_name: addressDto.first_name,
        last_name: addressDto.last_name,
        address_1: addressDto.address_1,
        address_2: addressDto.address_2,
        city: addressDto.city,
        state: addressDto.state,
        postcode: addressDto.postcode,
        country: addressDto.country,
      },
    };

    // fetch shipping options from API
    const response = await fetch("https://buckydrop.camion-app.com/api/shipping/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new RpcException({ statusCode: response.status, message: "Failed to fetch shipping option" });
    }

    const shippingOptions = await response.json();

    const option = shippingOptions[0];
    if (!option) {
      throw new RpcException({ statusCode: 404, message: "No shipping options available" });
    }
    // assign only needed fields
    user.address.shipping_option = {
      method_id: option.instance_id,
      title: option.title,
      cost: option.cost,
    };

    return this.userRepository.save(user);
  }

  async countAllUsers() {
    try {
      return await this.userRepository.count();
    } catch (error) {
      throw toRpc(error, 'Failed to count users');
    }
  }

  async countActiveUsers() {
    try {
      return await this.userRepository.count({ where: { isActive: true } });
    } catch (error) {
      throw toRpc(error, 'Failed to count active users');
    }
  }

}


function toRpc(error: any, fallbackMsg?: string) {
  if (error instanceof RpcException) return error;
  const statusCode = error?.getStatus?.() || 500;
  const message = error?.message || fallbackMsg || 'Internal server error';
  return new RpcException({ statusCode, message });
}
