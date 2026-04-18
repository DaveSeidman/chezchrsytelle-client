import './index.scss';

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser, setToken } = useAuth();
  const [message, setMessage] = useState('Signing you in...');

  useEffect(() => {
    async function completeLogin() {
      const token = searchParams.get('token');

      if (!token) {
        setMessage('Missing login token');
        return;
      }

      setToken(token);
      await refreshUser();
      navigate('/clients', { replace: true });
    }

    void completeLogin();
  }, [navigate, refreshUser, searchParams, setToken]);

  return <div className="auth-callback">{message}</div>;
}
