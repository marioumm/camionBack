/* eslint-disable @typescript-eslint/require-await */
import { Controller, Post } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('admin')
export class AdminController {
  constructor(
    @Inject('USER_SERVICE') private userService: ClientProxy,
  ) {}

  @Post('seed-currencies')
  async seedCurrencies() {
    return this.userService.send('seed_currencies', {});
  }
}
