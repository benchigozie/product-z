'use client';

import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MoreHorizontal,
  Search,
  UserRound,
} from 'lucide-react';

const units = [
  {
    id: 1,
    property: 'Adeola Court',
    unit: 'Flat 01',
    resident: 'Chinedu Okoro',
    status: 'Occupied',
    lease: 'Active',
    expiry: 'Dec 2026',
  },
  {
    id: 2,
    property: 'Adeola Court',
    unit: 'Flat 02',
    resident: 'Sarah Johnson',
    status: 'Occupied',
    lease: 'Active',
    expiry: 'Mar 2027',
  },
  {
    id: 3,
    property: 'Adeola Court',
    unit: 'Flat 03',
    resident: '—',
    status: 'Available',
    lease: '—',
    expiry: '—',
  },
  {
    id: 4,
    property: 'Palm View Apartments',
    unit: 'Flat 01',
    resident: 'David Adeyemi',
    status: 'Occupied',
    lease: 'Active',
    expiry: 'Jan 2027',
  },
  {
    id: 5,
    property: 'Palm View Apartments',
    unit: 'Flat 02',
    resident: 'Amaka Eze',
    status: 'Occupied',
    lease: 'Active',
    expiry: 'Aug 2027',
  },
  {
    id: 6,
    property: 'Lekki Gardens',
    unit: 'Flat 04',
    resident: '—',
    status: 'Available',
    lease: '—',
    expiry: '—',
  },
  {
    id: 7,
    property: 'Bode Estate',
    unit: 'Flat 02',
    resident: 'Michael Ibrahim',
    status: 'Occupied',
    lease: 'Expiring soon',
    expiry: 'Oct 2026',
  },
  {
    id: 8,
    property: 'Bode Estate',
    unit: 'Flat 05',
    resident: '—',
    status: 'Maintenance',
    lease: '—',
    expiry: '—',
  },
];

const statusStyles = {
  Occupied: 'bg-primary-soft text-primary',
  Available: 'bg-blue-50 text-blue-700',
  Maintenance: 'bg-amber-50 text-amber-700',
};

export default function OccupancyPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">
          Landlord workspace
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-text">
          Occupancy
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-secondary-text">
          Keep track of residents, available units, and tenancy status
          across your properties.
        </p>
      </div>

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <OccupancyStat
          label="Occupied units"
          value="18"
          icon={UserRound}
        />

        <OccupancyStat
          label="Available units"
          value="4"
          icon={Building2}
        />

        <OccupancyStat
          label="Leases expiring soon"
          value="2"
          icon={Clock3}
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
          placeholder="Search residents, properties or units..."
          className="h-11 w-full rounded-xl border border-outline-color bg-white pl-10 pr-4 text-sm text-primary-text outline-none placeholder:text-secondary-text focus:border-primary"
        />
      </div>

      {/* Occupancy table */}
      <div className="overflow-hidden rounded-2xl border border-outline-color bg-white">
        <div className="border-b border-outline-color px-5 py-4">
          <h2 className="text-sm font-semibold text-primary-text">
            Unit occupancy
          </h2>

          <p className="mt-0.5 text-xs text-secondary-text">
            Current occupancy across your properties
          </p>
        </div>

        <div className="divide-y divide-outline-color">
          {units.map((unit) => (
            <div
              key={unit.id}
              className="flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-background/60 lg:flex-row lg:items-center"
            >
              {/* Property */}
              <div className="min-w-0 flex-1">
                <p className="text-xs text-secondary-text">
                  {unit.property}
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-primary-text">
                    {unit.unit}
                  </h3>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      statusStyles[
                        unit.status as keyof typeof statusStyles
                      ]
                    }`}
                  >
                    {unit.status}
                  </span>
                </div>
              </div>

              {/* Resident */}
              <div className="flex items-center gap-3 lg:w-56">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-secondary-text">
                  <UserRound size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-secondary-text">
                    Resident
                  </p>

                  <p className="mt-1 truncate text-sm font-medium text-primary-text">
                    {unit.resident}
                  </p>
                </div>
              </div>

              {/* Lease */}
              <div className="lg:w-40">
                <p className="text-xs text-secondary-text">
                  Lease
                </p>

                <p
                  className={`mt-1 text-sm font-medium ${
                    unit.lease === 'Expiring soon'
                      ? 'text-amber-700'
                      : 'text-primary-text'
                  }`}
                >
                  {unit.lease}
                </p>
              </div>

              {/* Expiry */}
              <div className="flex items-center gap-2 lg:w-32">
                <CalendarDays
                  size={15}
                  className="text-secondary-text"
                />

                <div>
                  <p className="text-xs text-secondary-text">
                    Expiry
                  </p>

                  <p className="mt-1 text-sm font-medium text-primary-text">
                    {unit.expiry}
                  </p>
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-secondary-text transition-colors hover:bg-background hover:text-primary-text"
                aria-label={`Actions for ${unit.unit}`}
              >
                <MoreHorizontal size={19} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tenancy note */}
      <div className="flex items-start gap-3 rounded-2xl border border-outline-color bg-white p-5">
        <CheckCircle2
          size={18}
          className="mt-0.5 shrink-0 text-primary"
        />

        <div>
          <p className="text-sm font-semibold text-primary-text">
            Keep tenancy information connected
          </p>

          <p className="mt-1 text-sm leading-6 text-secondary-text">
            Resident information, tenancy dates, property records, and
            occupancy status can eventually work together to give you a
            complete picture of each unit.
          </p>
        </div>
      </div>
    </div>
  );
}

function OccupancyStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof UserRound;
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