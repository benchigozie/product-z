import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service.js';
import { CreatePropertyRelationshipDto } from './dto/create-property-relationship.dto.js';
import type {
  PropertyRelationshipListResult,
  PropertyRelationshipResult,
} from './types/property-relationship-result.type.js';

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

  async findParentWithProperty(propertyId: string) {
    return this.prisma.db.orm.public.PropertyRelationship
      .where({ childPropertyId: propertyId })
      .include('parentProperty')
      .first();
  }

  async findChildrenWithProperties(propertyId: string) {
    return this.prisma.db.orm.public.PropertyRelationship
      .where({ parentPropertyId: propertyId })
      .include('childProperty')
      .all();
  }

}