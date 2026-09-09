import { Injectable } from '@nestjs/common';
import { PropertyRepository } from './property.repository.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';

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
}