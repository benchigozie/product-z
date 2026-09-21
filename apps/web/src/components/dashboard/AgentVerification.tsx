'use client';

import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  MapPin,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Video,
} from 'lucide-react';

const verificationItems = [
  {
    id: 1,
    property: '3 Bedroom Flat',
    location: 'Ikeja GRA, Lagos',
    status: 'Verified',
    verified: 'Aug 28, 2026',
    evidence: 'Complete',
  },
  {
    id: 2,
    property: '2 Bedroom Apartment',
    location: 'Yaba, Lagos',
    status: 'Awaiting verification',
    verified: 'Not yet verified',
    evidence: 'Pending',
  },
  {
    id: 3,
    property: '4 Bedroom Duplex',
    location: 'Lekki Phase 1, Lagos',
    status: 'In review',
    verified: 'Submitted Sep 2, 2026',
    evidence: 'Under review',
  },
  {
    id: 4,
    property: 'Mini Flat',
    location: 'Surulere, Lagos',
    status: 'Verified',
    verified: 'Aug 14, 2026',
    evidence: 'Complete',
  },
];

const statusStyles = {
  Verified: 'bg-primary-soft text-primary',
  'Awaiting verification': 'bg-amber-50 text-amber-700',
  'In review': 'bg-blue-50 text-blue-700',
};

export default function VerificationPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">
          Agent workspace
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-text">
          Verification
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-secondary-text">
          Track verification status and evidence for the properties you
          represent.
        </p>
      </div>

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <VerificationStat
          label="Verified properties"
          value="8"
          icon={ShieldCheck}
        />

        <VerificationStat
          label="Awaiting verification"
          value="3"
          icon={Clock3}
        />

        <VerificationStat
          label="Reports completed"
          value="18"
          icon={FileCheck2}
        />
      </div>

      {/* Verification explanation */}
      <div className="overflow-hidden rounded-2xl border border-primary/10 bg-primary-soft">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
            <ShieldCheck size={23} />
          </div>

          <div className="flex-1">
            <h2 className="text-sm font-semibold text-primary-text">
              Property verification
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-secondary-text">
              Verification provides evidence that a property has been
              physically checked. Verified properties can give renters
              more confidence when evaluating a listing.
            </p>
          </div>

          <button
            type="button"
            className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Request verification
          </button>
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
            Verification status
          </h2>

          <p className="mt-0.5 text-xs text-secondary-text">
            Properties associated with your agent account
          </p>
        </div>

        <div className="divide-y divide-outline-color">
          {verificationItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-5 px-5 py-5 transition-colors hover:bg-background/60 lg:flex-row lg:items-center"
            >
              {/* Property */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-primary-text">
                    {item.property}
                  </h3>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      statusStyles[
                        item.status as keyof typeof statusStyles
                      ]
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center gap-1.5 text-sm text-secondary-text">
                  <MapPin size={15} />
                  <span>{item.location}</span>
                </div>
              </div>

              {/* Verification date */}
              <div className="lg:w-48">
                <p className="text-xs text-secondary-text">
                  Verification
                </p>

                <p className="mt-1 text-sm font-medium text-primary-text">
                  {item.verified}
                </p>
              </div>

              {/* Evidence */}
              <div className="lg:w-40">
                <p className="text-xs text-secondary-text">
                  Evidence
                </p>

                <div className="mt-1 flex items-center gap-2">
                  {item.evidence === 'Complete' ? (
                    <Video
                      size={15}
                      className="text-primary"
                    />
                  ) : (
                    <Clock3
                      size={15}
                      className="text-secondary-text"
                    />
                  )}

                  <span className="text-sm font-medium text-primary-text">
                    {item.evidence}
                  </span>
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-secondary-text transition-colors hover:bg-background hover:text-primary-text"
                aria-label={`Actions for ${item.property}`}
              >
                <MoreHorizontal size={19} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Verification principle */}
      <div className="flex items-start gap-3 rounded-xl border border-outline-color bg-white p-5">
        <CheckCircle2
          size={18}
          className="mt-0.5 shrink-0 text-primary"
        />

        <div>
          <p className="text-sm font-semibold text-primary-text">
            Verification is evidence, not just a badge.
          </p>

          <p className="mt-1 text-sm leading-6 text-secondary-text">
            A verified property should be backed by a real inspection,
            recorded evidence, and a clear verification date.
          </p>
        </div>
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