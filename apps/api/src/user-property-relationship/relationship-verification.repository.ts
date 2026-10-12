import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service.js';
import { RelationshipVerificationMethod } from './enums/relationship-verification-method.enum.js';
import { RelationshipVerificationStatus } from './enums/relationship-verification-status.enum.js';
import type { RelationshipVerificationResult } from './types/relationship-verification-result.type.js';

import type { RelationshipVerificationEvidence } from './dto/create-relationship-verification.dto.js';

@Injectable()
export class RelationshipVerificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    relationshipId: string,
    method: RelationshipVerificationMethod,
    evidence?: RelationshipVerificationEvidence,
  ) {
    const plan = this.prisma.db.sql.public.relationshipVerification
      .insert([
        {
          relationshipId,
          status: RelationshipVerificationStatus.PENDING,
          method,
          evidence,
        },
      ])
      .returning(
        'id',
        'relationshipId',
        'status',
        'method',
        'verifiedAt',
        'expiresAt',
        'reviewerId',
        'evidence',
        'createdAt',
        'updatedAt',
      )
      .build();

    const result = await this.prisma.db.runtime().query(plan);

    return result;
  }

  async findById(
    id: string,
  ): Promise<RelationshipVerificationResult | null> {
    return this.prisma.db.orm.public.RelationshipVerification.first({ id });
  }

  async findByRelationshipId(
    relationshipId: string,
  ): Promise<RelationshipVerificationResult[]> {
    return this.prisma.db.orm.public.RelationshipVerification
      .where({ relationshipId })
      .all();
  }
}