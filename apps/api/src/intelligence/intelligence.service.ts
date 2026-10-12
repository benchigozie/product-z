import { Injectable } from '@nestjs/common';

import { ObservationRepository } from '../observation/observation.repository.js';
import { EvidenceAnalysisService } from './evidence/evidence-analysis.service.js';
import type { IntelligenceTarget } from './types/intelligence-target.type.js';
import type { EvidenceAnalysisResult } from './evidence/types/evidence-analysis-result.type.js';

@Injectable()
export class IntelligenceService {
    constructor(
        private readonly observationRepository: ObservationRepository,
        private readonly evidenceAnalysisService: EvidenceAnalysisService,
    ) {}

    async recompute(
        target: IntelligenceTarget,
    ): Promise<EvidenceAnalysisResult>{
        let observations;

        if (target.type === 'PROPERTY') {
            observations =
                await this.observationRepository.findByPropertyIds([
                    target.propertyId,
                ]);
        } else {
            observations =
                await this.observationRepository.findByPlaceId(
                    target.placeId,
                );
        }

        const analysis =
    await this.evidenceAnalysisService.analyze(observations);

return analysis;
    }
}