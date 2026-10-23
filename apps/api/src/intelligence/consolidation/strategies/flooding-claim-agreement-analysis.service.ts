import { Injectable } from '@nestjs/common';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { FloodingClaimData } from '../types/flooding-claim-data.type.js';
import type { FloodingClaimAgreementAnalysis } from '../types/flooding-claim-agreement-analysis.type.js';
import { FloodingClaimAgreementService } from './flooding-claim-agreement.service.js';
import { FloodingClaimAgreementClassifier } from './flooding-claim-agreement.classifier.js';

@Injectable()
export class FloodingClaimAgreementAnalysisService {
    constructor(
        private readonly agreementService: FloodingClaimAgreementService,
        private readonly agreementClassifier: FloodingClaimAgreementClassifier,
    ) {}

    analyze(
        consolidatedEvidence: ConsolidatedEvidence[],
    ): FloodingClaimAgreementAnalysis[] {
        const floodingClaims = consolidatedEvidence.filter(
            (
                evidence,
            ): evidence is ConsolidatedEvidence<FloodingClaimData> =>
                evidence.category === ObservationCategory.FLOODING,
        );

        const results: FloodingClaimAgreementAnalysis[] = [];

        for (let i = 0; i < floodingClaims.length; i++) {
            for (let j = i + 1; j < floodingClaims.length; j++) {
                const firstClaim = floodingClaims[i]!;
                const secondClaim = floodingClaims[j]!;

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
                    occurrenceDifference: agreement.occurrenceDifference,
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