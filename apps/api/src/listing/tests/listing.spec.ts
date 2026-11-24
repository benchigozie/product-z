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
      updateStatus: vi.fn(),
      replacePrice: vi.fn(),
      deleteFeesByListingId: vi.fn(),
      deleteMediaByListingId: vi.fn(),
      isVerifiedLandlord: vi.fn(),
      findExpiredActiveListings: vi.fn(),
    };
    matchSuggestionService = {
      generateForProperty: vi.fn().mockResolvedValue(undefined),
    } as unknown as MatchSuggestionService;
    service = new ListingService(repo, matchSuggestionService);
  });

  // ---------- create ----------

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
    repo.findPriceByListingId.mockResolvedValue({
      amount: 100,
      currency: 'NGN',
      period: 'MONTHLY',
      years: null,
    });
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
    expect(repo.createListing).toHaveBeenCalledOnce();
    expect(repo.createPrice).toHaveBeenCalledOnce();
  });

  // ---------- update ----------

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

  // ---------- transitions ----------

  describe('publish', () => {
    it('fails when listing not found', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.publish('u1', 'l1')).rejects.toThrow(/not found/);
    });

    it('fails when not owner', async () => {
      repo.findById.mockResolvedValue({
        id: 'l1',
        createdByUserId: 'u2',
        status: 'DRAFT',
        propertyId: 'p1',
        displayLocation: 'x',
      });
      repo.isVerifiedLandlord.mockResolvedValue(false);

      await expect(service.publish('u1', 'l1')).rejects.toThrow(/cannot manage/);
    });

    it('fails on non-DRAFT', async () => {
      repo.findById.mockResolvedValue({
        id: 'l1',
        createdByUserId: 'u1',
        status: 'ACTIVE',
        propertyId: 'p1',
        displayLocation: 'x',
      });

      await expect(service.publish('u1', 'l1')).rejects.toThrow(/DRAFT/);
    });

    it('fails without price', async () => {
      repo.findById.mockResolvedValue({
        id: 'l1',
        createdByUserId: 'u1',
        status: 'DRAFT',
        propertyId: 'p1',
        displayLocation: 'x',
      });
      repo.findPriceByListingId.mockResolvedValue(null);
      repo.findMediaByListingId.mockResolvedValue([{ id: 'm1' }]);

      await expect(service.publish('u1', 'l1')).rejects.toThrow(/price/);
    });

    it('fails without media', async () => {
      repo.findById.mockResolvedValue({
        id: 'l1',
        createdByUserId: 'u1',
        status: 'DRAFT',
        propertyId: 'p1',
        displayLocation: 'x',
      });
      repo.findPriceByListingId.mockResolvedValue({ amount: 1 });
      repo.findMediaByListingId.mockResolvedValue([]);

      await expect(service.publish('u1', 'l1')).rejects.toThrow(/photo/);
    });

    it('succeeds with price + media on DRAFT', async () => {
      repo.findById
        .mockResolvedValueOnce({
          id: 'l1',
          createdByUserId: 'u1',
          status: 'DRAFT',
          propertyId: 'p1',
          displayLocation: 'x',
          expiresAt: null,
        })
        .mockResolvedValueOnce({
          id: 'l1',
          createdByUserId: 'u1',
          status: 'ACTIVE',
          propertyId: 'p1',
          displayLocation: 'x',
        });
      repo.findPriceByListingId.mockResolvedValue({ amount: 1 });
      repo.findMediaByListingId.mockResolvedValue([{ id: 'm1' }]);
      repo.findFeesByListingId.mockResolvedValue([]);
      repo.updateListing.mockResolvedValue({});
      repo.updateStatus.mockResolvedValue({});

      const result = await service.publish('u1', 'l1');
      expect(result.status).toBe('ACTIVE');
      expect(repo.updateListing).toHaveBeenCalledOnce();
    });
  });

  describe('pause / activate', () => {
    it('pause requires ACTIVE', async () => {
      repo.findById.mockResolvedValue({
        id: 'l1',
        createdByUserId: 'u1',
        status: 'DRAFT',
      });

      await expect(service.pause('u1', 'l1')).rejects.toThrow(
        /Expected status ACTIVE/,
      );
    });

    it('pause succeeds from ACTIVE', async () => {
      repo.findById
        .mockResolvedValueOnce({
          id: 'l1',
          createdByUserId: 'u1',
          status: 'ACTIVE',
        })
        .mockResolvedValueOnce({
          id: 'l1',
          createdByUserId: 'u1',
          status: 'PAUSED',
        });
      repo.findPriceByListingId.mockResolvedValue(null);
      repo.findFeesByListingId.mockResolvedValue([]);
      repo.findMediaByListingId.mockResolvedValue([]);
      repo.updateStatus.mockResolvedValue({});

      const result = await service.pause('u1', 'l1');
      expect(result.status).toBe('PAUSED');
    });

    it('activate requires PAUSED', async () => {
      repo.findById.mockResolvedValue({
        id: 'l1',
        createdByUserId: 'u1',
        status: 'ACTIVE',
      });

      await expect(service.activate('u1', 'l1')).rejects.toThrow(
        /Expected status PAUSED/,
      );
    });
  });

  describe('withdraw', () => {
    it('fails from FILLED', async () => {
      repo.findById.mockResolvedValue({
        id: 'l1',
        createdByUserId: 'u1',
        status: 'FILLED',
      });

      await expect(service.withdraw('u1', 'l1')).rejects.toThrow(
        /Cannot withdraw/,
      );
    });

    it('succeeds from ACTIVE', async () => {
      repo.findById
        .mockResolvedValueOnce({
          id: 'l1',
          createdByUserId: 'u1',
          status: 'ACTIVE',
        })
        .mockResolvedValueOnce({
          id: 'l1',
          createdByUserId: 'u1',
          status: 'WITHDRAWN',
        });
      repo.findPriceByListingId.mockResolvedValue(null);
      repo.findFeesByListingId.mockResolvedValue([]);
      repo.findMediaByListingId.mockResolvedValue([]);
      repo.updateStatus.mockResolvedValue({});

      const result = await service.withdraw('u1', 'l1');
      expect(result.status).toBe('WITHDRAWN');
    });
  });

  describe('markFilled', () => {
    it('requires ACTIVE', async () => {
      repo.findById.mockResolvedValue({
        id: 'l1',
        createdByUserId: 'u1',
        status: 'PAUSED',
      });

      await expect(service.markFilled('u1', 'l1')).rejects.toThrow(
        /Expected status ACTIVE/,
      );
    });
  });
});