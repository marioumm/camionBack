import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('utility')
export class UtilityController {
  constructor(
    @Inject('UTILITY_SERVICE')
    private readonly utilityClient: ClientProxy,
  ) {}

  @Get('currency-rates')
  async getCurrencyRates(
    @Query('base') base?: string,
    @Query('symbols') symbols?: string,
  ) {
    try {
      const result = await firstValueFrom(
        this.utilityClient.send(
          { cmd: 'get_exchange_rates' },
          { base, symbols },
        ),
      );

      return result;
    } catch (error: any) {
      console.error('Get currency rates error:', error);
      return {
        success: false,
        message: 'Failed to get currency rates',
        error: error?.message || 'Unknown error',
      };
    }
  }
}
