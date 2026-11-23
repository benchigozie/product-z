import { distanceScore, haversineMeters, textSimilarity } from './geo.util.js';
import type { MatchReason } from './types/match-reason.type.js';

/**
 * The subset of Property fields the scorer needs. Kept narrow so tests can
 * construct fixtures without a full Property row, and so the scorer has no
 * hidden dependency on the shape of the database model.
 */
export type ScoreableProperty = {
  propertyType: string;
  stateId: string;
  placeId: string | null;
  address: string | null;
  street: string | null;
  houseNumber: string | null;
  landmark: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type ScoreResult = {
  score: number;      // 0..1
  reasons: MatchReason[];
};

export const SCORE_THRESHOLD = 0.5;

// Weights. Sum to 1.0 when all signals are present. When a signal is missing,
// its weight is redistributed proportionally to the remaining signals — see
// `redistribute` below. Do not change these without re-running the scorer tests
// and re-validating against a sample of real duplicate pairs.
const WEIGHTS = {
  distance: 0.40,
  address:  0.25,
  landmark: 0.10,
  type:     0.10,
  state:    0.05,
  place:    0.10,
} as const;

type SignalKey = keyof typeof WEIGHTS;

/**
 * Score a candidate pair of properties for "is this the same property?".
 *
 * Hard gates (return 0 immediately):
 *   - different stateId (properties in different states are never the same)
 *
 * Soft signals (combined by weighted sum):
 *   - distance between geo points (exponential decay)
 *   - token Jaccard over address + street + houseNumber
 *   - token Jaccard over landmark
 *   - propertyType equality
 *   - placeId equality (only counts if both non-null)
 *
 * Missing signals have their weight redistributed proportionally across the
 * signals that ARE present, so a property with no geo is not penalized for
 * the absence of distance — it's scored on the evidence it does have.
 */
export function scorePair(
  source: ScoreableProperty,
  candidate: ScoreableProperty,
): ScoreResult {
  // Hard gate: different states can never be the same property.
  if (source.stateId !== candidate.stateId) {
    return { score: 0, reasons: [] };
  }

  const signals: Partial<Record<SignalKey, { value: number; reason: MatchReason }>> = {};

  // Distance — only counts if both have coordinates.
  if (
    source.latitude  != null && source.longitude != null &&
    candidate.latitude != null && candidate.longitude != null
  ) {
    const meters = haversineMeters(source.latitude, source.longitude, candidate.latitude, candidate.longitude);
    signals.distance = {
      value: distanceScore(meters),
      reason: { type: 'DISTANCE', meters, weight: WEIGHTS.distance },
    };
  }

  // Address — concat address/street/houseNumber so "14 Herbert Macaulay Way"
  // matches "Herbert Macaulay Wy 14" regardless of field boundary.
  const addressA = [source.address, source.street, source.houseNumber].filter(Boolean).join(' ');
  const addressB = [candidate.address, candidate.street, candidate.houseNumber].filter(Boolean).join(' ');
  if (addressA && addressB) {
    const sim = textSimilarity(addressA, addressB);
    // Only report the signal if there's meaningful evidence either way.
    // Zero-similarity on non-empty strings is informative (different addresses),
    // so we include it, but a reader of the queue will see similarity: 0 and
    // know the address did not agree.
    signals.address = {
      value: sim,
      reason: { type: 'ADDRESS', similarity: sim, weight: WEIGHTS.address },
    };
  }

  // Landmark — same treatment, but only if BOTH sides have one. A landmark on
  // one side and nothing on the other is not evidence of sameness OR difference;
  // it's just absence of evidence, so we skip it.
  if (source.landmark && candidate.landmark) {
    const sim = textSimilarity(source.landmark, candidate.landmark);
    signals.landmark = {
      value: sim,
      reason: { type: 'LANDMARK', similarity: sim, weight: WEIGHTS.landmark },
    };
  }

  // Type — always present (both sides have it).
  signals.type = {
    value: source.propertyType === candidate.propertyType ? 1 : 0,
    reason: { type: 'TYPE', same: source.propertyType === candidate.propertyType, weight: WEIGHTS.type },
  };

  // State — always present, and always "same" because we gated on it above.
  signals.state = {
    value: 1,
    reason: { type: 'STATE', same: true, weight: WEIGHTS.state },
  };

  // Place — only counts if both sides have a non-null placeId. Same rationale
  // as landmark: "both in Yaba" is evidence; "one says Yaba, one says nothing"
  // is not.
  if (source.placeId && candidate.placeId) {
    const same = source.placeId === candidate.placeId;
    signals.place = {
      value: same ? 1 : 0,
      reason: { type: 'PLACE', same, weight: WEIGHTS.place },
    };
  }

  // Redistribute weights of missing signals proportionally over present ones,
  // then compute the weighted sum.
  const present = Object.keys(signals) as SignalKey[];
  const presentWeightTotal = present.reduce((sum, k) => sum + WEIGHTS[k], 0);
  if (presentWeightTotal === 0) {
    return { score: 0, reasons: [] };
  }
  const scale = 1 / presentWeightTotal;

  let score = 0;
  const reasons: MatchReason[] = [];
  for (const k of present) {
    const s = signals[k]!;
    score += s.value * WEIGHTS[k] * scale;
    // Record the effective weight (after redistribution) so the queue UI can
    // render accurate contribution bars if it wants to.
    reasons.push({ ...s.reason, weight: WEIGHTS[k] * scale } as MatchReason);
  }

  return { score, reasons };
}

