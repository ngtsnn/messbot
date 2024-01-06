import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('HealthCheck')
export class AppController {
  @Get('health')
  getHello(): string {
    return 'ok';
  }
}
