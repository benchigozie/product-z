
'use client';

import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

const inspections = [
  {
    id: 1,
    title: '2 Bedroom Apartment',
    location: 'Yaba, Lagos',
    price: '₦2,800,000 / year',
    date: 'Sep 24, 2026',
    time: '10:00 AM',
    status: 'Scheduled',
    statusTone: 'primary',
    inspector: 'Product Z Inspector',
    report: false,
    verified: true,
  },
  {
    id: 2,
    title: '3 Bedroom Flat',
    location: 'Ikeja GRA, Lagos',
    price: '₦4,500,000 / year',
    date: 'Sep 18, 2026',
    time: '2:30 PM',
    status: 'Completed',
    statusTone: 'success',
    inspector: 'Product Z Inspector',
    report: true,
    verified: true,
  },
  {
    id: 3,
    title: 'Mini Flat',
    location: 'Surulere, Lagos',
    price: '₦1,800,000 / year',
    date: 'Sep 16, 2026',
    time: '11:00 AM',
    status: 'Report ready',
    statusTone: 'success',
    inspector: 'Product Z Inspector',
    report: true,
    verified: false,
  },
  {
    id: 4,
    title: '4 Bedroom Duplex',
    location: 'Lekki Phase 1, Lagos',
    price: '₦8,500,000 / year',
    date: 'Sep 14, 2026',
    time: '9:00 AM',
    status: 'Cancelled',
    statusTone: 'muted',
    inspector: '—',
    report: false,
    verified: true,
  },
];

export default function PersonalInspections() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">
          Personal workspace
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-text">
          Inspections
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-secondary-text">
          Manage property inspections you've requested and access
          completed reports.
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
            placeholder="Search inspections..."
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

      {/* Inspection list */}
      <div className="overflow-hidden rounded-2xl border border-outline-color bg-white">
        <div className="border-b border-outline-color px-5 py-4">
          <h2 className="text-sm font-semibold text-primary-text">
            Your inspections
          </h2>

          <p className="mt-0.5 text-xs text-secondary-text">
            Inspections you've requested or completed
          </p>
        </div>

        <div className="divide-y divide-outline-color">
          {inspections.map((inspection) => (
            <div
              key={inspection.id}
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
                      {inspection.title}
                    </h3>

                    {inspection.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                        <CheckCircle2 size={12} />
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="mt-1 flex items-center gap-1 text-sm text-secondary-text">
                    <MapPin size={14} />
                    {inspection.location}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-primary-text">
                    {inspection.price}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="lg:w-36">
                <p className="text-xs text-secondary-text">
                  Status
                </p>

                <span
                  className={`mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    inspection.statusTone === 'primary'
                      ? 'bg-primary-soft text-primary'
                      : inspection.statusTone === 'success'
                        ? 'bg-primary-soft text-primary'
                        : 'bg-background text-secondary-text'
                  }`}
                >
                  {inspection.status}
                </span>
              </div>

              {/* Date */}
              <div className="lg:w-40">
                <p className="text-xs text-secondary-text">
                  Inspection
                </p>

                <div className="mt-1">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-primary-text">
                    <CalendarDays
                      size={14}
                      className="text-secondary-text"
                    />
                    {inspection.date}
                  </p>

                  <p className="mt-0.5 text-xs text-secondary-text">
                    {inspection.time}
                  </p>
                </div>
              </div>

              {/* Report */}
              <div className="lg:w-32">
                <p className="text-xs text-secondary-text">
                  Report
                </p>

                {inspection.report ? (
                  <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-primary">
                    <FileText size={15} />
                    Available
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-secondary-text">
                    <Clock3 size={15} />
                    Pending
                  </div>
                )}
              </div>

              {/* Action */}
              <button
                type="button"
                className="flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
              >
                {inspection.report ? 'View report' : 'View'}
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Empty / CTA area */}
      <div className="rounded-2xl border border-dashed border-outline-color bg-white p-6 text-center">
        <p className="text-sm font-semibold text-primary-text">
          Looking at a property?
        </p>

        <p className="mx-auto mt-1 max-w-lg text-sm leading-6 text-secondary-text">
          Request an inspection from a property page when you want
          someone to verify what the property is actually like.
        </p>
      </div>
    </div>
  );
}

