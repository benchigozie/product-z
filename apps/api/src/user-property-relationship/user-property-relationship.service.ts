import { Injectable, NotFoundException } from '@nestjs/common';

import { PropertyRepository } from '../property/property.repository.js';
import { CreateUserPropertyRelationshipDto } from './dto/create-user-property-relationsjip.dto.js';
import { UserPropertyRelationshipRepository } from './user-property-relationship..repository.js';

@Injectable()
export class UserPropertyRelationshipService {
  constructor(
    private readonly relationshipRepository: UserPropertyRelationshipRepository,
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async create(
    propertyId: string,
    userId: string,
    data: CreateUserPropertyRelationshipDto,
  ) {
    const property = await this.propertyRepository.findById(propertyId);

    if (!property) {
      throw new NotFoundException('Property not found');
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