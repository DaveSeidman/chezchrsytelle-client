import './index.scss';

import { Link, useSearchParams } from 'react-router-dom';

import StatusPill from '../../components/StatusPill';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl, isDevLoginEnabled } from '../../services/api';

export default function ClientsPage() {
  const { isLoading, login, logout, user } = useAuth();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
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
    <div className="clients-page page-shell">
      <div className="clients-page__card card">
        <h1>Client account</h1>
        {errorMessage ? <p>{errorMessage}</p> : null}
        {isLoading ? <p>Loading account...</p> : null}
        {!isLoading && !user ? (
          <div className="stack">
            <p>Approved clients can sign in with Google to place orders and review past activity.</p>
            <button className="primary" onClick={login} type="button">
              Sign in with Google
            </button>
            {isDevLoginEnabled() ? (
              <button onClick={startDevLogin} type="button">
                Use local dev login
              </button>
            ) : null}
          </div>
        ) : null}

        {user ? (
          <div className="stack">
            <p>
              Signed in as <strong>{user.displayName}</strong> ({user.email})
            </p>
            <div className="clients-page__status-row">
              <span>Status</span>
              <StatusPill>{user.isApproved || user.isAdmin ? 'confirmed' : 'pending'}</StatusPill>
            </div>
            <p>
              {user.isApproved || user.isAdmin
                ? 'You can place orders from the Order section on the homepage and review them below.'
                : 'Your account is waiting for admin approval before ordering unlocks.'}
            </p>
            <div className="clients-page__actions">
              <Link className="clients-page__link" to="/">
                Back to homepage
              </Link>
              {(user.isApproved || user.isAdmin) ? (
                <Link className="clients-page__link" to="/clients/orders">
                  View my orders
                </Link>
              ) : null}
              {user.isAdmin ? (
                <Link className="clients-page__link" to="/admin">
                  Open admin
                </Link>
              ) : null}
              <button onClick={logout} type="button">
                Log out
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
