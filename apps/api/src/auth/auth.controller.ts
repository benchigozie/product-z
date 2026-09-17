import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import type { Response } from 'express';

import { AuthService } from './auth.service.js';
import { SessionAuthGuard } from './guards/session-auth.guard.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { UserService } from '../user/user.service.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(
    @Body() body: RegisterDto,
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(body);

    response.cookie('session', result.session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return {
      user: result.user,
    };
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  async me(@Req() request: Request) {
    const user = await this.userService.findById(request.user!.id);
  
    return {
      user,
    };
  }

  @Post('logout')
async logout(
  @Req() request: Request,
  @Res({ passthrough: true }) response: Response,
) {
  const token = request.cookies?.session;

  if (token) {
    await this.authService.logout(token);
  }

  response.clearCookie('session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return {
    message: 'Logged out successfully',
  };
}
}