
'use client';

import {
  CheckCircle2,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

const listings = [
  {
    id: 1,
    title: '3 Bedroom Flat',
    location: 'Ikeja GRA, Lagos',
    price: '₦4,500,000 / year',
    status: 'Active',
    views: 124,
    updated: '2 days ago',
  },
  {
    id: 2,
    title: '2 Bedroom Apartment',
    location: 'Yaba, Lagos',
    price: '₦2,800,000 / year',
    status: 'Active',
    views: 89,
    updated: '4 days ago',
  },
  {
    id: 3,
    title: '4 Bedroom Duplex',
    location: 'Lekki Phase 1, Lagos',
    price: '₦8,500,000 / year',
    status: 'Pending',
    views: 52,
    updated: '1 week ago',
  },
  {
    id: 4,
    title: 'Mini Flat',
    location: 'Surulere, Lagos',
    price: '₦1,800,000 / year',
    status: 'Inactive',
    views: 31,
    updated: '2 weeks ago',
  },
];

const statusStyles = {
  Active: 'bg-primary-soft text-primary',
  Pending: 'bg-amber-50 text-amber-700',
  Inactive: 'bg-gray-100 text-gray-500',
};

const activeListings = listings.filter(
  (listing) => listing.status === 'Active',
).length;

const pendingListings = listings.filter(
  (listing) => listing.status === 'Pending',
).length;

const totalViews = listings.reduce(
  (total, listing) => total + listing.views,
  0,
);

export default function AgentListingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">
            Agent workspace
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-text">
            Listings
          </h1>

          <p className="mt-1 text-sm text-secondary-text">
            Manage the properties you are currently listing.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          <Plus size={17} />
          Add listing
        </button>
      </div>

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <ListingStat
          label="Active listings"
          value={activeListings.toString()}
          icon={CheckCircle2}
        />

        <ListingStat
          label="Pending listings"
          value={pendingListings.toString()}
          icon={SlidersHorizontal}
        />

        <ListingStat
          label="Total views"
          value={totalViews.toString()}
          icon={Eye}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-outline-color bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text"
          />

          <input
            type="text"
            placeholder="Search listings..."
            className="h-10 w-full rounded-xl border border-outline-color bg-background pl-10 pr-4 text-sm text-primary-text outline-none placeholder:text-secondary-text focus:border-primary"
          />
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-outline-color px-4 text-sm font-medium text-secondary-text transition-colors hover:bg-background hover:text-primary-text"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      {/* Listings */}
      <div className="overflow-hidden rounded-2xl border border-outline-color bg-white">
        <div className="flex items-center justify-between border-b border-outline-color px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-primary-text">
              Your listings
            </h2>

            <p className="mt-0.5 text-xs text-secondary-text">
              {listings.length} properties
            </p>
          </div>
        </div>

        <div className="divide-y divide-outline-color">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-background/60 lg:flex-row lg:items-center"
            >
              {/* Property */}
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="hidden h-14 w-20 shrink-0 rounded-xl bg-primary-soft sm:block" />

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-primary-text">
                      {listing.title}
                    </h3>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyles[
                        listing.status as keyof typeof statusStyles
                        ]
                        }`}
                    >
                      {listing.status}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-sm text-secondary-text">
                    {listing.location}
                  </p>

                  <p className="mt-1 text-sm font-medium text-primary-text">
                    {listing.price}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 lg:w-48">
                <div>
                  <p className="text-xs text-secondary-text">
                    Views
                  </p>

                  <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-primary-text">
                    <Eye
                      size={15}
                      className="text-secondary-text"
                    />
                    {listing.views}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-secondary-text">
                    Updated
                  </p>

                  <p className="mt-1 text-sm font-medium text-primary-text">
                    {listing.updated}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-secondary-text transition-colors hover:bg-background hover:text-primary-text"
                aria-label={`Actions for ${listing.title}`}
              >
                <MoreHorizontal size={19} />
              </button>
            </div>
          ))}
        </div>
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
  icon: typeof CheckCircle2;
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

