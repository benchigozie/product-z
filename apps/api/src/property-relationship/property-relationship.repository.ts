import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service.js';
import { CreatePropertyRelationshipDto } from './dto/create-property-relationship.dto.js';

@Injectable()
export class PropertyRelationshipRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const plan = this.prisma.db.sql.public.propertyRelationship
      .select(
        'id',
        'parentPropertyId',
        'childPropertyId',
        'relationshipType',
        'createdAt',
      )
      .build();

    return this.prisma.db.runtime().query(plan);
  }

  async create(data: CreatePropertyRelationshipDto) {
    const plan = this.prisma.db.sql.public.propertyRelationship
      .insert([
        {
          parentPropertyId: data.parentPropertyId,
          childPropertyId: data.childPropertyId,
          relationshipType: data.relationshipType,
        },
      ])
      .returning(
        'id',
        'parentPropertyId',
        'childPropertyId',
        'relationshipType',
        'createdAt',
      )
      .build();

    return this.prisma.db.runtime().query(plan);
  }
}