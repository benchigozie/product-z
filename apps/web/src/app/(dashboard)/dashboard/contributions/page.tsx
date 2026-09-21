'use client';

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CloudRain,
  Droplets,
  FileText,
  Home,
  MapPin,
  Plus,
  ShieldAlert,
  Zap,
} from 'lucide-react';

const contributionStats = [
  {
    label: 'Total contributions',
    value: '12',
    description: 'Information you’ve shared',
  },
  {
    label: 'Approved',
    value: '9',
    description: 'Contributions accepted',
  },
  {
    label: 'Pending review',
    value: '2',
    description: 'Currently being reviewed',
  },
  {
    label: 'Needs attention',
    value: '1',
    description: 'Action may be required',
  },
];

const contributionTypes = [
  {
    title: 'Property information',
    description: 'Share what you know about a property’s condition, utilities, or availability.',
    icon: Home,
  },
  {
    title: 'Area information',
    description: 'Help others understand what it’s like to live around a particular area.',
    icon: MapPin,
  },
  {
    title: 'Update existing information',
    description: 'Tell us when something about a property or area has changed.',
    icon: FileText,
  },
  {
    title: 'Report an issue',
    description: 'Flag information that may be outdated, inaccurate, or misleading.',
    icon: ShieldAlert,
  },
];

const recentContributions = [
  {
    title: 'Power reliability',
    location: '2 Bedroom Apartment · Yaba, Lagos',
    category: 'Property information',
    date: 'Aug 28, 2026',
    status: 'Approved',
    icon: Zap,
  },
  {
    title: 'Water availability',
    location: '2 Bedroom Apartment · Yaba, Lagos',
    category: 'Property information',
    date: 'Aug 12, 2026',
    status: 'Approved',
    icon: Droplets,
  },
  {
    title: 'Area flooding',
    location: 'Yaba, Lagos',
    category: 'Area information',
    date: 'Jul 19, 2026',
    status: 'Pending review',
    icon: CloudRain,
  },
  {
    title: 'Property condition',
    location: '2 Bedroom Apartment · Yaba, Lagos',
    category: 'Property information',
    date: 'Jul 03, 2026',
    status: 'Needs attention',
    icon: AlertCircle,
  },
];

function StatusBadge({ status }: { status: string }) {
  if (status === 'Approved') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Approved
      </span>
    );
  }

  if (status === 'Pending review') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Pending review
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
      <AlertCircle className="h-3.5 w-3.5" />
      Needs attention
    </span>
  );
}

export default function ContributionsPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">
            Community intelligence
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-primary-text sm:text-3xl">
            Your contributions
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary-text">
            Help keep Product Z accurate and useful by sharing what you know
            about properties and the areas around them.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Make a contribution
        </button>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {contributionStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-outline-color bg-white p-4"
          >
            <p className="text-sm text-secondary-text">{stat.label}</p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-primary-text">
              {stat.value}
            </p>

            <p className="mt-1 text-xs text-secondary-text">
              {stat.description}
            </p>
          </div>
        ))}
      </section>

      {/* Contribution actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-primary-text">
            What would you like to contribute?
          </h2>

          <p className="mt-1 text-sm text-secondary-text">
            Share information that can help someone make a better housing
            decision.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {contributionTypes.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                type="button"
                className="group flex items-start gap-4 rounded-xl border border-outline-color bg-white p-5 text-left transition hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-primary-text">
                      {item.title}
                    </h3>

                    <ArrowRight className="h-4 w-4 shrink-0 text-secondary-text transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>

                  <p className="mt-1.5 text-sm leading-5 text-secondary-text">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recent contributions */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-primary-text">
              Recent contributions
            </h2>

            <p className="mt-1 text-sm text-secondary-text">
              A record of the information you’ve shared.
            </p>
          </div>

          <button
            type="button"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-outline-color bg-white">
          {recentContributions.map((contribution, index) => {
            const Icon = contribution.icon;

            return (
              <button
                key={contribution.title}
                type="button"
                className={`group flex w-full items-center gap-4 p-4 text-left transition hover:bg-background ${
                  index !== recentContributions.length - 1
                    ? 'border-b border-outline-color'
                    : ''
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background text-secondary-text">
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                    <h3 className="truncate text-sm font-medium text-primary-text">
                      {contribution.title}
                    </h3>

                    <span className="hidden text-xs text-secondary-text sm:inline">
                      {contribution.category}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-xs text-secondary-text">
                    {contribution.location}
                  </p>
                </div>

                <div className="hidden shrink-0 text-right sm:block">
                  <StatusBadge status={contribution.status} />
                  <p className="mt-1.5 text-xs text-secondary-text">
                    {contribution.date}
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-secondary-text transition group-hover:translate-x-0.5 group-hover:text-primary sm:hidden" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Pending review */}
      <section className="rounded-xl border border-primary/15 bg-primary-soft/60 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary">
            <FileText className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-primary-text">
              How contributions work
            </h2>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-secondary-text">
              Your contributions may be reviewed before they become part of
              Product Z’s property or area intelligence. This helps keep
              information reliable while still allowing people with real
              experience to contribute.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}