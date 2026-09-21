'use client';

import { useWorkspace } from '@/context/WorkspaceContext';
import { PersonalDashboard } from '@/components/dashboard/PersonalDashboard';
import { useAuth } from '@/context/AuthContext';
import CustomPageLoader from '@/components/general/CustomPageLoader';
import { AgentDashboard } from '@/components/dashboard/AgentDashboard';
import { LandlordDashboard } from '@/components/dashboard/LandlordDashboard';

export default function DashboardPage() {
    const { workspace } = useWorkspace();
    const { isLoading } = useAuth();

    if (isLoading) {
       return <CustomPageLoader />;
    }

    switch (workspace) {
        case 'agent':
            return <AgentDashboard/>;

        case 'landlord':
            return <LandlordDashboard />;

        case 'personal':
        default:
            return <PersonalDashboard />;
    }
}