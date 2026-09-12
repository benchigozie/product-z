import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service.js';
import { CreatePlaceDto } from './dto/create-place.dto.js';

import type { PlaceResult } from './types/place-result.type.js';

@Injectable()
export class PlaceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const plan = this.prisma.db.sql.public.place
      .select(
        'id',
        'name',
        'type',
        'stateId',
        'parentPlaceId',
        'latitude',
        'longitude',
        'createdAt',
        'updatedAt',
      )
      .build();

    const result = await this.prisma.db.runtime().query(plan);

    return result;
  }

  async create(data: CreatePlaceDto) {
    const plan = this.prisma.db.sql.public.place
      .insert([
        {
          name: data.name,
          type: data.type,
          stateId: data.stateId,
          parentPlaceId: data.parentPlaceId,
          latitude: data.latitude,
          longitude: data.longitude,
        },
      ])
      .returning(
        'id',
        'name',
        'type',
        'stateId',
        'parentPlaceId',
        'latitude',
        'longitude',
        'createdAt',
        'updatedAt',
      )
      .build();

    const result = await this.prisma.db.runtime().query(plan);

    return result;
  }

  async findById(id: string): Promise<PlaceResult> {
    return this.prisma.db.orm.public.Place.first({ id });
  }
}