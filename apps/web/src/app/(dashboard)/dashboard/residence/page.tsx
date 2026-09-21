'use client';

import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  FileText,
  Home,
  MapPin,
  MessageSquarePlus,
  MoveRight,
  ShieldCheck,
  UserRound,
  Zap,
  Droplets,
  CloudRain,
} from 'lucide-react';

const residence = {
  propertyName: '2 Bedroom Apartment',
  area: 'Yaba, Lagos',
  since: 'March 2025',
  verificationStatus: 'Partially verified',
};

const contributions = [
  {
    title: 'Power reliability',
    date: 'Aug 28, 2026',
    icon: Zap,
  },
  {
    title: 'Water availability',
    date: 'Aug 12, 2026',
    icon: Droplets,
  },
  {
    title: 'Area flooding',
    date: 'Jul 19, 2026',
    icon: CloudRain,
  },
  {
    title: 'Property condition',
    date: 'Jul 03, 2026',
    icon: Home,
  },
];

const timeline = [
  {
    date: 'Mar 2025',
    title: 'You moved into this property',
    description: 'Your residence was added to Product Z.',
  },
  {
    date: 'Jul 2025',
    title: 'Power information added',
    description: 'You contributed information about power reliability.',
  },
  {
    date: 'May 2026',
    title: 'Water availability updated',
    description: 'You updated the property record.',
  },
  {
    date: 'Aug 2026',
    title: 'Property condition reported',
    description: 'You shared an update about the condition of the property.',
  },
];

export default function ResidencePage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
          <Home className="h-4 w-4" />
          My Residence
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-primary-text sm:text-3xl">
          Your current home
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary-text sm:text-base">
          Manage your current residence, contribute what you know, and help
          keep its Product Z record up to date.
        </p>
      </div>

      {/* Current Residence */}
      <section className="rounded-2xl border border-outline-color bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Home className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-secondary-text">
                Current residence
              </div>

              <h2 className="text-lg font-semibold text-primary-text">
                {residence.propertyName}
              </h2>

              <div className="mt-1 flex items-center gap-1.5 text-sm text-secondary-text">
                <MapPin className="h-4 w-4" />
                {residence.area}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
                  <UserRound className="h-3.5 w-3.5" />
                  Current resident
                </span>

                <span className="text-xs text-secondary-text">
                  Living here since {residence.since}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <div>
              <div className="text-xs font-medium text-secondary-text">
                Property intelligence
              </div>

              <div className="mt-1 flex items-center gap-2 text-sm font-medium text-primary-text">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {residence.verificationStatus}
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:opacity-80"
            >
              View property
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Residence Actions */}
      <section>
        <SectionHeading
          title="Residence actions"
          description="Keep your residence information accurate and contribute to its record."
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ActionCard
            icon={FileText}
            title="Update Residence"
            description="Update information about your current home."
          />

          <ActionCard
            icon={MessageSquarePlus}
            title="Contribute"
            description="Share what you know about the property and area."
          />

          <ActionCard
            icon={CircleAlert}
            title="Report an Issue"
            description="Tell Product Z when something has changed."
          />

          <ActionCard
            icon={ShieldCheck}
            title="Get Verified"
            description="Request a Product Z verification of this property."
          />
        </div>
      </section>

      {/* Planning to Move */}
      <section className="overflow-hidden rounded-2xl border border-primary/15 bg-primary-soft">
        <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <MoveRight className="h-4 w-4" />
              Planning to move?
            </div>

            <h2 className="text-xl font-semibold tracking-tight text-primary-text">
              Your current home could help the next renter.
            </h2>

            <p className="mt-2 text-sm leading-6 text-secondary-text">
              When you're ready to leave, you can list your home on Product Z
              and help the next renter understand what they're getting.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            List My Home
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Contributions */}
      <section>
        <SectionHeading
          title="Your contributions"
          description="Information you've shared that helps build the property's intelligence record."
        />

        <div className="mt-4 overflow-hidden rounded-2xl border border-outline-color bg-white">
          <div className="divide-y divide-outline-color">
            {contributions.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-secondary-text">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div>
                      <div className="text-sm font-medium text-primary-text">
                        {item.title}
                      </div>

                      <div className="mt-0.5 text-xs text-secondary-text">
                        Updated {item.date}
                      </div>
                    </div>
                  </div>

                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                </div>
              );
            })}
          </div>

          <div className="border-t border-outline-color px-5 py-4 sm:px-6">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:opacity-80"
            >
              View all contributions
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Residence Timeline */}
      <section>
        <SectionHeading
          title="Residence timeline"
          description="A history of important updates connected to your residence."
        />

        <div className="mt-4 rounded-2xl border border-outline-color bg-white p-5 sm:p-6">
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={item.title} className="relative flex gap-4">
                {index < timeline.length - 1 && (
                  <div className="absolute left-[7px] top-5 h-[calc(100%+12px)] w-px bg-outline-color" />
                )}

                <div className="relative mt-1 h-4 w-4 shrink-0 rounded-full border-4 border-primary-soft bg-primary" />

                <div className="min-w-0 pb-1">
                  <div className="text-xs font-medium text-secondary-text">
                    {item.date}
                  </div>

                  <h3 className="mt-1 text-sm font-semibold text-primary-text">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-secondary-text">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-primary-text">{title}</h2>
      <p className="mt-1 text-sm text-secondary-text">{description}</p>
    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof FileText;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="group rounded-2xl border border-outline-color bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-primary-text">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-5 text-secondary-text">
        {description}
      </p>

      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
        Open
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}