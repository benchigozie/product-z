'use client';

import Link from 'next/link';
import {
  Bell,
  ChevronDown,
  Menu,
  ExternalLink,
  UserRound,
} from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary-text transition-colors hover:bg-background hover:text-primary-text lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={21} />
        </button>

        {/* Workspace */}
        <button
          type="button"
          className="hidden items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-primary-text transition-colors hover:bg-background sm:flex"
        >
          <span>Personal</span>
          <ChevronDown size={16} className="text-secondary-text" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Explore Product Z */}
        <Link
          href="/"
          className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-secondary-text transition-colors hover:bg-background hover:text-primary-text md:flex"
        >
          <span>Explore Product Z</span>
          <ExternalLink size={15} />
        </Link>

        {/* Notifications */}
        <Link
          href="/dashboard/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-secondary-text transition-colors hover:bg-background hover:text-primary-text"
          aria-label="Notifications"
        >
          <Bell size={19} strokeWidth={1.8} />

          {/* Unread indicator */}
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </Link>

        {/* Profile */}
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-background"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
            <UserRound size={17} />
          </div>

          <span className="hidden text-sm font-semibold text-primary-text lg:block">
            Profile
          </span>
        </Link>
      </div>
    </header>
  );
}