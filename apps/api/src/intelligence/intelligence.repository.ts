import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service.js';

@Injectable()
export class IntelligenceRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByPropertyId(
        propertyId: string,
    ): Promise<Record<string, unknown> | null> {
        const row = await this.prisma.db.orm.public.Intelligence
            .where({ propertyId })
            .first();
        return row as unknown as Record<string, unknown> | null;
    }

    async findByPlaceId(
        placeId: string,
    ): Promise<Record<string, unknown> | null> {
        const row = await this.prisma.db.orm.public.Intelligence
            .where({ placeId })
            .first();
        return row as unknown as Record<string, unknown> | null;
    }
}