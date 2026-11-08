import type { RoadAccessIntelligenceInput } from '../types/road-access-intelligence-input.type.js';
import { EVIDENCE_RECENCY_RULES } from '../evidence/evidence-recency.rules.js';

export class RoadAccessIntelligencePrompt {
    build(input: RoadAccessIntelligenceInput): string {
        const observationIds = input.observations.map(
            (observation) => observation.id,
        );

        const roadRecency = EVIDENCE_RECENCY_RULES.ROAD_ACCESS;

        return `
You are interpreting housing evidence for Product Z.

Assess the reported road access situation at the property using the supplied
raw observations and deterministic evidence analysis.

Rules:
- Use only the supplied evidence.
- Treat observations as reports, not automatically verified facts.
- Consider recency, supporting evidence, conflicting evidence, and possible change.
- Do not invent facts or observation IDs.
- Do not claim certainty that the evidence does not justify.
- Return only a valid JSON object, with no Markdown fences or additional text.
- Follow the required JSON structure exactly.
- reasonSignals must always be an array of strings.
- evidenceReferences must contain only raw observation IDs from the supplied valid observation IDs.
- Never put consolidated claim IDs in evidenceReferences.
- considerations must always be an array of strings.
- The conclusion must be exactly one of: WELL_ACCESSIBLE, ACCESSIBLE_BUT_POOR, LIMITED_ACCESS, UNRESOLVED.
- WELL_ACCESSIBLE means the evidence supports that cars (or larger vehicles) can reliably reach the property and the road condition is fair or better.
- ACCESSIBLE_BUT_POOR means the evidence supports that cars can reach the property but the road condition is poor or very poor.
- LIMITED_ACCESS means the evidence supports that only motorcycles or walking can reach the property — cars cannot.
- UNRESOLVED means the evidence is insufficient, contradictory, or ambiguous.

Road access-specific interpretation:
- A road access observation reports two things:
  - Condition: how good is the road surface? VERY_POOR, POOR, FAIR, GOOD, VERY_GOOD.
  - Accessibility: which vehicle types can reach the property? A set of WALKING, MOTORCYCLE, CAR, LARGE_VEHICLE.
- Accessibility is the primary axis for agreement. Two observations that report the same maximum accessibility (both say cars can get through, both say only motorcycles can get through) agree on the fundamental question of how reachable the property is.
- Condition is secondary. Two observations that agree on accessibility but disagree on condition describe a real difference in quality, but not a contradiction about whether the road is usable.
- The maximum accessibility in a set determines the reach: if CAR is in the accessibility list, cars can get through even if LARGE_VEHICLE is not.
- A road with LARGE_VEHICLE accessibility is nearly always WELL_ACCESSIBLE regardless of condition, because it's a road that heavy traffic uses.
- A road that's only accessible by walking or motorcycle is LIMITED_ACCESS regardless of condition.
- A road accessible to cars but in poor or very poor condition is ACCESSIBLE_BUT_POOR.

Evidence interpretation:
- Raw observations are individual reports. Consolidated claims group observations that report the same (condition, maxAccessibility) pair.
- A consolidated claim is not independent confirmation of the observations it contains. Use observationCount and observationIds to understand how many reports contribute to it.
- Claim agreement analysis compares distinct consolidated claims.
- STRONG_AGREEMENT means both claims report the same maximum accessibility.
- MIXED_AGREEMENT means the claims report adjacent accessibility levels (e.g. WALKING vs MOTORCYCLE, or CAR vs LARGE_VEHICLE).
- CONTRADICTORY_EVIDENCE means the claims report accessibility levels that are two or more tiers apart (e.g. WALKING vs CAR, or MOTORCYCLE vs LARGE_VEHICLE).
- Recency classification is category-specific. For ROAD_ACCESS:
  - RECENT means observed within the last ${roadRecency.recentDays} days.
  - NEITHER means observed more than ${roadRecency.recentDays} but no more than ${roadRecency.oldDays} days ago.
  - OLD means observed more than ${roadRecency.oldDays} days ago.
- RECENT observations describe the current period and are the strongest evidence available. Do not describe recent evidence as old, stale, or lacking recency.
- When multiple RECENT observations contradict each other on accessibility, state that recent reports conflict.
- temporalAgreement interpretations: CONSISTENT, POSSIBLE_CHANGE, UNRESOLVED_DISAGREEMENT.
- When recent observations show a progression toward better accessibility over time and the most recent observation is RECENT, acknowledge the possible improvement but do not conclude WELL_ACCESSIBLE without corroboration.
- Construction or roadworks context, if mentioned in descriptions, should be noted in considerations but is not part of the primary accessibility axis.

Confidence describes how strongly the evidence supports the conclusion.

CRITICAL CONFIDENCE RULE:
- confidence must be LOW, MODERATE, or HIGH.
- Never use UNRESOLVED as the confidence value.
- If conclusion is UNRESOLVED, choose LOW, MODERATE, or HIGH based on evidence strength.
- Never copy the conclusion value into confidence.

Recency rules:
- Old observations describe a historical condition and must not establish the current condition.
- If all available observations are OLD, conclude UNRESOLVED.
- Agreement between old observations does not establish the current road access condition.

Required structure:
{
  "conclusion": "WELL_ACCESSIBLE | ACCESSIBLE_BUT_POOR | LIMITED_ACCESS | UNRESOLVED",
  "confidence": "LOW | MODERATE | HIGH",
  "reason": "string",
  "reasonSignals": ["string"],
  "evidenceReferences": ["exact raw observation ID"],
  "considerations": ["string"]
}

EVIDENCE REFERENCE PROCEDURE:
1. Select the raw observations that support your conclusion.
2. Copy each selected observation's id field exactly.
3. Put those exact IDs in evidenceReferences.
4. Never copy an ID from Consolidated evidence or Claim-level agreement analysis.
5. Return an empty evidenceReferences array only if no raw observations were supplied. If observations were supplied, reference the ones you considered.

Valid observation IDs:
${JSON.stringify(observationIds)}

Raw observations:
${JSON.stringify(input.observations)}

Observation-level evidence analysis:
${JSON.stringify(input.evidenceAnalysis)}

Observation-level evidence assessments:
${JSON.stringify(input.evidenceAssessments)}

Consolidated evidence:
${JSON.stringify(input.consolidatedEvidence)}

Claim-level agreement analysis:
${JSON.stringify(input.claimAgreementAnalysis)}
`;
    }
}