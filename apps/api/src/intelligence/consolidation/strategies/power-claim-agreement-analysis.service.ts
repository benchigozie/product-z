import { Injectable } from '@nestjs/common';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { PowerClaimData } from '../types/power-claim-data.type.js';
import type { PowerClaimAgreementAnalysis } from '../types/power-claim-agreement-analysis.type.js';
import { PowerClaimAgreementService } from './power-claim-agreement.service.js';
import { PowerClaimAgreementClassifier } from './power-claim-agreement.classifier.js';

@Injectable()
export class PowerClaimAgreementAnalysisService {
    constructor(
        private readonly agreementService: PowerClaimAgreementService,
        private readonly agreementClassifier: PowerClaimAgreementClassifier,
    ) {}

    analyze(
        consolidatedEvidence: ConsolidatedEvidence[],
    ): PowerClaimAgreementAnalysis[] {
        const powerClaims = consolidatedEvidence.filter(
            (
                evidence,
            ): evidence is ConsolidatedEvidence<PowerClaimData> =>
                evidence.category === ObservationCategory.POWER,
        );

        const results: PowerClaimAgreementAnalysis[] = [];

        for (let i = 0; i < powerClaims.length; i++) {
            for (let j = i + 1; j < powerClaims.length; j++) {
                const firstClaim = powerClaims[i]!;
                const secondClaim = powerClaims[j]!;

                const agreement = this.agreementService.compare(
                    firstClaim.claimData,
                    secondClaim.claimData,
                );

                const classification =
                    this.agreementClassifier.classify(agreement);

                const timeDifferenceInDays = Math.abs(
                    secondClaim.lastObservedAt.getTime() -
                    firstClaim.lastObservedAt.getTime(),
                ) / (1000 * 60 * 60 * 24);

                results.push({
                    firstClaimId: firstClaim.id,
                    secondClaimId: secondClaim.id,
                    classification,
                    availabilityDifference: agreement.availabilityDifference,
                    sharedObservationIds: firstClaim.observationIds.filter(
                        (id) => secondClaim.observationIds.includes(id),
                    ),
                    firstObservationIds: firstClaim.observationIds,
                    secondObservationIds: secondClaim.observationIds,
                    timeDifferenceInDays,
                });
            }
        }

        return results;
    }
}