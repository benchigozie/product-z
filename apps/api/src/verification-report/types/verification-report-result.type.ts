import type { PrismaService } from '../../prisma.service.js';

export type VerificationReportResult = NonNullable<
    Awaited<
        ReturnType<
            PrismaService['db']['orm']['public']['VerificationReport']['first']
        >
    >
>;