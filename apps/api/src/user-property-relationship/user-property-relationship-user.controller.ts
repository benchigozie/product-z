import {
    Controller,
    Get,
    Req,
    UseGuards,
  } from '@nestjs/common';
  
  import type { Request } from 'express';
  
  import { SessionAuthGuard } from '../auth/guards/session-auth.guard.js';
  import { UserPropertyRelationshipService } from './user-property-relationship.service.js';
  
  @Controller('user/relationships')
  @UseGuards(SessionAuthGuard)
  export class UserPropertyRelationshipUserController {
    constructor(
      private readonly relationshipService: UserPropertyRelationshipService,
    ) {}
  
    @Get()
    async findMyRelationships(
      @Req() request: Request,
    ) {
      return this.relationshipService.findByUserId(
        request.user!.id,
      );
    }
  }