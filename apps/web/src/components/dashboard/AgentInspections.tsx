'use client';

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
} from 'lucide-react';

const inspections = [
  {
    id: 1,
    property: '3 Bedroom Flat',
    location: 'Ikeja GRA, Lagos',
    date: 'Today',
    time: '2:00 PM',
    status: 'Upcoming',
    inspector: 'You',
  },
  {
    id: 2,
    property: '2 Bedroom Apartment',
    location: 'Yaba, Lagos',
    date: 'Tomorrow',
    time: '11:30 AM',
    status: 'Upcoming',
    inspector: 'You',
  },
  {
    id: 3,
    property: '4 Bedroom Duplex',
    location: 'Lekki Phase 1, Lagos',
    date: 'Sep 10',
    time: '3:00 PM',
    status: 'Pending',
    inspector: 'Awaiting assignment',
  },
  {
    id: 4,
    property: 'Mini Flat',
    location: 'Surulere, Lagos',
    date: 'Sep 5',
    time: '10:00 AM',
    status: 'Completed',
    inspector: 'You',
  },
];

const statusStyles = {
  Upcoming: 'bg-primary-soft text-primary',
  Pending: 'bg-amber-50 text-amber-700',
  Completed: 'bg-gray-100 text-gray-600',
};

export default function AgentInspections() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">
            Agent workspace
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-text">
            Inspections
          </h1>

          <p className="mt-1 text-sm text-secondary-text">
            Manage property inspections and verification visits.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          <Plus size={17} />
          Request inspection
        </button>
      </div>

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <InspectionStat
          label="Upcoming"
          value="2"
          icon={CalendarDays}
        />

        <InspectionStat
          label="Pending"
          value="1"
          icon={Clock3}
        />

        <InspectionStat
          label="Completed"
          value="24"
          icon={CheckCircle2}
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
          placeholder="Search inspections..."
          className="h-11 w-full rounded-xl border border-outline-color bg-white pl-10 pr-4 text-sm text-primary-text outline-none placeholder:text-secondary-text focus:border-primary"
        />
      </div>

      {/* Inspection list */}
      <div className="overflow-hidden rounded-2xl border border-outline-color bg-white">
        <div className="border-b border-outline-color px-5 py-4">
          <h2 className="text-sm font-semibold text-primary-text">
            Inspection activity
          </h2>

          <p className="mt-0.5 text-xs text-secondary-text">
            Your recent and upcoming inspections
          </p>
        </div>

        <div className="divide-y divide-outline-color">
          {inspections.map((inspection) => (
            <div
              key={inspection.id}
              className="flex flex-col gap-5 px-5 py-5 transition-colors hover:bg-background/60 lg:flex-row lg:items-center"
            >
              {/* Property */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-primary-text">
                    {inspection.property}
                  </h3>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      statusStyles[
                        inspection.status as keyof typeof statusStyles
                      ]
                    }`}
                  >
                    {inspection.status}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center gap-1.5 text-sm text-secondary-text">
                  <MapPin size={15} />
                  <span>{inspection.location}</span>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3 lg:w-48">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-secondary-text">
                  <CalendarDays size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-primary-text">
                    {inspection.date}
                  </p>

                  <p className="mt-0.5 text-xs text-secondary-text">
                    {inspection.time}
                  </p>
                </div>
              </div>

              {/* Inspector */}
              <div className="lg:w-40">
                <p className="text-xs text-secondary-text">
                  Inspector
                </p>

                <p className="mt-1 text-sm font-medium text-primary-text">
                  {inspection.inspector}
                </p>
              </div>

              {/* Action */}
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-secondary-text transition-colors hover:bg-background hover:text-primary-text"
                aria-label={`Actions for ${inspection.property}`}
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

function InspectionStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof CalendarDays;
}) {
  return (
    <div className="rounded-2xl border border-outline-color bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Icon size={18} />
        </div>
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