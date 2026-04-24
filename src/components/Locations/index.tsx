import './index.scss';
import 'leaflet/dist/leaflet.css';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

import type { Store } from '../../types/api';

type LocationsProps = {
  sectionRef: (element: HTMLElement | null) => void;
  stores: Store[];
};

type PositionedStore = {
  lat: number;
  lng: number;
  store: Store;
};

export default function Locations({ sectionRef, stores }: LocationsProps) {
  const availableStores = stores
    .filter((store) => store.pickupAddress.trim().length > 0)
    .filter((store) => typeof store.mapLocation?.lat === 'number' && typeof store.mapLocation?.lng === 'number');
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const positionedStores: PositionedStore[] = availableStores.map((store) => ({
    store,
    lat: store.mapLocation!.lat,
    lng: store.mapLocation!.lng
  }));

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current || !positionedStores.length) {
      return;
    }

    const map = L.map(mapElementRef.current, {
      scrollWheelZoom: false,
      zoomControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.control
      .zoom({
        position: 'topright'
      })
      .addTo(map);

    mapRef.current = map;
    markerLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      markerLayerRef.current?.clearLayers();
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, [positionedStores.length]);

  useEffect(() => {
    if (!markerLayerRef.current || !mapRef.current) {
      return;
    }

    markerLayerRef.current.clearLayers();

    for (const location of positionedStores) {
      const isActive = location.store._id === selectedStoreId;
      const isDimmed = Boolean(selectedStoreId) && !isActive;
      const marker = L.marker([location.lat, location.lng], {
        icon: L.divIcon({
          className: 'locations_emoji_icon',
          html: `<div class="locations_emoji_marker${isActive ? ' is-active' : ''}${isDimmed ? ' is-dimmed' : ''}">🥗</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 28]
        })
      });

      marker.on('click', () => setSelectedStoreId(location.store._id));
      marker.bindTooltip(location.store.name, {
        direction: 'top',
        offset: [0, -20]
      });
      marker.addTo(markerLayerRef.current);
    }

    const selectedLocation = positionedStores.find((location) => location.store._id === selectedStoreId);

    if (selectedLocation) {
      mapRef.current.setView([selectedLocation.lat, selectedLocation.lng], 14, {
        animate: true
      });
      return;
    }

    const bounds = L.latLngBounds(positionedStores.map((location) => [location.lat, location.lng] as [number, number]));
    mapRef.current.fitBounds(bounds, {
      padding: [36, 36]
    });
  }, [positionedStores, selectedStoreId]);

  return (
    <div className="page locations-page" id="locations" ref={sectionRef}>
      <h1 className="page_title">Locations</h1>
      <div className="page_body">
        <div className="locations">
          <div className="locations_list_wrap">
            <div className="locations_list" role="list">
              <button className={!selectedStoreId ? 'locations_list_item is-active' : 'locations_list_item'} onClick={() => setSelectedStoreId('')} type="button">
                <span className="locations_list_name">All locations</span>
              </button>
              {availableStores.map((store) => (
                <button
                  className={selectedStoreId === store._id ? 'locations_list_item is-active' : 'locations_list_item'}
                  key={store._id}
                  onClick={() => setSelectedStoreId(store._id)}
                  type="button"
                >
                  <span className="locations_list_name">{store.name}</span>
                  <span className="locations_list_address">{store.pickupAddress}</span>
                  {store.pickupNotes ? <small className="locations_list_notes">{store.pickupNotes}</small> : null}
                </button>
              ))}
            </div>
          </div>

          <div className="locations_map">
            {!positionedStores.length ? (
              <div className="locations_empty">
                <p>No store locations are ready for the map yet.</p>
              </div>
            ) : (
              <div className="locations_map_frame">
                <div className="locations_map_canvas" ref={mapElementRef} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
