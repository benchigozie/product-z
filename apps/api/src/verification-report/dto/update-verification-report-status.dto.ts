import { IsEnum } from 'class-validator';

import { VerificationReportStatus } from '../enums/verification-report-status.enum.js';

export class UpdateVerificationReportStatusDto {
    @IsEnum(VerificationReportStatus)
    status!: VerificationReportStatus;
}