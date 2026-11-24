import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

import { UserModule } from '../user/user.module.js';
import { SessionModule } from '../session/session.module.js';
import { PasswordModule } from '../password/password.module.js';
import { SessionAuthGuard } from './guards/session-auth.guard.js';
import { GoogleStrategy } from './google.strategy.js';
import { PassportModule } from '@nestjs/passport';
import { UserPropertyRelationshipModule } from '../user-property-relationship/user-property-relationship.module.js';
import { RolesGuard } from './guards/roles.guard.js';
import { UserService } from '../user/user.service.js';

@Module({
  imports: [
    UserModule,
    SessionModule,
    PasswordModule,
    PassportModule,
    UserPropertyRelationshipModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, SessionAuthGuard, GoogleStrategy, RolesGuard],
  exports: [
    SessionAuthGuard,
    RolesGuard,
    UserModule,
   
  ],
})
export class AuthModule {}