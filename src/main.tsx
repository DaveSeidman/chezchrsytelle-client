import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.scss';

function getRouterBasename() {
  if (window.location.hostname.endsWith('github.io')) {
    const [, repoName] = window.location.pathname.split('/');
    return repoName ? `/${repoName}` : '/';
  }

  return '/';
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename={getRouterBasename()}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
