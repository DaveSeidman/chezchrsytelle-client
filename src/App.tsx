import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import AdminConfig from './pages/AdminConfig';
import AdminOrders from './pages/AdminOrders';
import AdminPage from './pages/AdminPage';
import AdminProducts from './pages/AdminProducts';
import AdminStores from './pages/AdminStores';
import AdminUsers from './pages/AdminUsers';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ClientOrdersPage from './pages/ClientOrdersPage';
import ClientsPage from './pages/ClientsPage';
import PublicSite from './pages/PublicSite';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />
      <Route path="/about" element={<PublicSite />} />
      <Route path="/products" element={<PublicSite />} />
      <Route path="/order" element={<PublicSite />} />
      <Route path="/contact" element={<PublicSite />} />

      <Route path="/clients" element={<ClientsPage />} />
      <Route path="/clients/auth/callback" element={<AuthCallbackPage />} />
      <Route
        path="/clients/orders"
        element={
          <ProtectedRoute requireApproved>
            <ClientOrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="users" replace />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="stores" element={<AdminStores />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="config" element={<AdminConfig />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
