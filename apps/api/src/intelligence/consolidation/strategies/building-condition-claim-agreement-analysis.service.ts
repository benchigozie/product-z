import { Injectable } from '@nestjs/common';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { BuildingConditionClaimData } from '../types/building-condition-claim-data.type.js';
import type { BuildingConditionClaimAgreementAnalysis } from '../types/building-condition-claim-agreement-analysis.type.js';
import { BuildingConditionClaimAgreementService } from './building-condition-claim-agreement.service.js';
import { BuildingConditionClaimAgreementClassifier } from './building-condition-claim-agreement.classifier.js';

@Injectable()
export class BuildingConditionClaimAgreementAnalysisService {
    constructor(
        private readonly agreementService: BuildingConditionClaimAgreementService,
        private readonly agreementClassifier: BuildingConditionClaimAgreementClassifier,
    ) {}

    analyze(
        consolidatedEvidence: ConsolidatedEvidence[],
    ): BuildingConditionClaimAgreementAnalysis[] {
        const claims = consolidatedEvidence.filter(
            (
                evidence,
            ): evidence is ConsolidatedEvidence<BuildingConditionClaimData> =>
                evidence.category === ObservationCategory.BUILDING_CONDITION,
        );

        const results: BuildingConditionClaimAgreementAnalysis[] = [];

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