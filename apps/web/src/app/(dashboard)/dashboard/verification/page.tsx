'use client';

import { useWorkspace } from '@/context/WorkspaceContext';
import AgentVerification from '@/components/dashboard/AgentVerification';
import LandlordVerification from '@/components/dashboard/LandlordVerification';

export default function VerificationPage() {
  const { workspace } = useWorkspace();

  switch (workspace) {
    case 'agent':
      return <AgentVerification />;

    case 'landlord':
      return <LandlordVerification />;

    default:
      return null;
  }
}