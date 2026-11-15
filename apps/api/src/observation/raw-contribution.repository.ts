import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service.js';
import { ObservationCategory } from './enums/observation-category.enum.js';
import type { RawContribution } from './types/raw-contribution.type.js';

@Injectable()
export class RawContributionRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByPropertyId(
        propertyId: string,
    ): Promise<RawContribution[]> {
        const observations =
            await this.prisma.db.orm.public.Observation
                .where({
                    propertyId,
                    category: ObservationCategory.OTHER,
                })
                .all();

        if (observations.length === 0) {
            return [];
        }

        const userIds = observations
            .map((o) => o.userId)
            .filter((id): id is string => id !== null);

        const [relationships, users] = await Promise.all([
            userIds.length > 0
                ? this.prisma.db.orm.public.UserPropertyRelationship
                    .where((rel) => rel.propertyId.eq(propertyId))
                    .where((rel) => rel.userId.in(userIds))
                    .all()
                : Promise.resolve([]),
            userIds.length > 0
                ? this.prisma.db.orm.public.User
                    .where((u) => u.id.in(userIds))
                    .include('profile')
                    .all()
                : Promise.resolve([]),
        ]);

        const relationshipByUserId = new Map<string, string>();
        for (const rel of relationships) {
            relationshipByUserId.set(rel.userId, rel.relationshipType);
        }

        const displayNameByUserId = new Map<string, string | null>();
        for (const user of users) {
            const profile = user.profile as
                | { displayName?: string | null; username?: string | null }
                | null
                | undefined;
            const name =
                profile?.displayName ?? profile?.username ?? null;
            displayNameByUserId.set(user.id, name);
        }

        return observations
            .map((obs) => ({
                id: obs.id,
                text: obs.description ?? '',
                submittedAt: this.toIsoString(obs.observedAt),
                submitterId: obs.userId ?? null,
                submitterDisplayName: obs.userId
                    ? (displayNameByUserId.get(obs.userId) ?? null)
                    : null,
                submitterRelationship: obs.userId
                    ? (relationshipByUserId.get(obs.userId) ?? null)
                    : null,
            }))
            .filter((r) => r.text.length > 0)
            .sort(
                (a, b) =>
                    new Date(b.submittedAt).getTime() -
                    new Date(a.submittedAt).getTime(),
            );
    }

    private toIsoString(value: unknown): string {
        if (value instanceof Date) {
            return value.toISOString();
        }
        if (typeof value === 'string') {
            return new Date(value).toISOString();
        }
        if (value && typeof (value as any).toString === 'function') {
            return new Date(String(value)).toISOString();
        }
        return new Date().toISOString();
    }
}