'use client';

import {
  Building2,
  CheckCircle2,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  UserRound,
} from 'lucide-react';

const agents = [
  {
    id: 1,
    name: 'Emeka Properties',
    contact: 'Emeka Okafor',
    phone: '+234 803 123 4567',
    properties: 3,
    listings: 5,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Prime Homes',
    contact: 'David Adeyemi',
    phone: '+234 806 456 7890',
    properties: 2,
    listings: 3,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Lekki Realty',
    contact: 'Chinedu Eze',
    phone: '+234 809 234 5678',
    properties: 1,
    listings: 2,
    status: 'Pending',
  },
  {
    id: 4,
    name: 'Bode Properties',
    contact: 'Bode Williams',
    phone: '+234 805 678 1234',
    properties: 1,
    listings: 0,
    status: 'Inactive',
  },
];

const statusStyles = {
  Active: 'bg-primary-soft text-primary',
  Pending: 'bg-amber-50 text-amber-700',
  Inactive: 'bg-gray-100 text-gray-500',
};

const activeAgents = agents.filter(
  (agent) => agent.status === 'Active',
).length;

const assignedProperties = agents.reduce(
  (total, agent) => total + agent.properties,
  0,
);

const activeListings = agents.reduce(
  (total, agent) => total + agent.listings,
  0,
);

export default function LandlordAgentsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">
            Landlord workspace
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-text">
            Agents
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-secondary-text">
            Manage the agents working with you and the properties they
            represent.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          <Plus size={17} />
          Add agent
        </button>
      </div>

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <AgentStat
          label="Active agents"
          value={activeAgents.toString()}
          icon={CheckCircle2}
        />

        <AgentStat
          label="Assigned properties"
          value={assignedProperties.toString()}
          icon={Building2}
        />

        <AgentStat
          label="Active listings"
          value={activeListings.toString()}
          icon={Eye}
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
          placeholder="Search agents..."
          className="h-11 w-full rounded-xl border border-outline-color bg-white pl-10 pr-4 text-sm text-primary-text outline-none placeholder:text-secondary-text focus:border-primary"
        />
      </div>

      {/* Agents */}
      <div className="overflow-hidden rounded-2xl border border-outline-color bg-white">
        <div className="border-b border-outline-color px-5 py-4">
          <h2 className="text-sm font-semibold text-primary-text">
            Your agents
          </h2>

          <p className="mt-0.5 text-xs text-secondary-text">
            Agents connected to your properties
          </p>
        </div>

        <div className="divide-y divide-outline-color">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex flex-col gap-5 px-5 py-5 transition-colors hover:bg-background/60 lg:flex-row lg:items-center"
            >
              {/* Agent */}
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <UserRound size={19} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-primary-text">
                      {agent.name}
                    </h3>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        statusStyles[
                          agent.status as keyof typeof statusStyles
                        ]
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-secondary-text">
                    {agent.contact}
                  </p>

                  <p className="mt-0.5 text-xs text-secondary-text">
                    {agent.phone}
                  </p>
                </div>
              </div>

              {/* Properties */}
              <div className="lg:w-36">
                <p className="text-xs text-secondary-text">
                  Properties
                </p>

                <p className="mt-1 text-sm font-semibold text-primary-text">
                  {agent.properties}
                </p>
              </div>

              {/* Listings */}
              <div className="lg:w-32">
                <p className="text-xs text-secondary-text">
                  Listings
                </p>

                <p className="mt-1 text-sm font-semibold text-primary-text">
                  {agent.listings}
                </p>
              </div>

              {/* Actions */}
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-secondary-text transition-colors hover:bg-background hover:text-primary-text"
                aria-label={`Actions for ${agent.name}`}
              >
                <MoreHorizontal size={19} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-outline-color bg-white p-5">
        <p className="text-sm font-semibold text-primary-text">
          Keep your property relationships organized
        </p>

        <p className="mt-1 text-sm leading-6 text-secondary-text">
          Agents can help market and represent your properties, while
          ownership and property records remain under your control.
        </p>
      </div>
    </div>
  );
}

function AgentStat({
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