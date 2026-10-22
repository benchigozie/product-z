import type { ObservationListResult } from '../../observation/types/observation-result.type.js';
import type { EvidenceAnalysisResult } from '../evidence/types/evidence-analysis-result.type.js';
import type { EvidenceWeightAssessment } from '../evidence/types/evidence-weight-assessment.type.js';
import type { ConsolidatedEvidence } from '../consolidation/types/consolidated-evidence.type.js';
import type { WaterClaimAgreementAnalysis } from '../consolidation/types/water-claim-agreement-analysis.type.js';

export interface WaterIntelligenceInput {
    observations: ObservationListResult;
    evidenceAnalysis: EvidenceAnalysisResult;
    evidenceAssessments: EvidenceWeightAssessment[];
    consolidatedEvidence: ConsolidatedEvidence[];
    powerClaimAgreementAnalysis: WaterClaimAgreementAnalysis[];
}