import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import 'leaflet/dist/leaflet.css';
import { seo } from '@/utils/seo';

type PlaceProperties = {
  name?: string | null;
  amenity?: string | null;
  osm_id?: number | string;
};

type PlaceFeature = GeoJSON.Feature<GeoJSON.Point, PlaceProperties>;
type PlaceCollection = GeoJSON.FeatureCollection<GeoJSON.Point, PlaceProperties>;

type LeafletModule = typeof import('leaflet');

type VectorGridFactory = {
  slicer: (
    data: GeoJSON.GeoJSON,
    options: {
      rendererFactory: unknown;
      interactive?: boolean;
      maxZoom?: number;
      vectorTileLayerStyles: Record<string, (properties: PlaceProperties) => Record<string, unknown>>;
    },
  ) => {
    addTo: (map: unknown) => void;
    bindPopup: (factory: (properties: PlaceProperties) => string) => void;
  };
};

declare global {
  interface Window {
    __restaurantMapDebug?: {
      featureCount: number;
      renderedWith: string;
    };
    L?: LeafletModule;
  }
}

const FOOD_AMENITIES = new Set(['restaurant', 'fast_food', 'cafe']);
const GEOJSON_URL = '/assets/Gas_stations_restaurants.geojson';

export const Route = createFileRoute('/map')({
  head: () => ({
    meta: [
      ...seo({
        title: 'Restaurant Map - Cashirk',
        description: 'A tiled map view of restaurant locations from the imported GeoJSON dataset.',
        keywords: 'restaurants, map, geojson, vector tiles, Cashirk',
      }),
    ],
  }),
  component: RestaurantMapPage,
});

function RestaurantMapPage() {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    async function mountMap() {
      try {
        const { default: L } = await import('leaflet') as { default: LeafletModule };
        window.L = L;
        await import('leaflet.vectorgrid');
        const vectorGrid = (L as unknown as { vectorGrid: VectorGridFactory }).vectorGrid;

        if (!mapRef.current || cancelled) return;

        const response = await fetch(GEOJSON_URL);
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON: ${response.status}`);
        }

        const source = (await response.json()) as PlaceCollection;
        const features = source.features.filter((feature): feature is PlaceFeature => {
          return (
            feature.geometry?.type === 'Point' &&
            Array.isArray(feature.geometry.coordinates) &&
            FOOD_AMENITIES.has(feature.properties?.amenity ?? '')
          );
        });
        const data: PlaceCollection = { type: 'FeatureCollection', features };

        const map = L.map(mapRef.current, {
          zoomControl: true,
          preferCanvas: true,
          renderer: L.canvas(),
        }).setView([23.8859, 45.0792], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        const placesLayer = vectorGrid.slicer(data, {
          rendererFactory: L.canvas.tile,
          interactive: true,
          maxZoom: 18,
          vectorTileLayerStyles: {
            sliced: (properties) => ({
              radius: 4,
              fill: true,
              fillColor:
                properties.amenity === 'cafe'
                  ? '#6d28d9'
                  : properties.amenity === 'fast_food'
                    ? '#ea580c'
                    : '#059669',
              fillOpacity: 0.9,
              color: '#ffffff',
              opacity: 0.95,
              weight: 1,
            }),
          },
        });

        placesLayer.bindPopup((properties) => {
          const name = properties.name || 'Unnamed place';
          const type = properties.amenity || 'restaurant';
          return `<strong>${escapeHtml(String(name))}</strong><br>${escapeHtml(String(type))}`;
        });
        placesLayer.addTo(map);

        const bounds = L.latLngBounds(features.map((feature) => {
          const [lng, lat] = feature.geometry.coordinates;
          return [lat, lng] as [number, number];
        }));
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [32, 32], maxZoom: 8, animate: false });
        }

        window.__restaurantMapDebug = {
          featureCount: features.length,
          renderedWith: 'leaflet.vectorgrid.slicer',
        };

        cleanup = () => {
          map.remove();
          delete window.__restaurantMapDebug;
        };
      } catch (mapError) {
        if (!cancelled) {
          setError(mapError instanceof Error ? mapError.message : 'Failed to load map.');
        }
      }
    }

    mountMap();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <main className="h-screen w-screen overflow-hidden bg-white">
      {error ? (
        <div className="flex h-screen w-screen items-center justify-center p-6 text-center text-sm text-red-700">
          {error}
        </div>
      ) : null}
      <div ref={mapRef} className="h-screen w-screen" />
    </main>
  );
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#039;';
    }
  });
}
