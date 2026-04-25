'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getMapboxToken } from '@/lib/api/config';

interface GeoJSONSourceWithCluster extends mapboxgl.GeoJSONSource {
  getClusterExpansionZoom(clusterId: number, callback: (err: Error | null, zoom: number) => void): void;
}

const MapContext = React.createContext<mapboxgl.Map | null>(null);

export function useMap(): mapboxgl.Map | null {
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

export function Map({
  center,
  zoom,
  children,
  className = '',
  style,
  fadeDuration = 300,
}: MapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = React.useState<mapboxgl.Map | null>(null);

  React.useEffect(() => {
    const token = getMapboxToken();
    if (!token || !containerRef.current) return;

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
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

  React.useEffect(() => {
    if (!mapInstance) return;
    mapInstance.setCenter(center);
    mapInstance.setZoom(zoom);
  }, [mapInstance, center, zoom]);

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
      <div ref={containerRef} className="w-full h-full" />
      {mapInstance ? (
        <MapContext.Provider value={mapInstance}>
          {children}
        </MapContext.Provider>
      ) : null}
    </div>
  );
}

// Re-render children when map is ready by using a wrapper that re-subscribes to context after mount
function MapChildrenWhenReady({ children }: { children?: React.ReactNode }) {
  const map = useMap();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!map || !mounted) return null;
  return <>{children}</>;
}

export interface MapClusterLayerProps<T = Record<string, unknown>> {
  /** GeoJSON FeatureCollection URL or object. Points must have properties for T. */
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
  const layerIdsRef = React.useRef<string[]>([]);
  const onPointClickRef = React.useRef(onPointClick);
  onPointClickRef.current = onPointClick;

  React.useEffect(() => {
    if (!map) return;

    const layers = ['clusters', 'cluster-count', 'unclustered-point'].map((id) => `${sourceId}-${id}`);
    layerIdsRef.current = layers;

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
        const src = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
        if (src) src.setData(typeof data === 'string' ? data : data as GeoJSON.GeoJSON);
      }

      if (!map.getLayer(layers[0])) {
        map.addLayer({
          id: layers[0],
          type: 'circle',
          source: sourceId,
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              clusterColors[0] ?? '#ea580c',
              10,
              clusterColors[1] ?? '#f97316',
              50,
              clusterColors[2] ?? '#fb923c',
            ],
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
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
          },
          paint: {
            'text-color': '#fff',
          },
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

      const handleClusterClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapGeoJSONFeature[] }) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const clusterId = feature.properties?.cluster_id;
        const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined;
        if (source && typeof (source as GeoJSONSourceWithCluster).getClusterExpansionZoom === 'function') {
          (source as GeoJSONSourceWithCluster).getClusterExpansionZoom(clusterId, (err: Error | null, zoom: number) => {
            if (err) return;
            map.easeTo({
              center: (feature.geometry as GeoJSON.Point).coordinates as [number, number],
              zoom,
            });
          });
        }
      };

      const handlePointClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapGeoJSONFeature[] }) => {
        const feature = e.features?.[0];
        if (feature && onPointClickRef.current) {
          const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
          onPointClickRef.current((feature.properties ?? {}) as T, coords);
        }
      };

      const cursorClusters = () => { map.getCanvas().style.cursor = 'pointer'; };
      const cursorDefault = () => { map.getCanvas().style.cursor = ''; };

      map.on('click', layers[0], handleClusterClick);
      map.on('click', layers[2], handlePointClick);
      map.on('mouseenter', layers[0], cursorClusters);
      map.on('mouseleave', layers[0], cursorDefault);
      map.on('mouseenter', layers[2], cursorClusters);
      map.on('mouseleave', layers[2], cursorDefault);

      return () => {
        map.off('click', layers[0], handleClusterClick);
        map.off('click', layers[2], handlePointClick);
        map.off('mouseenter', layers[0], cursorClusters);
        map.off('mouseleave', layers[0], cursorDefault);
        map.off('mouseenter', layers[2], cursorClusters);
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
      try {
        layers.forEach((id) => { if (map.getLayer(id)) map.removeLayer(id); });
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch (_) {}
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
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const rootRef = React.useRef<ReturnType<typeof createRoot> | null>(null);
  const childrenRef = React.useRef(children);
  childrenRef.current = children;

  React.useEffect(() => {
    if (!map) return;
    const container = document.createElement('div');
    container.className = className;
    containerRef.current = container;

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: closeOnClick ?? false,
      offset: 14,
    })
      .setLngLat([longitude, latitude])
      .setDOMContent(container)
      .addTo(map);

    popup.on('close', onClose);

    rootRef.current = createRoot(container);
    rootRef.current.render(
      <div className="rounded-lg bg-[#1a1a1a] border border-white/20 shadow-xl overflow-hidden min-w-[180px] max-w-[280px] relative">
        {closeButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-2 z-10 p-1 rounded text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
        <div className="p-3 text-sm text-white/90">{children}</div>
      </div>
    );

    return () => {
      try { rootRef.current?.render(null); } catch (_) {}
      rootRef.current = null;
      popup.remove();
      containerRef.current = null;
    };
  }, [map, longitude, latitude, onClose, closeOnClick, className, children]);

  return null;
}

export function MapControls() {
  const map = useMap();
  React.useEffect(() => {
    if (!map) return;
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
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
    const marker = new mapboxgl.Marker(el)
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
  return <span className={`absolute text-xs font-medium whitespace-nowrap -translate-x-1/2 ${position === 'bottom' ? 'top-full left-1/2 mt-1' : position === 'top' ? 'bottom-full left-1/2 mb-1' : ''}`}>{children}</span>;
}

export function MarkerTooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function MarkerPopup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
