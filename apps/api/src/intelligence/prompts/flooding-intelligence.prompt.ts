import type { FloodingIntelligenceInput } from '../types/flooding-intelligence-input.type.js';
import { EVIDENCE_RECENCY_RULES } from '../evidence/evidence-recency.rules.js';

export class FloodingIntelligencePrompt {
    build(input: FloodingIntelligenceInput): string {
        const observationIds = input.observations.map(
            (observation) => observation.id,
        );

        const floodingRecency = EVIDENCE_RECENCY_RULES.FLOODING;

        return `
You are interpreting housing evidence for Product Z.

Assess the reported flooding situation using the supplied raw observations
and deterministic evidence analysis.

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
- Consolidated claim IDs identify groups of observations and are not valid evidenceReferences.
- When a consolidated claim supports your conclusion, use the raw observation IDs listed in that claim's observationIds field.
- Copy raw observation IDs exactly as supplied. Never construct, shorten, transform, or invent IDs.
- considerations must always be an array of strings, even when there is only one consideration. Use an empty array if there are no additional considerations.
- The conclusion must be exactly one of: DOES_NOT_FLOOD, SIGNS_OF_FLOODING, FLOODS, UNRESOLVED.
- DOES_NOT_FLOOD means the evidence supports that the property does not flood, based on explicit negative observations.
- SIGNS_OF_FLOODING means the evidence consists of signs consistent with past flooding (for example water marks, damp patches, mould) but no direct observation of flooding. The cause of the signs is not confirmed.
- FLOODS means the evidence supports that flooding has been observed at the property.
- UNRESOLVED means the evidence is insufficient, contradictory, or ambiguous.

Flooding-specific interpretation:
- A flooding observation reports an occurrence (what the reporter observed) and an extent (how far the flooding reached).
- Occurrence has three states:
  - NO_FLOODING_OBSERVED: the reporter looked and saw no signs of flooding. This is positive evidence that the property does not flood.
  - EVIDENCE_OF_PAST_FLOODING: the reporter saw signs consistent with past flooding (water marks, damp patches, high-water marks, neighbour reports). These signs have multiple possible causes and are not direct confirmation of flooding. They could indicate a leaking tank, poor plumbing, rising damp, or poor ventilation rather than actual flooding.
  - FLOODING_OBSERVED: the reporter directly observed flooding at the property or its immediate area.
- Extent describes where the water reached: PROPERTY (inside the property), IMMEDIATE_ACCESS (right outside the entrance), STREET (the street), or WIDER_AREA (the surrounding area). Extent is a severity-layer concern, not a claim-identity concern: two observations both reporting FLOODING_OBSERVED are the same claim even if they report different extents.
- Severity, when present, describes how bad the flooding was: MINOR, MODERATE, or SEVERE.
- The conditions field, when present, is free-text context about when or under what circumstances flooding occurs (for example "only during heavy rain"). Use it as context but do not invent conditions that are not stated.
- Signs of past flooding should not be treated as evidence that flooding is currently occurring. A report of mould is not the same claim as a report of standing water.

Evidence interpretation:
- Raw observations are individual reports. Consolidated claims group observations that report the same occurrence state.
- A consolidated claim is not independent confirmation of the observations it contains. Use observationCount and observationIds to understand how many reports contribute to it.
- Claim agreement analysis compares distinct consolidated claims.
- STRONG_AGREEMENT means both claims report the same occurrence state.
- MIXED_AGREEMENT means the claims report adjacent occurrence states (for example NO_FLOODING_OBSERVED vs EVIDENCE_OF_PAST_FLOODING, or EVIDENCE_OF_PAST_FLOODING vs FLOODING_OBSERVED).
- CONTRADICTORY_EVIDENCE means the claims report opposite occurrence states (NO_FLOODING_OBSERVED vs FLOODING_OBSERVED).
- A direct contradiction between recent observations means the current condition is genuinely unknown. Conclude UNRESOLVED in that situation.
- Recency classification is category-specific. For FLOODING:
  - RECENT means observed within the last ${floodingRecency.recentDays} days.
  - NEITHER means observed more than ${floodingRecency.recentDays} but no more than ${floodingRecency.oldDays} days ago.
  - OLD means observed more than ${floodingRecency.oldDays} days ago.
- RECENT observations describe the current period and are the strongest evidence available. Do not describe recent evidence as old, stale, or lacking recency.
- A claim's firstObservedAt and lastObservedAt describe the time span of its contributing observations. Consider the timing when interpreting conflicting claims.
- Claim-level analysis supplements observation-level analysis; it does not replace raw observations, recency analysis, or evidence assessments.
- Do not count the same underlying observations as independent evidence simply because they appear in both raw and consolidated data.
- Use claim relationships as evidence about consistency, not as proof that a claim is true.
- When recent observations across time show a progressive worsening (for example NO_FLOODING_OBSERVED → EVIDENCE_OF_PAST_FLOODING → FLOODING_OBSERVED), acknowledge the progression but do not over-claim severity based on a single recent observation.
- When recent observations across time show a progressive improvement (for example FLOODING_OBSERVED → EVIDENCE_OF_PAST_FLOODING → NO_FLOODING_OBSERVED), acknowledge the possible improvement but do not conclude DOES_NOT_FLOOD without at least two recent NO_FLOODING_OBSERVED reports.

Confidence describes how strongly the evidence supports the conclusion,
not the flooding condition itself.

CRITICAL CONFIDENCE RULE:
- The confidence field is completely independent from the conclusion field.
- The confidence field must be exactly one of: LOW, MODERATE, HIGH.
- Never use UNRESOLVED as the confidence value.
- UNRESOLVED is only a valid value for the conclusion field.
- If the conclusion is UNRESOLVED, you must still choose LOW, MODERATE, or HIGH for confidence based on the strength and quality of the available evidence.
- Never copy the conclusion value into the confidence field.
- For example, this is INVALID:
  {
    "conclusion": "UNRESOLVED",
    "confidence": "UNRESOLVED"
  }
- A valid unresolved conclusion must still have a valid confidence value, for example:
  {
    "conclusion": "UNRESOLVED",
    "confidence": "LOW"
  }

Recency rules:
- Old observations may describe a historical condition and must not automatically establish the current condition.
- If all available observations are classified as OLD, the conclusion must be UNRESOLVED.
- Agreement between old observations does not establish the current flooding condition.
- Do not conclude DOES_NOT_FLOOD, SIGNS_OF_FLOODING, or FLOODS as the current condition when all available evidence is OLD.
- The confidence must reflect the evidence's recency, quantity, and agreement.

Required structure:
{
  "conclusion": "DOES_NOT_FLOOD | SIGNS_OF_FLOODING | FLOODS | UNRESOLVED",
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
5. Return an empty evidenceReferences array only if no raw observations were supplied at all. If raw observations were supplied, you must reference the ones you actually considered when forming your conclusion.
   For example, if three raw observations are supplied and you conclude UNRESOLVED because two disagree, evidenceReferences must still list all three observation IDs you considered.

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
${JSON.stringify(input.powerClaimAgreementAnalysis)}
`;
    }
}