import { Injectable } from '@nestjs/common';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { RoadAccessClaimData } from '../types/road-access-claim-data.type.js';
import type { RoadAccessClaimAgreementAnalysis } from '../types/road-access-claim-agreement-analysis.type.js';
import { RoadAccessClaimAgreementService } from './road-access-claim-agreement.service.js';
import { RoadAccessClaimAgreementClassifier } from './road-access-claim-agreement.classifier.js';

@Injectable()
export class RoadAccessClaimAgreementAnalysisService {
    constructor(
        private readonly agreementService: RoadAccessClaimAgreementService,
        private readonly agreementClassifier: RoadAccessClaimAgreementClassifier,
    ) {}

    analyze(
        consolidatedEvidence: ConsolidatedEvidence[],
    ): RoadAccessClaimAgreementAnalysis[] {
        const claims = consolidatedEvidence.filter(
            (
                evidence,
            ): evidence is ConsolidatedEvidence<RoadAccessClaimData> =>
                evidence.category === ObservationCategory.ROAD_ACCESS,
        );

        const results: RoadAccessClaimAgreementAnalysis[] = [];

        for (let i = 0; i < claims.length; i++) {
            for (let j = i + 1; j < claims.length; j++) {
                const firstClaim = claims[i]!;
                const secondClaim = claims[j]!;

                const agreement = this.agreementService.compare(
                    firstClaim.claimData,
                    secondClaim.claimData,
                );

                const classification =
                    this.agreementClassifier.classify(agreement);

                const timeDifferenceInDays =
                    Math.abs(
                        secondClaim.lastObservedAt.getTime() -
                            firstClaim.lastObservedAt.getTime(),
                    ) /
                    (1000 * 60 * 60 * 24);

                results.push({
                    firstClaimId: firstClaim.id,
                    secondClaimId: secondClaim.id,
                    classification,
                    accessibilityDifference:
                        agreement.accessibilityDifference,
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