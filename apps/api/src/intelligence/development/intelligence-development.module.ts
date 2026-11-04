import { Module } from '@nestjs/common';

import { IntelligenceModule } from '../intelligence.module.js';
import { EvidenceWeightingService } from '../evidence/evidence-weighting.service.js';
import { PowerIntelligenceRunner } from './power-intelligence.runner.js';
import { PowerIntelligenceDevelopmentController } from './power-intelligence-development.controller.js';
import { WaterIntelligenceRunner } from './water-intelligence.runner.js';
import { WaterIntelligenceDevelopmentController } from './water-intelligence-development.controller.js';
import { FloodingIntelligenceRunner } from './flooding-intelligence.runner.js';
import { FloodingIntelligenceDevelopmentController } from './flooding-intelligence-development.controller.js';
import { PrismaModule } from '../../prisma.module.js';
import { SecurityIntelligenceRunner } from './security-intelligence.runner.js';
import { SecurityIntelligenceDevelopmentController } from './security-intelligence-development.controller.js';
import { InternetIntelligenceRunner } from './internet-intelligence.runner.js';
import { InternetIntelligenceDevelopmentController } from './internet-intelligence-development.controller.js';


@Module({
    imports: [
        IntelligenceModule,
        PrismaModule,
    ],
    controllers: [
        PowerIntelligenceDevelopmentController,
        WaterIntelligenceDevelopmentController,
        FloodingIntelligenceDevelopmentController,
        SecurityIntelligenceDevelopmentController,
        InternetIntelligenceDevelopmentController,
    ],
    providers: [
        PowerIntelligenceRunner,
        WaterIntelligenceRunner,
        FloodingIntelligenceRunner,
        EvidenceWeightingService,
        SecurityIntelligenceRunner,
        InternetIntelligenceRunner,

    ],
    exports: [
        PowerIntelligenceRunner,
        WaterIntelligenceRunner,
        FloodingIntelligenceRunner,
        SecurityIntelligenceRunner,
        InternetIntelligenceRunner,
    ],
})
export class IntelligenceDevelopmentModule {}