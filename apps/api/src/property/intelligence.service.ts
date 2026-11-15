import { Injectable, NotFoundException } from '@nestjs/common';

import { IntelligenceRepository } from '../intelligence/intelligence.repository.js';
import { RawContributionRepository } from '../observation/raw-contribution.repository.js';
import type { RawContribution } from '../observation/types/raw-contribution.type.js';

@Injectable()
export class PropertyIntelligenceService {
    constructor(
        private readonly intelligenceRepository: IntelligenceRepository,
        private readonly rawContributionRepository: RawContributionRepository,
    ) {}

    async findByPropertyId(propertyId: string) {
        const intelligence =
            await this.intelligenceRepository.findByPropertyId(propertyId);

        if (!intelligence) {
            throw new NotFoundException(
                `Intelligence for property "${propertyId}" not found.`,
            );
        }

        const rawContributions: RawContribution[] =
            await this.rawContributionRepository.findByPropertyId(propertyId);

        return {
            propertyId,
            categories: intelligence.categories,
            summary: intelligence.overall,
            rawContributions,
            computedAt: intelligence.computedAt,
            evidenceThrough: intelligence.evidenceThrough,
        };
    }
}