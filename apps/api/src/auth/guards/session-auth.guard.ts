import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import type { Request } from 'express';
  
  import { SessionService } from '../../session/session.service.js';
  
  @Injectable()
  export class SessionAuthGuard implements CanActivate {
    constructor(
      private readonly sessionService: SessionService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
  
      const token = request.cookies?.session;
  
      if (!token) {
        throw new UnauthorizedException('Authentication required');
      }
  
      const session = await this.sessionService.validateSession(token);
  
      request.user = {
        id: session.userId,
      };
  
      return true;
    }
  }