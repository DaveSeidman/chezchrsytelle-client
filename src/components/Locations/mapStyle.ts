import type { StyleSpecification } from 'maplibre-gl';

// OpenFreeMap's OpenMapTiles data, styled to match the site's cream and sage palette.
export const mapStyle: StyleSpecification = {
  version: 8,
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  sources: {
    openmaptiles: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' }
  },
  layers: [
    { id: 'background', type: 'background', paint: { 'background-color': '#f5f2eb' } },
    {
      id: 'parks', type: 'fill', source: 'openmaptiles', 'source-layer': 'park',
      paint: { 'fill-color': '#e0e7d8' }
    },
    {
      id: 'water', type: 'fill', source: 'openmaptiles', 'source-layer': 'water',
      filter: ['!=', ['get', 'brunnel'], 'tunnel'],
      paint: { 'fill-color': '#d9e5e5' }
    },
    {
      id: 'buildings', type: 'fill', source: 'openmaptiles', 'source-layer': 'building', minzoom: 15,
      paint: { 'fill-color': '#eae6de', 'fill-opacity': 0.55 }
    },
    {
      id: 'streets', type: 'line', source: 'openmaptiles', 'source-layer': 'transportation',
      filter: ['match', ['get', 'class'], ['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'minor', 'service'], true, false],
      paint: {
        'line-color': '#ffffff',
        'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 14, 2, 18, 8],
        'line-opacity': 0.85
      }
    },
    {
      id: 'place-names', type: 'symbol', source: 'openmaptiles', 'source-layer': 'place', minzoom: 9,
      filter: ['match', ['get', 'class'], ['city', 'suburb'], true, false],
      layout: {
        'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']],
        'text-font': ['Noto Sans Regular'], 'text-size': 12,
        'text-transform': 'uppercase', 'text-letter-spacing': 0.12, 'text-padding': 40
      },
      paint: { 'text-color': '#899184', 'text-halo-color': '#f5f2eb', 'text-halo-width': 2 }
    },
    {
      id: 'major-street-names', type: 'symbol', source: 'openmaptiles', 'source-layer': 'transportation_name', minzoom: 12,
      filter: ['match', ['get', 'class'], ['primary', 'secondary', 'tertiary', 'trunk'], true, false],
      layout: {
        'symbol-placement': 'line', 'symbol-spacing': 500,
        'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']],
        'text-font': ['Noto Sans Regular'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 12, 10, 16, 11],
        'text-padding': 30
      },
      paint: { 'text-color': '#7b8276', 'text-halo-color': '#fdfcf8', 'text-halo-width': 1 }
    },
    {
      id: 'local-street-names', type: 'symbol', source: 'openmaptiles', 'source-layer': 'transportation_name', minzoom: 14,
      filter: ['match', ['get', 'class'], ['minor', 'service'], true, false],
      layout: {
        'symbol-placement': 'line', 'symbol-spacing': 400,
        'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']],
        'text-font': ['Noto Sans Regular'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 14, 9, 17, 10],
        'text-padding': 25
      },
      paint: { 'text-color': '#858b7e', 'text-halo-color': '#fdfcf8', 'text-halo-width': 1 }
    }
  ]
};
