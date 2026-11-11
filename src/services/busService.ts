import { BackendConfig, BusServiceArrival, BusStopInfo, NextBusArrival } from '../types/transit';

export const BUS_STOP_04121: BusStopInfo = {
  BusStopCode: '04121',
  RoadName: 'North Bridge Rd',
  Description: 'Opp The Treasury',
  Latitude: 1.2902,
  Longitude: 103.8502,
  ServicesCount: 13,
};

// Initial base timing offsets in seconds from now to establish realistic staggered arrivals
const SERVICE_BASE_CONFIG: Array<{
  ServiceNo: string;
  Operator: 'SBST' | 'SMRT' | 'TTS' | 'GAS';
  DestinationName: string;
  RouteDescription: string;
  firstBus: string;
  lastBus: string;
  frequencyRange: string;
  baseInterval: number; // typical headway in seconds
  seedOffset: number; // initial second offset
  favDefault?: boolean;
}> = [
  {
    ServiceNo: '51',
    Operator: 'SBST',
    DestinationName: 'Hougang Central Int',
    RouteDescription: 'via Bugis, Kallang, MacPherson & Kovan',
    firstBus: '05:45',
    lastBus: '23:45',
    frequencyRange: '8 - 12 mins',
    baseInterval: 600,
    seedOffset: 75, // arriving soon!
    favDefault: true,
  },
  {
    ServiceNo: '61',
    Operator: 'SMRT',
    DestinationName: 'Eunos Int',
    RouteDescription: 'via Boat Quay, Chinatown, Telok Blangah',
    firstBus: '05:30',
    lastBus: '23:30',
    frequencyRange: '10 - 15 mins',
    baseInterval: 780,
    seedOffset: 240, // 4 mins
  },
  {
    ServiceNo: '63',
    Operator: 'SBST',
    DestinationName: 'Eunos Int (Loop)',
    RouteDescription: 'via Bugis, Circuit Rd, MacPherson, Eunos',
    firstBus: '05:45',
    lastBus: '23:45',
    frequencyRange: '7 - 11 mins',
    baseInterval: 540,
    seedOffset: 120, // 2 mins
    favDefault: true,
  },
  {
    ServiceNo: '80',
    Operator: 'SBST',
    DestinationName: 'Sengkang Int',
    RouteDescription: 'via Bugis, Lavender, Geylang East, Hougang',
    firstBus: '05:50',
    lastBus: '23:55',
    frequencyRange: '8 - 13 mins',
    baseInterval: 660,
    seedOffset: 390, // 6.5 mins
  },
  {
    ServiceNo: '124',
    Operator: 'SBST',
    DestinationName: "St. Michael's Ter",
    RouteDescription: 'via Somerset, Orchard, Newton, Balestier',
    firstBus: '06:00',
    lastBus: '23:45',
    frequencyRange: '10 - 14 mins',
    baseInterval: 720,
    seedOffset: 520, // ~8.5 mins
  },
  {
    ServiceNo: '145',
    Operator: 'SBST',
    DestinationName: 'Toa Payoh Int',
    RouteDescription: 'via Bugis, Jalan Besar, Balestier Rd',
    firstBus: '05:40',
    lastBus: '23:50',
    frequencyRange: '6 - 10 mins',
    baseInterval: 480,
    seedOffset: 30, // Arr!
    favDefault: true,
  },
  {
    ServiceNo: '166',
    Operator: 'SBST',
    DestinationName: 'Ang Mo Kio Int',
    RouteDescription: 'via Bencoolen, Thomson, Bishan, AMK Ave 6',
    firstBus: '05:45',
    lastBus: '23:45',
    frequencyRange: '9 - 13 mins',
    baseInterval: 700,
    seedOffset: 480, // 8 mins
  },
  {
    ServiceNo: '174',
    Operator: 'SBST',
    DestinationName: 'Boon Lay Int',
    RouteDescription: 'via Orchard, Bukit Timah, Clementi, Jurong',
    firstBus: '05:35',
    lastBus: '23:30',
    frequencyRange: '10 - 15 mins',
    baseInterval: 750,
    seedOffset: 660, // 11 mins
  },
  {
    ServiceNo: '197',
    Operator: 'SBST',
    DestinationName: 'Bedok Int',
    RouteDescription: 'via Victoria St, Mountbatten, Marine Parade',
    firstBus: '05:45',
    lastBus: '23:45',
    frequencyRange: '8 - 12 mins',
    baseInterval: 620,
    seedOffset: 190, // 3 mins
  },
  {
    ServiceNo: '851',
    Operator: 'SMRT',
    DestinationName: 'Yishun Int',
    RouteDescription: 'via Bugis, Little India, Novena, Marymount',
    firstBus: '05:40',
    lastBus: '23:40',
    frequencyRange: '7 - 12 mins',
    baseInterval: 580,
    seedOffset: 310, // ~5 mins
    favDefault: true,
  },
  {
    ServiceNo: '851e',
    Operator: 'SMRT',
    DestinationName: 'Yishun Int (Express)',
    RouteDescription: 'Express via CTE expressway direct to Yishun',
    firstBus: '06:30',
    lastBus: '20:00',
    frequencyRange: '15 - 20 mins',
    baseInterval: 1000,
    seedOffset: 840, // 14 mins
  },
  {
    ServiceNo: '961',
    Operator: 'SMRT',
    DestinationName: 'Woodlands Int',
    RouteDescription: 'via Beach Rd, Chinatown, Bt Timah, Woodlands Rd',
    firstBus: '05:30',
    lastBus: '23:30',
    frequencyRange: '9 - 14 mins',
    baseInterval: 720,
    seedOffset: 420, // 7 mins
  },
  {
    ServiceNo: '961M',
    Operator: 'SMRT',
    DestinationName: 'Woodlands Int (via Marina)',
    RouteDescription: 'via Marina Centre, Suntec City & Woodlands',
    firstBus: '06:00',
    lastBus: '23:00',
    frequencyRange: '12 - 18 mins',
    baseInterval: 900,
    seedOffset: 780, // 13 mins
  },
];

