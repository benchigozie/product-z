import type { ObservationRecencyAnalysis } from "./observation-recency-analysis.type";
import type { PowerAgreementAnalysis } from "./power-agreement-analysis.type";
import type { TemporalAgreementAnalysis } from './temporal-agreement-analysis.type.js';

export interface EvidenceAnalysisResult {
    recency: ObservationRecencyAnalysis[];
    powerAgreement: PowerAgreementAnalysis[];
    temporalAgreement: TemporalAgreementAnalysis[];
}