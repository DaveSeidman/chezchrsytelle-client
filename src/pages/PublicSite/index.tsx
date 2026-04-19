import './index.scss';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import About from '../../components/About';
import AppShell from '../../components/AppShell';
import Contact from '../../components/Contact';
import Home from '../../components/Home';
import Order from '../../components/Order';
import Products from '../../components/Products';
import { useAuth } from '../../context/AuthContext';
import { useSectionRouting } from '../../hooks/useSectionRouting';
import { apiRequest } from '../../services/api';
import type { Config, Product, Store } from '../../types/api';

const sectionIds = ['home', 'about', 'products', 'order', 'contact'];

export default function PublicSite() {
  const navigate = useNavigate();
  const { activeSection, navigateToSection, registerSection } = useSectionRouting(sectionIds);
  const { user } = useAuth();
  const [config, setConfig] = useState<Config | null>(null);
  const [publicStores, setPublicStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCatalogStoreId, setSelectedCatalogStoreId] = useState('');

  useEffect(() => {
    async function loadInitialData() {
      const [fetchedConfig, fetchedStores] = await Promise.all([
        apiRequest<Config>('/api/config/public'),
        apiRequest<Store[]>('/api/stores/public')
      ]);

      setConfig(fetchedConfig);
      setPublicStores(fetchedStores);

      if (fetchedStores[0]) {
        setSelectedCatalogStoreId(fetchedStores[0]._id);
      }
    }

    void loadInitialData();
  }, []);

  useEffect(() => {
    if (!selectedCatalogStoreId) {
      return;
    }

    async function loadProducts() {
      const fetchedProducts = await apiRequest<Product[]>(`/api/products/public?storeId=${selectedCatalogStoreId}`);
      setProducts(fetchedProducts);
    }

    void loadProducts();
  }, [selectedCatalogStoreId]);

  const orderStores = user?.isAdmin ? publicStores : user?.assignedStores ?? [];

  return (
    <AppShell activeSection={activeSection} onClientsClick={() => navigate('/clients')} onNavigate={navigateToSection} user={user}>
      <div className="public-site">
        <Home sectionRef={registerSection('home')} />
        <About sectionRef={registerSection('about')} />
        <Products
          onStoreChange={setSelectedCatalogStoreId}
          products={products}
          sectionRef={registerSection('products')}
          selectedStoreId={selectedCatalogStoreId}
          stores={publicStores}
        />
        <Order config={config} sectionRef={registerSection('order')} stores={orderStores} />
        <Contact contactEmail={config?.contactEmail ?? 'chrystelleseidman@gmail.com'} sectionRef={registerSection('contact')} />
      </div>
    </AppShell>
  );
}
