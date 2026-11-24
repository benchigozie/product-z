import { Injectable } from '@nestjs/common';
import { or } from '@prisma/orm-postgres/orm-client';
import { PrismaService } from '../prisma.service.js';
import type {
  ListingFeeRow,
  ListingMediaRow,
  ListingPriceRow,
  ListingRow,
  PropertyType,
  FeeType,
  ListingStatus,
} from './types/listing-result.type.js';

import type { Temporal } from 'temporal-spec';

type PropertyRow = {
  id: string;
  name: string | null;
  propertyType: PropertyType;
  stateId: string;
  placeId: string | null;
  address: string | null;
  street: string | null;
  houseNumber: string | null;
  unitIdentifier: string | null;
  landmark: string | null;
  isProvisional: boolean;
  createdByUserId: string | null;
  mergedIntoId: string | null;
};

@Injectable()
export class ListingRepository {
  constructor(private readonly prisma: PrismaService) { }

  // ---------- Property (for the dedup flow) ----------

  async findPropertyById(id: string): Promise<PropertyRow | null> {
    return this.prisma.db.orm.public.Property
      .where({ id })
      .first() as Promise<PropertyRow | null>;
  }

  async searchProperties(params: {
    stateId: string;
    q: string;
    limit?: number;
  }): Promise<PropertyRow[]> {
    const like = `%${params.q}%`;
    const result = await this.prisma.db.orm.public.Property
      .where((p) => p.stateId.eq(params.stateId))
      .where((p) => p.mergedIntoId.isNull())
      .where((p) =>
        or(
          p.name.ilike(like),
          p.address.ilike(like),
          p.street.ilike(like),
        ),
      )
      .limit(params.limit ?? 10)
      .all();
    return result as PropertyRow[];
  }

  async createProvisionalProperty(data: {
    propertyType: PropertyType;
    countryId: string;
    stateId: string;
    placeId?: string;
    address?: string;
    street?: string;
    houseNumber?: string;
    unitIdentifier?: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
    bedrooms?: number;
    bathrooms?: number;
    sizeSqm?: number;
    createdByUserId: string;
  }): Promise<PropertyRow> {
    return this.prisma.db.orm.public.Property.create({
      ...data,
      isProvisional: true,
    }) as Promise<PropertyRow>;
  }

  // ---------- Listing ----------

  async createListing(data: {
    propertyId: string;
    createdByUserId: string;
    kind: 'RENT' | 'SALE';
    title: string;
    description?: string;
    displayLocation: string;
    bedrooms?: number;
    bathrooms?: number;
    sizeSqm?: number;
    features?: any;
    expiresAt?: Temporal.Instant;
  }): Promise<ListingRow> {
    return this.prisma.db.orm.public.Listing.create({
      propertyId: data.propertyId,
      createdByUserId: data.createdByUserId,
      kind: data.kind,
      status: 'DRAFT',
      title: data.title,
      description: data.description ?? null,
      displayLocation: data.displayLocation,
      bedrooms: data.bedrooms ?? null,
      bathrooms: data.bathrooms ?? null,
      sizeSqm: data.sizeSqm ?? null,
      features: data.features as any,
      expiresAt: data.expiresAt ?? null,
    }) as Promise<ListingRow>;
  }

  async createPrice(data: {
    listingId: string;
    amount: number;
    currency: string;
    period: 'MONTHLY' | 'YEARLY' | 'TOTAL';
    years?: number;
  }): Promise<void> {
    await this.prisma.db.orm.public.ListingPrice.create({
      listingId: data.listingId,
      amount: data.amount,
      currency: data.currency,
      period: data.period,
      years: data.years ?? null,
    });
  }

  async createFees(
    fees: Array<{
      listingId: string;
      type: FeeType;
      amount: number;
      currency: string;
      notes?: string;
    }>,
  ): Promise<void> {
    if (fees.length === 0) return;
    await this.prisma.db.orm.public.ListingFee.createAll(fees);
  }

