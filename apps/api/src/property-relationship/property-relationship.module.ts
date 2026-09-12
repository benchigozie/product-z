import { Module } from '@nestjs/common';

import { PropertyRelationshipController } from './property-relationship.controller.js';
import { PropertyRelationshipRepository } from './property-relationship.repository.js';
import { PropertyRelationshipService } from './property-relationship.service.js';

@Module({
  controllers: [PropertyRelationshipController],
  providers: [
    PropertyRelationshipRepository,
    PropertyRelationshipService,
  ],
  exports: [
    PropertyRelationshipRepository,
    PropertyRelationshipService,
  ],
})
export class PropertyRelationshipModule {}