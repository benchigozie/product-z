import type { SecurityIntelligenceInput } from "../types/security-intelligence-input.type";
import { EVIDENCE_RECENCY_RULES } from '../evidence/evidence-recency.rules.js';

export class SecurityIntelligencePrompt {
    build(input: SecurityIntelligenceInput): string {
        const observationIds = input.observations.map(
            (observation) => observation.id,
        );

        const securityRecency = EVIDENCE_RECENCY_RULES.SECURITY;

        return `
You are interpreting housing evidence for Product Z.

Assess the reported security situation at the property using the supplied
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
- The conclusion must be exactly one of: SECURE, CAUTIOUS, INSECURE, UNRESOLVED.
- SECURE means the evidence supports that the property has strong security measures and no significant reported concerns.
- CAUTIOUS means the evidence is mixed — some security measures are present but the picture is not settled, or reports are adjacent rather than consistent.
- INSECURE means the evidence supports that the property has weak or absent security measures, or significant reported concerns.
- UNRESOLVED means the evidence is insufficient, contradictory, or ambiguous.

Security-specific interpretation:
- A security observation reports access control, personnel presence, and security features.
- Access control has three states, in order of increasing restriction:
  - OPEN_ACCESS: no barriers to entry, anyone can walk in.
  - CONTROLLED_ACCESS: some barrier exists but entry is possible (e.g. gate that opens, unlocked door).
  - RESTRICTED_ACCESS: meaningful barrier requiring permission or key to pass.
- Personnel has two states: NONE_OBSERVED (no guard seen) and PRESENT (guard or security personnel observed).
- Features is a set of physical measures: gate, fence, wall, security lighting, CCTV, guard post, access control system, or other.
- Access control is the primary axis for agreement. Two observations that report the same access control level agree on the fundamental question of how restricted the property is.
- Personnel difference between observations that otherwise agree on access control is a nuance to note in considerations, not a contradiction.
- Feature overlap between observations is context. Different feature lists do not make two observations contradictory if their access control agrees.

Evidence interpretation:
- Raw observations are individual reports. Consolidated claims group observations that report the same access control and personnel combination.
- A consolidated claim is not independent confirmation of the observations it contains. Use observationCount and observationIds to understand how many reports contribute to it.
- Claim agreement analysis compares distinct consolidated claims.
- STRONG_AGREEMENT means both claims report the same access control level.
- MIXED_AGREEMENT means the claims report adjacent access control levels.
- CONTRADICTORY_EVIDENCE means the claims report opposite access control levels.
- NOT_COMPARABLE means at least one claim does not report access control. Do not treat such claims as agreement or contradiction.
- Recency classification is category-specific. For SECURITY:
  - RECENT means observed within the last ${securityRecency.recentDays} days.
  - NEITHER means observed more than ${securityRecency.recentDays} but no more than ${securityRecency.oldDays} days ago.
  - OLD means observed more than ${securityRecency.oldDays} days ago.
- RECENT observations describe the current period and are the strongest evidence available. Do not describe recent evidence as old, stale, or lacking recency.
- When multiple RECENT observations contradict each other on access control, state that recent reports conflict. The correct framing is a genuine recent contradiction.
- temporalAgreement interpretations: CONSISTENT, POSSIBLE_CHANGE, UNRESOLVED_DISAGREEMENT. A POSSIBLE_CHANGE means the timing between observations is large enough that the security situation may have changed.
- When observations show a progression toward more restriction over time (OPEN_ACCESS → CONTROLLED_ACCESS → RESTRICTED_ACCESS) and the most recent observation is RECENT, acknowledge the possible improvement but do not conclude SECURE without corroboration.
- When observations show a progression toward less restriction over time, acknowledge the possible deterioration but do not conclude INSECURE without corroboration.

Confidence describes how strongly the evidence supports the conclusion.

CRITICAL CONFIDENCE RULE:
- confidence must be LOW, MODERATE, or HIGH.
- Never use UNRESOLVED as the confidence value.
- If conclusion is UNRESOLVED, choose LOW, MODERATE, or HIGH based on evidence strength.
- Never copy the conclusion value into confidence.

Recency rules:
- Old observations describe a historical condition and must not establish the current condition.
- If all available observations are OLD, conclude UNRESOLVED.
- Agreement between old observations does not establish the current security condition.

Required structure:
{
  "conclusion": "SECURE | CAUTIOUS | INSECURE | UNRESOLVED",
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