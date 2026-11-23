/**
 * Pure geo + string helpers used by the match scorer.
 * No framework dependencies, no DB access — trivially unit-testable.
 */

const EARTH_RADIUS_M = 6_371_000;

/**
 * Canonical mappings for common Nigerian address abbreviations.
 *
 * Applied during tokenization: every token is looked up here before being
 * added to the set. So "Way" and "Wy" become the same token ("way"),
 * "Street" and "St" become "street", etc.
 *
 * The goal is to catch real-world variance in how the same street gets
 * written, without introducing fuzzy matching (which would require a
 * similarity threshold and risks false positives like "Bay"/"Way").
 *
 * Only add entries here when the abbreviation unambiguously means the
 * same thing. Do NOT add entries that could be ambiguous — e.g. "E"
 * could mean "East" or "Estate"; leave those out and let the scorer
 * deal with the ambiguity through weight redistribution.
 */
const ABBREVIATIONS: Record<string, string> = {
  // Street types
  st: 'street',
  str: 'street',
  rd: 'road',
  ave: 'avenue',
  av: 'avenue',
  cl: 'close',
  cres: 'crescent',
  dr: 'drive',
  ln: 'lane',
  pl: 'place',
  blvd: 'boulevard',
  wy: 'way',
  hwy: 'highway',
  expy: 'expressway',
  cres_: 'crescent', // defensive; won't fire but documents intent

  // Estates / areas
  est: 'estate',
  ph: 'phase',

  // Directionals
  n: 'north',
  s: 'south',
  e: 'east',
  w: 'west',
};

/**
 * Great-circle distance between two lat/lng points, in meters.
 * Haversine formula. Accurate to ~0.5% for the distances we care about
 * (neighborhood scale, not continental scale), which is more than enough
 * for match suggestion thresholds.
 *
 * Latitude and longitude are in degrees. Order matters: (lat, lng), not (lng, lat).
 */
export function haversineMeters(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);

  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Tokenize a string for similarity comparison.
 *
 * Pipeline:
 *   1. Lowercase
 *   2. Replace non-alphanumeric with whitespace
 *   3. Split on whitespace
 *   4. Expand single-char directional prefixes (N/S/E/W) via ABBREVIATIONS
 *   5. Drop remaining tokens shorter than 2 chars
 *   6. Map known abbreviations to their canonical form
 *   7. Deduplicate (Set)
 *
 * Step 4 runs before the length filter because directional prefixes are
 * genuinely 1 char ("N Herbert Rd" / "North Herbert Road") and would
 * otherwise be dropped as noise. Only the four entries in ABBREVIATIONS
 * survive that expansion; arbitrary 1-char tokens (a, b, c) still get
 * filtered out at step 5.
 *
 * Deliberately simple — no stemming, no stopword list, no fuzzy matching.
 * Nigerian street names vary mostly in spelling and word order; Jaccard
 * over normalized tokens handles that well enough at suggestion-quality.
 */
export function tokenize(input: string | null | undefined): Set<string> {
  if (!input) return new Set();
  const cleaned = input.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const raw = cleaned.split(/\s+/);

  const normalized: string[] = [];
  for (const t of raw) {
    if (t.length === 0) continue;

    // Single-char directional prefixes: expand before the length filter
    // so "N" survives as "north". Anything else 1-char is dropped.
    if (t.length === 1) {
      const expanded = ABBREVIATIONS[t];
      if (expanded) normalized.push(expanded);
      continue;
    }

    normalized.push(ABBREVIATIONS[t] ?? t);
  }

  return new Set(normalized);
}

/**
 * Jaccard similarity of two token sets: |A ∩ B| / |A ∪ B|, in [0, 1].
 * Empty ∪ empty returns 0 (two empty strings are not "the same" for our purposes —
 * missing data should not count as a positive signal).
 */
export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const t of a) {
    if (b.has(t)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Jaccard similarity over a concatenated string. Convenience wrapper.
 */
export function textSimilarity(
  a: string | null | undefined,
  b: string | null | undefined,
): number {
  return jaccard(tokenize(a), tokenize(b));
}

/**
 * Exponential distance decay. Returns 1 at 0m, ~0.37 at 100m, ~0.14 at 200m.
 * The `scaleM` parameter is the distance at which the score drops to ~0.37
 * (one e-fold). Default 100m matches the "same property within a plot or two"
 * intuition for Nigerian residential addresses.
 */
export function distanceScore(meters: number, scaleM = 100): number {
  return Math.exp(-meters / scaleM);
}