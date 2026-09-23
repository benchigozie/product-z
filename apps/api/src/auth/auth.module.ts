import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

import { UserModule } from '../user/user.module.js';
import { SessionModule } from '../session/session.module.js';
import { PasswordModule } from '../password/password.module.js';
import { SessionAuthGuard } from './guards/session-auth.guard.js';
import { GoogleStrategy } from './google.strategy.js';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [
    UserModule,
    SessionModule,
    PasswordModule,
    PassportModule,

  ],
  controllers: [AuthController],
  providers: [AuthService, SessionAuthGuard, GoogleStrategy],
  exports: [
    SessionAuthGuard,
  ],
})
export class AuthModule {}