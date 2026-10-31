import { Injectable, Logger } from '@nestjs/common';

import type { ObservationResult } from '../../observation/types/observation-result.type.js';
import type { ObservationInterpretation } from '../../observation/types/observation-interpretation.type.js';

@Injectable()
export class ObservationInterpretationService {
    private readonly logger = new Logger(
        ObservationInterpretationService.name,
    );

    async interpret(
        observation: ObservationResult,
    ): Promise<ObservationInterpretation> {
        // TODO: AI interpretation of observations is not implemented yet.
        // Returning an empty interpretation is valid — the intelligence
        // pipeline works from raw observation data, not interpretations.
        // When this is built, it should extract claims (structured facts
        // derived from the observation) and note uncertainties.
        this.logger.debug(
            `Interpretation not yet implemented; returning empty for observation ${observation?.id}`,
        );

        return {
            claims: [],
            uncertainties: [],
        };
    }
}