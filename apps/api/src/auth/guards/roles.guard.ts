import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import type { Request } from 'express';
  
  import { ROLES_KEY, type UserRole } from '../decorators/roles.decorator.js';
  import { UserService } from '../../user/user.service.js';
  
  type SessionUser = { id: string };
  
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(
      private readonly reflector: Reflector,
      private readonly userService: UserService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
  
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest<Request>();
      const user = request.user as SessionUser | undefined;
  
      if (!user?.id) {
        throw new ForbiddenException('Authentication required');
      }
  
      const dbUser = await this.userService.findById(user.id);
  
      if (!dbUser) {
        throw new ForbiddenException('User not found');
      }
  
      if (!requiredRoles.includes(dbUser.role as UserRole)) {
        throw new ForbiddenException('Insufficient permissions');
      }
  
      return true;
    }
  }