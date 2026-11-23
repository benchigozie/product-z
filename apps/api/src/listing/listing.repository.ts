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
  constructor(private readonly prisma: PrismaService) {}

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
}