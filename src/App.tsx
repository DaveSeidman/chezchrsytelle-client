import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import AdminConfig from './pages/AdminConfig';
import AdminOrders from './pages/AdminOrders';
import AdminPage from './pages/AdminPage';
import AdminProducts from './pages/AdminProducts';
import AdminStores from './pages/AdminStores';
import AdminUsers from './pages/AdminUsers';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ClientOrderPage from './pages/ClientOrderPage';
import ClientOrdersPage from './pages/ClientOrdersPage';
import ClientsPage from './pages/ClientsPage';
import PublicSite from './pages/PublicSite';

export default function App() {
  const adminRoute = (
    <ProtectedRoute requireAdmin>
      <AdminPage />
    </ProtectedRoute>
  );

  const clientOrderRoute = (
    <ProtectedRoute>
      <ClientOrderPage />
    </ProtectedRoute>
  );

  const clientOrdersRoute = (
    <ProtectedRoute>
      <ClientOrdersPage />
    </ProtectedRoute>
  );

  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />
      <Route path="/about" element={<Navigate to="/" replace />} />
      <Route path="/contact" element={<PublicSite />} />
      <Route path="/family-dinners" element={<Navigate to="/lets-eat" replace />} />
      <Route path="/catering" element={<Navigate to="/lets-eat" replace />} />
      <Route path="/lets-eat" element={<PublicSite />} />
      <Route path="/travel" element={<PublicSite />} />
      <Route path="/locations" element={<PublicSite />} />
      <Route path="/products" element={<Navigate to="/" replace />} />
      <Route path="/order" element={<Navigate to="/clients/order" replace />} />

      <Route path="/admin" element={adminRoute}>
        <Route index element={<Navigate to="users" replace />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="stores" element={<AdminStores />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="config" element={<AdminConfig />} />
      </Route>

      <Route path="/clients" element={<ClientsPage />} />
      <Route path="/clients/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/clients/order" element={clientOrderRoute} />
      <Route path="/clients/orders" element={clientOrdersRoute} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
