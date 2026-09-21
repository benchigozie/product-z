"use client"

import { useWorkspace } from "@/context/WorkspaceContext";
import LandlordListingsPage from "@/components/dashboard/LandlordListings";
import AgentListingsPage from "@/components/dashboard/AgentListings";


function LandlordListings() {
    const { workspace } = useWorkspace();

    if (workspace === 'agent') {
      return <AgentListingsPage />;
    }
    
    if (workspace === 'landlord') {
      return <LandlordListingsPage />;
    }
}

export default LandlordListings




