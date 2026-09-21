'use client';

import {
  Camera,
  CheckCircle2,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="border-b border-outline-color bg-white">
        <div className="px-6 py-6 lg:px-8">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-primary-text">
              Profile
            </h1>
            <p className="mt-1 text-sm text-secondary-text">
              Manage your personal information and how you appear on Product Z.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-6 py-8 lg:px-8">
        {/* Profile identity */}
        <section className="rounded-2xl border border-outline-color bg-white">
          <div className="border-b border-outline-color px-6 py-5">
            <h2 className="text-sm font-semibold text-primary-text">
              Personal information
            </h2>
            <p className="mt-1 text-sm text-secondary-text">
              The basic information associated with your Product Z account.
            </p>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-soft text-2xl font-semibold text-primary">
                  BA
                </div>

                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-sm transition hover:bg-primary/90"
                  aria-label="Change profile photo"
                >
                  <Camera size={15} strokeWidth={2} />
                </button>
              </div>

              {/* Identity */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-primary-text">
                    Benedict Asoya
                  </h3>

                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
                    <CheckCircle2 size={13} />
                    Verified
                  </span>
                </div>

                <p className="mt-1 text-sm text-secondary-text">
                  Personal account
                </p>

                <button
                  type="button"
                  className="mt-4 text-sm font-medium text-primary transition hover:text-primary/80"
                >
                  Change profile photo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact information */}
        <section className="rounded-2xl border border-outline-color bg-white">
          <div className="border-b border-outline-color px-6 py-5">
            <h2 className="text-sm font-semibold text-primary-text">
              Contact information
            </h2>
            <p className="mt-1 text-sm text-secondary-text">
              Your contact details are used to keep your account and housing
              activity connected.
            </p>
          </div>

          <div className="divide-y divide-outline-color">
            {/* Name */}
            <div className="flex items-center justify-between gap-6 px-6 py-5">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <User size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary-text">
                    Full name
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-primary-text">
                    Benedict Asoya
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="shrink-0 text-sm font-medium text-primary hover:text-primary/80"
              >
                Edit
              </button>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between gap-6 px-6 py-5">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Mail size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary-text">
                    Email address
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium text-primary-text">
                      benedict@example.com
                    </p>

                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                      <CheckCircle2 size={13} />
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="shrink-0 text-sm font-medium text-primary hover:text-primary/80"
              >
                Edit
              </button>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between gap-6 px-6 py-5">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Phone size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary-text">
                    Phone number
                  </p>
                  <p className="mt-1 text-sm font-medium text-primary-text">
                    +234 800 000 0000
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="shrink-0 text-sm font-medium text-primary hover:text-primary/80"
              >
                Edit
              </button>
            </div>

            {/* Location */}
            <div className="flex items-center justify-between gap-6 px-6 py-5">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <MapPin size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary-text">
                    Location
                  </p>
                  <p className="mt-1 text-sm font-medium text-primary-text">
                    Lagos, Nigeria
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="shrink-0 text-sm font-medium text-primary hover:text-primary/80"
              >
                Edit
              </button>
            </div>
          </div>
        </section>

        {/* Verification */}
        <section className="rounded-2xl border border-outline-color bg-white">
          <div className="border-b border-outline-color px-6 py-5">
            <h2 className="text-sm font-semibold text-primary-text">
              Identity & verification
            </h2>
            <p className="mt-1 text-sm text-secondary-text">
              Verification helps build trust around your contributions and
              property activity.
            </p>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-5 rounded-xl border border-primary/15 bg-primary-soft/50 p-5 sm:flex-row sm:items-center">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                <ShieldCheck size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-primary-text">
                  Your identity is verified
                </p>
                <p className="mt-1 text-sm leading-6 text-secondary-text">
                  Your verified identity helps Product Z establish trust
                  around your activity on the platform.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
              >
                View details
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Public profile */}
        <section className="rounded-2xl border border-outline-color bg-white">
          <div className="border-b border-outline-color px-6 py-5">
            <h2 className="text-sm font-semibold text-primary-text">
              Profile visibility
            </h2>
            <p className="mt-1 text-sm text-secondary-text">
              Control what other Product Z users can see about you.
            </p>
          </div>

          <div className="flex items-center justify-between gap-6 px-6 py-5">
            <div>
              <p className="text-sm font-medium text-primary-text">
                Show my contributor profile
              </p>
              <p className="mt-1 max-w-xl text-sm leading-6 text-secondary-text">
                Allow other users to see your name and contribution activity
                when you contribute information to properties or areas.
              </p>
            </div>

            <button
              type="button"
              className="relative h-6 w-11 shrink-0 rounded-full bg-primary transition"
              aria-label="Toggle contributor profile visibility"
              aria-pressed="true"
            >
              <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </section>

        {/* Workspace note */}
        <section className="rounded-2xl border border-dashed border-outline-color bg-background p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
              <User size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold text-primary-text">
                Your profile works across Product Z
              </p>
              <p className="mt-1 text-sm leading-6 text-secondary-text">
                If you use Product Z as an agent or landlord, your professional
                information will appear alongside this core profile in those
                workspaces.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}