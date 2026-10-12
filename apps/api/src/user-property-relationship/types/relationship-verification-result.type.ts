import type { PrismaService } from '../../prisma.service.js';

export type RelationshipVerificationResult = Awaited<
  ReturnType<
    PrismaService['db']['orm']['public']['RelationshipVerification']['first']
  >
>;

export type RelationshipVerificationListResult =
  RelationshipVerificationResult[];