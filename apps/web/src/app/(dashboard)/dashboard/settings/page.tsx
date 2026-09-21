'use client';

import {
  Bell,
  ChevronRight,
  Eye,
  KeyRound,
  LogOut,
  Monitor,
  Moon,
  Palette,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserRound,
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="border-b border-outline-color bg-white">
        <div className="px-6 py-6 lg:px-8">
          <h1 className="text-xl font-semibold tracking-tight text-primary-text">
            Settings
          </h1>
          <p className="mt-1 text-sm text-secondary-text">
            Manage your account, preferences, privacy, and security.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-6 py-8 lg:px-8">
        {/* Account */}
        <SettingsSection
          title="Account"
          description="Manage your account details and access."
        >
          <SettingsRow
            icon={<UserRound size={18} />}
            title="Profile"
            description="Update your name, contact information, and profile."
            action="Manage"
          />

          <SettingsRow
            icon={<KeyRound size={18} />}
            title="Password"
            description="Change your password and keep your account secure."
            action="Change"
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection
          title="Notifications"
          description="Choose how Product Z keeps you informed."
        >
          <SettingsRow
            icon={<Bell size={18} />}
            title="Notification preferences"
            description="Control which updates and activity notifications you receive."
            action="Manage"
          />

          <SettingsToggle
            icon={<Bell size={18} />}
            title="Email notifications"
            description="Receive important Product Z updates by email."
            enabled
          />

          <SettingsToggle
            icon={<Smartphone size={18} />}
            title="Push notifications"
            description="Receive notifications on your device when available."
            enabled
          />
        </SettingsSection>

        {/* Privacy */}
        <SettingsSection
          title="Privacy"
          description="Control how your information is used and displayed."
        >
          <SettingsRow
            icon={<Eye size={18} />}
            title="Profile visibility"
            description="Choose what other Product Z users can see about you."
            action="Manage"
          />

          <SettingsToggle
            icon={<ShieldCheck size={18} />}
            title="Contribution attribution"
            description="Show your verified identity alongside contributions you make."
            enabled
          />
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection
          title="Preferences"
          description="Customize your Product Z experience."
        >
          <SettingsRow
            icon={<Monitor size={18} />}
            title="Appearance"
            description="Choose how Product Z looks on your device."
            value="System"
            action="Change"
          />

          <SettingsRow
            icon={<Moon size={18} />}
            title="Theme"
            description="Set your preferred interface theme."
            value="Light"
            action="Change"
          />

          <SettingsRow
            icon={<Palette size={18} />}
            title="Interface preferences"
            description="Manage other visual and interaction preferences."
            action="Manage"
          />
        </SettingsSection>

        {/* Security */}
        <SettingsSection
          title="Security"
          description="Review your account security and active sessions."
        >
          <SettingsRow
            icon={<ShieldCheck size={18} />}
            title="Security"
            description="Manage authentication and account security options."
            action="Manage"
          />

          <SettingsRow
            icon={<Monitor size={18} />}
            title="Active sessions"
            description="Review devices currently signed in to your account."
            action="View"
          />
        </SettingsSection>

        {/* Workspace */}
        <SettingsSection
          title="Workspace"
          description="Manage settings related to how you use Product Z."
        >
          <SettingsRow
            icon={<UserRound size={18} />}
            title="Workspace preferences"
            description="Manage preferences for your current workspace."
            action="Manage"
          />
        </SettingsSection>

        {/* Sign out */}
        <section className="rounded-2xl border border-outline-color bg-white">
          <div className="border-b border-outline-color px-6 py-5">
            <h2 className="text-sm font-semibold text-primary-text">
              Session
            </h2>
            <p className="mt-1 text-sm text-secondary-text">
              Manage your current session.
            </p>
          </div>

          <div className="flex items-center justify-between gap-6 px-6 py-5">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <LogOut size={18} />
              </div>

              <div>
                <p className="text-sm font-medium text-primary-text">
                  Sign out
                </p>
                <p className="mt-1 text-sm text-secondary-text">
                  Sign out of Product Z on this device.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="shrink-0 rounded-lg border border-outline-color px-4 py-2 text-sm font-medium text-primary-text transition hover:bg-background"
            >
              Sign out
            </button>
          </div>
        </section>

        {/* Danger zone */}
        <section className="rounded-2xl border border-red-200 bg-white">
          <div className="border-b border-red-100 px-6 py-5">
            <h2 className="text-sm font-semibold text-red-700">
              Danger zone
            </h2>
            <p className="mt-1 text-sm text-secondary-text">
              Actions here can permanently affect your Product Z account.
            </p>
          </div>

          <div className="flex flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Trash2 size={18} />
              </div>

              <div>
                <p className="text-sm font-medium text-primary-text">
                  Delete account
                </p>
                <p className="mt-1 max-w-xl text-sm leading-6 text-secondary-text">
                  Permanently delete your account and associated personal
                  information. Some public contributions may be retained in
                  anonymized form.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="shrink-0 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Delete account
            </button>
          </div>
        </section>

        {/* Footer */}
        <div className="pb-4 pt-2 text-center">
          <p className="text-xs text-secondary-text">
            Product Z · Account settings
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-outline-color bg-white">
      <div className="border-b border-outline-color px-6 py-5">
        <h2 className="text-sm font-semibold text-primary-text">{title}</h2>
        <p className="mt-1 text-sm text-secondary-text">{description}</p>
      </div>

      <div className="divide-y divide-outline-color">{children}</div>
    </section>
  );
}

function SettingsRow({
  icon,
  title,
  description,
  action,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  value?: string;
}) {
  return (
    <button
      type="button"
      className="group flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-background"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-primary-text">{title}</p>
        <p className="mt-1 text-sm leading-5 text-secondary-text">
          {description}
        </p>
      </div>

      {value && (
        <span className="hidden shrink-0 text-sm text-secondary-text sm:block">
          {value}
        </span>
      )}

      <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
        <span className="hidden sm:block">{action}</span>
        <ChevronRight
          size={17}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </button>
  );
}

function SettingsToggle({
  icon,
  title,
  description,
  enabled,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-5">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-primary-text">{title}</p>
          <p className="mt-1 text-sm leading-5 text-secondary-text">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? 'bg-primary' : 'bg-outline-color'
        }`}
        aria-label={`Toggle ${title}`}
        aria-pressed={enabled}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? 'right-1' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}