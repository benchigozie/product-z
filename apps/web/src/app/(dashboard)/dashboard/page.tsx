'use client';

import { useWorkspace } from '@/context/WorkspaceContext';
import { PersonalDashboard } from '@/components/dashboard/PersonalDashboard';
import { useAuth } from '@/context/AuthContext';
import CustomScreenLoader from '@/components/general/CustomScreenLoader';
import { AgentDashboard } from '@/components/dashboard/AgentDashboard';
import { LandlordDashboard } from '@/components/dashboard/LandlordDashboard';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ContentTransition } from '@/components/motion/ContenTransition';


export default function DashboardPage() {
    const { workspace } = useWorkspace();
    const {
        isLoading,
        needsProfileCompletion,
    } = useAuth();

    const router = useRouter();

    useEffect(() => {
        if (!isLoading && needsProfileCompletion) {
            router.replace('/complete-profile');
        }
    }, [isLoading, needsProfileCompletion, router]);

    if (isLoading) {
        return <CustomScreenLoader />;
    }


    return (
    
                <ContentTransition transitionKey={workspace}>
                    {workspace === 'agent' && <AgentDashboard />}

                    {workspace === 'landlord' && <LandlordDashboard />}

                    {workspace === 'personal' && <PersonalDashboard />}
                </ContentTransition>
    );

}