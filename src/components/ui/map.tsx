'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface GeoJSONSourceWithCluster extends maplibregl.GeoJSONSource {
  getClusterExpansionZoom(clusterId: number, callback: (err: Error | null, zoom: number) => void): void;
}

const MapContext = React.createContext<maplibregl.Map | null>(null);

export function useMap(): maplibregl.Map | null {
  return React.useContext(MapContext);
}

export interface MapProps {
  center: [number, number];
  zoom: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  fadeDuration?: number;
}

const CARTO_LIGHT_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    carto: {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    },
  },
  layers: [
    {
      id: 'carto',
      type: 'raster',
      source: 'carto',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

export function Map({
  center,
  zoom,
  children,
  className = '',
  style,
  fadeDuration = 300,
}: MapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = React.useState<maplibregl.Map | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: CARTO_LIGHT_STYLE,
      center,
      zoom,
      fadeDuration,
    });

    map.on('load', () => setMapInstance(map));

    return () => {
      map.remove();
      setMapInstance(null);
    };
  }, []);

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
      <div ref={containerRef} className="h-full w-full" />
      {mapInstance ? (
        <MapContext.Provider value={mapInstance}>
          {children}
        </MapContext.Provider>
      ) : null}
    </div>
  );
}

export interface MapClusterLayerProps<T = Record<string, unknown>> {
  data: string | GeoJSON.FeatureCollection<GeoJSON.Point, T>;
  clusterRadius?: number;
  clusterMaxZoom?: number;
  clusterColors?: string[];
  pointColor?: string;
  onPointClick?: (properties: T, coordinates: [number, number]) => void;
  sourceId?: string;
}

const DEFAULT_CLUSTER_COLORS = ['#ea580c', '#f97316', '#fb923c'];

export function MapClusterLayer<T = Record<string, unknown>>({
  data,
  clusterRadius = 50,
  clusterMaxZoom = 14,
  clusterColors = DEFAULT_CLUSTER_COLORS,
  pointColor = '#ea580c',
  onPointClick,
  sourceId = 'stores-cluster',
}: MapClusterLayerProps<T>) {
  const map = useMap();
  const onPointClickRef = React.useRef(onPointClick);
  onPointClickRef.current = onPointClick;

  React.useEffect(() => {
    if (!map) return;

    const layers = ['clusters', 'cluster-count', 'unclustered-point'].map((id) => `${sourceId}-${id}`);

    const setup = () => {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'geojson',
          data: typeof data === 'string' ? data : data as GeoJSON.GeoJSON,
          cluster: true,
          clusterMaxZoom,
          clusterRadius,
          generateId: true,
        });
      } else {
        const src = map.getSource(sourceId) as maplibregl.GeoJSONSource;
        if (src) src.setData(typeof data === 'string' ? data : data as GeoJSON.GeoJSON);
      }

      if (!map.getLayer(layers[0])) {
        map.addLayer({
          id: layers[0],
          type: 'circle',
          source: sourceId,
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': ['step', ['get', 'point_count'], clusterColors[0] ?? '#ea580c', 10, clusterColors[1] ?? '#f97316', 50, clusterColors[2] ?? '#fb923c'],
            'circle-radius': ['step', ['get', 'point_count'], 18, 10, 24, 50, 30],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
          },
        });
      }

      if (!map.getLayer(layers[1])) {
        map.addLayer({
          id: layers[1],
          type: 'symbol',
          source: sourceId,
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['Noto Sans Regular'],
            'text-size': 12,
          },
          paint: { 'text-color': '#fff' },
        });
      }

      if (!map.getLayer(layers[2])) {
        map.addLayer({
          id: layers[2],
          type: 'circle',
          source: sourceId,
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': pointColor,
            'circle-radius': 8,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
          },
        });
      }

      const handleClusterClick = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const clusterId = feature.properties?.cluster_id;
        const source = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;
        if (source && typeof (source as GeoJSONSourceWithCluster).getClusterExpansionZoom === 'function') {
          (source as GeoJSONSourceWithCluster).getClusterExpansionZoom(clusterId, (err: Error | null, expansionZoom: number) => {
            if (err) return;
            map.easeTo({
              center: (feature.geometry as GeoJSON.Point).coordinates as [number, number],
              zoom: expansionZoom,
            });
          });
        }
      };

      const handlePointClick = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
        const feature = e.features?.[0];
        if (feature && onPointClickRef.current) {
          const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
          onPointClickRef.current((feature.properties ?? {}) as T, coords);
        }
      };

      const cursorPointer = () => { map.getCanvas().style.cursor = 'pointer'; };
      const cursorDefault = () => { map.getCanvas().style.cursor = ''; };

      map.on('click', layers[0], handleClusterClick);
      map.on('click', layers[2], handlePointClick);
      map.on('mouseenter', layers[0], cursorPointer);
      map.on('mouseleave', layers[0], cursorDefault);
      map.on('mouseenter', layers[2], cursorPointer);
      map.on('mouseleave', layers[2], cursorDefault);

      return () => {
        map.off('click', layers[0], handleClusterClick);
        map.off('click', layers[2], handlePointClick);
        map.off('mouseenter', layers[0], cursorPointer);
        map.off('mouseleave', layers[0], cursorDefault);
        map.off('mouseenter', layers[2], cursorPointer);
        map.off('mouseleave', layers[2], cursorDefault);
      };
    };

    let cleanup: (() => void) | undefined;
    if (map.loaded()) {
      cleanup = setup();
    } else {
      map.once('load', () => { cleanup = setup(); });
    }

    return () => {
      cleanup?.();
      layers.forEach((id) => { if (map.getLayer(id)) map.removeLayer(id); });
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map, sourceId, clusterRadius, clusterMaxZoom, pointColor, typeof data === 'string' ? data : JSON.stringify(data)]);

  return null;
}

