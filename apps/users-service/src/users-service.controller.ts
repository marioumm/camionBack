/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from './users-service.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verifyOTP.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { UserRole } from './entities/user.entity';

function mapException(error: any) {
  if (error instanceof RpcException) return error;
  if (
    error instanceof NotFoundException ||
    error instanceof BadRequestException ||
    error instanceof UnauthorizedException ||
    error instanceof ConflictException
  ) {
    return new RpcException({
      statusCode: error.getStatus(),
      message: error.message,
    });
  }
  return new RpcException({
    statusCode: 500,
    message: error?.message || 'Unknown error from users microservice',
  });
}

@UsePipes(
  new ValidationPipe({
    exceptionFactory: (errors) =>
      new RpcException({
        statusCode: 400,
        message: 'Validation failed',
        details: errors,
      }),
  }),
)
@Controller()
export class UsersServiceController {
  constructor(private readonly usersService: UsersService,
  ) { }

  @MessagePattern({ cmd: 'register_user' })
  async register(@Payload() dto: RegisterDto) {
    try {
      return await this.usersService.register(dto);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'login_user' })
  async login(@Payload() dto: LoginDto) {
    try {
      return await this.usersService.login(dto);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'login_admin' })
  async loginAdmin(@Payload() dto: LoginAdminDto) {
    try {
      return await this.usersService.loginAdmin(dto);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Payload() dto: CreateUserDto) {
    try {
      return await this.usersService.createUser(dto);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'verify_user' })
  async verifyOTP(@Payload() data: VerifyDto & { guestId?: string }) {
    try {
      const { guestId, ...dto } = data;  
      return await this.usersService.verifyOTP(dto as VerifyDto, guestId);  
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'get_users' })
  async getAllUsers() {
    try {
      return await this.usersService.getUsers();
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'get_user_by_id' })
  async getUserById(@Payload() id: string) {
    try {
      return await this.usersService.getUserById(id);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'users.getUserById' })
  async handleGetUserById(@Payload() { id }: { id: string }) {
    try {
      return await this.usersService.getUserById(id);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'find_user_by_identifier' })
  async findUsersByFilters(@Payload() filters: FilterUsersDto) {
    try {
      return await this.usersService.findUsersByFilters(filters);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUser(@Payload() payload: { id: string; updateData: UpdateUserDto }) {
    try {
      const { id, updateData } = payload;
      return await this.usersService.updateUser(id, updateData);
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'update-user-role' })
  async updateUserRole(data: { userId: string; role: UserRole }) {
    return this.usersService.updateUserRole(data.userId, data.role);
  }

  @MessagePattern({ cmd: 'approve-affiliate' })
  async handleApproveAffiliate(@Payload() data: { userId: string; role: UserRole }) {
    return this.usersService.approveAffiliateAndGenerateToken(data.userId, data.role);
  }

  @MessagePattern({ cmd: 'generate-token' })
  async handleGenerateToken(@Payload() data: { userId: string }) {
    return this.usersService.generateTokenForUser(data.userId);
  }

  @MessagePattern({ cmd: 'save_notification_token' })
  async saveNotificationToken(
    @Payload() data: { userId: string; token: string }
  ) {
    return this.usersService.saveNotificationToken(data.userId, data.token);
  }

  @MessagePattern({ cmd: 'get-user-device-token' })
  async getUserDeviceToken(@Payload() payload: { userId: string }) {
    return this.usersService.getUserDeviceToken(payload.userId);
  }


 @MessagePattern({ cmd: 'delete_user' })
  async deleteUser(@Payload() id: string) {
    try {
      await this.usersService.deleteUser(id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw mapException(error);
    }
  }

  @MessagePattern({ cmd: 'updateUserAddress' })
  async updateUserAddress(@Payload() data: { userId: string; addressDto: any }) {
    try {
      const { userId, addressDto } = data;
      return await this.usersService.updateUserAddress(userId, addressDto);
    } catch (error) {
      throw mapException(error);
    }
  }


  @MessagePattern({ cmd: 'getUserAddress' })
  async getUserAddress(@Payload() userId: string) {
    return await this.usersService.getUserAddress(userId);
  }



  @MessagePattern({ cmd: 'count_all_users' })
  async countAllUsers() {
    return await this.usersService.countAllUsers();
  }

  @MessagePattern({ cmd: 'count_active_users' })
  async countActiveUsers() {
    return await this.usersService.countActiveUsers();
  }
}





