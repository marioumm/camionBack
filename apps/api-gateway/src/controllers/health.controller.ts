import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return { status: 'ok', message: 'API Gateway is healthy!', timestamp: new Date().toISOString() };
  }
}
