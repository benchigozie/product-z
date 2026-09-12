import type { PrismaService } from '../../prisma.service.js';

export type CountryResult = Awaited<
  ReturnType<
    PrismaService['db']['orm']['public']['Country']['first']
  >
>;