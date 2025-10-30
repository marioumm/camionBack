/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from 'apps/users-service/src/dto/create-user.dto';
import { FilterUsersDto } from 'apps/users-service/src/dto/filter-users.dto';
import { LoginAdminDto } from 'apps/users-service/src/dto/login-admin.dto';
import { LoginDto } from 'apps/users-service/src/dto/login.dto';
import { RegisterDto } from 'apps/users-service/src/dto/register.dto';
import { UpdateAddressDto } from 'apps/users-service/src/dto/update-address.dto';
import { UpdateUserDto } from 'apps/users-service/src/dto/update-user.dto';
import { VerifyDto } from 'apps/users-service/src/dto/verifyOTP.dto';
import { UserRole } from 'apps/users-service/src/entities/user.entity';
import { JwtAuthGuard } from 'libs/auth/src';
import { CurrentUserId } from 'libs/auth/src/current-user.decorator';
import { OwnerOrAdmin } from 'libs/auth/src/owner-or-admin.decorator';
import { Roles } from 'libs/auth/src/roles.decorator';
import { RolesGuard } from 'libs/auth/src/roles.guard';
import { firstValueFrom } from 'rxjs';



@Controller('users')
export class UserController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    @Inject('NOTIFICATIONS_SERVICE') private readonly notificationClient: ClientProxy,
  ) { }

  @Post('auth/register')
  register(@Body() body: RegisterDto) {
    return this.usersClient.send({ cmd: 'register_user' }, body);
  }

  @Post('auth/login_admin')
  loginAdmin(@Body() body: LoginAdminDto) {
    return this.usersClient.send({ cmd: 'login_admin' }, body);
  }

  @Post('auth/login')
  login(@Body() body: LoginDto) {
    return this.usersClient.send({ cmd: 'login_user' }, body);
  }

  @Post('verify')
  async verifyOTP(
    @Body() dto: VerifyDto,
    @Headers('x-guest-id') guestId?: string,
  ) {
    return this.usersClient.send(
      { cmd: 'verify_user' },
      { ...dto, guestId }
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.usersClient.send({ cmd: 'create_user' }, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  getAllUsers() {
    return this.usersClient.send({ cmd: 'get_users' }, {});
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@CurrentUserId() userId: string) {
    return this.usersClient.send({ cmd: 'get_user_by_id' }, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersClient.send({ cmd: 'get_user_by_id' }, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('find')
  findUsersByFilters(@Body() body: FilterUsersDto) {
    return this.usersClient.send({ cmd: 'find_user_by_identifier' }, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDto) {
    return this.usersClient.send({ cmd: 'update_user' }, { id, updateData });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @OwnerOrAdmin()
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersClient.send({ cmd: 'delete_user' }, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('notifications/token')
  async storeNotificationToken(
    @Body() body: { token: string },
    @CurrentUserId() userId: string,
  ) {
    return await firstValueFrom(
      this.usersClient.send(
        { cmd: 'save_notification_token' },
        { userId, token: body.token },
      ),
    );
  }

  @Get('notifications/me')
  @UseGuards(JwtAuthGuard)
  getMyNotifications(@CurrentUserId() userId: string) {
    return this.notificationClient.send(
      { cmd: 'get_user_notifications' },
      { userId }
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('address/me')
  async getUserAddress(@CurrentUserId() userId: string) {
    return await firstValueFrom(
      this.usersClient.send({ cmd: 'getUserAddress' }, userId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('address/update')
  async updateUserAddress(
    @Body() addressDto: UpdateAddressDto,
    @CurrentUserId() userId: string,
  ) {
    return await firstValueFrom(
      this.usersClient.send(
        { cmd: 'updateUserAddress' },
        { userId, addressDto },
      ),
    );
  }


  @Get('/count/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  countAllUsers() {
    return this.usersClient.send({ cmd: 'count_all_users' }, {});
  }

  @Get('/count/active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  countActiveUsers() {
    return this.usersClient.send({ cmd: 'count_active_users' }, {});
  }

}
