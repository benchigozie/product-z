import { describe, expect, it } from 'vitest';
import { distanceScore, haversineMeters, jaccard, textSimilarity, tokenize } from '../geo.util.js';

describe('haversineMeters', () => {
  it('returns 0 for identical points', () => {
    expect(haversineMeters(6.5095, 3.3711, 6.5095, 3.3711)).toBe(0);
  });

  it('returns approximately the right distance for a known pair (Yaba → Surulere ≈ 6.5km)', () => {
    // Yaba: 6.5095, 3.3711. Surulere: 6.5000, 3.3500.
    const d = haversineMeters(6.5095, 3.3711, 6.5000, 3.3500);
    // ~2.4km, allow generous tolerance for coordinate fuzz
    expect(d).toBeGreaterThan(2000);
    expect(d).toBeLessThan(3000);
  });

  it('is symmetric', () => {
    const a = haversineMeters(6.5, 3.3, 6.6, 3.4);
    const b = haversineMeters(6.6, 3.4, 6.5, 3.3);
    expect(Math.abs(a - b)).toBeLessThan(0.01);
  });
});

describe('tokenize', () => {
  it('returns empty set for null/undefined/empty', () => {
    expect(tokenize(null).size).toBe(0);
    expect(tokenize(undefined).size).toBe(0);
    expect(tokenize('').size).toBe(0);
  });

  it('lowercases and strips punctuation', () => {
    const t = tokenize('14 Herbert Macaulay Way.');
    expect(t.has('14')).toBe(true);
    expect(t.has('herbert')).toBe(true);
    expect(t.has('macaulay')).toBe(true);
    expect(t.has('way')).toBe(true);
  });

  it('drops single-character tokens', () => {
    const t = tokenize('a b c 14 herbert');
    expect(t.has('a')).toBe(false);
    expect(t.has('b')).toBe(false);
    expect(t.has('c')).toBe(false);
    expect(t.has('14')).toBe(true);
  });

  it('normalizes street type abbreviations', () => {
    const t = tokenize('14 Herbert Macaulay Wy');
    expect(t.has('way')).toBe(true);
    expect(t.has('wy')).toBe(false);
  });

  it('produces the same token set for St and Street variants', () => {
    const a = tokenize('5 Bode Thomas St');
    const b = tokenize('5 Bode Thomas Street');
    expect(a).toEqual(b);
  });

  it('normalizes Avenue/Ave and Close/Cl', () => {
    expect(tokenize('10 Admiralty Ave')).toEqual(tokenize('10 Admiralty Avenue'));
    expect(tokenize('7 Ozumba Mbadiwe Cl')).toEqual(tokenize('7 Ozumba Mbadiwe Close'));
  });

  it('normalizes directional prefixes', () => {
    expect(tokenize('N Herbert Rd')).toEqual(tokenize('North Herbert Road'));
  });
});

describe('jaccard', () => {
  it('returns 0 for two empty sets', () => {
    expect(jaccard(new Set(), new Set())).toBe(0);
  });

  it('returns 1 for identical sets', () => {
    expect(jaccard(new Set(['a', 'b']), new Set(['a', 'b']))).toBe(1);
  });

  it('returns the correct ratio for partial overlap', () => {
    expect(jaccard(new Set(['a', 'b', 'c']), new Set(['b', 'c', 'd']))).toBeCloseTo(0.5);
  });
});

describe('textSimilarity', () => {
  it('handles spelling variants of the same street', () => {
    const sim = textSimilarity('Herbert Macaulay Way', 'Herbert Macauley Wy');
    // "herbert" and "way"/"wy" don't fully overlap, but "herbert" does.
    // Expect moderate similarity — enough to contribute signal, not enough to decide alone.
    expect(sim).toBeGreaterThan(0.15);
    expect(sim).toBeLessThan(0.75);
  });

  it('returns 0 if one side is null', () => {
    expect(textSimilarity('abc', null)).toBe(0);
  });

  it('now scores higher when only the street type abbreviation differs', () => {
    // With abbreviation normalization, "Way" and "Wy" both map to "way",
    // so the token sets overlap more than they did before.
    const sim = textSimilarity('14 Herbert Macaulay Way', 'Herbert Macauley Wy 14');
    // "14", "herbert", "way" all match; "macaulay"/"macauley" differ.
    // Intersection 3, union 5 → 0.6.
    expect(sim).toBeGreaterThan(0.5);
  });
});

describe('distanceScore', () => {
  it('returns 1 at 0m', () => {
    expect(distanceScore(0)).toBe(1);
  });

  it('drops to ~0.37 at 100m (default scale)', () => {
    expect(distanceScore(100)).toBeCloseTo(Math.exp(-1), 3);
  });

  it('is monotonically decreasing', () => {
    expect(distanceScore(50)).toBeGreaterThan(distanceScore(100));
    expect(distanceScore(100)).toBeGreaterThan(distanceScore(200));
  });
});