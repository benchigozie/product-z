
'use client';

import { useState } from 'react';
import {
  Check,
  ChevronDown,
  Home,
  Building2,
  UserRound,
} from 'lucide-react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useRouter, usePathname } from 'next/navigation';

type Workspace = {
  id: 'personal' | 'agent' | 'landlord';
  name: string;
  description: string;
  icon: typeof UserRound;
};

const workspaces: Workspace[] = [
  {
    id: 'personal',
    name: 'Personal',
    description: 'Your housing activity',
    icon: UserRound,
  },
  {
    id: 'agent',
    name: 'Agent',
    description: 'Manage your listings',
    icon: Building2,
  },
  {
    id: 'landlord',
    name: 'Landlord',
    description: 'Manage your properties',
    icon: Home,
  },
];

export function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { workspace, setWorkspace } = useWorkspace();

  const router = useRouter();
  const pathname = usePathname();

  const currentWorkspace =
    workspaces.find((item) => item.id === workspace) ?? workspaces[0];

  const CurrentIcon = currentWorkspace.icon;

  function handleWorkspaceChange(
    workspaceOption: Workspace,
  ) {

    if (pathname !== '/dashboard') {
      router.push('/dashboard');
    }

    setTimeout(() => {
      setWorkspace(workspaceOption.id);
    setIsOpen(false);
    },300)

    
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-primary/10"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white transition-colors group-hover:bg-primary/15 group-hover:text-primary">
          <CurrentIcon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {currentWorkspace.name}
          </p>

          <p className="truncate text-xs text-white/55">
            {currentWorkspace.description}
          </p>
        </div>

        <ChevronDown
          size={16}
          className={`shrink-0 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-4 right-4 top-full space-y-1 z-50 mt-2 overflow-hidden rounded-xl border border-white/10 bg-primary-dark p-1.5 shadow-xl">
          {workspaces.map((workspaceOption) => {
            const Icon = workspaceOption.icon;
            const isActive = workspaceOption.id === workspace;

            return (
              <button
                key={workspaceOption.id}
                type="button"
                onClick={() => handleWorkspaceChange(workspaceOption)}
                className={`flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors ${isActive
                    ? 'bg-primary/50 text-white'
                    : 'text-white/70 hover:bg-primary/10 hover:text-primary'
                  }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isActive
                      ? 'bg-primary/15'
                      : 'bg-white/10'
                    }`}
                >
                  <Icon size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {workspaceOption.name}
                  </p>

                  <p className="truncate text-xs text-white/45">
                    {workspaceOption.description}
                  </p>
                </div>

                {isActive && <Check size={16} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

