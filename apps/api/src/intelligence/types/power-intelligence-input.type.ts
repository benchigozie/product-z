import type { ObservationListResult } from '../../observation/types/observation-result.type.js';
import type { EvidenceAnalysisResult } from '../evidence/types/evidence-analysis-result.type.js';
import type { EvidenceWeightAssessment } from '../evidence/types/evidence-weight-assessment.type.js';

export interface PowerIntelligenceInput {
    observations: ObservationListResult;
    evidenceAnalysis: EvidenceAnalysisResult;
    evidenceAssessments: EvidenceWeightAssessment[];
}