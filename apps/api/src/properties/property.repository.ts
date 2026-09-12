
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import type { PropertyListResult, PropertyResult } from './types/property-result.type.js';

@Injectable()
export class PropertyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const plan = this.prisma.db.sql.public.property
      .select(
        'id',
        'name',
        'propertyType',
        'countryId',
        'stateId',
        'placeId',
        'address',
        'street',
        'houseNumber',
        'unitIdentifier',
        'landmark',
        'latitude',
        'longitude',
        'createdAt',
        'updatedAt',
      )
      .build();

    const result = await this.prisma.db.runtime().query(plan);

    console.log('FIND ALL RESULT:', result);

    return result;
  }

  async create(data: CreatePropertyDto) {
    const plan = this.prisma.db.sql.public.property
      .insert([
        {
          name: data.name,
          propertyType: data.propertyType,
          countryId: data.countryId,
          stateId: data.stateId,
          placeId: data.placeId,
          address: data.address,
          street: data.street,
          houseNumber: data.houseNumber,
          unitIdentifier: data.unitIdentifier,
          landmark: data.landmark,
          latitude: data.latitude,
          longitude: data.longitude,
        },
      ])
      .returning(
        'id',
        'name',
        'propertyType',
        'countryId',
        'stateId',
        'placeId',
        'address',
        'street',
        'houseNumber',
        'unitIdentifier',
        'landmark',
        'latitude',
        'longitude',
        'createdAt',
        'updatedAt',
      )
      .build();

    const result = await this.prisma.db.runtime().query(plan);

    return result;
  }

  async findById(id: string) : Promise<PropertyResult> {
    return this.prisma.db.orm.public.Property.first({ id });
  }

  async findByPlaceId(placeId: string) : Promise<PropertyListResult> {
    return this.prisma.db.orm.public.Property
      .where({ placeId })
      .all();
  }
}

