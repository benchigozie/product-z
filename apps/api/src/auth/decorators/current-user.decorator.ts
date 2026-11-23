import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export type SessionUser = {
  id: string;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SessionUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as SessionUser;
  },
);