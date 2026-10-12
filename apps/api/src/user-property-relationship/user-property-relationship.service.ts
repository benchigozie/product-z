import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PropertyRepository } from '../property/property.repository.js';
import { CreateUserPropertyRelationshipDto } from './dto/create-user-property-relationsjip.dto.js';
import { UserPropertyRelationshipRepository } from './user-property-relationship.repository.js';
import { Temporal } from '@js-temporal/polyfill';





@Injectable()
export class UserPropertyRelationshipService {
  constructor(
    private readonly relationshipRepository: UserPropertyRelationshipRepository,
    private readonly propertyRepository: PropertyRepository,
  ) { }

  async create(
    propertyId: string,
    userId: string,
    data: CreateUserPropertyRelationshipDto,
  ) {
    const property = await this.propertyRepository.findById(propertyId);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const existingRelationships =
      await this.relationshipRepository.findByUserPropertyAndType(
        userId,
        propertyId,
        data.relationshipType,
      );


    const newStartedAt = Temporal.Instant.from(data.startedAt);
    const newEndedAt = data.endedAt
      ? Temporal.Instant.from(data.endedAt)
      : null;

    const hasOverlap = existingRelationships.some((relationship) => {
      const existingStartedAt = Temporal.Instant.from(
        relationship.startedAt,
      );

     

      const existingEndedAt = relationship.endedAt
        ? Temporal.Instant.from(relationship.endedAt)
        : null;

        const newStartsBeforeExistingEnds =
        existingEndedAt === null ||
        newStartedAt.epochNanoseconds <= existingEndedAt.epochNanoseconds;
      
      const existingStartsBeforeNewEnds =
        newEndedAt === null ||
        existingStartedAt.epochNanoseconds <= newEndedAt.epochNanoseconds;

      return newStartsBeforeExistingEnds && existingStartsBeforeNewEnds;
    });

    if (hasOverlap) {
      throw new ConflictException(
        'An overlapping relationship of this type already exists for this property',
      );
    }

    return this.relationshipRepository.create(
      data,
      userId,
      propertyId,
    );
  }

  async findByPropertyId(propertyId: string) {
    const property = await this.propertyRepository.findById(propertyId);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return this.relationshipRepository.findByPropertyId(propertyId);
  }

  async findByUserId(userId: string) {
    return this.relationshipRepository.findByUserId(userId);
  }
}