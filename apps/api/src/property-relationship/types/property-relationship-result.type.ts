import type { PrismaService } from '../../prisma.service.js';

export type PropertyRelationshipResult = Awaited<
  ReturnType<
    PrismaService['db']['orm']['public']['PropertyRelationship']['first']
  >
>;

export type PropertyRelationshipListResult =
  PropertyRelationshipResult[];