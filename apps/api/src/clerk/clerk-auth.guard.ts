import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import type { Request } from 'express';
  
  import { clerkClient } from './clerk.client.js';
  
  @Injectable()
  export class ClerkAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
  
      const requestState = await clerkClient.authenticateRequest(
        new Request(`http://${request.get('host')}${request.originalUrl}`, {
          method: request.method,
          headers: new Headers(
            Object.fromEntries(
              Object.entries(request.headers)
                .filter(([, value]) => typeof value === 'string')
                .map(([key, value]) => [key, value as string]),
            ),
          ),
        }),
        {
            authorizedParties: [process.env.CLERK_AUTHORIZED_PARTIES!],
        },
      );
  
      if (!requestState.isAuthenticated) {
        throw new UnauthorizedException();
      }
  
      request.auth = requestState.toAuth();
  
      return true;
    }
  }