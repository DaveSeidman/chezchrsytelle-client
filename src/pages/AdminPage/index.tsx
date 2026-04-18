import './index.scss';

import { NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/stores', label: 'Stores' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/config', label: 'Config' }
];

export default function AdminPage() {
  const { logout, user } = useAuth();

  return (
    <div className="admin-page page-shell">
      <header className="admin-page__header">
        <div>
          <p>Signed in as {user?.displayName}</p>
          <h1>Admin</h1>
        </div>
        <div className="admin-page__header-actions">
          <NavLink to="/">Public site</NavLink>
          <button onClick={logout} type="button">
            Log out
          </button>
        </div>
      </header>

      <div className="admin-page__layout">
        <nav className="admin-page__nav card">
          {links.map((link) => (
            <NavLink className={({ isActive }) => (isActive ? 'is-active' : '')} key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-page__content card">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
