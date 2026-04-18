import './index.scss';

import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

import { useAuth } from '../../context/AuthContext';

type ProtectedRouteProps = {
  children: ReactNode;
  requireAdmin?: boolean;
  requireApproved?: boolean;
};

export default function ProtectedRoute({ children, requireAdmin = false, requireApproved = false }: ProtectedRouteProps) {
  const { isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="protected-route">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/clients" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/clients" replace />;
  }

  if (requireApproved && !user.isApproved && !user.isAdmin) {
    return <Navigate to="/clients" replace />;
  }

  return <>{children}</>;
}
