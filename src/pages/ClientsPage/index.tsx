import './index.scss';

import { Link, useSearchParams } from 'react-router-dom';

import ClientPortalShell from '../../components/ClientPortalShell';
import StatusPill from '../../components/StatusPill';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl, isDevLoginEnabled } from '../../services/api';

export default function ClientsPage() {
  const { isLoading, login, logout, user } = useAuth();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const isApproved = Boolean(user && (user.status === 'approved' || user.isApproved || user.isAdmin));
  const isDenied = Boolean(user && user.status === 'denied' && !user.isAdmin);
  const errorMessage =
    error === 'google_auth_not_configured'
      ? 'Google auth is not configured yet for this environment.'
      : error === 'google_auth_failed'
        ? 'Google sign-in did not complete. Check your Google OAuth redirect URI and try again.'
        : '';

  function startDevLogin() {
    window.location.assign(`${getApiUrl()}/auth/dev-login`);
  }

  return (
    <>
      {!user ? (
        <div className="clients-page clients-page--signup page-shell">
          <div className="clients-page__card card">
            <h1>Client Portal</h1>
            {errorMessage ? <p>{errorMessage}</p> : null}
            {isLoading ? <p>Loading account...</p> : null}
            {!isLoading && !user ? (
              <div className="stack">
                <p>Sign up here to request access to the ordering portal.</p>
                <button className="primary" onClick={login} type="button">
                  Sign up
                </button>
                {isDevLoginEnabled() ? (
                  <button onClick={startDevLogin} type="button">
                    Use local dev login
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {user ? (
        <ClientPortalShell
          description="Review your approval status, place new orders, and keep tabs on past submissions."
          title="Client Portal"
        >
          <div className="stack">
            <p>
              Signed in as <strong>{user.displayName}</strong> ({user.email})
            </p>
            <div className="clients-page__status-row">
              <span>Status</span>
              <StatusPill>{user.isAdmin ? 'confirmed' : user.status}</StatusPill>
            </div>
            {isApproved ? (
              <p>
                You can <Link to="/clients/order">place new orders</Link> from this client portal and{' '}
                <Link to="/clients/orders">review every past order</Link> below.
              </p>
            ) : (
              <p>
                {isDenied
                  ? 'Your request was declined. Reach out through the contact form if you would like us to review it again.'
                  : 'Thanks for signing up. Once your account is approved, you can place and check the status of your orders.'}
              </p>
            )}
            <div className="clients-page__actions">
              {user.isAdmin ? (
                <Link className="clients-page__link" to="/admin">
                  Open admin
                </Link>
              ) : null}
            </div>
          </div>
        </ClientPortalShell>
      ) : null}
    </>
  );
}
