import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { CreatePropertyRelationshipDto } from './dto/create-property-relationship.dto.js';
import { PropertyRelationshipRepository } from './property-relationship.repository.js';
import { PropertyRepository } from '../property/property.repository.js';
import { PropertyService } from '../property/property.service.js';
import { canContainPropertyType } from '../property/property-types.js';

@Injectable()
export class PropertyRelationshipService {
  constructor(
    private readonly propertyRelationshipRepository: PropertyRelationshipRepository,
    private readonly propertyRepository: PropertyRepository,
    private readonly propertyService: PropertyService,
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


    if (parent.id === child.id) {
      throw new BadRequestException(
        'A property cannot contain itself.',
      );
    }

    if (!canContainPropertyType(
      parent.propertyType,
      child.propertyType,
    )) {
      throw new BadRequestException(
        `A ${parent.propertyType} cannot contain a ${child.propertyType}.`,
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

  async findParentWithProperty(propertyId: string) {
    await this.propertyService.findById(propertyId);

    return this.propertyRelationshipRepository.findParentWithProperty(
      propertyId,
    );
  }

  async findChildrenWithProperties(propertyId: string) {
    await this.propertyService.findById(propertyId);

    return this.propertyRelationshipRepository.findChildrenWithProperties(
      propertyId,
    );
  }
}