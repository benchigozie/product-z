import { Injectable } from '@nestjs/common';

import { CreatePropertyRelationshipDto } from './dto/create-property-relationship.dto.js';
import { PropertyRelationshipRepository } from './property-relationship.repository.js';

@Injectable()
export class PropertyRelationshipService {
  constructor(
    private readonly propertyRelationshipRepository: PropertyRelationshipRepository,
  ) {}

  async findAll() {
    return this.propertyRelationshipRepository.findAll();
  }

  async create(data: CreatePropertyRelationshipDto) {
    return this.propertyRelationshipRepository.create(data);
  }
}