  async attachMedia(params: {
    listingId: string;
    mediaIds: string[];
    sortOrderStart?: number;
  }): Promise<void> {
    if (params.mediaIds.length === 0) return;
    const rows = params.mediaIds.map((mediaId, i) => ({
      listingId: params.listingId,
      mediaId,
      sortOrder: (params.sortOrderStart ?? 0) + i,
    }));
    await this.prisma.db.orm.public.ListingMedia.createAll(rows);
  }

  async findById(id: string): Promise<ListingRow | null> {
    return this.prisma.db.orm.public.Listing
      .where({ id })
      .first() as Promise<ListingRow | null>;
  }

  async findPriceByListingId(
    listingId: string,
  ): Promise<ListingPriceRow | null> {
    return this.prisma.db.orm.public.ListingPrice
      .where({ listingId })
      .first() as Promise<ListingPriceRow | null>;
  }

  async findFeesByListingId(listingId: string): Promise<ListingFeeRow[]> {
    const rows = await this.prisma.db.orm.public.ListingFee
      .where({ listingId })
      .all();
    return rows as ListingFeeRow[];
  }

  async findMediaByListingId(listingId: string): Promise<ListingMediaRow[]> {
    const rows = await this.prisma.db.orm.public.ListingMedia
      .where({ listingId })
      .all();
    return rows as ListingMediaRow[];
  }

  async updateListing(
    id: string,
    data: Record<string, unknown>,
  ): Promise<ListingRow | null> {
    return this.prisma.db.orm.public.Listing
      .where({ id })
      .update(data) as Promise<ListingRow | null>;
  }

  async replacePrice(
    listingId: string,
    data: {
      amount: number;
      currency: string;
      period: 'MONTHLY' | 'YEARLY' | 'TOTAL';
      years?: number;
    },
  ): Promise<void> {
    await this.prisma.db.orm.public.ListingPrice
      .where({ listingId })
      .update({
        amount: data.amount,
        currency: data.currency,
        period: data.period,
        years: data.years ?? null,
      });
  }

  async deleteFeesByListingId(listingId: string): Promise<void> {
    await this.prisma.db.orm.public.ListingFee.where({ listingId }).deleteAll();
  }

  async deleteMediaByListingId(listingId: string): Promise<void> {
    await this.prisma.db.orm.public.ListingMedia
      .where({ listingId })
      .deleteAll();
  }

  // ---------- Permission helper ----------

  async isVerifiedLandlord(
    userId: string,
    propertyId: string,
  ): Promise<boolean> {
    const rel = (await this.prisma.db.orm.public.UserPropertyRelationship
      .where({
        userId,
        propertyId,
        relationshipType: 'LANDLORD',
      })
      .first()) as { id: string } | null;

    if (!rel) return false;

    const verification = await this.prisma.db.orm.public.RelationshipVerification
      .where({
        relationshipId: rel.id,
        status: 'VERIFIED',
      })
      .first();

    return verification !== null;
  }

  async updateStatus(id: string, status: ListingStatus): Promise<ListingRow | null> {
    return this.prisma.db.orm.public.Listing
      .where({ id })
      .update({ status }) as Promise<ListingRow | null>;
  }

  async findExpiredActiveListings(now: Date): Promise<ListingRow[]> {
    const rows = await this.prisma.db.orm.public.Listing
      .where((l) => l.status.eq('ACTIVE'))
      .where((l) => l.expiresAt.isNotNull())
      .where((l) => l.expiresAt.lt(now))
      .all();
    return rows as ListingRow[];
  }

