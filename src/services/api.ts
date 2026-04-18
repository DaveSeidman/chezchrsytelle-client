const API_URL = (import.meta.env.VITE_API_URL?.trim() || 'http://localhost:8000').replace(/\/$/, '');
const DEV_LOGIN_ENABLED = import.meta.env.VITE_ENABLE_DEV_LOGIN === 'true';
const TOKEN_KEY = 'chezchrystelle-token';

export function getApiUrl() {
  return API_URL;
}

export function isDevLoginEnabled() {
  return DEV_LOGIN_ENABLED;
}

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T>(path: string, init: RequestInit = {}) {
  const token = getStoredToken();
  const headers = new Headers(init.headers);

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers
  });

  if (response.status === 204) {
    return null as T;
  }

  const data = (await response.json()) as T & { message?: string };

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}
