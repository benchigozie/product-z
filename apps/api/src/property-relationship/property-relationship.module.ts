import { Module } from '@nestjs/common';

import { PropertyRelationshipController } from './property-relationship.controller.js';
import { PropertyRelationshipRepository } from './property-relationship.repository.js';
import { PropertyRelationshipService } from './property-relationship.service.js';
import { PropertyModule } from '../property/property.module.js';

@Module({
  imports: [PropertyModule],
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