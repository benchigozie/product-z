import { Module } from '@nestjs/common';

import { OpsController } from './ops.controller.js';
import { OpsService } from './ops.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { SessionModule } from '../session/session.module.js';
import { UserModule } from '../user/user.module.js';
import { PropertyModule } from '../property/property.module.js';

@Module({
  imports: [AuthModule, SessionModule, UserModule, PropertyModule],
  controllers: [OpsController],
  providers: [OpsService],
})
export class OpsModule {}