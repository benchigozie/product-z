import { Injectable, NotFoundException } from '@nestjs/common';

import { IntelligenceRepository } from '../intelligence/intelligence.repository.js';

@Injectable()
export class PropertyIntelligenceService {
    constructor(
        private readonly intelligenceRepository: IntelligenceRepository,
    ) {}

    async findByPropertyId(propertyId: string) {
        const intelligence =
            await this.intelligenceRepository.findByPropertyId(propertyId);

        if (!intelligence) {
            throw new NotFoundException(
                `Intelligence for property "${propertyId}" not found.`,
            );
        }

        return {
            propertyId,
            categories: intelligence.categories,
            summary: intelligence.overall,
            computedAt: intelligence.computedAt,
            evidenceThrough: intelligence.evidenceThrough,
        };
    }
}