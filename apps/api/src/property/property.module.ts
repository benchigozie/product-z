import { Module } from '@nestjs/common';

import { PropertyController } from './property.controller.js';
import { PropertyIntelligenceController } from './intelligence.controller.js';
import { PropertyRepository } from './property.repository.js';
import { PropertyService } from './property.service.js';
import { PropertyIntelligenceService } from './intelligence.service.js';
import { IntelligenceModule } from '../intelligence/intelligence.module.js';
import { ObservationModule } from '../observation/observation.module.js';



@Module({
    imports: [IntelligenceModule, ObservationModule],
    controllers: [
        PropertyIntelligenceController,
        PropertyController,
    ],
    providers: [
        PropertyRepository,
        PropertyService,
        PropertyIntelligenceService,
    ],
    exports: [
        PropertyRepository,
        PropertyService,
    ],
})
export class PropertyModule {}