import type { PowerIntelligenceInput } from '../types/power-intelligence-input.type.js';

export class PowerIntelligencePrompt {
    build(input: PowerIntelligenceInput): string {
        const observationIds = input.observations.map(
            (observation) => observation.id,
        );

        return `
You are interpreting housing evidence for Product Z.

Assess the reported electricity situation using the supplied raw observations
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
- The conclusion must be exactly one of: AVAILABLE, INTERMITTENT, UNAVAILABLE, UNRESOLVED.
- AVAILABLE means the evidence supports generally available electricity.
- INTERMITTENT means the evidence supports irregular or inconsistent electricity.
- UNAVAILABLE means the evidence supports electricity being unavailable.
- UNRESOLVED means the evidence is insufficient, contradictory, or ambiguous.

Evidence interpretation:
- Raw observations are individual reports. Consolidated claims group observations that report the same power-source combination and availability.
- A consolidated claim is not independent confirmation of the observations it contains. Use observationCount and observationIds to understand how many reports contribute to it.
- Claim agreement analysis compares distinct consolidated claims.
- STRONG_AGREEMENT means the same source combination has the same reported availability.
- MIXED_AGREEMENT means the same source combination has different but adjacent availability states.
- CONTRADICTORY_EVIDENCE means the same source combination reports opposite availability states.
- NOT_COMPARABLE means the source combinations differ. Do not treat such claims as agreement or contradiction merely because their availability differs.
- A claim's firstObservedAt and lastObservedAt describe the time span of its contributing observations. Consider the timing when interpreting conflicting claims.
- Claim-level analysis supplements observation-level analysis; it does not replace raw observations, recency analysis, or evidence assessments.
- Do not count the same underlying observations as independent evidence simply because they appear in both raw and consolidated data.
- Do not assume that availability reported for one source applies to a different source. For example, grid power being unavailable does not by itself mean generator power is unavailable.
- Use claim relationships as evidence about consistency, not as proof that a claim is true.

Confidence describes how strongly the evidence supports the conclusion,
not the power condition itself.

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

- Old observations may describe a historical condition and must not automatically establish the current condition.
- If all available observations are classified as OLD, the conclusion must be UNRESOLVED.
- Agreement between old observations does not establish the current electricity condition.
- Do not conclude AVAILABLE, INTERMITTENT, or UNAVAILABLE as the current condition when all available evidence is OLD.
- The confidence must reflect the evidence's recency, reliability, quantity, and agreement.

Required structure:
{
  "conclusion": "AVAILABLE | INTERMITTENT | UNAVAILABLE | UNRESOLVED",
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
5. If you cannot identify a supporting raw observation, return an empty evidenceReferences array.

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