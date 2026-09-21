'use client';

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

export type Workspace = 'personal' | 'agent' | 'landlord';

type WorkspaceContextValue = {
  workspace: Workspace;
  setWorkspace: (workspace: Workspace) => void;
};

const WorkspaceContext = createContext<
  WorkspaceContextValue | undefined
>(undefined);

export function WorkspaceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [workspace, setWorkspace] =
    useState<Workspace>('personal');

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        setWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      'useWorkspace must be used within a WorkspaceProvider',
    );
  }

  return context;
}