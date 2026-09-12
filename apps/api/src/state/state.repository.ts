import { Injectable } from '@nestjs/common';
import type { StateResult } from './types/state-result.type.js';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class StateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const plan = this.prisma.db.sql.public.state
      .select(
        'id',
        'name',
        'code',
        'countryId',
      )
      .build();

    return this.prisma.db.runtime().query(plan);
  }

  async findById(id: string) : Promise<StateResult> {
    return this.prisma.db.orm.public.State.first({ id });
  }

  async findByCountryId(countryId: string) : Promise<StateResult[]> {
    return this.prisma.db.orm.public.State
      .where({ countryId })
      .all();
  }

}