import type { PrismaService } from '../../prisma.service.js';

export type PropertyResult = Awaited<
  ReturnType<
    PrismaService['db']['orm']['public']['Property']['first']
  >
>;


export type PropertyListResult = PropertyResult[];