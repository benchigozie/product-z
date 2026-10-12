import { Injectable, NotFoundException } from '@nestjs/common';

import { UserPropertyRelationshipRepository } from './user-property-relationship.repository.js';
import { RelationshipVerificationRepository } from './relationship-verification.repository.js';
import type { CreateRelationshipVerificationDto } from './dto/create-relationship-verification.dto.js';
import type {
  RelationshipVerificationListResult,
  RelationshipVerificationResult,
} from './types/relationship-verification-result.type.js';

@Injectable()
export class RelationshipVerificationService {
  constructor(
    private readonly verificationRepository: RelationshipVerificationRepository,
    private readonly relationshipRepository: UserPropertyRelationshipRepository,
  ) {}

  async create(
    relationshipId: string,
    data: CreateRelationshipVerificationDto,
  ) {
    const relationship =
      await this.relationshipRepository.findById(relationshipId);

    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }

    return this.verificationRepository.create(
      relationshipId,
      data.method,
      data.evidence,
    );
  }

  async findById(
    id: string,
  ): Promise<RelationshipVerificationResult | null> {
    return this.verificationRepository.findById(id);
  }

  async findByRelationshipId(
    relationshipId: string,
  ): Promise<RelationshipVerificationListResult> {
    const relationship =
      await this.relationshipRepository.findById(relationshipId);

    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }

    return this.verificationRepository.findByRelationshipId(
      relationshipId,
    );
  }
}