  async browse(params: {
    stateId?: string;
    placeId?: string;
    kind?: 'RENT' | 'SALE';
    propertyType?: PropertyType;
    bedrooms?: number;
    q?: string;
    sort?: 'newest';
    cursor?: string;
    limit: number;
  }): Promise<{ items: any[]; nextCursor: string | null }> {
    const limit = Math.min(params.limit, 50);
  
    // 1. If location/propertyType filter is present, get matching property IDs first.
    let propertyIds: string[] | undefined;
    if (params.stateId || params.placeId || params.propertyType) {
      let propQuery = this.prisma.db.orm.public.Property
        .where((p) => p.mergedIntoId.isNull());
      if (params.stateId) {
        propQuery = propQuery.where({ stateId: params.stateId });
      }
      if (params.placeId) {
        propQuery = propQuery.where({ placeId: params.placeId });
      }
      if (params.propertyType) {
        propQuery = propQuery.where({ propertyType: params.propertyType });
      }
      const props = (await propQuery.select('id').all()) as { id: string }[];
      propertyIds = props.map((p) => p.id);
      if (propertyIds.length === 0) {
        return { items: [], nextCursor: null };
      }
    }
  
    // 2. Build listing query.
    let query = this.prisma.db.orm.public.Listing
      .where({ status: 'ACTIVE' })
      .where((l) => l.deletedAt.isNull());
  
    if (params.kind) {
      query = query.where({ kind: params.kind });
    }
    if (params.bedrooms !== undefined) {
      query = query.where((l) => l.bedrooms.gte(params.bedrooms!));
    }
    if (propertyIds) {
      query = query.where((l) => l.propertyId.in(propertyIds));
    }
    if (params.q) {
      const like = `%${params.q}%`;
      query = query.where((l) => l.title.ilike(like));
    }
    if (params.cursor) {
      query = query.where((l) => l.id.gt(params.cursor!));
    }
  
    // Sort — newest only for now.
    query = query.orderBy((l) => l.publishedAt.desc());
  
    const rows = (await query.limit(limit + 1).all()) as any[];
    const hasNext = rows.length > limit;
    const items = hasNext ? rows.slice(0, limit) : rows;
  
    // 3. Batch-enrich: prices, inspection fees, primary photo.
    const listingIds = items.map((r) => r.id);
    if (listingIds.length === 0) {
      return { items: [], nextCursor: null };
    }
  
    const prices = (await this.prisma.db.orm.public.ListingPrice
      .where((lp) => lp.listingId.in(listingIds))
      .all()) as Array<{
      listingId: string;
      amount: number;
      currency: string;
      period: 'MONTHLY' | 'YEARLY' | 'TOTAL';
      years: number | null;
    }>;
    const priceByListing = new Map(prices.map((p) => [p.listingId, p]));
  
    const feeRows = (await this.prisma.db.orm.public.ListingFee
      .where((lf) => lf.listingId.in(listingIds))
      .where({ type: 'INSPECTION_FEE' })
      .all()) as Array<{ listingId: string }>;
    const feeSet = new Set(feeRows.map((f) => f.listingId));
  
    const mediaRows = (await this.prisma.db.orm.public.ListingMedia
      .where((lm) => lm.listingId.in(listingIds))
      .all()) as Array<{ listingId: string; mediaId: string; sortOrder: number }>;
    const firstMediaByListing = new Map<
      string,
      { mediaId: string; sortOrder: number }
    >();
    for (const m of mediaRows) {
      const existing = firstMediaByListing.get(m.listingId);
      if (!existing || m.sortOrder < existing.sortOrder) {
        firstMediaByListing.set(m.listingId, m);
      }
    }
  
    const mediaIds = Array.from(firstMediaByListing.values()).map(
      (m) => m.mediaId,
    );
    const mediaObjects = mediaIds.length
      ? ((await this.prisma.db.orm.public.Media
          .where((m) => m.id.in(mediaIds))
          .all()) as Array<{ id: string; url: string }>)
      : [];
    const urlById = new Map(mediaObjects.map((m) => [m.id, m.url]));
  
    // 4. Assemble.
    const resultItems = items.map((r) => {
      const price = priceByListing.get(r.id);
      const firstMedia = firstMediaByListing.get(r.id);
      return {
        id: r.id,
        kind: r.kind,
        title: r.title,
        displayLocation: r.displayLocation,
        bedrooms: r.bedrooms,
        bathrooms: r.bathrooms,
        sizeSqm: r.sizeSqm,
        publishedAt: r.publishedAt,
        price: price
          ? {
              amount: price.amount,
              currency: price.currency,
              period: price.period,
              years: price.years,
            }
          : null,
        hasInspectionFee: feeSet.has(r.id),
        primaryPhotoUrl: firstMedia
          ? (urlById.get(firstMedia.mediaId) ?? null)
          : null,
      };
    });
  
    return {
      items: resultItems,
      nextCursor: hasNext ? items[items.length - 1].id : null,
    };
  }
}