import type { ReactNode } from 'react';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-primary-text">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-outline-color bg-white lg:block">
        <DashboardSidebar />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-outline-color bg-white">
          <DashboardHeader />
        </header>

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}