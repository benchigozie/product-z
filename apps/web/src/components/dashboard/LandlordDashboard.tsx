'use client';

import {
    ArrowRight,
    Building2,
    CheckCircle2,
    ClipboardCheck,
    Home,
    Plus,
    UserRound,
    Users,
} from 'lucide-react';

const stats = [
    {
        label: 'Properties',
        value: '6',
        description: 'Properties you own',
        icon: Building2,
    },
    {
        label: 'Occupied Units',
        value: '18',
        description: 'Currently occupied',
        icon: Users,
    },
    {
        label: 'Available Units',
        value: '4',
        description: 'Currently available',
        icon: Home,
    },
    {
        label: 'Verified Properties',
        value: '4',
        description: 'Properties verified',
        icon: CheckCircle2,
    },
];

const recentProperties = [
    {
        property: '12 Unity Street',
        area: 'Yaba, Lagos',
        units: '8 units',
        status: 'Occupied',
    },
    {
        property: '24 Ogunlana Drive',
        area: 'Surulere, Lagos',
        units: '6 units',
        status: 'Occupied',
    },
    {
        property: '8 Admiralty Way',
        area: 'Lekki Phase 1, Lagos',
        units: '4 units',
        status: '2 available',
    },
];

const recentActivity = [
    {
        title: 'New tenancy recorded',
        description: 'A new resident was added to 12 Unity Street',
        time: '2 hours ago',
    },
    {
        title: 'Property verification completed',
        description: '12 Unity Street was successfully verified',
        time: 'Yesterday',
    },
    {
        title: 'Listing updated',
        description: 'Availability was updated for 8 Admiralty Way',
        time: '2 days ago',
    },
];

export function LandlordDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium text-secondary-text">
                        Landlord workspace
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
                    Add Property
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
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                                <Icon size={19} strokeWidth={1.8} />
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
                {/* Properties */}
                <section className="rounded-2xl border border-outline-color bg-white">
                    <div className="flex items-center justify-between border-b border-outline-color px-5 py-4">
                        <div>
                            <h2 className="text-sm font-semibold text-primary-text">
                                Your Properties
                            </h2>

                            <p className="mt-1 text-xs text-secondary-text">
                                Overview of your managed properties
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
                        {recentProperties.map((property) => (
                            <div
                                key={property.property}
                                className="flex items-center justify-between gap-4 px-5 py-4"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-primary-text">
                                        {property.property}
                                    </p>

                                    <p className="mt-1 text-xs text-secondary-text">
                                        {property.area} · {property.units}
                                    </p>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                                        property.status === 'Occupied'
                                            ? 'bg-primary-soft text-primary'
                                            : 'bg-amber-50 text-amber-700'
                                    }`}
                                >
                                    {property.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Activity */}
                <section className="rounded-2xl border border-outline-color bg-white">
                    <div className="flex items-center justify-between border-b border-outline-color px-5 py-4">
                        <div>
                            <h2 className="text-sm font-semibold text-primary-text">
                                Recent Activity
                            </h2>

                            <p className="mt-1 text-xs text-secondary-text">
                                Recent changes across your properties
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
                        {recentActivity.map((activity) => (
                            <div
                                key={activity.title}
                                className="flex gap-3 px-5 py-4"
                            >
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                                    <CheckCircle2 size={16} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-primary-text">
                                        {activity.title}
                                    </p>

                                    <p className="mt-1 text-xs text-secondary-text">
                                        {activity.description}
                                    </p>

                                    <p className="mt-2 text-xs text-secondary-text">
                                        {activity.time}
                                    </p>
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
                        Common actions for managing your properties
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
                                Add a property
                            </p>

                            <p className="mt-1 text-xs text-secondary-text">
                                Add a property to your portfolio
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
                                Verify a property
                            </p>

                            <p className="mt-1 text-xs text-secondary-text">
                                Start the property verification process
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
                                Manage residents
                            </p>

                            <p className="mt-1 text-xs text-secondary-text">
                                View residents and tenancy information
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