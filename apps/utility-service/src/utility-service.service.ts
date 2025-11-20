import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UtilityServiceService {
  private readonly logger = new Logger(UtilityServiceService.name);
  private exchangeRatesCache = new Map<string, { timestamp: number; data: any }>();

  constructor(private readonly httpService: HttpService) {}

  async getExchangeRates(params?: { base?: string; symbols?: string }) {
    const base = params?.base || 'USD';
    const symbols = params?.symbols;
    const accessKey = process.env.EXCHANGERATE_HOST_ACCESS_KEY;

    if (!accessKey) {
      this.logger.error('EXCHANGERATE_HOST_ACCESS_KEY is not set');
      return {
        success: false,
        message: 'Exchange rate API access key is not configured',
        error: 'Missing EXCHANGERATE_HOST_ACCESS_KEY environment variable',
      };
    }

    const cacheKey = `${base}:${symbols || 'ALL'}`;
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    const cached = this.exchangeRatesCache.get(cacheKey);
    if (cached && now - cached.timestamp < oneDayMs) {
      this.logger.log(`Returning cached exchange rates for ${cacheKey}`);
      return {
        success: true,
        source: 'cache',
        ...cached.data,
      };
    }

    const queryParams: Record<string, string> = { base, access_key: accessKey };
    if (symbols) {
      queryParams.symbols = symbols;
    }

    try {
      this.logger.log(`Fetching exchange rates from exchangerate.host for ${cacheKey}`);

      const response = await firstValueFrom(
        this.httpService.get('https://api.exchangerate.host/latest', {
          params: queryParams,
        }),
      );

      const data = response.data;

      this.exchangeRatesCache.set(cacheKey, {
        timestamp: now,
        data,
      });

      return {
        success: true,
        source: 'live',
        ...data,
      };
    } catch (error: any) {
      this.logger.error('Error fetching exchange rates:', error?.message || error);

      if (cached) {
        return {
          success: true,
          source: 'stale_cache',
          warning: 'Failed to refresh rates, returning stale cached data',
          ...cached.data,
        };
      }

      return {
        success: false,
        message: 'Failed to fetch exchange rates',
        error: error?.message || 'Unknown error',
      };
    }
  }
}
