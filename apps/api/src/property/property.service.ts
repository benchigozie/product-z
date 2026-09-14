import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyRepository } from './property.repository.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import type { PropertyResult } from './types/property-result.type.js';

@Injectable()
export class PropertyService {
  constructor(
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async findAll() {
    return this.propertyRepository.findAll();
  }

  async create(data: CreatePropertyDto ) {
    return this.propertyRepository.create(data);
  }

  async findById(id: string) : Promise<PropertyResult> {
    const property = await this.propertyRepository.findById(id);

    if (!property) {
      throw new NotFoundException(`Property not found`);
    }

    return property;
  }

  async findByPlaceId(placeId: string) {

    const property = this.propertyRepository.findByPlaceId(placeId);

    if (!property) {
      throw new NotFoundException(`Property not found`);
    }

    return property;
  }
}