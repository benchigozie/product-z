import { Injectable } from '@nestjs/common';

import type { ObservationResult } from '../../observation/types/observation-result.type.js';
import type { ObservationInterpretation } from '../../observation/types/observation-interpretation.type.js';

@Injectable()
export class ObservationInterpretationService {
    async interpret(
        observation: ObservationResult,
    ): Promise<ObservationInterpretation> {
        throw new Error('Not implemented');
    }
}