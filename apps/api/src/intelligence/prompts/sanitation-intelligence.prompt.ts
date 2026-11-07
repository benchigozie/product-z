import type { SanitationIntelligenceInput } from '../types/sanitation-intelligence-input.type.js';
import { EVIDENCE_RECENCY_RULES } from '../evidence/evidence-recency.rules.js';

export class SanitationIntelligencePrompt {
    build(input: SanitationIntelligenceInput): string {
        const observationIds = input.observations.map(
            (observation) => observation.id,
        );

        const sanitationRecency = EVIDENCE_RECENCY_RULES.SANITATION;

        return `
You are interpreting housing evidence for Product Z.

Assess the reported sanitation situation at the property using the supplied
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
- The conclusion must be exactly one of: SANITARY, CONCERNING, UNSANITARY, UNRESOLVED.
- SANITARY means the evidence supports that the property's sanitation is clean and adequately handled.
- CONCERNING means the evidence is mixed or shows moderate issues — the situation is not clearly clean but not clearly unsafe either.
- UNSANITARY means the evidence supports that the property has poor or very poor sanitation conditions.
- UNRESOLVED means the evidence is insufficient, contradictory, or ambiguous.

Sanitation-specific interpretation:
- A sanitation observation reports a condition: CLEAN, FAIR, POOR, or VERY_POOR.
- The observation may include a free-text description providing additional context. Use it to inform the reasoning but do not invent details not present.
- CLEAN reports indicate no sanitation issues were observed.
- FAIR reports indicate minor or acceptable issues.
- POOR reports indicate significant issues that would concern a renter.
- VERY_POOR reports indicate serious sanitation problems.
- A property with mixed reports across the CLEAN to VERY_POOR spectrum is genuinely ambiguous — do not over-claim either SANITARY or UNSANITARY without corroboration.

Evidence interpretation:
- Raw observations are individual reports. Consolidated claims group observations that report the same sanitation condition.
- A consolidated claim is not independent confirmation of the observations it contains. Use observationCount and observationIds to understand how many reports contribute to it.
- Claim agreement analysis compares distinct consolidated claims.
- STRONG_AGREEMENT means both claims report the same condition.
- MIXED_AGREEMENT means the claims report adjacent conditions (e.g. CLEAN vs FAIR, or FAIR vs POOR).
- CONTRADICTORY_EVIDENCE means the claims report opposite conditions (e.g. CLEAN vs POOR or worse).
- Recency classification is category-specific. For SANITATION:
  - RECENT means observed within the last ${sanitationRecency.recentDays} days.
  - NEITHER means observed more than ${sanitationRecency.recentDays} but no more than ${sanitationRecency.oldDays} days ago.
  - OLD means observed more than ${sanitationRecency.oldDays} days ago.
- RECENT observations describe the current period and are the strongest evidence available. Do not describe recent evidence as old, stale, or lacking recency.
- When multiple RECENT observations contradict each other, state that recent reports conflict.
- temporalAgreement interpretations: CONSISTENT, POSSIBLE_CHANGE, UNRESOLVED_DISAGREEMENT. A POSSIBLE_CHANGE means the timing between observations is large enough that sanitation may have changed.
- When recent observations show a progression toward improvement over time and the most recent observation is RECENT, acknowledge the possible improvement but do not conclude SANITARY without corroboration.
- When recent observations show a progression toward deterioration over time, acknowledge the concern but do not conclude UNSANITARY without corroboration.

Confidence describes how strongly the evidence supports the conclusion.

CRITICAL CONFIDENCE RULE:
- confidence must be LOW, MODERATE, or HIGH.
- Never use UNRESOLVED as the confidence value.
- If conclusion is UNRESOLVED, choose LOW, MODERATE, or HIGH based on evidence strength.
- Never copy the conclusion value into confidence.

Recency rules:
- Old observations describe a historical condition and must not establish the current condition.
- If all available observations are OLD, conclude UNRESOLVED.
- Agreement between old observations does not establish the current sanitation condition.

Required structure:
{
  "conclusion": "SANITARY | CONCERNING | UNSANITARY | UNRESOLVED",
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