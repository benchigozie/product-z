import { Injectable } from '@nestjs/common';

import type { ObservationListResult } from '../../observation/types/observation-result.type.js';
import { EvidenceRecencyService } from './evidence-recency.service.js';
import { SecurityAgreementService } from './security-agreement.service.js';
import { SecurityAgreementClassifier } from './security-agreement.classifier.js';
import { ObservationCategory } from '../../observation/enums/observation-category.enum.js';
import { SecurityAccessControl } from '../../observation/types/security/security-access-control.type.js';
import { SecurityPersonnel } from '../../observation/types/security/security-personnel.type.js';
import { SecurityFeature } from '../../observation/types/security/security-feature.type.js';
import type { SecurityData } from '../../observation/types/security/security-data.type.js';
import type { SecurityCategoryAgreementAnalysis } from './types/category-agreement-analysis.type.js';
import type { EvidenceAnalysisResult } from './types/evidence-analysis-result.type.js';
import type { ObservationRecencyAnalysis } from './types/observation-recency-analysis.type.js';
import { EvidenceTemporalAnalysisService } from './evidence-temporal-analysis.service.js';
import type { TemporalAgreementAnalysis } from './types/temporal-agreement-analysis.type.js';

function isSecurityData(value: unknown): value is SecurityData {
    if (
        typeof value !== 'object' ||
        value === null ||
        Array.isArray(value)
    ) {
        return false;
    }

    const data = value as Record<string, unknown>;

    return (
        (data.accessControl === undefined ||
            Object.values(SecurityAccessControl).includes(
                data.accessControl as SecurityAccessControl,
            )) &&
        (data.personnel === undefined ||
            Object.values(SecurityPersonnel).includes(
                data.personnel as SecurityPersonnel,
            )) &&
        (data.features === undefined ||
            (Array.isArray(data.features) &&
                data.features.every((f) =>
                    Object.values(SecurityFeature).includes(
                        f as SecurityFeature,
                    ),
                )))
    );
}

@Injectable()
export class SecurityEvidenceAnalysisService {
    constructor(
        private readonly evidenceRecencyService: EvidenceRecencyService,
        private readonly securityAgreementService: SecurityAgreementService,
        private readonly securityAgreementClassifier: SecurityAgreementClassifier,
        private readonly evidenceTemporalAnalysisService: EvidenceTemporalAnalysisService,
    ) {}

    async analyze(
        observations: ObservationListResult,
    ): Promise<EvidenceAnalysisResult> {
        const securityObservations = observations.filter(
            (observation) =>
                observation.category === ObservationCategory.SECURITY,
        );

        const securityAgreementAnalyses: SecurityCategoryAgreementAnalysis[] =
            [];
        const temporalAgreementAnalyses: TemporalAgreementAnalysis[] = [];

        for (let i = 0; i < securityObservations.length; i++) {
            for (let j = i + 1; j < securityObservations.length; j++) {
                const firstObservation = securityObservations[i];
                const secondObservation = securityObservations[j];

                if (
                    !isSecurityData(firstObservation.data) ||
                    !isSecurityData(secondObservation.data)
                ) {
                    console.warn(
                        'Skipping security agreement comparison: invalid observation data.',
                        firstObservation.id,
                        secondObservation.id,
                    );
                    continue;
                }

                const timeDifferenceInDays =
                    Math.abs(
                        firstObservation.observedAt.getTime() -
                            secondObservation.observedAt.getTime(),
                    ) /
                    (1000 * 60 * 60 * 24);

                const agreementResult =
                    this.securityAgreementService.compare(
                        firstObservation.data,
                        secondObservation.data,
                    );

                const classification =
                    this.securityAgreementClassifier.classify(
                        agreementResult,
                    );

                securityAgreementAnalyses.push({
                    category: ObservationCategory.SECURITY,
                    firstObservationId: firstObservation.id,
                    secondObservationId: secondObservation.id,
                    classification,
                    timeDifferenceInDays,
                    agreement: agreementResult,
                });

                temporalAgreementAnalyses.push(
                    this.evidenceTemporalAnalysisService.analyze(
                        firstObservation.id,
                        secondObservation.id,
                        classification,
                        timeDifferenceInDays,
                    ),
                );
            }
        }

        const recencyAnalyses: ObservationRecencyAnalysis[] = [];

        for (const observation of observations) {
            const classification =
                this.evidenceRecencyService.classify(observation);

            recencyAnalyses.push({
                observationId: observation.id,
                category: observation.category,
                classification,
            });
        }

        return {
            recency: recencyAnalyses,
            agreement: securityAgreementAnalyses,
            temporalAgreement: temporalAgreementAnalyses,
        };
    }
}