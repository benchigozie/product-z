import type { PrismaService } from '../../prisma.service.js';

export type ObservationResult = Awaited<
  ReturnType<
    PrismaService['db']['orm']['public']['Observation']['first']
  >
>;

export type ObservationListResult = ObservationResult[];