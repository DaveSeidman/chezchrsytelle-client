import './index.scss';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppShell from '../../components/AppShell';
import Contact from '../../components/Contact';
import Home from '../../components/Home';
import LetsEat from '../../components/LetsEat';
import Locations from '../../components/Locations';
import Travel from '../../components/Travel';
import { useSectionRouting } from '../../hooks/useSectionRouting';
import { apiRequest } from '../../services/api';
import type { Config, Store } from '../../types/api';

const sectionIds = ['home', 'lets-eat', 'locations', 'travel', 'contact'];

export default function PublicSite() {
  const navigate = useNavigate();
  const { activeSection, navigateToSection, registerSection } = useSectionRouting(sectionIds);
  const [config, setConfig] = useState<Config | null>(null);
  const [publicStores, setPublicStores] = useState<Store[]>([]);

  useEffect(() => {
    async function loadInitialData() {
      const [fetchedConfig, fetchedStores] = await Promise.all([
        apiRequest<Config>('/api/config/public'),
        apiRequest<Store[]>('/api/stores/public')
      ]);

      setConfig(fetchedConfig);
      setPublicStores(fetchedStores);
    }

    void loadInitialData();
  }, []);

  return (
    <AppShell activeSection={activeSection} onClientsClick={() => navigate('/clients')} onNavigate={navigateToSection}>
      <div className="public-site">
        <Home sectionRef={registerSection('home')} />
        <LetsEat sectionRef={registerSection('lets-eat')} />
        <Locations sectionRef={registerSection('locations')} stores={publicStores} />
        <Travel sectionRef={registerSection('travel')} />
        <Contact contactEmail={config?.contactEmail ?? 'chrystelleseidman@gmail.com'} sectionRef={registerSection('contact')} />
      </div>
    </AppShell>
  );
}
