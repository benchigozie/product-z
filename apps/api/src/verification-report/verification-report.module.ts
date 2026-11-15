import { Module } from '@nestjs/common';

import { VerificationReportController } from './verification-report.controller.js';
import { VerificationReportService } from './verification-report.service.js';
import { VerificationReportRepository } from './verification-report.repository.js';
import { UserPropertyRelationshipRepository } from '../user-property-relationship/user-property-relationship.repository.js';
import { UserPropertyRelationshipModule } from '../user-property-relationship/user-property-relationship.module.js';
import { SessionModule } from '../session/session.module.js';


@Module({
    controllers: [VerificationReportController],
    imports: [UserPropertyRelationshipModule, SessionModule],
    providers: [
        VerificationReportService,
        VerificationReportRepository,
        UserPropertyRelationshipRepository,
    ],
    exports: [
        VerificationReportService,
        VerificationReportRepository,
    ],
})
export class VerificationReportModule {}