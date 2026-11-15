import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service.js';
import { VerificationReportStatus } from './enums/verification-report-status.enum.js';
import type { VerificationReportResult } from './types/verification-report-result.type.js';

@Injectable()
export class VerificationReportRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: {
        propertyId: string;
        verifierId: string;
    }): Promise<VerificationReportResult> {
        const plan = this.prisma.db.sql.public.verificationReport
            .insert([
                {
                    propertyId: data.propertyId,
                    verifierId: data.verifierId,
                },
            ])
            .returning(
                'id',
                'propertyId',
                'verifierId',
                'scope',
                'status',
                'recordingUrl',
                'recordingStartedAt',
                'recordingEndedAt',
                'recordingDurationSeconds',
                'latitude',
                'longitude',
                'reviewerId',
                'reviewNotes',
                'reviewedAt',
                'requestedAt',
                'publishedAt',
                'createdAt',
                'updatedAt',
            )
            .build();

        const [report] = await this.prisma.db.runtime().query(plan);

        if (!report) {
            throw new Error('Failed to create verification report');
        }

        return report;
    }

    async findById(id: string): Promise<VerificationReportResult | null> {
        return this.prisma.db.orm.public.VerificationReport.first({ id });
    }
    async findByPropertyId(
        propertyId: string,
    ): Promise<VerificationReportResult[]> {
        return this.prisma.db.orm.public.VerificationReport
            .where({ propertyId })
            .all();
    }

    async findByPropertyIdAndStatus(
        propertyId: string,
        status: VerificationReportStatus,
    ): Promise<VerificationReportResult[]> {
        return this.prisma.db.orm.public.VerificationReport
            .where({ propertyId })
            .where({ status })
            .all();
    }

    async updateStatus(
        id: string,
        status: VerificationReportStatus,
    ): Promise<VerificationReportResult> {
        const updated = await this.prisma.db.orm.public.VerificationReport
            .where({ id })
            .update({ status });
    
        if (!updated) {
            throw new Error(
                `Verification report "${id}" not found during update`,
            );
        }
    
        return updated;
    }
}