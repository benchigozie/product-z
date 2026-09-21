'use client';

import { useAuth } from "@/context/AuthContext";

import {
    ArrowRight,
    Bookmark,
    CalendarDays,
    Eye,
    MapPin,
    Plus,
    ShieldCheck,
} from 'lucide-react';


export function PersonalDashboard() {

    const { user } = useAuth();

    const displayName =
        user?.profile?.displayName ||
        user?.profile?.username ||
        user?.email?.split('@')[0] ||
        'there';

    function getGreeting() {
        const hour = new Date().getHours();

        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';

        return 'Good evening';
    }

    const greeting = getGreeting();

    return (
        <div className="mx-auto w-full max-w-7xl space-y-8">
            <section>
                <p className="mb-2 text-sm font-medium text-secondary-text">
                    Personal workspace
                </p>

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-primary-text sm:text-3xl">
                            {greeting}, {displayName}
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-secondary-text">
                            Continue your housing search and stay up to date with the
                            properties and areas that matter to you.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                    >
                        Explore properties
                        <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardStat
                    icon={Bookmark}
                    label="Saved properties"
                    value="0"
                    href="/dashboard/saved"
                />

                <DashboardStat
                    icon={Eye}
                    label="Recently viewed"
                    value="0"
                    href="/dashboard/recently-viewed"
                />

                <DashboardStat
                    icon={CalendarDays}
                    label="Upcoming inspections"
                    value="0"
                    href="/dashboard/inspections"
                />

                <DashboardStat
                    icon={ShieldCheck}
                    label="HIN Credits"
                    value="0"
                    href="/dashboard/contributions"
                />
            </section>

            <section className="rounded-2xl border border-outline-color bg-white p-6">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div className="max-w-xl">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                            <MapPin size={19} />
                        </div>

                        <h2 className="text-lg font-semibold text-primary-text">
                            Continue your housing search
                        </h2>

                        <p className="mt-1.5 text-sm leading-6 text-secondary-text">
                            You haven't saved any properties yet. Explore properties and
                            start building your housing shortlist.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-outline-color px-4 py-2.5 text-sm font-semibold text-primary-text transition-colors hover:border-primary hover:text-primary"
                    >
                        Explore properties
                        <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            <section>
                <DashboardSectionHeader
                    title="Saved properties"
                    description="Properties you've saved for later."
                    href="/dashboard/saved"
                />

                <div className="rounded-2xl border border-outline-color bg-white p-8 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-background text-secondary-text">
                        <Bookmark size={19} />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-primary-text">
                        No saved properties yet
                    </h3>

                    <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-secondary-text">
                        Save properties while exploring Product Z and they'll appear here.
                    </p>

                    <button
                        type="button"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                    >
                        Explore properties
                        <ArrowRight size={15} />
                    </button>
                </div>
            </section>
            
            <section className="grid gap-6 lg:grid-cols-2">
                <DashboardActivityCard
                    title="Recent area intelligence"
                    description="Updates from areas you're interested in."
                    icon={MapPin}
                    emptyTitle="No area activity yet"
                    emptyDescription="Explore areas to start seeing relevant intelligence here."
                />

                <DashboardActivityCard
                    title="Contribution activity"
                    description="Your recent contributions to Product Z."
                    icon={Plus}
                    emptyTitle="No contributions yet"
                    emptyDescription="Help improve housing intelligence and earn HIN Credits."
                />
            </section>
        </div>
    );
}

function DashboardStat({
    icon: Icon,
    label,
    value,
    href,
}: {
    icon: typeof Bookmark;
    label: string;
    value: string;
    href: string;
}) {
    return (
        <a
            href={href}
            className="group rounded-2xl border border-outline-color bg-white p-5 transition-colors hover:border-primary/30"
        >
            <div className="flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon size={18} />
                </div>

                <ArrowRight
                    size={16}
                    className="text-secondary-text transition-all group-hover:translate-x-0.5 group-hover:text-primary"
                />
            </div>

            <p className="mt-5 text-2xl font-semibold text-primary-text">
                {value}
            </p>

            <p className="mt-1 text-sm text-secondary-text">{label}</p>
        </a>
    );
}

function DashboardSectionHeader({
    title,
    description,
    href,
}: {
    title: string;
    description: string;
    href: string;
}) {
    return (
        <div className="mb-4 flex items-end justify-between gap-4">
            <div>
                <h2 className="text-lg font-semibold text-primary-text">{title}</h2>
                <p className="mt-1 text-sm text-secondary-text">{description}</p>
            </div>

            <a
                href={href}
                className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark sm:flex"
            >
                View all
                <ArrowRight size={15} />
            </a>
        </div>
    );
}

function DashboardActivityCard({
    title,
    description,
    icon: Icon,
    emptyTitle,
    emptyDescription,
}: {
    title: string;
    description: string;
    icon: typeof MapPin;
    emptyTitle: string;
    emptyDescription: string;
}) {
    return (
        <section className="rounded-2xl border border-outline-color bg-white p-6">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon size={18} />
                </div>

                <div>
                    <h2 className="text-base font-semibold text-primary-text">
                        {title}
                    </h2>

                    <p className="mt-1 text-sm text-secondary-text">{description}</p>
                </div>
            </div>

            <div className="py-10 text-center">
                <p className="text-sm font-medium text-primary-text">{emptyTitle}</p>

                <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-secondary-text">
                    {emptyDescription}
                </p>
            </div>
        </section>
    );
}