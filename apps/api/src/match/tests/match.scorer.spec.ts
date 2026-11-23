import { describe, expect, it } from 'vitest';
import { scorePair, SCORE_THRESHOLD, type ScoreableProperty } from '../match.scorer.js';

const base = (overrides: Partial<ScoreableProperty> = {}): ScoreableProperty => ({
  propertyType: 'APARTMENT',
  stateId: 'lagos',
  placeId: 'yaba',
  address: '14 Herbert Macaulay Way',
  street: 'Herbert Macaulay Way',
  houseNumber: '14',
  landmark: 'Opposite Yaba Tech',
  latitude: 6.5095,
  longitude: 3.3711,
  ...overrides,
});

describe('scorePair', () => {
  it('returns 0 for properties in different states (hard gate)', () => {
    const a = base();
    const b = base({ stateId: 'abuja' });
    const result = scorePair(a, b);
    expect(result.score).toBe(0);
    expect(result.reasons).toEqual([]);
  });

  it('scores a near-identical pair above threshold', () => {
    const a = base();
    // Same everything, coords ~40m away (roughly half a plot)
    const b = base({ latitude: 6.5097, longitude: 3.3712 });
    const result = scorePair(a, b);
    expect(result.score).toBeGreaterThan(SCORE_THRESHOLD);
    expect(result.score).toBeGreaterThan(0.9);
  });

  it('scores the same address with no coords above threshold', () => {
    const a = base({ latitude: null, longitude: null });
    const b = base({ latitude: null, longitude: null });
    const result = scorePair(a, b);
    expect(result.score).toBeGreaterThan(SCORE_THRESHOLD);
    // With no distance signal, address + type + state + place should dominate.
    expect(result.reasons.some((r) => r.type === 'ADDRESS')).toBe(true);
    expect(result.reasons.some((r) => r.type === 'DISTANCE')).toBe(false);
  });

  it('scores different addresses in the same area below threshold', () => {
    const a = base();
    const b = base({
      address: '5 Bode Thomas Street',
      street: 'Bode Thomas Street',
      houseNumber: '5',
      landmark: null,
      latitude: 6.5000,
      longitude: 3.3500,
    });
    const result = scorePair(a, b);
    expect(result.score).toBeLessThan(SCORE_THRESHOLD);
  });

  it('reports a DISTANCE reason with meters when both have coords', () => {
    const a = base();
    const b = base({ latitude: 6.5097, longitude: 3.3712 });
    const result = scorePair(a, b);
    const distanceReason = result.reasons.find((r) => r.type === 'DISTANCE');
    expect(distanceReason).toBeDefined();
    if (distanceReason?.type === 'DISTANCE') {
      expect(distanceReason.meters).toBeGreaterThan(0);
      expect(distanceReason.meters).toBeLessThan(100);
    }
  });

  it('skips LANDMARK when only one side has it', () => {
    const a = base();
    const b = base({ landmark: null });
    const result = scorePair(a, b);
    expect(result.reasons.some((r) => r.type === 'LANDMARK')).toBe(false);
  });

  it('skips PLACE when only one side has a placeId', () => {
    const a = base();
    const b = base({ placeId: null });
    const result = scorePair(a, b);
    expect(result.reasons.some((r) => r.type === 'PLACE')).toBe(false);
  });

  it('reports PLACE when both have the same placeId', () => {
    const a = base();
    const b = base({ latitude: 6.5097, longitude: 3.3712 });
    const result = scorePair(a, b);
    const placeReason = result.reasons.find((r) => r.type === 'PLACE');
    expect(placeReason).toBeDefined();
    if (placeReason?.type === 'PLACE') {
      expect(placeReason.same).toBe(true);
    }
  });

  it('returns score <= 1 for any input', () => {
    const a = base();
    const b = base();
    expect(scorePair(a, b).score).toBeLessThanOrEqual(1);
  });

  it('returns score >= 0 for any input', () => {
    const a = base({ address: null, street: null, houseNumber: null, latitude: null, longitude: null });
    const b = base({ propertyType: 'HOUSE', address: null, street: null, houseNumber: null, latitude: null, longitude: null });
    expect(scorePair(a, b).score).toBeGreaterThanOrEqual(0);
  });
});