// In-memory simulation state to keep track of dynamic countdown between re-renders
let simulatedState: Map<string, { next1: number; next2: number; next3: number }> | null = null;
let lastSimulatedTimestamp = Date.now();

export function getSimulatedArrivals(starredServices: string[] = []): BusServiceArrival[] {
  const now = Date.now();
  const elapsedSec = Math.max(0, Math.floor((now - lastSimulatedTimestamp) / 1000));
  lastSimulatedTimestamp = now;

  if (!simulatedState) {
    simulatedState = new Map();
    for (const item of SERVICE_BASE_CONFIG) {
      simulatedState.set(item.ServiceNo, {
        next1: item.seedOffset,
        next2: item.seedOffset + item.baseInterval,
        next3: item.seedOffset + item.baseInterval * 2 + Math.floor(Math.random() * 120),
      });
    }
  } else {
    // Tick down simulated seconds
    for (const item of SERVICE_BASE_CONFIG) {
      const current = simulatedState.get(item.ServiceNo)!;
      let n1 = current.next1 - elapsedSec;
      let n2 = current.next2 - elapsedSec;
      let n3 = current.next3 - elapsedSec;

      // When bus 1 arrives and departs (stay at Arr for ~35s, then cycles)
      if (n1 < -35) {
        n1 = n2 > 0 ? n2 : 300;
        n2 = n3 > n1 ? n3 : n1 + item.baseInterval;
        n3 = n2 + item.baseInterval + Math.floor(Math.random() * 120);
      }
      simulatedState.set(item.ServiceNo, { next1: n1, next2: n2, next3: n3 });
    }
  }

  return SERVICE_BASE_CONFIG.map((item, idx) => {
    const timing = simulatedState!.get(item.ServiceNo)!;
    const s1 = Math.max(-30, timing.next1);
    const s2 = Math.max(s1 + 180, timing.next2);
    const s3 = Math.max(s2 + 240, timing.next3);

    // Realistic vehicle types and crowd load patterns
    const isDoubleDeckFav = ['51', '80', '145', '166', '174', '197', '851'].includes(item.ServiceNo);
    const type1 = isDoubleDeckFav ? (idx % 3 === 0 ? 'SD' : 'DD') : 'SD';
    const type2 = isDoubleDeckFav ? 'DD' : (idx % 2 === 0 ? 'DD' : 'SD');
    const type3 = 'SD';

    const load1 = s1 <= 60 ? (idx % 4 === 0 ? 'LSD' : idx % 2 === 0 ? 'SDA' : 'SEA') : (idx % 3 === 0 ? 'SDA' : 'SEA');
    const load2 = idx % 2 === 0 ? 'SEA' : 'SDA';
    const load3 = 'SEA';

    const nextBus1: NextBusArrival = {
      EstimatedArrival: new Date(now + Math.max(0, s1) * 1000).toISOString(),
      Load: load1,
      Feature: 'WAB',
      Type: type1,
      secondsRemaining: s1,
    };

    const nextBus2: NextBusArrival = {
      EstimatedArrival: new Date(now + s2 * 1000).toISOString(),
      Load: load2,
      Feature: 'WAB',
      Type: type2,
      secondsRemaining: s2,
    };

    const nextBus3: NextBusArrival = {
      EstimatedArrival: new Date(now + s3 * 1000).toISOString(),
      Load: load3,
      Feature: 'WAB',
      Type: type3,
      secondsRemaining: s3,
    };

    const isStarred = starredServices.length > 0 
      ? starredServices.includes(item.ServiceNo) 
      : Boolean(item.favDefault);

    return {
      ServiceNo: item.ServiceNo,
      Operator: item.Operator,
      DestinationName: item.DestinationName,
      RouteDescription: item.RouteDescription,
      NextBus: nextBus1,
      NextBus2: nextBus2,
      NextBus3: nextBus3,
      firstBus: item.firstBus,
      lastBus: item.lastBus,
      frequencyRange: item.frequencyRange,
      isStarred,
    };
  });
}

