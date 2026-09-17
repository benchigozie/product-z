import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

import { UserModule } from '../user/user.module.js';
import { SessionModule } from '../session/session.module.js';
import { PasswordModule } from '../password/password.module.js';
import { SessionAuthGuard } from './guards/session-auth.guard.js';

@Module({
  imports: [
    UserModule,
    SessionModule,
    PasswordModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, SessionAuthGuard],
  exports: [
    SessionAuthGuard,
  ],
})
export class AuthModule {}