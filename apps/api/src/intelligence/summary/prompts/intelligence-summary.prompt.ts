import type { ConclusionState } from '../../enums/conclusion-state.enum.js';
import type { IntelligenceConfidence } from '../../enums/intelligence-confidence.enum.js';

export type SummarySubjectType = 'PROPERTY' | 'PLACE';

export interface CategoryIntelligenceForSummary {
    category: string;
    conclusion: ConclusionState;
    confidence: IntelligenceConfidence;
    reason: string;
    considerations: string[];
}

export class IntelligenceSummaryPrompt {
    build(
        subjectType: SummarySubjectType,
        subjectName: string,
        categories: CategoryIntelligenceForSummary[],
        variantCount = 5,
    ): string {
        const categoryBlocks = categories
            .map((c) => {
                const considerations =
                    c.considerations.length > 0
                        ? `\n  Considerations: ${c.considerations.join(' | ')}`
                        : '';
                return `- ${c.category}:
  Conclusion: ${c.conclusion}
  Confidence: ${c.confidence}
  Reason: ${c.reason}${considerations}`;
            })
            .join('\n\n');

        const subjectLabel =
            subjectType === 'PROPERTY'
                ? `a property called "${subjectName}"`
                : `an area called "${subjectName}"`;

        const audienceLine =
            subjectType === 'PROPERTY'
                ? 'a prospective renter evaluating this specific property'
                : 'a prospective renter considering this area';

        const subjectNoun =
            subjectType === 'PROPERTY' ? 'property' : 'area';

        return `
You are writing a short, plain-language summary of the living conditions
for ${subjectLabel}. The summary is for ${audienceLine}. It synthesizes
the intelligence Product Z has already derived from resident and
inspector observations.

The intelligence available for this ${subjectNoun}:

${categoryBlocks}

Your task:

Write ${variantCount} different one-paragraph summaries of this
${subjectNoun}'s situation. Each summary should:

1. Be written for a renter, not an analyst. Use plain English. Do not use
   enum names like PRESENT, ABSENT, MIXED, UNRESOLVED. Translate them to
   natural language ("reliable", "unavailable", "sometimes available",
   "mixed reports").

2. Describe what is actually known about the ${subjectNoun} across
   the categories above. Combine the categories into a coherent picture,
   not a list. If power is reliable and water is unreliable, say so in a
   way that reads naturally — not "Power: PRESENT. Water: MIXED."

3. Preserve uncertainty honestly. If a category is UNRESOLVED, the
   summary should say the situation is unclear, not resolved. If
   confidence is LOW, the language should reflect that ("reports
   suggest" rather than "the ${subjectNoun} has").

4. Not invent facts. Do not mention specific issues, dates, sources, or
   problems that are not stated in the intelligence above. Do not
   speculate about repairs, landlords, or neighbours. Only describe what
   the intelligence supports.

5. Not mention what is missing. Do not say "no information about
   security" or "power data was not available." Describe only what is
   known. Missing categories are a UI concern, not a summary concern.

6. Not repeat the technical language. Do not say "based on 3 observations"
   or "evidence references" — the renter does not need that. Describe
   the condition, not the evidence.

7. Be concise. Each summary should be 2–4 sentences. Long enough to
   communicate the picture, short enough to read in one breath.

Each variant must be semantically equivalent to the others. They should
differ only in phrasing, ordering, and emphasis — NOT in the actual
claims. Do not have one variant say "reliable power" and another say
"unreliable power". They describe the same situation from different
angles.

Tone: neutral, factual, informative. Not salesy. Not cautionary. Not
overly positive or negative. A summary a sensible friend would give.

Return only a valid JSON object with this exact structure:

{
  "variants": [
    "First variant paragraph.",
    "Second variant paragraph.",
    "Third variant paragraph.",
    "Fourth variant paragraph.",
    "Fifth variant paragraph."
  ]
}

Do not include any text outside the JSON object. No Markdown fences.
`.trim();
    }
}