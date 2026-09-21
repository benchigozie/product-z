'use client';

import {
  CalendarDays,
  ChevronRight,
  Clock3,
  MessageCircle,
  MoreHorizontal,
  Search,
  UserRound,
} from 'lucide-react';

const prospects = [
  {
    id: 1,
    name: 'Daniel Okafor',
    property: '3 Bedroom Flat',
    location: 'Ikeja GRA, Lagos',
    status: 'Viewing scheduled',
    lastActivity: 'Today',
    nextAction: 'Viewing today',
  },
  {
    id: 2,
    name: 'Sarah Williams',
    property: '2 Bedroom Apartment',
    location: 'Yaba, Lagos',
    status: 'Interested',
    lastActivity: 'Yesterday',
    nextAction: 'Follow up',
  },
  {
    id: 3,
    name: 'Michael Adeyemi',
    property: '4 Bedroom Duplex',
    location: 'Lekki Phase 1, Lagos',
    status: 'New enquiry',
    lastActivity: '2 days ago',
    nextAction: 'Respond',
  },
  {
    id: 4,
    name: 'Amaka Eze',
    property: 'Mini Flat',
    location: 'Surulere, Lagos',
    status: 'Follow-up',
    lastActivity: '4 days ago',
    nextAction: 'Follow up',
  },
  {
    id: 5,
    name: 'David Ibrahim',
    property: '3 Bedroom Flat',
    location: 'Ikeja GRA, Lagos',
    status: 'Interested',
    lastActivity: '1 week ago',
    nextAction: 'Follow up',
  },
];

const statusStyles = {
  'Viewing scheduled': 'bg-primary-soft text-primary',
  Interested: 'bg-blue-50 text-blue-700',
  'New enquiry': 'bg-amber-50 text-amber-700',
  'Follow-up': 'bg-gray-100 text-gray-600',
};

export default function ProspectsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">
          Agent workspace
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-text">
          Prospects
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-secondary-text">
          Keep track of people interested in the properties you represent.
        </p>
      </div>

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <ProspectStat
          label="Active prospects"
          value="18"
          icon={UserRound}
        />

        <ProspectStat
          label="New enquiries"
          value="5"
          icon={MessageCircle}
        />

        <ProspectStat
          label="Viewings scheduled"
          value="4"
          icon={CalendarDays}
        />
      </div>

      {/* Search + filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text"
          />

          <input
            type="text"
            placeholder="Search prospects..."
            className="h-11 w-full rounded-xl border border-outline-color bg-white pl-10 pr-4 text-sm text-primary-text outline-none placeholder:text-secondary-text focus:border-primary"
          />
        </div>

        <button
          type="button"
          className="h-11 rounded-xl border border-outline-color bg-white px-4 text-sm font-medium text-secondary-text transition-colors hover:bg-background hover:text-primary-text"
        >
          All prospects
        </button>
      </div>

      {/* Prospects */}
      <div className="overflow-hidden rounded-2xl border border-outline-color bg-white">
        <div className="border-b border-outline-color px-5 py-4">
          <h2 className="text-sm font-semibold text-primary-text">
            Your prospects
          </h2>

          <p className="mt-0.5 text-xs text-secondary-text">
            People currently interacting with your listings
          </p>
        </div>

        <div className="divide-y divide-outline-color">
          {prospects.map((prospect) => (
            <div
              key={prospect.id}
              className="flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-background/60 lg:flex-row lg:items-center"
            >
              {/* Person */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <UserRound size={18} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-primary-text">
                      {prospect.name}
                    </h3>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        statusStyles[
                          prospect.status as keyof typeof statusStyles
                        ]
                      }`}
                    >
                      {prospect.status}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-sm text-secondary-text">
                    {prospect.property} · {prospect.location}
                  </p>
                </div>
              </div>

              {/* Activity */}
              <div className="lg:w-32">
                <p className="text-xs text-secondary-text">
                  Last activity
                </p>

                <p className="mt-1 text-sm font-medium text-primary-text">
                  {prospect.lastActivity}
                </p>
              </div>

              {/* Next action */}
              <div className="lg:w-40">
                <p className="text-xs text-secondary-text">
                  Next action
                </p>

                <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-primary-text">
                  <Clock3 size={14} className="text-secondary-text" />
                  {prospect.nextAction}
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
                >
                  View
                  <ChevronRight size={15} />
                </button>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary-text transition-colors hover:bg-background hover:text-primary-text"
                  aria-label={`Actions for ${prospect.name}`}
                >
                  <MoreHorizontal size={19} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProspectStat({
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