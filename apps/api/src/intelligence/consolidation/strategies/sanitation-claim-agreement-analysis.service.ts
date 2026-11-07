import { Injectable } from '@nestjs/common';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { SanitationClaimData } from '../types/sanitation-claim-data.type.js';
import type { SanitationClaimAgreementAnalysis } from '../types/sanitation-claim-agreement-analysis.type.js';
import { SanitationClaimAgreementService } from './sanitation-claim-agreement.service.js';
import { SanitationClaimAgreementClassifier } from './sanitation-claim-agreement.classifier.js';

@Injectable()
export class SanitationClaimAgreementAnalysisService {
    constructor(
        private readonly agreementService: SanitationClaimAgreementService,
        private readonly agreementClassifier: SanitationClaimAgreementClassifier,
    ) {}

    analyze(
        consolidatedEvidence: ConsolidatedEvidence[],
    ): SanitationClaimAgreementAnalysis[] {
        const sanitationClaims = consolidatedEvidence.filter(
            (
                evidence,
            ): evidence is ConsolidatedEvidence<SanitationClaimData> =>
                evidence.category === ObservationCategory.SANITATION,
        );

        const results: SanitationClaimAgreementAnalysis[] = [];

        for (let i = 0; i < sanitationClaims.length; i++) {
            for (let j = i + 1; j < sanitationClaims.length; j++) {
                const firstClaim = sanitationClaims[i]!;
                const secondClaim = sanitationClaims[j]!;

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
                    conditionDifference: agreement.conditionDifference,
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