import { Injectable, Logger } from '@nestjs/common';

import type { InterpretObservationJob } from './interpret-observation.job.js';
import { ObservationRepository } from '../observation.repository.js';
import { ObservationInterpretationService } from '../../intelligence/interpretation/observation-interpretation.service.js';
import { IntelligenceRecomputeService } from '../../intelligence/queue/intelligence-recompute.service.js';
import { ObservationCategory } from '../enums/observation-category.enum.js';

@Injectable()
export class InterpretObservationWorker {
    private readonly logger = new Logger(InterpretObservationWorker.name);

    constructor(
        private readonly observationRepository: ObservationRepository,
        private readonly observationInterpretationService: ObservationInterpretationService,
        private readonly intelligenceRecomputeService: IntelligenceRecomputeService,
    ) {}

    async process(job: InterpretObservationJob): Promise<void> {
        const observation =
            await this.observationRepository.findById(job.observationId);
    
        if (!observation) {
            this.logger.warn(
                `Observation ${job.observationId} not found; skipping.`,
            );
            return;
        }
    
        // Interpretation is enrichment. If it fails, the pipeline can still
        // run on the raw observation. Log and continue.
        try {
            const interpretation =
                await this.observationInterpretationService.interpret(
                    observation,
                );
    
            await this.observationRepository.updateInterpretation(
                observation.id,
                interpretation,
            );
        } catch (error) {
            this.logger.error(
                `Interpretation failed for observation ${job.observationId}: ${
                    error instanceof Error ? error.message : String(error)
                }`,
            );
            // Do not rethrow — continue to intelligence recompute.
        }
    
        // Only recompute the category the observation belongs to.
        const category = observation.category as ObservationCategory;
        const supportedCategories = [
            ObservationCategory.POWER,
            ObservationCategory.WATER,
            ObservationCategory.FLOODING,
            ObservationCategory.SECURITY,
            ObservationCategory.INTERNET,
            ObservationCategory.SANITATION,
            ObservationCategory.ROAD_ACCESS,
            ObservationCategory.BUILDING_CONDITION,
        ];
    
        if (!supportedCategories.includes(category)) {
            this.logger.debug(
                `Category ${category} has no intelligence pipeline yet; skipping recompute.`,
            );
            return;
        }
    
        if (observation.propertyId) {
            await this.intelligenceRecomputeService.recompute({
                propertyId: observation.propertyId,
                category,
                reason: 'NEW_OBSERVATION',
            });
        } else if (observation.placeId) {
            await this.intelligenceRecomputeService.recompute({
                placeId: observation.placeId,
                category,
                reason: 'NEW_OBSERVATION',
            });
        }
    }
}