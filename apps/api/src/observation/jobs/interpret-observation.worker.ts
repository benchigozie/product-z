import { Injectable } from '@nestjs/common';

import type { InterpretObservationJob } from './interpret-observation.job.js';
import { ObservationRepository } from '../observation.repository.js';
import { ObservationInterpretationService } from '../../intelligence/interpretation/observation-interpretation.service.js';
import { IntelligenceService } from '../../intelligence/intelligence.service.js';

@Injectable()
export class InterpretObservationWorker {
    constructor(
        private readonly observationRepository: ObservationRepository,
        private readonly observationInterpretationService: ObservationInterpretationService,
        private readonly intelligenceService: IntelligenceService,
    ) {}

    async process(
        job: InterpretObservationJob,
    ): Promise<void> {
        const observation =
            await this.observationRepository.findById(
                job.observationId,
            );
    
        if (!observation) {
            return;
        }
    
        const interpretation =
            await this.observationInterpretationService.interpret(
                observation,
            );
    
        await this.observationRepository.updateInterpretation(
            observation.id,
            interpretation,
        );
    
        if (observation.propertyId) {
            await this.intelligenceService.recompute({
                type: 'PROPERTY',
                propertyId: observation.propertyId,
            });
        } else if (observation.placeId) {
            await this.intelligenceService.recompute({
                type: 'PLACE',
                placeId: observation.placeId,
            });
        }
    }
}