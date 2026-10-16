import { maplibreGL } from '@maplibre/maplibre-gl-leaflet';
import { setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';

import { mapStyle } from './mapStyle';

setWorkerUrl(workerUrl);

export function createBasemap() {
  return maplibreGL({
    style: mapStyle,
    attributionControl: false,
    interactive: false
  });
}
