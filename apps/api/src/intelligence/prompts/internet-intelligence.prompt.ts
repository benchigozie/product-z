import type { InternetIntelligenceInput } from '../types/internet-intelligence-input.type.js';
import { EVIDENCE_RECENCY_RULES } from '../evidence/evidence-recency.rules.js';

export class InternetIntelligencePrompt {
    build(input: InternetIntelligenceInput): string {
        const observationIds = input.observations.map(
            (observation) => observation.id,
        );

        const internetRecency = EVIDENCE_RECENCY_RULES.INTERNET;

        return `
You are interpreting housing evidence for Product Z.

Assess the reported internet situation at the property using the supplied
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
- The conclusion must be exactly one of: AVAILABLE, INTERMITTENT, UNAVAILABLE, UNRESOLVED.
- AVAILABLE means the evidence supports internet being available at the property.
- INTERMITTENT means the evidence supports internet being available but unreliable.
- UNAVAILABLE means the evidence supports internet being unavailable at the property.
- UNRESOLVED means the evidence is insufficient, contradictory, or ambiguous.

Internet-specific interpretation:
- An internet observation reports a provider, a connection type (MOBILE_DATA, FIBRE, FIXED_WIRELESS, SATELLITE, OTHER), availability, and optional reliability and coverage.
- Different connection types are not interchangeable. A report that fibre is available does not mean mobile data is available, and vice versa. Two observations about different connection types describe different supplies.
- A property may have some connection types available and others not. Consider the full picture across all observations.
- The provider is a specific operator (e.g. a mobile carrier or ISP). Provider differences within the same connection type are context, not contradiction — different providers on the same network type may perform differently.
- Coverage describes signal quality when mobile or wireless. It is secondary context; availability is the primary signal.

Evidence interpretation:
- Raw observations are individual reports. Consolidated claims group observations that report the same connection type and availability.
- A consolidated claim is not independent confirmation of the observations it contains. Use observationCount and observationIds to understand how many reports contribute to it.
- Claim agreement analysis compares distinct consolidated claims.
- STRONG_AGREEMENT means the same connection type has the same reported availability.
- MIXED_AGREEMENT means the same connection type has different but adjacent availability states.
- CONTRADICTORY_EVIDENCE means the same connection type reports opposite availability states.
- NOT_COMPARABLE means the connection types differ. Do not treat such claims as agreement or contradiction merely because their availability differs.
- Recency classification is category-specific. For INTERNET:
  - RECENT means observed within the last ${internetRecency.recentDays} days.
  - NEITHER means observed more than ${internetRecency.recentDays} but no more than ${internetRecency.oldDays} days ago.
  - OLD means observed more than ${internetRecency.oldDays} days ago.
- RECENT observations describe the current period and are the strongest evidence available. Do not describe recent evidence as old, stale, or lacking recency.
- When multiple RECENT observations contradict each other on the same connection type, state that recent reports conflict.
- temporalAgreement interpretations: CONSISTENT, POSSIBLE_CHANGE, UNRESOLVED_DISAGREEMENT. A POSSIBLE_CHANGE means the timing between observations is large enough that availability may have changed.
- When recent observations show a progression toward better availability over time and the most recent observation is RECENT, acknowledge the possible improvement but do not conclude AVAILABLE without corroboration.

Confidence describes how strongly the evidence supports the conclusion.

CRITICAL CONFIDENCE RULE:
- confidence must be LOW, MODERATE, or HIGH.
- Never use UNRESOLVED as the confidence value.
- If conclusion is UNRESOLVED, choose LOW, MODERATE, or HIGH based on evidence strength.
- Never copy the conclusion value into confidence.

Recency rules:
- Old observations describe a historical condition and must not establish the current condition.
- If all available observations are OLD, conclude UNRESOLVED.
- Agreement between old observations does not establish the current internet condition.

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