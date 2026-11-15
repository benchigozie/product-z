import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { UserPropertyRelationshipRepository } from '../user-property-relationship/user-property-relationship.repository.js';
import { UserPropertyRelationshipType } from '../user-property-relationship/enums/user-property-relationship-type.enum.js';
import { VerificationReportRepository } from './verification-report.repository.js';
import { VerificationReportStatus } from './enums/verification-report-status.enum.js';
import type { CreateVerificationReportDto } from './dto/create-verification-report.dto.js';
import type { UpdateVerificationReportStatusDto } from './dto/update-verification-report-status.dto.js';
import type { VerificationReportResult } from './types/verification-report-result.type.js';

const ALLOWED_VERIFIER_TYPES: UserPropertyRelationshipType[] = [
    UserPropertyRelationshipType.AGENT,
    UserPropertyRelationshipType.LANDLORD,
    UserPropertyRelationshipType.RESIDENT,
    UserPropertyRelationshipType.TENANT,
];

@Injectable()
export class VerificationReportService {
    constructor(
        private readonly verificationReportRepository: VerificationReportRepository,
        private readonly userPropertyRelationshipRepository: UserPropertyRelationshipRepository,
    ) { }

    async create(
        dto: CreateVerificationReportDto,
        verifierId: string,
    ): Promise<VerificationReportResult> {
        const relationships =
            await this.userPropertyRelationshipRepository.findByUserAndProperty(
                verifierId,
                dto.propertyId,
            );

            const hasAllowedRelationship = relationships.some((rel) =>
                ALLOWED_VERIFIER_TYPES.includes(
                    rel.relationshipType as UserPropertyRelationshipType,
                ),
            );

        if (!hasAllowedRelationship) {
            throw new ForbiddenException(
                'You must have a relationship to this property to request a verification report.',
            );
        }

        return this.verificationReportRepository.create({
            propertyId: dto.propertyId,
            verifierId,
        });
    }

    async findById(id: string): Promise<VerificationReportResult> {
        const report = await this.verificationReportRepository.findById(id);
    
        if (!report) {
            throw new NotFoundException(
                `Verification report "${id}" not found`,
            );
        }
    
        return report;
    }

    async findPublishedByPropertyId(
        propertyId: string,
    ): Promise<VerificationReportResult[]> {
        return this.verificationReportRepository.findByPropertyIdAndStatus(
            propertyId,
            VerificationReportStatus.PUBLISHED,
        );
    }

    async updateStatus(
        id: string,
        dto: UpdateVerificationReportStatusDto,
    ): Promise<VerificationReportResult> {
        const report = await this.findById(id);

        const next = dto.status;
        const current = report.status as VerificationReportStatus;

        if (!this.isValidTransition(current, next)) {
            throw new BadRequestException(
                `Invalid status transition: ${current} → ${next}`,
            );
        }

        return this.verificationReportRepository.updateStatus(id, next);
    }

    private isValidTransition(
        from: VerificationReportStatus,
        to: VerificationReportStatus,
    ): boolean {
        const transitions: Record<
            VerificationReportStatus,
            VerificationReportStatus[]
        > = {
            [VerificationReportStatus.REQUESTED]: [
                VerificationReportStatus.IN_PROGRESS,
                VerificationReportStatus.CANCELLED,
            ],
            [VerificationReportStatus.IN_PROGRESS]: [
                VerificationReportStatus.PENDING_REVIEW,
                VerificationReportStatus.CANCELLED,
            ],
            [VerificationReportStatus.PENDING_REVIEW]: [
                VerificationReportStatus.PUBLISHED,
                VerificationReportStatus.REJECTED,
            ],
            [VerificationReportStatus.PUBLISHED]: [],
            [VerificationReportStatus.REJECTED]: [],
            [VerificationReportStatus.CANCELLED]: [],
        };

        return transitions[from]?.includes(to) ?? false;
    }
}