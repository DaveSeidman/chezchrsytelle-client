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
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState('');

  useEffect(() => {
    async function loadInitialData() {
      const [fetchedConfig, fetchedStores] = await Promise.all([
        apiRequest<Config>('/api/config/public'),
        apiRequest<Store[]>('/api/stores/public')
      ]);

      setConfig(fetchedConfig);
      setStores(fetchedStores);

      if (fetchedStores[0]) {
        setSelectedStoreId(fetchedStores[0]._id);
      }
    }

    void loadInitialData();
  }, []);

  useEffect(() => {
    if (!selectedStoreId) {
      return;
    }

    async function loadProducts() {
      const fetchedProducts = await apiRequest<Product[]>(`/api/products/public?storeId=${selectedStoreId}`);
      setProducts(fetchedProducts);
    }

    void loadProducts();
  }, [selectedStoreId]);

  return (
    <AppShell activeSection={activeSection} onClientsClick={() => navigate('/clients')} onNavigate={navigateToSection} user={user}>
      <div className="public-site">
        <Home sectionRef={registerSection('home')} />
        <About sectionRef={registerSection('about')} />
        <Products
          onStoreChange={setSelectedStoreId}
          products={products}
          sectionRef={registerSection('products')}
          selectedStoreId={selectedStoreId}
          stores={stores}
          userMarkupAmount={user?.markupAmount ?? 0}
        />
        <Order
          config={config}
          onStoreChange={setSelectedStoreId}
          products={products}
          sectionRef={registerSection('order')}
          selectedStoreId={selectedStoreId}
          stores={stores}
        />
        <Contact contactEmail={config?.contactEmail ?? 'chrystelleseidman@gmail.com'} sectionRef={registerSection('contact')} />
      </div>
    </AppShell>
  );
}
