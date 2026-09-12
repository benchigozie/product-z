import type { PrismaService } from '../../prisma.service.js';

export type PlaceResult = Awaited<
  ReturnType<
    PrismaService['db']['orm']['public']['Place']['first']
  >
>;