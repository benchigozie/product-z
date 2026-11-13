export class ObservationIngestionPrompt {
    build(text: string): string {
        return `
You are extracting structured housing observations from a resident's or
inspector's free-form text about a property. Your job is to identify which
of Product Z's categories the text describes, and for each category,
produce a structured observation using the category's schema.

Input text:
"""
${text}
"""

Categories and their schemas. For each category, only extract an
observation if the text provides enough information to fill the required
fields. Do not invent or assume values. If a field cannot be determined
from the text, omit it (or omit the whole observation if a required field
is missing).

- POWER
  Required: source (array of GRID / GENERATOR / INVERTER), availability (AVAILABLE / INTERMITTENT / UNAVAILABLE)
  Optional: reliability (VERY_POOR / POOR / FAIR / GOOD / EXCELLENT)

- WATER
  Required: source (array of PUBLIC_SUPPLY / BOREHOLE / WELL / RIVER_STREAM / WATER_VENDOR / RAINWATER / OTHER), availability (AVAILABLE / INTERMITTENT / UNAVAILABLE)
  Optional: reliability (VERY_POOR / POOR / FAIR / GOOD / EXCELLENT)

- INTERNET
  Required: provider (string), connectionType (MOBILE_DATA / FIBRE / FIXED_WIRELESS / SATELLITE / OTHER), availability (AVAILABLE / INTERMITTENT / UNAVAILABLE)
  Optional: reliability (VERY_POOR / POOR / FAIR / GOOD / EXCELLENT), coverage (POOR / FAIR / GOOD / EXCELLENT)

- FLOODING
  Required: occurrence (FLOODING_OBSERVED / EVIDENCE_OF_PAST_FLOODING / NO_FLOODING_OBSERVED), extent (PROPERTY / IMMEDIATE_ACCESS / STREET / WIDER_AREA)
  Optional: severity (MINOR / MODERATE / SEVERE), conditions (string describing when it happens)

- SECURITY
  Required: at least one of accessControl (OPEN_ACCESS / CONTROLLED_ACCESS / RESTRICTED_ACCESS), personnel (NONE_OBSERVED / PRESENT), features (array of GATE / FENCE / WALL / SECURITY_LIGHTING / CCTV / GUARD_POST / ACCESS_CONTROL_SYSTEM / OTHER)

- SANITATION
  Required: condition (CLEAN / FAIR / POOR / VERY_POOR)
  Optional: description (string)

- ROAD_ACCESS
  Required: condition (VERY_POOR / POOR / FAIR / GOOD / VERY_GOOD), accessibility (array of WALKING / MOTORCYCLE / CAR / LARGE_VEHICLE)

- BUILDING_CONDITION
  Required: condition (VERY_POOR / POOR / FAIR / GOOD / VERY_GOOD), issues (array of { issue: MOULD | CRACKING | WATER_DAMAGE | LEAK | BROKEN | OTHER, component?: WALLS | CEILING | FLOORS | ROOF | DOORS_WINDOWS | PLUMBING | ELECTRICAL | OTHER }), components (array of the same component enum)
  Optional: description (string)

Rules:
1. Only extract an observation for a category if the text gives enough
   information to fill that category's required fields with certainty.
2. If a text mentions multiple categories, produce multiple observations.
3. If a category is mentioned but the required fields cannot be filled,
   do not produce an observation for that category. Do not guess.
4. Do not invent facts. Do not add details not present in the text.
5. Each observation's description field must be the fragment of the
   original text that produced it — the shortest meaningful excerpt that
   supports the observation. Not the whole text; the relevant part.
6. Do not extract observations for categories that are not mentioned.
7. If nothing in the text can be parsed into any category, return an
   empty observations array.

Return only valid JSON in this exact shape, with no Markdown fences:

{
  "observations": [
    {
      "category": "POWER",
      "data": { "source": ["GRID"], "availability": "INTERMITTENT" },
      "description": "the power comes and goes"
    }
  ]
}
`.trim();
    }
}