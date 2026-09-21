'use client';

import {
  Building2,
  CheckCircle2,
  MoreHorizontal,
  Plus,
  Search,
  Users,
} from 'lucide-react';

const properties = [
  {
    id: 1,
    name: 'Adeola Court',
    location: 'Ikeja GRA, Lagos',
    units: 12,
    occupied: 10,
    available: 2,
    verification: 'Verified',
  },
  {
    id: 2,
    name: 'Palm View Apartments',
    location: 'Yaba, Lagos',
    units: 8,
    occupied: 8,
    available: 0,
    verification: 'Verified',
  },
  {
    id: 3,
    name: 'Lekki Gardens',
    location: 'Lekki Phase 1, Lagos',
    units: 6,
    occupied: 4,
    available: 2,
    verification: 'Pending',
  },
  {
    id: 4,
    name: 'Bode Estate',
    location: 'Surulere, Lagos',
    units: 5,
    occupied: 3,
    available: 2,
    verification: 'Not verified',
  },
];

const verificationStyles = {
  Verified: 'bg-primary-soft text-primary',
  Pending: 'bg-amber-50 text-amber-700',
  'Not verified': 'bg-gray-100 text-gray-600',
};

export default function PropertiesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">
            Landlord workspace
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-text">
            Properties
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-secondary-text">
            Manage the properties and units associated with your account.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          <Plus size={17} />
          Add property
        </button>
      </div>

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <PropertyStat
          label="Total properties"
          value="6"
          icon={Building2}
        />

        <PropertyStat
          label="Occupied units"
          value="18"
          icon={Users}
        />

        <PropertyStat
          label="Available units"
          value="4"
          icon={Building2}
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
          placeholder="Search properties..."
          className="h-11 w-full rounded-xl border border-outline-color bg-white pl-10 pr-4 text-sm text-primary-text outline-none placeholder:text-secondary-text focus:border-primary"
        />
      </div>

      {/* Property list */}
      <div className="overflow-hidden rounded-2xl border border-outline-color bg-white">
        <div className="border-b border-outline-color px-5 py-4">
          <h2 className="text-sm font-semibold text-primary-text">
            Your properties
          </h2>

          <p className="mt-0.5 text-xs text-secondary-text">
            Properties currently associated with your landlord account
          </p>
        </div>

        <div className="divide-y divide-outline-color">
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex flex-col gap-5 px-5 py-5 transition-colors hover:bg-background/60 lg:flex-row lg:items-center"
            >
              {/* Property identity */}
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary sm:flex">
                  <Building2 size={21} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-primary-text">
                      {property.name}
                    </h3>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        verificationStyles[
                          property.verification as keyof typeof verificationStyles
                        ]
                      }`}
                    >
                      {property.verification}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-secondary-text">
                    {property.location}
                  </p>
                </div>
              </div>

              {/* Units */}
              <div className="flex items-center gap-8 lg:w-56">
                <div>
                  <p className="text-xs text-secondary-text">
                    Units
                  </p>

                  <p className="mt-1 text-sm font-semibold text-primary-text">
                    {property.units}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-secondary-text">
                    Occupied
                  </p>

                  <p className="mt-1 text-sm font-semibold text-primary-text">
                    {property.occupied}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-secondary-text">
                    Available
                  </p>

                  <p className="mt-1 text-sm font-semibold text-primary-text">
                    {property.available}
                  </p>
                </div>
              </div>

              {/* Occupancy indicator */}
              <div className="hidden w-28 lg:block">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary-text">
                    Occupancy
                  </span>

                  <span className="font-medium text-primary-text">
                    {Math.round(
                      (property.occupied / property.units) * 100,
                    )}
                    %
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${
                        (property.occupied / property.units) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-secondary-text transition-colors hover:bg-background hover:text-primary-text"
                aria-label={`Actions for ${property.name}`}
              >
                <MoreHorizontal size={19} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Verification reminder */}
      <div className="flex items-start gap-3 rounded-2xl border border-outline-color bg-white p-5">
        <CheckCircle2
          size={18}
          className="mt-0.5 shrink-0 text-primary"
        />

        <div>
          <p className="text-sm font-semibold text-primary-text">
            Keep your property information current
          </p>

          <p className="mt-1 text-sm leading-6 text-secondary-text">
            Accurate property records help keep listings, occupancy,
            verification, and resident information connected.
          </p>
        </div>
      </div>
    </div>
  );
}

function PropertyStat({
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