
'use client';

import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  MapPin,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

const interests = [
  {
    id: 1,
    title: '3 Bedroom Flat',
    location: 'Ikeja GRA, Lagos',
    price: '₦4,500,000 / year',
    status: 'Interested',
    statusTone: 'neutral',
    verified: true,
    areaScore: 'Good',
    activity: 'Interested 2 days ago',
  },
  {
    id: 2,
    title: '2 Bedroom Apartment',
    location: 'Yaba, Lagos',
    price: '₦2,800,000 / year',
    status: 'Inspection requested',
    statusTone: 'primary',
    verified: true,
    areaScore: 'Good',
    activity: 'Updated yesterday',
  },
  {
    id: 3,
    title: 'Mini Flat',
    location: 'Surulere, Lagos',
    price: '₦1,800,000 / year',
    status: 'Interested',
    statusTone: 'neutral',
    verified: false,
    areaScore: 'Fair',
    activity: 'Interested 4 days ago',
  },
  {
    id: 4,
    title: '4 Bedroom Duplex',
    location: 'Lekki Phase 1, Lagos',
    price: '₦8,500,000 / year',
    status: 'Viewing completed',
    statusTone: 'primary',
    verified: true,
    areaScore: 'Good',
    activity: 'Viewing completed 1 week ago',
  },
];

export default function PropertyInterestsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">
          Personal workspace
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-text">
          Property Interests
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-secondary-text">
          Keep track of properties you're seriously considering.
        </p>
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
            placeholder="Search your interests..."
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

      {/* Interests */}
      <div className="overflow-hidden rounded-2xl border border-outline-color bg-white">
        <div className="border-b border-outline-color px-5 py-4">
          <h2 className="text-sm font-semibold text-primary-text">
            Your interests
          </h2>

          <p className="mt-0.5 text-xs text-secondary-text">
            Properties you're actively considering
          </p>
        </div>

        <div className="divide-y divide-outline-color">
          {interests.map((property) => (
            <div
              key={property.id}
              className="flex flex-col gap-5 px-5 py-5 transition-colors hover:bg-background/60 lg:flex-row lg:items-center"
            >
              {/* Property */}
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
                  <MapPin
                    size={22}
                    className="text-primary"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-primary-text">
                      {property.title}
                    </h3>

                    {property.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                        <CheckCircle2 size={12} />
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="mt-1 flex items-center gap-1 text-sm text-secondary-text">
                    <MapPin size={14} />
                    {property.location}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-primary-text">
                    {property.price}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="lg:w-40">
                <p className="text-xs text-secondary-text">
                  Status
                </p>

                <span
                  className={`mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    property.statusTone === 'primary'
                      ? 'bg-primary-soft text-primary'
                      : 'bg-background text-primary-text'
                  }`}
                >
                  {property.status}
                </span>
              </div>

              {/* Area */}
              <div className="lg:w-24">
                <p className="text-xs text-secondary-text">
                  Area
                </p>

                <p className="mt-1 text-sm font-semibold text-primary-text">
                  {property.areaScore}
                </p>
              </div>

              {/* Activity */}
              <div className="lg:w-44">
                <p className="text-xs text-secondary-text">
                  Last activity
                </p>

                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-primary-text">
                  <Clock3
                    size={14}
                    className="text-secondary-text"
                  />
                  {property.activity}
                </p>
              </div>

              {/* Action */}
              <button
                type="button"
                className="flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
              >
                View
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Guidance */}
      <div className="rounded-2xl border border-outline-color bg-white p-5">
        <p className="text-sm font-semibold text-primary-text">
          Ready to take the next step?
        </p>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-secondary-text">
          When you're ready, you can request an inspection or explore
          the property's available intelligence before making a decision.
        </p>
      </div>
    </div>
  );
}