export interface MapPopupProps {
  longitude: number;
  latitude: number;
  onClose: () => void;
  children: React.ReactNode;
  closeButton?: boolean;
  closeOnClick?: boolean;
  className?: string;
}

export function MapPopup({
  longitude,
  latitude,
  onClose,
  children,
  closeButton = true,
  closeOnClick = false,
  className = '',
}: MapPopupProps) {
  const map = useMap();
  const rootRef = React.useRef<ReturnType<typeof createRoot> | null>(null);

  React.useEffect(() => {
    if (!map) return;
    const container = document.createElement('div');
    container.className = className;

    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick,
      offset: 14,
    })
      .setLngLat([longitude, latitude])
      .setDOMContent(container)
      .addTo(map);

    popup.on('close', onClose);

    rootRef.current = createRoot(container);
    rootRef.current.render(
      <div className="relative min-w-[180px] max-w-[280px] overflow-hidden rounded-lg border border-white/20 bg-[#1a1a1a] shadow-xl">
        {closeButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-2 top-2 z-10 rounded p-1 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
        <div className="p-3 text-sm text-white/90">{children}</div>
      </div>
    );

    return () => {
      try { rootRef.current?.render(null); } catch (_) {}
      rootRef.current = null;
      popup.remove();
    };
  }, [map, longitude, latitude, onClose, closeOnClick, className, children, closeButton]);

  return null;
}

export function MapControls() {
  const map = useMap();
  React.useEffect(() => {
    if (!map) return;
    const control = new maplibregl.NavigationControl();
    map.addControl(control, 'top-right');
    return () => {
      try { map.removeControl(control); } catch (_) {}
    };
  }, [map]);
  return null;
}

export interface MapMarkerProps {
  longitude: number;
  latitude: number;
  children?: React.ReactNode;
}

export function MapMarker({ longitude, latitude, children }: MapMarkerProps) {
  const map = useMap();
  const [markerEl, setMarkerEl] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!map) return;
    const el = document.createElement('div');
    el.style.cursor = 'pointer';
    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([longitude, latitude])
      .addTo(map);
    setMarkerEl(el);
    return () => {
      marker.remove();
      setMarkerEl(null);
    };
  }, [map, longitude, latitude]);

  if (!markerEl || !children) return null;
  return createPortal(children, markerEl);
}

export function MarkerContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function MarkerLabel({
  children,
  position = 'bottom',
}: {
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}) {
  return <span className={`absolute -translate-x-1/2 whitespace-nowrap text-xs font-medium ${position === 'bottom' ? 'left-1/2 top-full mt-1' : position === 'top' ? 'bottom-full left-1/2 mb-1' : ''}`}>{children}</span>;
}

export function MarkerTooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function MarkerPopup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
