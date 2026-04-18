import './index.scss';

import { Link } from 'react-router-dom';

import type { User } from '../../types/api';

type NavBarProps = {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onClientsClick: () => void;
  user: User | null;
};

const links = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'products', label: 'Products' },
  { id: 'order', label: 'Order' },
  { id: 'contact', label: 'Contact' }
];

export default function NavBar({ activeSection, onNavigate, onClientsClick, user }: NavBarProps) {
  return (
    <header className="nav-bar">
      <div className="page-shell nav-bar__inner">
        <button className="nav-bar__brand linkish" onClick={() => onNavigate('home')} type="button">
          Chez Chrystelle
        </button>
        <nav className="nav-bar__links" aria-label="Main navigation">
          {links.map((link) => (
            <button
              className={activeSection === link.id ? 'nav-bar__link is-active' : 'nav-bar__link'}
              key={link.id}
              onClick={() => onNavigate(link.id)}
              type="button"
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="nav-bar__actions">
          {user?.isAdmin ? (
            <Link className="nav-bar__secondary" to="/admin">
              Admin
            </Link>
          ) : null}
          <button className="primary" onClick={onClientsClick} type="button">
            {user ? 'Clients' : 'Client Login'}
          </button>
        </div>
      </div>
    </header>
  );
}
