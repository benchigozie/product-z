
'use client';

import {
    ArrowRight,
    Building2,
    CalendarDays,
    CheckCircle2,
    ClipboardCheck,
    Eye,
    Plus,
    UserRound,
} from 'lucide-react';

const stats = [
    {
        label: 'Active Listings',
        value: '12',
        description: 'Properties you manage',
        icon: Building2,
    },
    {
        label: 'Upcoming Inspections',
        value: '4',
        description: 'Scheduled inspections',
        icon: CalendarDays,
    },
    {
        label: 'Active Prospects',
        value: '18',
        description: 'People showing interest',
        icon: UserRound,
    },
    {
        label: 'Verified Listings',
        value: '8',
        description: 'Properties verified',
        icon: CheckCircle2,
    },
];

const recentInspections = [
    {
        property: '3 Bedroom Flat',
        area: 'Yaba, Lagos',
        date: 'Today, 3:00 PM',
        status: 'Upcoming',
    },
    {
        property: '2 Bedroom Apartment',
        area: 'Surulere, Lagos',
        date: 'Tomorrow, 11:00 AM',
        status: 'Upcoming',
    },
    {
        property: '4 Bedroom Duplex',
        area: 'Lekki Phase 1, Lagos',
        date: 'Sep 22, 2:00 PM',
        status: 'Upcoming',
    },
];

const recentListings = [
    {
        property: 'Modern 3 Bedroom Apartment',
        area: 'Yaba, Lagos',
        views: 124,
        status: 'Active',
    },
    {
        property: '2 Bedroom Flat',
        area: 'Surulere, Lagos',
        views: 86,
        status: 'Active',
    },
    {
        property: '4 Bedroom Duplex',
        area: 'Lekki Phase 1, Lagos',
        views: 203,
        status: 'Active',
    },
];

export function AgentDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium text-secondary-text">
                        Agent workspace
                    </p>

                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-primary-text">
                        Good morning, Ben
                    </h1>

                    <p className="mt-2 text-sm text-secondary-text">
                        Here's what's happening with your properties.
                    </p>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                >
                    <Plus size={17} />
                    Add Listing
                </button>
            </div>

            {/* Overview */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-outline-color bg-white p-5"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                                    <Icon size={19} strokeWidth={1.8} />
                                </div>
                            </div>

                            <div className="mt-5">
                                <p className="text-2xl font-semibold text-primary-text">
                                    {stat.value}
                                </p>

                                <p className="mt-1 text-sm font-medium text-primary-text">
                                    {stat.label}
                                </p>

                                <p className="mt-1 text-xs text-secondary-text">
                                    {stat.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Main Content */}
            <div className="grid gap-6 xl:grid-cols-2">
                {/* Inspections */}
                <section className="rounded-2xl border border-outline-color bg-white">
                    <div className="flex items-center justify-between border-b border-outline-color px-5 py-4">
                        <div>
                            <h2 className="text-sm font-semibold text-primary-text">
                                Upcoming Inspections
                            </h2>

                            <p className="mt-1 text-xs text-secondary-text">
                                Your scheduled property inspections
                            </p>
                        </div>

                        <button
                            type="button"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
                        >
                            View all
                            <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="divide-y divide-outline-color">
                        {recentInspections.map((inspection) => (
                            <div
                                key={`${inspection.property}-${inspection.date}`}
                                className="flex items-center justify-between gap-4 px-5 py-4"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-primary-text">
                                        {inspection.property}
                                    </p>

                                    <p className="mt-1 text-xs text-secondary-text">
                                        {inspection.area}
                                    </p>

                                    <p className="mt-2 text-xs font-medium text-primary">
                                        {inspection.date}
                                    </p>
                                </div>

                                <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
                                    {inspection.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Listings */}
                <section className="rounded-2xl border border-outline-color bg-white">
                    <div className="flex items-center justify-between border-b border-outline-color px-5 py-4">
                        <div>
                            <h2 className="text-sm font-semibold text-primary-text">
                                Your Listings
                            </h2>

                            <p className="mt-1 text-xs text-secondary-text">
                                Recently active properties
                            </p>
                        </div>

                        <button
                            type="button"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
                        >
                            View all
                            <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="divide-y divide-outline-color">
                        {recentListings.map((listing) => (
                            <div
                                key={listing.property}
                                className="flex items-center justify-between gap-4 px-5 py-4"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-primary-text">
                                        {listing.property}
                                    </p>

                                    <p className="mt-1 text-xs text-secondary-text">
                                        {listing.area}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-1.5 text-xs text-secondary-text">
                                    <Eye size={14} />
                                    {listing.views}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Quick Actions */}
            <section>
                <div className="mb-4">
                    <h2 className="text-sm font-semibold text-primary-text">
                        Quick Actions
                    </h2>

                    <p className="mt-1 text-xs text-secondary-text">
                        Common actions for managing your listings
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <button
                        type="button"
                        className="group flex items-center gap-4 rounded-2xl border border-outline-color bg-white p-5 text-left transition-colors hover:border-primary/30 hover:bg-primary-soft"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                            <Plus size={19} />
                        </div>

                        <div className="flex-1">
                            <p className="text-sm font-semibold text-primary-text">
                                Add a listing
                            </p>

                            <p className="mt-1 text-xs text-secondary-text">
                                Add a property you're managing
                            </p>
                        </div>

                        <ArrowRight
                            size={16}
                            className="text-secondary-text transition-transform group-hover:translate-x-1"
                        />
                    </button>

                    <button
                        type="button"
                        className="group flex items-center gap-4 rounded-2xl border border-outline-color bg-white p-5 text-left transition-colors hover:border-primary/30 hover:bg-primary-soft"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                            <ClipboardCheck size={19} />
                        </div>

                        <div className="flex-1">
                            <p className="text-sm font-semibold text-primary-text">
                                Request verification
                            </p>

                            <p className="mt-1 text-xs text-secondary-text">
                                Get a property verified
                            </p>
                        </div>

                        <ArrowRight
                            size={16}
                            className="text-secondary-text transition-transform group-hover:translate-x-1"
                        />
                    </button>

                    <button
                        type="button"
                        className="group flex items-center gap-4 rounded-2xl border border-outline-color bg-white p-5 text-left transition-colors hover:border-primary/30 hover:bg-primary-soft"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                            <UserRound size={19} />
                        </div>

                        <div className="flex-1">
                            <p className="text-sm font-semibold text-primary-text">
                                View prospects
                            </p>

                            <p className="mt-1 text-xs text-secondary-text">
                                See people interested in your listings
                            </p>
                        </div>

                        <ArrowRight
                            size={16}
                            className="text-secondary-text transition-transform group-hover:translate-x-1"
                        />
                    </button>
                </div>
            </section>
        </div>
    );
}
