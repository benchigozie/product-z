import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { ClerkAuthGuard } from './clerk-auth.guard.js';

@Controller('clerk-test')
export class ClerkTestController {
  @Get()
  @UseGuards(ClerkAuthGuard)
  test(@Req() request: Request) {
    return {
      authenticated: true,
      clerkUserId: request.auth.userId,
    };
  }
}