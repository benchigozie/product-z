import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service.js';
import { CreateObservationDto } from './dto/create-observation.dto.js';

import type { PropertyResult } from '../property/types/property-result.type.js';
import type { PlaceResult } from '../place/types/place-result.type.js';
import { Temporal } from '@js-temporal/polyfill';
import type {
    ObservationListResult,
    ObservationResult,
  } from './types/observation-result.type.js';

type ObservationJsonValue =
  | string
  | number
  | boolean
  | null
  | ObservationJsonValue[]
  | { [key: string]: ObservationJsonValue };

@Injectable()
export class ObservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPropertyById(propertyId: string) : Promise<PropertyResult | null> {
    return this.prisma.db.orm.public.Property.first({
      id: propertyId,
    });
  }

  async findPlaceById(placeId: string) : Promise<PlaceResult | null> {
    return this.prisma.db.orm.public.Place.first({
      id: placeId,
    });
  }

  async create(data: CreateObservationDto) {
    const plan = this.prisma.db.sql.public.observation
      .insert([
        {
          category: data.category,
          propertyId: data.propertyId,
          placeId: data.placeId,
          data: data.data as ObservationJsonValue | undefined,
          description: data.description,
          observedAt: Temporal.Instant.from(data.observedAt),
        },
      ])
      .returning(
        'id',
        'category',
        'propertyId',
        'placeId',
        'data',
        'description',
        'observedAt',
        'createdAt',
        'updatedAt',
      )
      .build();

    const result = await this.prisma.db.runtime().query(plan);

    return result;
  }

  async findById(id: string): Promise<ObservationResult> {
    return this.prisma.db.orm.public.Observation.first({ id });
  }

  async findByPropertyId(
    propertyId: string,
  ): Promise<ObservationListResult> {
    return this.prisma.db.orm.public.Observation
      .where({ propertyId })
      .all();
  }

  async findByPlaceId(
    placeId: string,
  ): Promise<ObservationListResult> {
    return this.prisma.db.orm.public.Observation
      .where({ placeId })
      .all();
  }
}