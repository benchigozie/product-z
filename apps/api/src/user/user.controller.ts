import {
    Body,
    Controller,
    Patch,
    Req,
    UseGuards,
  } from '@nestjs/common';
  
  import type { Request } from 'express';
  
  import { UserService } from './user.service.js';
  import { UpdateProfileDto } from './dto/update-profile.dto.js';
  import { SessionAuthGuard } from '../auth/guards/session-auth.guard.js';
  
  @Controller('user')
  export class UserController {
    constructor(
      private readonly userService: UserService,
    ) {}
  
    @Patch('profile')
    @UseGuards(SessionAuthGuard)
    async updateProfile(
      @Req() request: Request,
      @Body() body: UpdateProfileDto,
    ) {
      const user = await this.userService.updateProfile(
        request.user!.id,
        body,
      );
  
      return {
        user,
      };
    }
  }