import { Injectable } from '@nestjs/common';

import { AvailabilityAgreementService } from './availability-agreement.service.js';
import type { WaterData } from '../../observation/types/water/water-data.type.js';
import type { AgreementResult } from './agreement-result.type.js';

@Injectable()
export class WaterAgreementService {
    constructor(
        private readonly core: AvailabilityAgreementService,
    ) {}

    compare(first: WaterData, second: WaterData): AgreementResult {
        return this.core.compare(first, second);
    }
}