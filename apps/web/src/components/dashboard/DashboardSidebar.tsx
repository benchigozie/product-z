'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    Bell,
    Bookmark,
    View,
    Compass,
    Home,
    Houses,
    LogOut,
    Search,
    Settings,
    UserRound,
    ClipboardCheck,
    PlusCircle,
    StarCheck,
} from 'lucide-react';

import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { useWorkspace } from '@/context/WorkspaceContext';

const navigation = {
    personal: [
        {
            label: 'Home',
            href: '/dashboard',
            icon: Home,
        },
        {
            label: 'Search',
            href: '/properties',
            icon: Search,
        },
        {
            label: 'Interests',
            href: '/dashboard/interests',
            icon: StarCheck,
        },
        {
            label: 'Inspections',
            href: '/dashboard/inspections',
            icon: ClipboardCheck,
        },
        {
            label: 'My Residence',
            href: '/dashboard/residence',
            icon: Houses,
        },
        {
            label: 'Contribute',
            href: '/dashboard/contributions',
            icon: PlusCircle,
        },
        {
            label: 'Notifications',
            href: '/dashboard/notifications',
            icon: Bell,
        },
    ],

    agent: [
        {
            label: 'Home',
            href: '/dashboard',
            icon: Home,
        },
        {
            label: 'Listings',
            href: '/dashboard/listings',
            icon: Houses,
        },
        {
            label: 'Inspections',
            href: '/dashboard/inspections',
            icon: ClipboardCheck,
        },
        {
            label: 'Verification',
            href: '/dashboard/verification',
            icon: Search,
        },
        {
            label: 'Prospects',
            href: '/dashboard/prospects',
            icon: UserRound,
        },
        {
            label: 'Notifications',
            href: '/dashboard/notifications',
            icon: Bell,
        },
    ],

    landlord: [
        {
            label: 'Home',
            href: '/dashboard',
            icon: Home,
        },
        {
            label: 'Properties',
            href: '/dashboard/properties',
            icon: Houses,
        },
        {
            label: 'Occupancy',
            href: '/dashboard/occupancy',
            icon: UserRound,
        },
        {
            label: 'Listings',
            href: '/dashboard/listings',
            icon: Compass,
        },
        {
            label: 'Agents',
            href: '/dashboard/agents',
            icon: UserRound,
        },
        {
            label: 'Verification',
            href: '/dashboard/verification',
            icon: Search,
        },
        {
            label: 'Notifications',
            href: '/dashboard/notifications',
            icon: Bell,
        },
    ],
};

export function DashboardSidebar() {

    const { workspace } = useWorkspace();
    const currentNavigation = navigation[workspace];

    return (
        <aside className="flex h-full flex-col bg-[linear-gradient(to_bottom,var(--color-primary-text)_0%,var(--color-primary-dark)_20%,var(--color-primary-dark)_100%)]">
            <div className="flex h-16 items-center border-b border-primary/10 px-6">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/images/arya-logo.png"
                        alt="Product Z"
                        width={120}
                        height={32}
                       
                    />
                </Link>
            </div>

            <div className="border-b border-white/10 p-4">
                <WorkspaceSwitcher />
            </div>

            <nav className="flex-1 space-y-1 p-4">
                {currentNavigation.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/65 transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                            <Icon
                                size={19}
                                strokeWidth={1.8}
                                className="transition-colors group-hover:text-primary"
                            />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-white/10 p-4">
                <Link
                    href="/dashboard/profile"
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/65 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                    <UserRound
                        size={19}
                        strokeWidth={1.8}
                        className="transition-colors group-hover:text-primary"
                    />
                    <span>Profile</span>
                </Link>

                <Link
                    href="/dashboard/settings"
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/65 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                    <Settings
                        size={19}
                        strokeWidth={1.8}
                        className="transition-colors group-hover:text-primary"
                    />
                    <span>Settings</span>
                </Link>

                <button
                    type="button"
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/65 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                    <LogOut
                        size={19}
                        strokeWidth={1.8}
                        className="transition-colors group-hover:text-primary"
                    />
                    <span>Log out</span>
                </button>
            </div>
        </aside>
    );
}
