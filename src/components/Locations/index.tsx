import './index.scss';
import 'leaflet/dist/leaflet.css';

import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';

import type { Store } from '../../types/api';

type LocationsProps = {
  sectionRef: (element: HTMLElement | null) => void;
  stores: Store[];
};

type MapStore = Pick<Store, '_id' | 'name' | 'pickupAddress' | 'pickupNotes'> & {
  mapLocation: { lat: number; lng: number };
};

const foodGardenMarket: MapStore = {
  _id: 'food-garden-market-4th-ave',
  name: 'Food Garden Market',
  pickupAddress: '102 4th Ave, Brooklyn, NY 11217',
  pickupNotes: '',
  mapLocation: { lat: 40.681442, lng: -73.9805922 }
};

export default function Locations({ sectionRef, stores }: LocationsProps) {
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const availableStores = useMemo(() => {
    const locations: MapStore[] = stores.filter((store): store is Store & MapStore =>
      store.pickupAddress.trim().length > 0 &&
      typeof store.mapLocation?.lat === 'number' && Number.isFinite(store.mapLocation.lat) &&
      typeof store.mapLocation?.lng === 'number' && Number.isFinite(store.mapLocation.lng)
    );

    if (!locations.some((store) => /^102\s+(4th|fourth)\s+(ave|avenue)\b/i.test(store.pickupAddress.trim()))) {
      locations.push(foodGardenMarket);
    }
    return locations;
  }, [stores]);

  useEffect(() => {
    if (!mapElementRef.current) return;

    const map = L.map(mapElementRef.current, { scrollWheelZoom: false, zoomControl: false });
    map.setMaxZoom(19);
    map.attributionControl.addAttribution(
      '<a href="https://openfreemap.org/">OpenFreeMap</a> · ' +
      '&copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> · ' +
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    );
    void import('./basemap').then(({ createBasemap }) => {
      if (mapRef.current === map) createBasemap().addTo(map);
    });
    L.control.zoom({ position: 'topright' }).addTo(map);
    mapRef.current = map;
    markerLayerRef.current = L.layerGroup().addTo(map);
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(mapElementRef.current);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markerLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    for (const store of availableStores) {
      const isActive = store._id === selectedStoreId;
      const marker = L.marker([store.mapLocation.lat, store.mapLocation.lng], {
        title: store.name,
        alt: store.name,
        zIndexOffset: isActive ? 1000 : 0,
        icon: L.divIcon({
          className: 'locations_emoji_icon',
          html: `<span class="locations_emoji_marker${isActive ? ' is-active' : selectedStoreId ? ' is-dimmed' : ''}">🥗</span>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        })
      });
      const label = document.createElement('span');
      label.textContent = store.name;
      marker.bindTooltip(label, { direction: 'top', offset: [0, -20], permanent: isActive });
      marker.on('click', () => setSelectedStoreId(store._id));
      marker.addTo(layer);
    }

    const selectedStore = availableStores.find((store) => store._id === selectedStoreId);
    if (selectedStore) {
      map.setView([selectedStore.mapLocation.lat, selectedStore.mapLocation.lng], 15, { animate: true });
    } else {
      map.fitBounds(L.latLngBounds(availableStores.map((store) => [store.mapLocation.lat, store.mapLocation.lng])), {
        padding: [40, 40], maxZoom: 14
      });
    }
  }, [availableStores, selectedStoreId]);

  return (
    <div className="page locations-page" id="locations" ref={sectionRef}>
      <h1 className="page_title">Salad Locations</h1>
      <div className="page_body">
        <div className="locations">
          <div className="locations_list_wrap">
            <p className="locations_subtitle">Where to find our Magic Kale Salads</p>
            <button className="locations_reset" onClick={() => setSelectedStoreId('')} type="button">
              All locations
            </button>
            <div className="locations_list" role="list">
              {availableStores.map((store) => (
                <div key={store._id} role="listitem">
                  <button
                    className={`locations_list_item${selectedStoreId === store._id ? ' is-active' : ''}`}
                    onClick={() => setSelectedStoreId(store._id)}
                    aria-pressed={selectedStoreId === store._id}
                    aria-controls="salad-locations-map"
                    type="button"
                  >
                    <span className="locations_list_name">{store.name}</span>
                    <span className="locations_list_address">{store.pickupAddress}</span>
                    {store.pickupNotes ? <small className="locations_list_notes">{store.pickupNotes}</small> : null}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="locations_map">
            <div className="locations_map_frame">
              <div
                className="locations_map_canvas"
                id="salad-locations-map"
                ref={mapElementRef}
                aria-label="Salad store locations map"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
