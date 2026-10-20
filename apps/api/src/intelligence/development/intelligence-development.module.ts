import { Module } from '@nestjs/common';

import { IntelligenceModule } from '../intelligence.module.js';
import { EvidenceWeightingService } from '../evidence/evidence-weighting.service.js';
import { PowerIntelligenceRunner } from './power-intelligence.runner.js';
import { PowerIntelligenceDevelopmentController } from './power-intelligence-development.controller.js';
import { PrismaModule } from '../../prisma.module.js';

@Module({
    imports: [
        IntelligenceModule,
        PrismaModule,
    ],
    controllers: [
        PowerIntelligenceDevelopmentController,
    ],
    providers: [
        PowerIntelligenceRunner,
        EvidenceWeightingService,
    ],
    exports: [
        PowerIntelligenceRunner,
    ],
})
export class IntelligenceDevelopmentModule {}