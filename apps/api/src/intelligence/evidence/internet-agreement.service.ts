import { Injectable } from '@nestjs/common';

import { AvailabilityAgreementService } from './availability-agreement.service.js';
import type { InternetData } from '../../observation/types/internet/internet-data.type.js';
import type { AgreementResult } from './agreement-result.type.js';

@Injectable()
export class InternetAgreementService {
    constructor(
        private readonly core: AvailabilityAgreementService,
    ) {}

    compare(first: InternetData, second: InternetData): AgreementResult {
        return this.core.compare(first, second);
    }
}