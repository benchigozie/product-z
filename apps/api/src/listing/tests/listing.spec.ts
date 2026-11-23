import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ListingService } from '../listing.service.js';
import type { MatchSuggestionService } from '../../match/match-suggestion.service.js';

describe('ListingService', () => {
  let service: ListingService;
  let repo: any;
  let matchSuggestionService: MatchSuggestionService;

  beforeEach(() => {
    repo = {
      findPropertyById: vi.fn(),
      searchProperties: vi.fn(),
      createProvisionalProperty: vi.fn(),
      createListing: vi.fn(),
      createPrice: vi.fn(),
      createFees: vi.fn(),
      attachMedia: vi.fn(),
      findById: vi.fn(),
      findPriceByListingId: vi.fn(),
      findFeesByListingId: vi.fn(),
      findMediaByListingId: vi.fn(),
      updateListing: vi.fn(),
      replacePrice: vi.fn(),
      deleteFeesByListingId: vi.fn(),
      isVerifiedLandlord: vi.fn(),
    };
    matchSuggestionService = {
      generateForProperty: vi.fn().mockResolvedValue(undefined),
    } as unknown as MatchSuggestionService;
    service = new ListingService(repo, matchSuggestionService);
  });

  it('create fails when no propertyId and no propertyType/countryId/stateId', async () => {
    await expect(
      service.create('u1', {
        kind: 'RENT',
        title: 'x',
        displayLocation: 'Surulere',
        price: { amountKobo: 1, currency: 'NGN', period: 'MONTHLY' },
      } as any),
    ).rejects.toThrow(/propertyType, countryId, and stateId/);
  });

  it('create attaches to existing property', async () => {
    repo.findPropertyById.mockResolvedValue({ id: 'p1', mergedIntoId: null });
    repo.createListing.mockResolvedValue({ id: 'l1' });
    repo.findById.mockResolvedValue({ id: 'l1', status: 'DRAFT' });
    repo.findPriceByListingId.mockResolvedValue({ amount: 100, currency: 'NGN', period: 'MONTHLY', years: null });
    repo.findFeesByListingId.mockResolvedValue([]);
    repo.findMediaByListingId.mockResolvedValue([]);

    const result = await service.create('u1', {
      kind: 'RENT',
      title: 't',
      displayLocation: 'Surulere',
      propertyId: 'p1',
      price: { amountKobo: 100, currency: 'NGN', period: 'MONTHLY' },
    } as any);

    expect(result.id).toBe('l1');
    expect(repo.createProvisionalProperty).not.toHaveBeenCalled();
  });

  it('update rejects non-owner non-landlord', async () => {
    repo.findById.mockResolvedValue({
      id: 'l1',
      createdByUserId: 'u2',
      status: 'DRAFT',
      propertyId: 'p1',
    });
    repo.isVerifiedLandlord.mockResolvedValue(false);

    await expect(
      service.update('u1', 'l1', { title: 'x' }),
    ).rejects.toThrow(/cannot manage/);
  });

  it('update rejects non-DRAFT', async () => {
    repo.findById.mockResolvedValue({
      id: 'l1',
      createdByUserId: 'u1',
      status: 'ACTIVE',
      propertyId: 'p1',
    });

    await expect(
      service.update('u1', 'l1', { title: 'x' }),
    ).rejects.toThrow(/Only DRAFT/);
  });
});