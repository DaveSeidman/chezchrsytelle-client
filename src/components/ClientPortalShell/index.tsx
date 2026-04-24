import './index.scss';

import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/clients', label: 'Overview', end: true },
  { to: '/clients/order', label: 'Order' },
  { to: '/clients/orders', label: 'My Orders' }
];

type ClientPortalShellProps = {
  children: ReactNode;
  description: string;
  title: string;
};

export default function ClientPortalShell({ children, description, title }: ClientPortalShellProps) {
  const { logout, user } = useAuth();

  return (
    <div className="client-portal page-shell">
      <header className="client-portal__header">
        <div>
          <p>Signed in as {user?.displayName}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="client-portal__header-actions">
          <NavLink to="/">Public site</NavLink>
          {user?.isAdmin ? <NavLink to="/admin">Admin</NavLink> : null}
          <button onClick={logout} type="button">
            Log out
          </button>
        </div>
      </header>

      <div className="client-portal__layout">
        <nav className="client-portal__nav card" aria-label="Client navigation">
          {links.map((link) => (
            <NavLink className={({ isActive }) => (isActive ? 'is-active' : '')} end={link.end} key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="client-portal__content card">{children}</div>
      </div>
    </div>
  );
}
