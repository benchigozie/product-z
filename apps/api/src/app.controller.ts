import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service.js';
import { PrismaService } from './prisma.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  async getHello() {
    return this.appService.getHello();
  }
}