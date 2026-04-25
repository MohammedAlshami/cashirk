/**
 * Geo utilities for Empire Sushi research (store enrichment, competitive areas).
 */

export type StoreWithCoord = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  brand: string;
  state?: string;
  stateName?: string;
  district?: string;
  inMall?: boolean;
};

export function haversineKm(a: { lng: number; lat: number }, b: { lng: number; lat: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

const COMPETITIVE_RADIUS_KM = 1;

export function competitiveAreas(stores: StoreWithCoord[]): { count: number; conflictCoords: { lng: number; lat: number }[] } {
  const conflictCoords: { lng: number; lat: number }[] = [];
  for (const store of stores) {
    const hasCompetitor = stores.some(
      (other) =>
        other.brand !== store.brand &&
        haversineKm({ lng: store.lng, lat: store.lat }, { lng: other.lng, lat: other.lat }) <= COMPETITIVE_RADIUS_KM
    );
    if (hasCompetitor) conflictCoords.push({ lng: store.lng, lat: store.lat });
  }
  return { count: conflictCoords.length, conflictCoords };
}

export function topContestedStores(
  stores: StoreWithCoord[],
  n: number
): { store: StoreWithCoord; competitorCount: number }[] {
  const contested = stores.map((store) => {
    const competitorCount = stores.filter(
      (other) =>
        other.brand !== store.brand &&
        haversineKm({ lng: store.lng, lat: store.lat }, { lng: other.lng, lat: other.lat }) <= COMPETITIVE_RADIUS_KM
    ).length;
    return { store, competitorCount };
  });
  return contested
    .filter((x) => x.competitorCount > 0)
    .sort((a, b) => b.competitorCount - a.competitorCount)
    .slice(0, n);
}

const TIER1_DISTRICTS = new Set([
  'kuala lumpur', 'petaling', 'george town', 'johor bahru', 'ipoh', 'kota kinabalu',
  'kuching', 'shah alam', 'klang', 'kajang', 'subang jaya', 'putrajaya',
]);

export function isTier1District(district?: string): boolean {
  if (!district) return false;
  return TIER1_DISTRICTS.has(district.toLowerCase().trim());
}

export function circlePolygon(lng: number, lat: number, radiusKm: number, steps = 32): number[][] {
  const coords: number[][] = [];
  const latDegPerKm = 1 / 110.574;
  const lngDegPerKm = 1 / (111.32 * Math.cos((lat * Math.PI) / 180));
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    coords.push([
      lng + (radiusKm * lngDegPerKm) * Math.cos(angle),
      lat + (radiusKm * latDegPerKm) * Math.sin(angle),
    ]);
  }
  return coords;
}

const STATE_CODE_TO_NAME: Record<string, string> = {
  JHR: 'Johor', KDH: 'Kedah', KTN: 'Kelantan', MLK: 'Melaka', NSN: 'Negeri Sembilan',
  PHG: 'Pahang', PRK: 'Perak', PLS: 'Perlis', PNG: 'Pulau Pinang', SBH: 'Sabah', SWK: 'Sarawak',
  SGR: 'Selangor', TRG: 'Terengganu', KUL: 'Kuala Lumpur', LBN: 'Labuan', PJY: 'Putrajaya',
};

function pointInRing([lng, lat]: number[], ring: number[][]): boolean {
  let inside = false;
  const n = ring.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function pointInMultiPolygon(lng: number, lat: number, coordinates: number[][][][]): boolean {
  for (const polygon of coordinates) {
    const outer = polygon[0];
    if (!outer || outer.length < 3) continue;
    if (!pointInRing([lng, lat], outer)) continue;
    let inHole = false;
    for (let i = 1; i < polygon.length; i++) {
      if (pointInRing([lng, lat], polygon[i])) {
        inHole = true;
        break;
      }
    }
    if (!inHole) return true;
  }
  return false;
}

export type EnrichedStore = StoreWithCoord;

export function enrichStores(
  stores: { name: string; address: string; lat: number; lng: number; brand: string }[],
  districtGeojson: { features?: { geometry?: { type: string; coordinates?: number[][][][] }; properties?: { state?: string; name?: string } }[] },
  mallMap: Record<string, boolean>
): EnrichedStore[] {
  const features = districtGeojson.features || [];
  return stores.map((store) => {
    let state: string | undefined;
    let stateName: string | undefined;
    let district: string | undefined;
    for (const f of features) {
      const geom = f.geometry;
      const props = f.properties || {};
      if (geom?.type === 'MultiPolygon' && geom.coordinates) {
        if (pointInMultiPolygon(store.lng, store.lat, geom.coordinates)) {
          state = props.state;
          stateName = STATE_CODE_TO_NAME[props.state || ''] || props.state;
          district = props.name;
          break;
        }
      }
    }
    const key = `${store.lng},${store.lat},${store.brand}`;
    const inMall = mallMap[key] ?? undefined;
    return { ...store, state, stateName, district, inMall };
  });
}
