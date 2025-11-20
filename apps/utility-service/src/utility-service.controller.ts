import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UtilityServiceService } from './utility-service.service';

@Controller()
export class UtilityServiceController {
  constructor(private readonly utilityService: UtilityServiceService) {}

  @MessagePattern({ cmd: 'get_exchange_rates' })
  async getExchangeRates(data: { base?: string; symbols?: string }) {
    try {
      return await this.utilityService.getExchangeRates({
        base: data?.base,
        symbols: data?.symbols,
      });
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to get exchange rates',
        error: error?.message || 'Unknown error',
      };
    }
  }
}
