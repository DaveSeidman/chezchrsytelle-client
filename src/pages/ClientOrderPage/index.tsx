import { useEffect, useState } from 'react';

import ClientPortalShell from '../../components/ClientPortalShell';
import Order from '../../components/Order';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';
import type { Config, Store } from '../../types/api';

export default function ClientOrderPage() {
  const { user } = useAuth();
  const [config, setConfig] = useState<Config | null>(null);
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    async function loadData() {
      const fetchedConfig = await apiRequest<Config>('/api/config/public');
      setConfig(fetchedConfig);

      if (user?.isAdmin) {
        const fetchedStores = await apiRequest<Store[]>('/api/stores/public');
        setStores(fetchedStores);
        return;
      }

      setStores(user?.assignedStores ?? []);
    }

    void loadData();
  }, [user]);

  return (
    <ClientPortalShell
      description="Choose your assigned store, review the current menu, and submit a new salad order."
      title="Order"
    >
      <Order config={config} stores={stores} />
    </ClientPortalShell>
  );
}
