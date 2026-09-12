import type { PrismaService } from '../../prisma.service.js';

export type StateResult = Awaited<
  ReturnType<
    PrismaService['db']['orm']['public']['State']['first']
  >
>;

export type StateListResult = StateResult[];