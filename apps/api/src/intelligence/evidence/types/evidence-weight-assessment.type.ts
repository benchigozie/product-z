
import type { EvidenceRecencyClassification } from '../evidence-recency.classification.js';
import type { TemporalAgreementInterpretation } from './temporal-agreement-analysis.type.js';

export interface EvidencePairAssessment {
    otherObservationId: string;
    temporalInterpretation: TemporalAgreementInterpretation;
}

export interface EvidenceWeightAssessment {
    observationId: string;
    recency: EvidenceRecencyClassification;
    supportingObservationIds: string[];
    conflictingObservationIds: string[];
    pairAssessments: EvidencePairAssessment[];
}
