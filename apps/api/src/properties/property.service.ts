import { Injectable } from '@nestjs/common';
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
    return this.propertyRepository.findById(id);
  }

  async findByPlaceId(placeId: string) {
    return this.propertyRepository.findByPlaceId(placeId);
  }
}