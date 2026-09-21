import type { ReactNode } from 'react';

import { WorkspaceProvider } from '@/context/WorkspaceContext';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <WorkspaceProvider>
      {children}
    </WorkspaceProvider>
  );
}

