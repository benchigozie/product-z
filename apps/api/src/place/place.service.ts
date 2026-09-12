import { Injectable } from '@nestjs/common';

import { CreatePlaceDto } from './dto/create-place.dto.js';
import type { PlaceResult } from './types/place-result.type.js';
import { PlaceRepository } from './place.repository.js';

@Injectable()
export class PlaceService {
  constructor(
    private readonly placeRepository: PlaceRepository,
  ) {}

  async findAll() {
    return this.placeRepository.findAll();
  }

  async create(data: CreatePlaceDto) {
    return this.placeRepository.create(data);
  }

  async findById(id: string): Promise<PlaceResult> {
    return this.placeRepository.findById(id);
  }
}