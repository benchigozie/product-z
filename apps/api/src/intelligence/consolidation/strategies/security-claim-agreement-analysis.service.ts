import { Injectable } from '@nestjs/common';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { SecurityClaimData } from '../types/security-claim-data.type.js';
import type { SecurityClaimAgreementAnalysis } from '../types/security-claim-agreement-analysis.type.js';
import { SecurityClaimAgreementService } from './security-claim-agreement.service.js';
import { SecurityClaimAgreementClassifier } from './security-claim-agreement.classifier.js';

@Injectable()
export class SecurityClaimAgreementAnalysisService {
    constructor(
        private readonly agreementService: SecurityClaimAgreementService,
        private readonly agreementClassifier: SecurityClaimAgreementClassifier,
    ) {}

    analyze(
        consolidatedEvidence: ConsolidatedEvidence[],
    ): SecurityClaimAgreementAnalysis[] {
        const securityClaims = consolidatedEvidence.filter(
            (
                evidence,
            ): evidence is ConsolidatedEvidence<SecurityClaimData> =>
                evidence.category === ObservationCategory.SECURITY,
        );

        const results: SecurityClaimAgreementAnalysis[] = [];

        for (let i = 0; i < securityClaims.length; i++) {
            for (let j = i + 1; j < securityClaims.length; j++) {
                const firstClaim = securityClaims[i]!;
                const secondClaim = securityClaims[j]!;

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
                    accessControlDifference:
                        agreement.accessControlDifference,
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