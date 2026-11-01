import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma.module.js';
import { SessionModule } from '../../session/session.module.js';
import { IntelligenceQueueModule } from '../queue/intelligence-queue.module.js';
import { IntelligenceAdminController } from './intelligence-admin.controller.js';
import { IntelligenceAdminService } from './intelligence-admin.service.js';

@Module({
    imports: [
        PrismaModule,
        SessionModule,
        IntelligenceQueueModule,
    ],
    controllers: [
        IntelligenceAdminController,
    ],
    providers: [
        IntelligenceAdminService,
    ],
})
export class IntelligenceAdminModule {}