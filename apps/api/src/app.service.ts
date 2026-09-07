import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello() {
    const plan = this.prisma.db.sql.public.property
      .select()
      .build();

    return this.prisma.db.runtime().query(plan);
  }
}