'use client';

import {
  Building2,
  CheckCircle2,
  Clock3,
  FileCheck2,
  MoreHorizontal,
  Search,
  ShieldCheck,
} from 'lucide-react';

const properties = [
  {
    id: 1,
    name: 'Adeola Court',
    location: 'Ikeja GRA, Lagos',
    units: 12,
    status: 'Verified',
    verified: 'Verified 3 days ago',
    report: 'Available',
  },
  {
    id: 2,
    name: 'Palm View Apartments',
    location: 'Yaba, Lagos',
    units: 8,
    status: 'Verified',
    verified: 'Verified 1 week ago',
    report: 'Available',
  },
  {
    id: 3,
    name: 'Lekki Gardens',
    location: 'Lekki Phase 1, Lagos',
    units: 6,
    status: 'Pending',
    verified: 'Verification in progress',
    report: 'Pending',
  },
  {
    id: 4,
    name: 'Bode Estate',
    location: 'Surulere, Lagos',
    units: 5,
    status: 'Not verified',
    verified: 'Not yet verified',
    report: 'Not started',
  },
];

const statusStyles = {
  Verified: 'bg-primary-soft text-primary',
  Pending: 'bg-amber-50 text-amber-700',
  'Not verified': 'bg-gray-100 text-gray-500',
};

const verifiedProperties = properties.filter(
  (property) => property.status === 'Verified',
).length;

const pendingProperties = properties.filter(
  (property) => property.status === 'Pending',
).length;

const reportsAvailable = properties.filter(
  (property) => property.report === 'Available',
).length;

export default function LandlordVerificationPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">
          Landlord workspace
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-text">
          Verification
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-secondary-text">
          Track verification across your properties and access completed
          verification reports.
        </p>
      </div>

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <VerificationStat
          label="Verified properties"
          value={verifiedProperties.toString()}
          icon={ShieldCheck}
        />

        <VerificationStat
          label="Awaiting verification"
          value={pendingProperties.toString()}
          icon={Clock3}
        />

        <VerificationStat
          label="Reports available"
          value={reportsAvailable.toString()}
          icon={FileCheck2}
        />
      </div>

      {/* Explanation */}
      <div className="rounded-2xl border border-outline-color bg-white p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-primary-text">
              Property verification
            </h2>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-secondary-text">
              Verification helps establish confidence in the property
              information available on Product Z. Verified properties can
              include supporting evidence and a verification report that
              renters can reference.
            </p>
          </div>
        </div>
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

      {/* Properties */}
      <div className="overflow-hidden rounded-2xl border border-outline-color bg-white">
        <div className="border-b border-outline-color px-5 py-4">
          <h2 className="text-sm font-semibold text-primary-text">
            Property verification
          </h2>

          <p className="mt-0.5 text-xs text-secondary-text">
            Verification status across your properties
          </p>
        </div>

        <div className="divide-y divide-outline-color">
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex flex-col gap-5 px-5 py-5 transition-colors hover:bg-background/60 lg:flex-row lg:items-center"
            >
              {/* Property */}
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Building2 size={19} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-primary-text">
                      {property.name}
                    </h3>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        statusStyles[
                          property.status as keyof typeof statusStyles
                        ]
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-secondary-text">
                    {property.location}
                  </p>

                  <p className="mt-0.5 text-xs text-secondary-text">
                    {property.units} units
                  </p>
                </div>
              </div>

              {/* Verification */}
              <div className="lg:w-48">
                <p className="text-xs text-secondary-text">
                  Verification
                </p>

                <div className="mt-1 flex items-center gap-1.5">
                  {property.status === 'Verified' && (
                    <CheckCircle2
                      size={15}
                      className="text-primary"
                    />
                  )}

                  {property.status === 'Pending' && (
                    <Clock3
                      size={15}
                      className="text-amber-600"
                    />
                  )}

                  <p className="text-sm font-medium text-primary-text">
                    {property.verified}
                  </p>
                </div>
              </div>

              {/* Report */}
              <div className="lg:w-36">
                <p className="text-xs text-secondary-text">
                  Report
                </p>

                <p className="mt-1 text-sm font-medium text-primary-text">
                  {property.report}
                </p>
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

      {/* Principle */}
      <div className="rounded-2xl border border-outline-color bg-white p-5">
        <p className="text-sm font-semibold text-primary-text">
          Verification does not replace the property record
        </p>

        <p className="mt-1 text-sm leading-6 text-secondary-text">
          Your property remains the underlying source of truth. Verification
          adds evidence and confidence around the information associated
          with that property.
        </p>
      </div>
    </div>
  );
}

function VerificationStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof ShieldCheck;
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