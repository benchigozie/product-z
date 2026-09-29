import { Injectable } from '@nestjs/common';
import { Temporal } from '@js-temporal/polyfill';

import { PrismaService } from '../prisma.service.js';
import { CreateUserPropertyRelationshipDto } from './dto/create-user-property-relationsjip.dto.js';
import type {
  UserPropertyRelationshipListResult,
  UserPropertyRelationshipResult,
} from './types/user-property-relationship-result.type.js';

@Injectable()
export class UserPropertyRelationshipRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateUserPropertyRelationshipDto,
    userId: string,
    propertyId: string,
  ) {
    const plan = this.prisma.db.sql.public.userPropertyRelationship
      .insert([
        {
          userId,
          propertyId,
          relationshipType: data.relationshipType,
          startedAt: Temporal.Instant.from(data.startedAt),
          startedAtPrecision: data.startedAtPrecision,
          endedAt: data.endedAt
            ? Temporal.Instant.from(data.endedAt)
            : undefined,
          endedAtPrecision: data.endedAtPrecision,
        },
      ])
      .returning(
        'id',
        'userId',
        'propertyId',
        'relationshipType',
        'startedAt',
        'startedAtPrecision',
        'endedAt',
        'endedAtPrecision',
        'createdAt',
        'updatedAt',
      )
      .build();

    const result = await this.prisma.db.runtime().query(plan);

    return result;
  }

  async findById(
    id: string,
  ): Promise<UserPropertyRelationshipResult | null> {
    return this.prisma.db.orm.public.UserPropertyRelationship.first({ id });
  }

  async findByUserId(
    userId: string,
  ): Promise<UserPropertyRelationshipListResult> {
    return this.prisma.db.orm.public.UserPropertyRelationship
      .where({ userId })
      .all();
  }

  async findByPropertyId(
    propertyId: string,
  ): Promise<UserPropertyRelationshipListResult> {
    return this.prisma.db.orm.public.UserPropertyRelationship
      .where({ propertyId })
      .all();
  }
}