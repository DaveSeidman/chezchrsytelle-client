import './index.scss';

import type { ReactNode } from 'react';

import NavBar from '../NavBar';

type AppShellProps = {
  activeSection: string;
  children: ReactNode;
  onNavigate: (sectionId: string) => void;
  onClientsClick: () => void;
};

export default function AppShell({ activeSection, children, onNavigate, onClientsClick }: AppShellProps) {
  return (
    <div className="app-shell">
      <NavBar activeSection={activeSection} onNavigate={onNavigate} onClientsClick={onClientsClick} />
      <main>{children}</main>
    </div>
  );
}
