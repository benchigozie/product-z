import { Injectable } from '@nestjs/common';

import { AvailabilityAgreementService } from './evidence/availability-agreement.service.js';
import type { PowerData } from '../observation/types/power/power-data.type.js';
import type { AgreementResult } from './evidence/agreement-result.type.js';

@Injectable()
export class PowerAgreementService {
    constructor(
        private readonly core: AvailabilityAgreementService,
    ) {}

    compare(first: PowerData, second: PowerData): AgreementResult {
        return this.core.compare(first, second);
    }
}

