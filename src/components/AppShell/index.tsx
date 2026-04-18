import './index.scss';

import type { ReactNode } from 'react';

import NavBar from '../NavBar';
import type { User } from '../../types/api';

type AppShellProps = {
  activeSection: string;
  children: ReactNode;
  onNavigate: (sectionId: string) => void;
  onClientsClick: () => void;
  user: User | null;
};

export default function AppShell({ activeSection, children, onNavigate, onClientsClick, user }: AppShellProps) {
  return (
    <div className="app-shell">
      <NavBar activeSection={activeSection} onNavigate={onNavigate} onClientsClick={onClientsClick} user={user} />
      <main>{children}</main>
    </div>
  );
}
