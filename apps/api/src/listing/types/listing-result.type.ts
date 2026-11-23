export type ListingKind = 'RENT' | 'SALE';
export type ListingStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'PAUSED'
  | 'PENDING_REVIEW'
  | 'FILLED'
  | 'EXPIRED'
  | 'WITHDRAWN';

export type PricePeriod = 'MONTHLY' | 'YEARLY' | 'TOTAL';

export type ListingRow = {
  id: string;
  propertyId: string;
  createdByUserId: string;
  kind: ListingKind;
  status: ListingStatus;
  title: string;
  description: string | null;
  displayLocation: string;
  bedrooms: number | null;
  bathrooms: number | null;
  sizeSqm: number | null;
  features: unknown;
  inspectionFeeDiscouraged: boolean;
  publishedAt: Date | null;
  expiresAt: Date | null;
  flaggedAt: Date | null;
  flaggedByUserId: string | null;
  flagReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type ListingPriceRow = {
    id: string;
    listingId: string;
    amount: number;
    currency: string;
    period: PricePeriod;
    years: number | null;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type ListingFeeRow = {
    id: string;
    listingId: string;
    type: string;
    amount: number;
    currency: string;
    notes: string | null;
    createdAt: Date;
  };
  
  export type ListingMediaRow = {
    id: string;
    listingId: string;
    mediaId: string;
    sortOrder: number;
    caption: string | null;
    createdAt: Date;
  };
  
  export type ListingDetail = ListingRow & {
    price: ListingPriceRow | null;
    fees: ListingFeeRow[];
    media: ListingMediaRow[];
  };

  export type PropertyType =
  | 'ESTATE' | 'COMPOUND' | 'BUILDING' | 'HOUSE' | 'APARTMENT'
  | 'HOSTEL' | 'UNIT' | 'SHOP' | 'OFFICE' | 'WAREHOUSE' | 'LAND';

  export type FeeType =
  | 'LEGAL' | 'CAUTION' | 'SERVICE_CHARGE' | 'AGENCY' | 'INSPECTION_FEE' | 'OTHER';