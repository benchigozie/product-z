import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';

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
          'area',
          'city',
          'address',
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
          area: data.area,
          city: data.city,
          address: data.address,
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
        'area',
        'city',
        'address',
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
}