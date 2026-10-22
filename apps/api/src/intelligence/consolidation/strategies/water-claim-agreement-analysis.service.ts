import { Injectable } from '@nestjs/common';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { WaterClaimData } from '../types/water-claim-data.type.js';
import type { WaterClaimAgreementAnalysis } from '../types/water-claim-agreement-analysis.type.js';
import { WaterClaimAgreementService } from './water-claim-agreement.service.js';
import { WaterClaimAgreementClassifier } from './water-claim-agreement.classifier.js';

@Injectable()
export class WaterClaimAgreementAnalysisService {
    constructor(
        private readonly agreementService: WaterClaimAgreementService,
        private readonly agreementClassifier: WaterClaimAgreementClassifier,
    ) {}

    analyze(
        consolidatedEvidence: ConsolidatedEvidence[],
    ): WaterClaimAgreementAnalysis[] {
        const waterClaims = consolidatedEvidence.filter(
            (
                evidence,
            ): evidence is ConsolidatedEvidence<WaterClaimData> =>
                evidence.category === ObservationCategory.WATER,
        );

        const results: WaterClaimAgreementAnalysis[] = [];

        for (let i = 0; i < waterClaims.length; i++) {
            for (let j = i + 1; j < waterClaims.length; j++) {
                const firstClaim = waterClaims[i]!;
                const secondClaim = waterClaims[j]!;

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