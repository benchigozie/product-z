import type { BuildingConditionIntelligenceInput } from '../types/building-condition-intelligence-input.type.js';
import { EVIDENCE_RECENCY_RULES } from '../evidence/evidence-recency.rules.js';

export class BuildingConditionIntelligencePrompt {
    build(input: BuildingConditionIntelligenceInput): string {
        const observationIds = input.observations.map(
            (observation) => observation.id,
        );

        const buildingRecency = EVIDENCE_RECENCY_RULES.BUILDING_CONDITION;

        return `
You are interpreting housing evidence for Product Z.

Assess the reported building condition at the property using the supplied
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
- The conclusion must be exactly one of: SOUND, CONCERNING, UNSAFE, UNRESOLVED.
- SOUND means the evidence supports that the building is in good or very good condition with no significant issues.
- CONCERNING means the evidence supports that the building has fair condition or minor issues that warrant noting but do not make it unsafe.
- UNSAFE means the evidence supports that the building is in poor or very poor condition, or has significant issues affecting its safety or habitability.
- UNRESOLVED means the evidence is insufficient, contradictory, or ambiguous.

Building condition-specific interpretation:
- A building condition observation reports:
  - condition: an overall assessment of the building from VERY_POOR to VERY_GOOD.
  - issues: a list of specific problems found. Each issue has a type (MOULD, CRACKING, WATER_DAMAGE, LEAK, BROKEN, OTHER) and optionally a component indicating where it was observed (WALLS, CEILING, FLOORS, ROOF, DOORS_WINDOWS, PLUMBING, ELECTRICAL, OTHER).
  - components: a list of building parts that were examined or mentioned.
  - description: optional free-text context.
- The condition rating is the primary axis. It reflects the reporter's overall assessment of the building.
- Specific issues (mould, cracking, leaks, water damage) and their components are secondary: they inform the reasoning and considerations but do not determine the conclusion independently of the condition rating.
- A single severe issue (e.g. structural cracking, widespread water damage) is worth noting prominently even if the reported condition is not very poor. Do not understate a serious specific issue just because the overall condition rating was optimistic.
- Conversely, an observation reporting FAIR or GOOD condition with no specific issues should be treated as genuinely positive, not suspicious.

Evidence interpretation:
- Raw observations are individual reports. Consolidated claims group observations that report the same condition and the same set of issues.
- A consolidated claim is not independent confirmation of the observations it contains. Use observationCount and observationIds to understand how many reports contribute to it.
- Claim agreement analysis compares distinct consolidated claims.
- STRONG_AGREEMENT means the same condition rating.
- MIXED_AGREEMENT means adjacent condition ratings (e.g. GOOD vs FAIR, or FAIR vs POOR).
- CONTRADICTORY_EVIDENCE means condition ratings two or more levels apart (e.g. GOOD vs VERY_POOR).
- Recency classification is category-specific. For BUILDING_CONDITION:
  - RECENT means observed within the last ${buildingRecency.recentDays} days.
  - NEITHER means observed more than ${buildingRecency.recentDays} but no more than ${buildingRecency.oldDays} days ago.
  - OLD means observed more than ${buildingRecency.oldDays} days ago.
- RECENT observations describe the current period and are the strongest evidence available. Do not describe recent evidence as old, stale, or lacking recency.
- When multiple RECENT observations contradict each other on condition, state that recent reports conflict.
- temporalAgreement interpretations:
  - CONSISTENT: the observations agree and timing is not a factor.
  - POSSIBLE_CHANGE: the observations contradict each other and the time gap is large enough that the building condition may have genuinely changed. These are NOT simultaneous conflicting reports — they describe the building at different points in time. The correct reading is "the condition may have shifted from one state to another."
  - UNRESOLVED_DISAGREEMENT: the contradiction is recent — no time for the building to have changed, so the disagreement stands.
- When a pair of observations is marked POSSIBLE_CHANGE, do not treat them as simultaneous conflicting reports. They describe the building at different times.
- When recent observations show a progression toward improvement over time (e.g. VERY_POOR → FAIR → GOOD) and the most recent observation is RECENT, explicitly acknowledge the possible improvement in the reason even if you conclude UNRESOLVED. Do not conclude SOUND without corroboration, but do not describe the evidence as unresolved without noting the temporal progression.
- When recent observations show a progression toward deterioration, acknowledge the concern but do not conclude UNSAFE without corroboration.

Confidence describes how strongly the evidence supports the conclusion.

CRITICAL CONFIDENCE RULE:
- confidence must be LOW, MODERATE, or HIGH.
- Never use UNRESOLVED as the confidence value.
- If conclusion is UNRESOLVED, choose LOW, MODERATE, or HIGH based on evidence strength.
- Never copy the conclusion value into confidence.

Recency rules:
- Old observations describe a historical condition and must not establish the current condition.
- If all available observations are OLD, conclude UNRESOLVED.
- Agreement between old observations does not establish the current building condition.

Required structure:
{
  "conclusion": "SOUND | CONCERNING | UNSAFE | UNRESOLVED",
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