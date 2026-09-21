'use client';

import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Home,
  Info,
  MessageSquare,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

type NotificationsViewProps = {
  variant?: 'dashboard' | 'public';
};


////////////For now type shiiiiiiii
type NotificationType =
  | 'verification'
  | 'contribution'
  | 'inspection'
  | 'property'
  | 'message'
  | 'system';
///////////////////////////////////

type Notification = {
  id: number;
  title: string;
  description: string;
  time: string;
  type: NotificationType;
  unread: boolean;
  action?: string;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'Your contribution was approved',
    description:
      'Your update about power reliability at the Yaba property has been added to the property record.',
    time: '2 hours ago',
    type: 'contribution',
    unread: true,
    action: 'View contribution',
  },
  {
    id: 2,
    title: 'Property verification completed',
    description:
      'The verification process for the 2 Bedroom Apartment in Yaba has been completed.',
    time: 'Yesterday',
    type: 'verification',
    unread: true,
    action: 'View property',
  },
  {
    id: 3,
    title: 'Your inspection request is being reviewed',
    description:
      'We are reviewing the details of your inspection request and will update you when there is progress.',
    time: '2 days ago',
    type: 'inspection',
    unread: true,
  },
  {
    id: 4,
    title: 'Property information was updated',
    description:
      'New information has been added to a property you recently viewed.',
    time: '3 days ago',
    type: 'property',
    unread: false,
    action: 'View property',
  },
  {
    id: 5,
    title: 'New message about your inspection',
    description:
      'You have received an update regarding your requested property inspection.',
    time: '4 days ago',
    type: 'message',
    unread: false,
    action: 'View message',
  },
  {
    id: 6,
    title: 'Welcome to Product Z',
    description:
      'Your account is ready. Start exploring properties and understanding the areas around them.',
    time: '1 week ago',
    type: 'system',
    unread: false,
    action: 'Explore properties',
  },
];

const filters = ['All', 'Unread', 'Updates'];

function NotificationIcon({ type }: { type: NotificationType }) {
  const config = {
    verification: {
      icon: ShieldCheck,
      className: 'bg-primary-soft text-primary',
    },
    contribution: {
      icon: CheckCircle2,
      className: 'bg-primary-soft text-primary',
    },
    inspection: {
      icon: Clock3,
      className: 'bg-amber-50 text-amber-600',
    },
    property: {
      icon: Home,
      className: 'bg-sky-50 text-sky-600',
    },
    message: {
      icon: MessageSquare,
      className: 'bg-violet-50 text-violet-600',
    },
    system: {
      icon: Info,
      className: 'bg-background text-secondary-text',
    },
  };

  const { icon: Icon, className } = config[type];

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${className}`}
    >
      <Icon className="h-4.5 w-4.5" />
    </div>
  );
}

export default function NotificationsView({
  variant = 'dashboard',
}: NotificationsViewProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState('All');

  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  const visibleNotifications = notifications.filter((notification) => {
    if (activeFilter === 'Unread') {
      return notification.unread;
    }

    if (activeFilter === 'Updates') {
      return (
        notification.type === 'property' ||
        notification.type === 'verification' ||
        notification.type === 'contribution'
      );
    }

    return true;
  });

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  const isDashboard = variant === 'dashboard';

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div
        className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${
          !isDashboard ? 'mx-auto max-w-5xl' : ''
        }`}
      >
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <Bell className="h-4 w-4" />
            Notifications
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-primary-text sm:text-3xl">
              Your notifications
            </h1>

            {unreadCount > 0 && (
              <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                {unreadCount} unread
              </span>
            )}
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary-text">
            Stay up to date with your properties, contributions, inspections,
            and account activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-outline-color bg-white px-4 text-sm font-medium text-primary-text transition hover:bg-background"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div
        className={`flex items-center gap-1 rounded-lg border border-outline-color bg-white p-1 w-fit ${
          !isDashboard ? 'mx-auto max-w-5xl' : ''
        }`}
      >
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              activeFilter === filter
                ? 'bg-primary text-white'
                : 'text-secondary-text hover:bg-background hover:text-primary-text'
            }`}
          >
            {filter}

            {filter === 'Unread' && unreadCount > 0 && (
              <span
                className={`ml-1.5 ${
                  activeFilter === filter
                    ? 'text-white/80'
                    : 'text-primary'
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <section
        className={`overflow-hidden rounded-xl border border-outline-color bg-white ${
          !isDashboard ? 'mx-auto max-w-5xl' : ''
        }`}
      >
        {visibleNotifications.length > 0 ? (
          visibleNotifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`relative flex gap-4 p-5 transition hover:bg-background ${
                index !== visibleNotifications.length - 1
                  ? 'border-b border-outline-color'
                  : ''
              } ${notification.unread ? 'bg-primary-soft/30' : ''}`}
            >
              <NotificationIcon type={notification.type} />

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="flex items-center gap-2">
                    {notification.unread && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}

                    <h2 className="text-sm font-semibold text-primary-text">
                      {notification.title}
                    </h2>
                  </div>

                  <span className="shrink-0 text-xs text-secondary-text">
                    {notification.time}
                  </span>
                </div>

                <p className="mt-1.5 max-w-2xl text-sm leading-5 text-secondary-text">
                  {notification.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {notification.action && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notification.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      {notification.action}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {notification.unread && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs font-medium text-secondary-text hover:text-primary-text"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-secondary-text">
              <Bell className="h-5 w-5" />
            </div>

            <h2 className="mt-4 text-sm font-semibold text-primary-text">
              No notifications here
            </h2>

            <p className="mt-1 max-w-sm text-sm leading-5 text-secondary-text">
              {activeFilter === 'Unread'
                ? 'You’re all caught up. There are no unread notifications.'
                : 'There are no notifications matching this filter.'}
            </p>
          </div>
        )}
      </section>

      {/* Notification settings */}
      <section
        className={`flex flex-col gap-4 rounded-xl border border-outline-color bg-white p-5 sm:flex-row sm:items-center sm:justify-between ${
          !isDashboard ? 'mx-auto max-w-5xl' : ''
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-secondary-text">
            <Zap className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-primary-text">
              Control your notifications
            </h2>

            <p className="mt-1 text-sm text-secondary-text">
              Choose what you want to hear about and how Product Z should
              notify you.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Notification settings
          <ChevronRight className="h-4 w-4" />
        </button>
      </section>
    </div>
  );
}