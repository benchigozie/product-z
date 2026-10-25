import { Injectable, Logger } from '@nestjs/common';

import { ConclusionState } from '../enums/conclusion-state.enum.js';
import { IntelligenceConfidence } from '../enums/intelligence-confidence.enum.js';
import { EvidenceAgreementClassification } from '../evidence/evidence-agreement.classification.js';
import { EvidenceRecencyClassification } from '../evidence/evidence-recency.classification.js';
import type { EvidenceAnalysisResult } from '../evidence/types/evidence-analysis-result.type.js';

@Injectable()
export class ConfidenceCalibrationService {
    private readonly logger = new Logger(ConfidenceCalibrationService.name);

    calibrate(
        conclusion: ConclusionState,
        proposedConfidence: IntelligenceConfidence,
        evidenceAnalysis: EvidenceAnalysisResult,
    ): IntelligenceConfidence {
        const recentObservationIds = new Set(
            evidenceAnalysis.recency
                .filter(
                    (r) =>
                        r.classification ===
                        EvidenceRecencyClassification.RECENT,
                )
                .map((r) => r.observationId),
        );

        const recentCount = recentObservationIds.size;

        // Rule 3: no recent observations → LOW.
        if (recentCount === 0) {
            return this.apply(proposedConfidence, IntelligenceConfidence.LOW, {
                rule: 'no-recent-evidence',
                recentCount,
                conclusion,
            });
        }

        // Rule 1: UNRESOLVED conclusion → LOW.
        if (conclusion === ConclusionState.UNRESOLVED) {
            return this.apply(proposedConfidence, IntelligenceConfidence.LOW, {
                rule: 'unresolved-conclusion',
                recentCount,
                conclusion,
            });
        }

        // Rule 4: contradictory evidence between RECENT observations → LOW.
        const hasRecentContradiction = evidenceAnalysis.agreement.some(
            (a) =>
                a.classification ===
                    EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE &&
                recentObservationIds.has(a.firstObservationId) &&
                recentObservationIds.has(a.secondObservationId),
        );

        if (hasRecentContradiction) {
            return this.apply(proposedConfidence, IntelligenceConfidence.LOW, {
                rule: 'recent-contradiction',
                recentCount,
                conclusion,
            });
        }

        // Rule 5: 3+ recent agreeing observations → HIGH allowed. No cap.
        if (recentCount >= 3) {
            return proposedConfidence;
        }

        // Rule 2 + fallback: 1 or 2 recent observations, no contradiction
        // → cap at MODERATE.
        const capped = this.min(
            proposedConfidence,
            IntelligenceConfidence.MODERATE,
        );

        return this.apply(proposedConfidence, capped, {
            rule: 'insufficient-recent-count',
            recentCount,
            conclusion,
        });
    }

    private min(
        a: IntelligenceConfidence,
        b: IntelligenceConfidence,
    ): IntelligenceConfidence {
        const order: Record<IntelligenceConfidence, number> = {
            [IntelligenceConfidence.LOW]: 0,
            [IntelligenceConfidence.MODERATE]: 1,
            [IntelligenceConfidence.HIGH]: 2,
        };

        return order[a] <= order[b] ? a : b;
    }

    private apply(
        proposed: IntelligenceConfidence,
        calibrated: IntelligenceConfidence,
        context: {
            rule: string;
            recentCount: number;
            conclusion: ConclusionState;
        },
    ): IntelligenceConfidence {
        if (proposed !== calibrated) {
            this.logger.debug(
                `Calibrated confidence ${proposed} → ${calibrated} ` +
                    `(rule=${context.rule}, recentCount=${context.recentCount}, ` +
                    `conclusion=${context.conclusion})`,
            );
        }

        return calibrated;
    }
}