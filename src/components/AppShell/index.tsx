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
      <footer className="app-footer page-shell">
        <p className="app-footer__assurances">
          Proud member of <a href="https://www.madeinnyc.org/companies/chez-chrystelle">Made in NYC</a> · NY State licensed (Article 20-C) · Produced under a HACCP food-safety plan ·
          made in a regularly-inspected commercial kitchen · fully insured (COI on request) · Black, woman-owned
          business
        </p>
        <p className="app-footer__copyright">© 2026 Chez Chrystelle</p>
      </footer>
    </div>
  );
}
