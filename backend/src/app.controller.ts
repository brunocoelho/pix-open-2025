import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index(): string {
    return this.appService.index();
  }

  @Get('health')
  healthCheck() {
    return { status: 'ok', timestamp: new Date() };
  }
}
