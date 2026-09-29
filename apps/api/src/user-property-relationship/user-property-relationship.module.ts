import { Module } from '@nestjs/common';

import { PropertyModule } from '../property/property.module.js';
import { UserPropertyRelationshipController } from './user-property-relationship.controller.js';
import { UserPropertyRelationshipRepository } from './user-property-relationship..repository.js';
import { UserPropertyRelationshipService } from './user-property-relationship.service.js';
import { SessionModule } from '../session/session.module.js';
import { UserPropertyRelationshipUserController } from './user-property-relationship-user.controller.js';

@Module({
  imports: [PropertyModule, SessionModule],
  controllers: [
    UserPropertyRelationshipController,
    UserPropertyRelationshipUserController
  ],
  providers: [
    UserPropertyRelationshipRepository,
    UserPropertyRelationshipService,
  ],
  exports: [
    UserPropertyRelationshipService,
  ],
})
export class UserPropertyRelationshipModule {}