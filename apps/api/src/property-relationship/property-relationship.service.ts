import {
  Injectable,
  NotFoundException,
  ConflictException
} from '@nestjs/common';

import { CreatePropertyRelationshipDto } from './dto/create-property-relationship.dto.js';
import { PropertyRelationshipRepository } from './property-relationship.repository.js';
import { PropertyRepository } from '../property/property.repository.js';

@Injectable()
export class PropertyRelationshipService {
  constructor(
    private readonly propertyRelationshipRepository: PropertyRelationshipRepository,
    private readonly propertyRepository: PropertyRepository,
  ) { }

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


    const child = await this.propertyRepository.findById(
      data.childPropertyId,
    );

    if (!child) {
      throw new NotFoundException(
        `Child property not found`,
      );
    }

    try {
      return await this.propertyRelationshipRepository.create(data);
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'sqlState' in error &&
        error.sqlState === '23505'
      ) {
        throw new ConflictException(
          'This property already has a parent relationship.',
        );
      }

      throw error;
    }
  }
}