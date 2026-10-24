import type { ObservationRecencyAnalysis } from './observation-recency-analysis.type.js';
import type { CategoryAgreementAnalysis } from './category-agreement-analysis.type.js';
import type { TemporalAgreementAnalysis } from './temporal-agreement-analysis.type.js';

export interface EvidenceAnalysisResult {
    recency: ObservationRecencyAnalysis[];
    agreement: CategoryAgreementAnalysis[];
    temporalAgreement: TemporalAgreementAnalysis[];
}