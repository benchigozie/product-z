import { Injectable } from '@nestjs/common';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { InternetClaimData } from '../types/internet-claim-data.type.js';
import type { InternetClaimAgreementAnalysis } from '../types/internet-claim-agreement-analysis.type.js';
import { InternetClaimAgreementService } from './internet-claim-agreement.service.js';
import { InternetClaimAgreementClassifier } from './internet-claim-agreement.classifier.js';

@Injectable()
export class InternetClaimAgreementAnalysisService {
    constructor(
        private readonly agreementService: InternetClaimAgreementService,
        private readonly agreementClassifier: InternetClaimAgreementClassifier,
    ) {}

    analyze(
        consolidatedEvidence: ConsolidatedEvidence[],
    ): InternetClaimAgreementAnalysis[] {
        const internetClaims = consolidatedEvidence.filter(
            (
                evidence,
            ): evidence is ConsolidatedEvidence<InternetClaimData> =>
                evidence.category === ObservationCategory.INTERNET,
        );

        const results: InternetClaimAgreementAnalysis[] = [];

        for (let i = 0; i < internetClaims.length; i++) {
            for (let j = i + 1; j < internetClaims.length; j++) {
                const firstClaim = internetClaims[i]!;
                const secondClaim = internetClaims[j]!;

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
                    availabilityDifference:
                        agreement.availabilityDifference,
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