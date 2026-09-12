import { Injectable } from '@nestjs/common';
import type { CountryResult } from './types/country-result.type.js';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class CountryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const plan = this.prisma.db.sql.public.country
      .select(
        'id',
        'name',
        'code',
      )
      .build();

    return this.prisma.db.runtime().query(plan);
  }

  async findById(id: string) : Promise<CountryResult> {
    return this.prisma.db.orm.public.Country.first({ id });
  }
}