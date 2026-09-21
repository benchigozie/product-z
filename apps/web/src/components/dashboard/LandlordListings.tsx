
'use client';

import {
  Building2,
  CheckCircle2,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  UserRound,
} from 'lucide-react';

const listings = [
  {
    id: 1,
    property: 'Adeola Court',
    location: 'Ikeja GRA, Lagos',
    units: 12,
    available: 2,
    status: 'Active',
    agent: 'Emeka Properties',
    views: 284,
  },
  {
    id: 2,
    property: 'Palm View Apartments',
    location: 'Yaba, Lagos',
    units: 8,
    available: 0,
    status: 'Active',
    agent: 'Prime Homes',
    views: 196,
  },
  {
    id: 3,
    property: 'Lekki Gardens',
    location: 'Lekki Phase 1, Lagos',
    units: 6,
    available: 2,
    status: 'Pending',
    agent: 'Awaiting agent',
    views: 74,
  },
  {
    id: 4,
    property: 'Bode Estate',
    location: 'Surulere, Lagos',
    units: 5,
    available: 2,
    status: 'Inactive',
    agent: '—',
    views: 41,
  },
];

const statusStyles = {
  Active: 'bg-primary-soft text-primary',
  Pending: 'bg-amber-50 text-amber-700',
  Inactive: 'bg-gray-100 text-gray-600',
};

export default function LandlordListingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">
            Landlord workspace
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-text">
            Listings
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-secondary-text">
            Manage how your properties and available units are represented
            on Product Z.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          <Plus size={17} />
          Create listing
        </button>
      </div>

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <ListingStat
          label="Active listings"
          value="4"
          icon={CheckCircle2}
        />

        <ListingStat
          label="Available units"
          value="4"
          icon={Building2}
        />

        <ListingStat
          label="Total views"
          value="595"
          icon={Eye}
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text"
        />

        <input
          type="text"
          placeholder="Search listings..."
          className="h-11 w-full rounded-xl border border-outline-color bg-white pl-10 pr-4 text-sm text-primary-text outline-none placeholder:text-secondary-text focus:border-primary"
        />
      </div>

      {/* Listings */}
      <div className="overflow-hidden rounded-2xl border border-outline-color bg-white">
        <div className="border-b border-outline-color px-5 py-4">
          <h2 className="text-sm font-semibold text-primary-text">
            Property listings
          </h2>

          <p className="mt-0.5 text-xs text-secondary-text">
            Listings associated with your properties
          </p>
        </div>

        <div className="divide-y divide-outline-color">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-col gap-5 px-5 py-5 transition-colors hover:bg-background/60 lg:flex-row lg:items-center"
            >
              {/* Property */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-primary-text">
                    {listing.property}
                  </h3>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      statusStyles[
                        listing.status as keyof typeof statusStyles
                      ]
                    }`}
                  >
                    {listing.status}
                  </span>
                </div>

                <p className="mt-1 text-sm text-secondary-text">
                  {listing.location}
                </p>
              </div>

              {/* Availability */}
              <div className="lg:w-36">
                <p className="text-xs text-secondary-text">
                  Availability
                </p>

                <p className="mt-1 text-sm font-semibold text-primary-text">
                  {listing.available} of {listing.units} available
                </p>
              </div>

              {/* Agent */}
              <div className="flex items-center gap-2 lg:w-44">
                <UserRound
                  size={16}
                  className="shrink-0 text-secondary-text"
                />

                <div className="min-w-0">
                  <p className="text-xs text-secondary-text">
                    Agent
                  </p>

                  <p className="mt-1 truncate text-sm font-medium text-primary-text">
                    {listing.agent}
                  </p>
                </div>
              </div>

              {/* Views */}
              <div className="flex items-center gap-2 lg:w-20">
                <Eye
                  size={15}
                  className="text-secondary-text"
                />

                <div>
                  <p className="text-xs text-secondary-text">
                    Views
                  </p>

                  <p className="mt-1 text-sm font-semibold text-primary-text">
                    {listing.views}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-secondary-text transition-colors hover:bg-background hover:text-primary-text"
                aria-label={`Actions for ${listing.property}`}
              >
                <MoreHorizontal size={19} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-outline-color bg-white p-5">
        <p className="text-sm font-semibold text-primary-text">
          Your property remains the source of truth
        </p>

        <p className="mt-1 text-sm leading-6 text-secondary-text">
          Listings describe how your property is presented to renters.
          The underlying property record continues to hold ownership,
          units, occupancy, and verification information.
        </p>
      </div>
    </div>
  );
}

function ListingStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Building2;
}) {
  return (
    <div className="rounded-2xl border border-outline-color bg-white p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon size={18} />
      </div>

      <p className="mt-4 text-2xl font-bold text-primary-text">
        {value}
      </p>

      <p className="mt-1 text-sm text-secondary-text">
        {label}
      </p>
    </div>
  );
}

