import { Injectable, NotFoundException } from '@nestjs/common';

import { CreatePropertyRelationshipDto } from './dto/create-property-relationship.dto.js';
import { PropertyRelationshipRepository } from './property-relationship.repository.js';
import { PropertyRepository } from '../property/property.repository.js';

@Injectable()
export class PropertyRelationshipService {
  constructor(
    private readonly propertyRelationshipRepository: PropertyRelationshipRepository,
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async findAll() {
    return this.propertyRelationshipRepository.findAll();
  }

  async create(data: CreatePropertyRelationshipDto) {

    const parent = await this.propertyRepository.findById(
      data.parentPropertyId,
    );
    
    if (!parent) {
      throw new NotFoundException(
        `Parent property not found`,
      );
    }

    console.log('PARENT LOOKUP:', parent);

    const child = await this.propertyRepository.findById(
      data.childPropertyId,
    );
    
    if (!child) {
      throw new NotFoundException(
        `Child property not found`,
      );
    }

    return this.propertyRelationshipRepository.create(data);
  }
}