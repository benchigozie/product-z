"use client";

import AgentInspections from "@/components/dashboard/AgentInspections";
import PersonalInspections from "@/components/dashboard/PersonalInspections";
import { useWorkspace } from "@/context/WorkspaceContext";


function page() {

    const { workspace } = useWorkspace();
    
    switch (workspace) {
        case 'agent':
          return <AgentInspections />;
      
        case 'personal':
          return <PersonalInspections />;
      
        default:
          return <PersonalInspections />;
      }
}

export default page