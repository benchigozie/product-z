import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Temporal as TemporalRuntime } from '@js-temporal/polyfill';
import type { Temporal } from 'temporal-spec';

import { ListingRepository } from './listing.repository.js';
import { MatchSuggestionService } from '../match/match-suggestion.service.js';
import type { CreateListingDto } from './dto/create-listing.dto.js';
import type { UpdateListingDto } from './dto/update-listing.dto.js';
import type { ListingRow } from './types/listing-result.type.js';
import type { ListingDetail } from './types/listing-result.type.js';

@Injectable()
export class ListingService {
  private readonly logger = new Logger(ListingService.name);

  constructor(
    private readonly repo: ListingRepository,
    private readonly matchSuggestionService: MatchSuggestionService,
  ) {}

  // ---------- Property search (dedup flow) ----------

  async searchProperties(params: { stateId: string; q: string }) {
    const rows = await this.repo.searchProperties(params);
    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      propertyType: p.propertyType,
      address: p.address,
      street: p.street,
      houseNumber: p.houseNumber,
      unitIdentifier: p.unitIdentifier,
      landmark: p.landmark,
      isProvisional: p.isProvisional,
      displayLocation: this.displayLocationOf(p),
    }));
  }

  // ---------- Create ----------

  async create(userId: string, dto: CreateListingDto): Promise<ListingDetail> {
    // 1. Resolve property: attach existing OR create provisional
    const propertyId = await this.resolveProperty(userId, dto);

    // 2. Create listing in DRAFT
    //    expiresAt column is temporal-typed; Temporal.Instant cannot add
    //    calendar units like days (they're ambiguous without a time zone),
    //    so we add hours explicitly.
    const expiresAt = dto.expiresInDays
    ? TemporalRuntime.Now.instant().add({ hours: dto.expiresInDays * 24 }) as Temporal.Instant
    : null;

    const listing = await this.repo.createListing({
      propertyId,
      createdByUserId: userId,
      kind: dto.kind,
      title: dto.title,
      description: dto.description,
      displayLocation: dto.displayLocation,
      bedrooms: dto.bedrooms,
      bathrooms: dto.bathrooms,
      sizeSqm: dto.sizeSqm,
      features: dto.features ?? null,
      expiresAt: expiresAt ?? undefined,
    });

    // 3. Price + fees
    await this.repo.createPrice({
      listingId: listing.id,
      amount: dto.price.amountKobo,
      currency: dto.price.currency,
      period: dto.price.period,
      years: dto.price.years,
    });

    if (dto.fees && dto.fees.length > 0) {
      await this.repo.createFees(
        dto.fees.map((f) => ({
          listingId: listing.id,
          type: f.type,
          amount: f.amountKobo,
          currency: f.currency,
          notes: f.notes,
        })),
      );
    }

    // 4. Media
    if (dto.mediaIds && dto.mediaIds.length > 0) {
      await this.repo.attachMedia({
        listingId: listing.id,
        mediaIds: dto.mediaIds,
      });
    }

    // 5. Fire-and-forget: look for possible duplicate properties.
    //    Deliberately not awaited — a failure here must not fail listing
    //    creation. Generation is idempotent, so retries are safe.
    void this.matchSuggestionService
      .generateForProperty(propertyId)
      .catch((err) => {
        this.logger.error(
          `match.generateForProperty failed for property ${propertyId}`,
          err instanceof Error ? err.stack : String(err),
        );
      });

    return this.getById(listing.id);
  }

  private async resolveProperty(
    userId: string,
    dto: CreateListingDto,
  ): Promise<string> {
    if (dto.propertyId) {
      const property = await this.repo.findPropertyById(dto.propertyId);
      if (!property) {
        throw new NotFoundException('Property not found');
      }
      if (property.mergedIntoId) {
        throw new BadRequestException(
          'Property has been merged into another; use the target property.',
        );
      }
      return property.id;
    }

    // Creating a new provisional property: required fields
    if (!dto.propertyType || !dto.countryId || !dto.stateId) {
      throw new BadRequestException(
        'When creating a new property, propertyType, countryId, and stateId are required.',
      );
    }

    const created = await this.repo.createProvisionalProperty({
      propertyType: dto.propertyType,
      countryId: dto.countryId,
      stateId: dto.stateId,
      placeId: dto.placeId,
      address: dto.address,
      street: dto.street,
      houseNumber: dto.houseNumber,
      unitIdentifier: dto.unitIdentifier,
      landmark: dto.landmark,
      latitude: dto.latitude,
      longitude: dto.longitude,
      bedrooms: dto.bedrooms,
      bathrooms: dto.bathrooms,
      sizeSqm: dto.sizeSqm,
      createdByUserId: userId,
    });

    return created.id;
  }

  // ---------- Read ----------

  async getById(id: string): Promise<ListingDetail> {
    const listing = await this.repo.findById(id);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const [price, fees, media] = await Promise.all([
      this.repo.findPriceByListingId(id),
      this.repo.findFeesByListingId(id),
      this.repo.findMediaByListingId(id),
    ]);

    return {
      ...listing,
      price,
      fees,
      media,
    };
  }

  // ---------- Update ----------

  async update(userId: string, id: string, dto: UpdateListingDto) {
    const listing = await this.repo.findById(id);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    await this.assertCanManage(userId, listing);

    if (listing.status !== 'DRAFT') {
      throw new ConflictException(
        'Only DRAFT listings can be edited. Pause the listing first.',
      );
    }

    const patch: Record<string, unknown> = {};
    if (dto.title !== undefined) patch.title = dto.title;
    if (dto.description !== undefined) patch.description = dto.description;
    if (dto.displayLocation !== undefined) patch.displayLocation = dto.displayLocation;
    if (dto.bedrooms !== undefined) patch.bedrooms = dto.bedrooms;
    if (dto.bathrooms !== undefined) patch.bathrooms = dto.bathrooms;
    if (dto.sizeSqm !== undefined) patch.sizeSqm = dto.sizeSqm;
    if (dto.features !== undefined) patch.features = dto.features;

    if (dto.expiresInDays !== undefined) {
      patch.expiresAt = TemporalRuntime.Now.instant().add({
        hours: dto.expiresInDays * 24,
      }) as Temporal.Instant;
    }

    if (Object.keys(patch).length > 0) {
      await this.repo.updateListing(id, patch);
    }

    if (dto.price) {
      await this.repo.replacePrice(id, {
        amount: dto.price.amountKobo,
        currency: dto.price.currency,
        period: dto.price.period,
        years: dto.price.years,
      });
    }

    if (dto.fees !== undefined) {
      await this.repo.deleteFeesByListingId(id);
      if (dto.fees.length > 0) {
        await this.repo.createFees(
          dto.fees.map((f) => ({
            listingId: id,
            type: f.type,
            amount: f.amountKobo,
            currency: f.currency,
            notes: f.notes,
          })),
        );
      }
    }

    return this.getById(id);
  }

  // ---------- Permission helper ----------

  private async assertCanManage(userId: string, listing: ListingRow) {
    if (listing.createdByUserId === userId) return;
    const isLandlord = await this.repo.isVerifiedLandlord(
      userId,
      listing.propertyId,
    );
    if (isLandlord) return;
    throw new ForbiddenException('You cannot manage this listing');
  }

  // ---------- Helpers ----------

  private displayLocationOf(p: {
    placeId: string | null;
    address: string | null;
  }): string {
    return p.address ?? p.placeId ?? '';
  }
}