/**
 * Parses response from a custom user backend.
 * Handles both LTA DataMall v3 format ({ BusStopCode: "04121", Services: [...] })
 * or simple REST API format ([{ ServiceNo: "51", ... }]).
 */
export async function fetchArrivalsFromCustomBackend(config: BackendConfig, starredServices: string[]): Promise<BusServiceArrival[]> {
  let headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (config.headersJson.trim()) {
    try {
      const parsed = JSON.parse(config.headersJson);
      headers = { ...headers, ...parsed };
    } catch {
      console.warn('Custom headers JSON parsing failed, using default headers');
    }
  }

  const response = await fetch(config.customBusUrl, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Custom backend returned status ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  const now = Date.now();

  // Support both LTA DataMall { Services: [...] } and direct array
  const rawServices: any[] = Array.isArray(data) 
    ? data 
    : (data?.Services || data?.services || data?.data || []);

  if (!rawServices.length) {
    throw new Error('No bus services found in response payload. Check endpoint or response structure.');
  }

  return rawServices.map((raw: any) => {
    const serviceNo = String(raw.ServiceNo || raw.serviceNo || raw.service_number || '');
    const meta = SERVICE_BASE_CONFIG.find(s => s.ServiceNo === serviceNo);

    const parseNext = (bus: any): NextBusArrival | null => {
      if (!bus || !bus.EstimatedArrival) return null;
      const arrivalDate = new Date(bus.EstimatedArrival);
      const secondsRemaining = isNaN(arrivalDate.getTime()) 
        ? undefined 
        : Math.round((arrivalDate.getTime() - now) / 1000);

      return {
        EstimatedArrival: bus.EstimatedArrival,
        Load: (bus.Load as any) || 'SEA',
        Feature: bus.Feature === 'WAB' ? 'WAB' : '',
        Type: (bus.Type as any) || 'SD',
        secondsRemaining,
      };
    };

    return {
      ServiceNo: serviceNo,
      Operator: raw.Operator || meta?.Operator || 'SBST',
      DestinationName: raw.DestinationName || meta?.DestinationName || 'Terminating Int',
      RouteDescription: raw.RouteDescription || meta?.RouteDescription || 'City service',
      NextBus: parseNext(raw.NextBus || raw.nextBus),
      NextBus2: parseNext(raw.NextBus2 || raw.nextBus2),
      NextBus3: parseNext(raw.NextBus3 || raw.nextBus3),
      firstBus: raw.firstBus || meta?.firstBus || '05:45',
      lastBus: raw.lastBus || meta?.lastBus || '23:45',
      frequencyRange: raw.frequencyRange || meta?.frequencyRange || '8 - 14 mins',
      isStarred: starredServices.includes(serviceNo),
    };
  });
}

/**
 * Format ETA seconds into clean human transit notation.
 */
export function formatEta(secondsRemaining?: number): {
  label: string;
  sublabel: string;
  isArr: boolean;
  statusColor: 'emerald' | 'amber' | 'neutral';
} {
  if (secondsRemaining === undefined || isNaN(secondsRemaining)) {
    return { label: '—', sublabel: 'No Data', isArr: false, statusColor: 'neutral' };
  }

  if (secondsRemaining <= 45) {
    return { label: 'Arr', sublabel: 'Arriving', isArr: true, statusColor: 'emerald' };
  }

  const mins = Math.ceil(secondsRemaining / 60);
  if (mins <= 1) {
    return { label: '1m', sublabel: `${secondsRemaining}s`, isArr: true, statusColor: 'emerald' };
  }

  if (mins <= 5) {
    return { label: `${mins}m`, sublabel: 'On Time', isArr: false, statusColor: 'amber' };
  }

  return { label: `${mins}m`, sublabel: 'Scheduled', isArr: false, statusColor: 'neutral' };
}
