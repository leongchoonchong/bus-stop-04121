import { BackendConfig, BusServiceArrival, BusStopInfo, NextBusArrival } from '../types/transit';

export const DEFAULT_BUS_STOP_CODE = '04179';

// Catalog of prominent Singapore bus stops
export const KNOWN_BUS_STOPS: Record<string, BusStopInfo> = {
  '04179': {
    BusStopCode: '04179',
    RoadName: 'North Bridge Rd',
    Description: 'Aft City Hall Stn Exit B',
    Latitude: 1.2925,
    Longitude: 103.8518,
    ServicesCount: 10,
    Sector: 'City',
    Landmarks: [
      "City Hall MRT (NS25/EW13 Exit B)",
      "St. Andrew's Cathedral",
      "Capitol Singapore",
      "Peninsula Plaza",
      "National Gallery Singapore",
    ],
  },
  '04121': {
    BusStopCode: '04121',
    RoadName: 'North Bridge Rd',
    Description: 'Opp The Treasury',
    Latitude: 1.2902,
    Longitude: 103.8502,
    ServicesCount: 13,
    Sector: 'City',
    Landmarks: [
      "The Treasury (Ministry of Finance)",
      "Parliament House",
      "Funan Mall",
      "High Street Centre",
      "The Arts House",
    ],
  },
  '01012': {
    BusStopCode: '01012',
    RoadName: 'Victoria St',
    Description: 'Hotel Grand Pacific',
    Latitude: 1.2968,
    Longitude: 103.8530,
    ServicesCount: 10,
    Sector: 'City',
    Landmarks: [
      "Bras Basah MRT (CC2)",
      "CHIJMES",
      "Bugis Junction",
      "Singapore Art Museum",
      "SMU Campus",
    ],
  },
  '08057': {
    BusStopCode: '08057',
    RoadName: 'Orchard Rd',
    Description: 'Dhoby Ghaut Stn Exit B',
    Latitude: 1.2995,
    Longitude: 103.8458,
    ServicesCount: 12,
    Sector: 'City',
    Landmarks: [
      "Dhoby Ghaut MRT (NS24/NE6/CC1)",
      "Plaza Singapura",
      "The Atrium@Orchard",
      "The Cathay",
      "Istana Park",
    ],
  },
  '05013': {
    BusStopCode: '05013',
    RoadName: 'Eu Tong Sen St',
    Description: 'Chinatown Stn Exit E',
    Latitude: 1.2842,
    Longitude: 103.8443,
    ServicesCount: 11,
    Sector: 'City',
    Landmarks: [
      "Chinatown MRT (NE4/DT19)",
      "Chinatown Point",
      "People's Park Complex",
      "Hong Lim Complex",
    ],
  },
  '09048': {
    BusStopCode: '09048',
    RoadName: 'Orchard Rd',
    Description: 'Orchard Stn / Lucky Plaza',
    Latitude: 1.3042,
    Longitude: 103.8341,
    ServicesCount: 9,
    Sector: 'Tanglin',
    Landmarks: [
      "Orchard MRT (NS22/TE14)",
      "Lucky Plaza",
      "TANGS at Tang Plaza",
      "ION Orchard",
      "Ngee Ann City",
    ],
  },
  '10169': {
    BusStopCode: '10169',
    RoadName: 'Telok Blangah Rd',
    Description: 'VivoCity',
    Latitude: 1.2644,
    Longitude: 103.8223,
    ServicesCount: 12,
    Sector: 'Bukit Merah',
    Landmarks: [
      "HarbourFront MRT (NE1/CC29)",
      "VivoCity Mall",
      "Sentosa Express Monorail",
      "Singapore Cruise Centre",
    ],
  },
  '28009': {
    BusStopCode: '28009',
    RoadName: 'Jurong Gateway Rd',
    Description: 'Jurong East Interchange',
    Latitude: 1.3331,
    Longitude: 103.7423,
    ServicesCount: 15,
    Sector: 'Jurong East',
    Landmarks: [
      "Jurong East MRT (NS1/EW24)",
      "Jem",
      "Westgate",
      "IMM Mall",
      "Ng Teng Fong Hospital",
    ],
  },
  '84009': {
    BusStopCode: '84009',
    RoadName: 'Tampines Central 1',
    Description: 'Tampines Interchange',
    Latitude: 1.3541,
    Longitude: 103.9431,
    ServicesCount: 16,
    Sector: 'Tampines',
    Landmarks: [
      "Tampines MRT (EW2/DT32)",
      "Tampines Mall",
      "Century Square",
      "Tampines 1",
      "Our Tampines Hub",
    ],
  },
};

/**
 * Resolves any 5-digit bus stop code entered by the user.
 * If known, returns authentic metadata; otherwise synthesizes a realistic stop.
 */
export function resolveBusStop(code: string): BusStopInfo {
  const cleanCode = code.trim();
  if (KNOWN_BUS_STOPS[cleanCode]) {
    return KNOWN_BUS_STOPS[cleanCode];
  }

  // Generate plausible metadata for custom 5-digit codes
  const num = parseInt(cleanCode.replace(/\D/g, ''), 10) || 4179;
  const latOffset = ((num % 80) - 40) * 0.0015;
  const lonOffset = ((num % 100) - 50) * 0.0018;

  return {
    BusStopCode: cleanCode || DEFAULT_BUS_STOP_CODE,
    RoadName: cleanCode.startsWith('0') ? 'Central Transit Corridor' : 'Radial Arterial Way',
    Description: `Bus Stop ${cleanCode}`,
    Latitude: Math.round((1.2925 + latOffset) * 10000) / 10000,
    Longitude: Math.round((103.8518 + lonOffset) * 10000) / 10000,
    ServicesCount: 8,
    Sector: num % 3 === 0 ? 'City' : num % 3 === 1 ? 'Tanglin' : 'Kallang',
    Landmarks: [
      `Transit Shelter for Bus Stop ${cleanCode}`,
      "Covered pedestrian walkway",
      "Electronic arrival board connection",
    ],
  };
}

// Master bus services dataset
interface BaseServiceConfig {
  ServiceNo: string;
  Operator: 'SBST' | 'SMRT' | 'TTS' | 'GAS';
  DestinationName: string;
  RouteDescription: string;
  firstBus: string;
  lastBus: string;
  frequencyRange: string;
  baseInterval: number;
  seedOffset: number;
  favDefault?: boolean;
}

const ALL_TRANSIT_SERVICES: Record<string, BaseServiceConfig> = {
  '32': {
    ServiceNo: '32',
    Operator: 'SBST',
    DestinationName: 'Buona Vista Ter',
    RouteDescription: 'via Clarke Quay, Chinatown, Margaret Dr, Commonwealth',
    firstBus: '05:50',
    lastBus: '23:45',
    frequencyRange: '10 - 14 mins',
    baseInterval: 660,
    seedOffset: 150,
  },
  '51': {
    ServiceNo: '51',
    Operator: 'SBST',
    DestinationName: 'Hougang Central Int',
    RouteDescription: 'via Bugis, Kallang, MacPherson & Kovan',
    firstBus: '05:45',
    lastBus: '23:45',
    frequencyRange: '8 - 12 mins',
    baseInterval: 600,
    seedOffset: 65,
    favDefault: true,
  },
  '61': {
    ServiceNo: '61',
    Operator: 'SMRT',
    DestinationName: 'Eunos Int',
    RouteDescription: 'via Boat Quay, Chinatown, Telok Blangah',
    firstBus: '05:30',
    lastBus: '23:30',
    frequencyRange: '10 - 15 mins',
    baseInterval: 780,
    seedOffset: 240,
  },
  '63': {
    ServiceNo: '63',
    Operator: 'SBST',
    DestinationName: 'Eunos Int (Loop)',
    RouteDescription: 'via Bugis, Circuit Rd, MacPherson, Eunos',
    firstBus: '05:45',
    lastBus: '23:45',
    frequencyRange: '7 - 11 mins',
    baseInterval: 540,
    seedOffset: 110,
    favDefault: true,
  },
  '80': {
    ServiceNo: '80',
    Operator: 'SBST',
    DestinationName: 'Sengkang Int',
    RouteDescription: 'via Bugis, Lavender, Geylang East, Hougang',
    firstBus: '05:50',
    lastBus: '23:55',
    frequencyRange: '8 - 13 mins',
    baseInterval: 660,
    seedOffset: 340,
  },
  '124': {
    ServiceNo: '124',
    Operator: 'SBST',
    DestinationName: "St. Michael's Ter",
    RouteDescription: 'via Somerset, Orchard, Newton, Balestier',
    firstBus: '06:00',
    lastBus: '23:45',
    frequencyRange: '10 - 14 mins',
    baseInterval: 720,
    seedOffset: 520,
  },
  '145': {
    ServiceNo: '145',
    Operator: 'SBST',
    DestinationName: 'Toa Payoh Int',
    RouteDescription: 'via Bugis, Jalan Besar, Balestier Rd',
    firstBus: '05:40',
    lastBus: '23:50',
    frequencyRange: '6 - 10 mins',
    baseInterval: 480,
    seedOffset: 25,
    favDefault: true,
  },
  '166': {
    ServiceNo: '166',
    Operator: 'SBST',
    DestinationName: 'Ang Mo Kio Int',
    RouteDescription: 'via Bencoolen, Thomson, Bishan, AMK Ave 6',
    firstBus: '05:45',
    lastBus: '23:45',
    frequencyRange: '9 - 13 mins',
    baseInterval: 700,
    seedOffset: 450,
  },
  '174': {
    ServiceNo: '174',
    Operator: 'SBST',
    DestinationName: 'Boon Lay Int',
    RouteDescription: 'via Orchard, Bukit Timah, Clementi, Jurong',
    firstBus: '05:35',
    lastBus: '23:30',
    frequencyRange: '10 - 15 mins',
    baseInterval: 750,
    seedOffset: 590,
  },
  '197': {
    ServiceNo: '197',
    Operator: 'SBST',
    DestinationName: 'Bedok Int',
    RouteDescription: 'via Victoria St, Mountbatten, Marine Parade',
    firstBus: '05:45',
    lastBus: '23:45',
    frequencyRange: '8 - 12 mins',
    baseInterval: 620,
    seedOffset: 190,
  },
  '851': {
    ServiceNo: '851',
    Operator: 'SMRT',
    DestinationName: 'Yishun Int',
    RouteDescription: 'via Bugis, Little India, Novena, Marymount',
    firstBus: '05:40',
    lastBus: '23:40',
    frequencyRange: '7 - 12 mins',
    baseInterval: 580,
    seedOffset: 280,
    favDefault: true,
  },
  '851e': {
    ServiceNo: '851e',
    Operator: 'SMRT',
    DestinationName: 'Yishun Int (Express)',
    RouteDescription: 'Express via CTE expressway direct to Yishun',
    firstBus: '06:30',
    lastBus: '20:00',
    frequencyRange: '15 - 20 mins',
    baseInterval: 1000,
    seedOffset: 720,
  },
  '961': {
    ServiceNo: '961',
    Operator: 'SMRT',
    DestinationName: 'Woodlands Int',
    RouteDescription: 'via Beach Rd, Chinatown, Bt Timah, Woodlands Rd',
    firstBus: '05:30',
    lastBus: '23:30',
    frequencyRange: '9 - 14 mins',
    baseInterval: 720,
    seedOffset: 420,
  },
  '961M': {
    ServiceNo: '961M',
    Operator: 'SMRT',
    DestinationName: 'Woodlands Int (via Marina)',
    RouteDescription: 'via Marina Centre, Suntec City & Woodlands',
    firstBus: '06:00',
    lastBus: '23:00',
    frequencyRange: '12 - 18 mins',
    baseInterval: 900,
    seedOffset: 780,
  },
};

// Services mapped per bus stop code
const STOP_SERVICES_MAP: Record<string, string[]> = {
  // 04179 (Default): Aft City Hall Stn Exit B
  '04179': ['32', '51', '63', '80', '145', '166', '174', '197', '851', '851e'],
  // 04121: Opp The Treasury
  '04121': ['51', '61', '63', '80', '124', '145', '166', '174', '197', '851', '851e', '961', '961M'],
  // 01012: Hotel Grand Pacific (Victoria St)
  '01012': ['32', '51', '63', '80', '145', '174', '197', '851'],
  // 08057: Dhoby Ghaut Stn Exit B
  '08057': ['61', '124', '166', '174', '197', '851', '851e'],
  // 05013: Chinatown Stn Exit E
  '05013': ['32', '51', '61', '63', '80', '124', '145', '166', '197', '961'],
  // 09048: Orchard Stn / Lucky Plaza
  '09048': ['124', '145', '166', '174', '851e', '961'],
  // 10169: VivoCity
  '10169': ['61', '80', '124', '145', '166', '197'],
  // 28009: Jurong East Interchange
  '28009': ['51', '61', '174', '197'],
  // 84009: Tampines Interchange
  '84009': ['51', '63', '80', '197', '851'],
};

// Simulation timing state map: key = `${busStopCode}:${serviceNo}`
const simulatedStateMap = new Map<string, { next1: number; next2: number; next3: number }>();
let lastSimulatedTimestamp = Date.now();

export function getSimulatedArrivals(
  busStopCode: string = DEFAULT_BUS_STOP_CODE,
  starredServices: string[] = []
): BusServiceArrival[] {
  const now = Date.now();
  const elapsedSec = Math.max(0, Math.floor((now - lastSimulatedTimestamp) / 1000));
  lastSimulatedTimestamp = now;

  const targetCode = busStopCode.trim() || DEFAULT_BUS_STOP_CODE;
  const serviceNumbers = STOP_SERVICES_MAP[targetCode] || [
    '32', '51', '63', '80', '145', '166', '174', '197', '851'
  ];

  const serviceConfigs: BaseServiceConfig[] = serviceNumbers
    .map(num => ALL_TRANSIT_SERVICES[num])
    .filter(Boolean);

  // Initialize or tick down timings
  for (const item of serviceConfigs) {
    const key = `${targetCode}:${item.ServiceNo}`;
    let current = simulatedStateMap.get(key);

    if (!current) {
      current = {
        next1: item.seedOffset,
        next2: item.seedOffset + item.baseInterval,
        next3: item.seedOffset + item.baseInterval * 2 + Math.floor(Math.random() * 120),
      };
      simulatedStateMap.set(key, current);
    } else if (elapsedSec > 0) {
      let n1 = current.next1 - elapsedSec;
      let n2 = current.next2 - elapsedSec;
      let n3 = current.next3 - elapsedSec;

      if (n1 < -35) {
        n1 = n2 > 0 ? n2 : 300;
        n2 = n3 > n1 ? n3 : n1 + item.baseInterval;
        n3 = n2 + item.baseInterval + Math.floor(Math.random() * 120);
      }
      simulatedStateMap.set(key, { next1: n1, next2: n2, next3: n3 });
    }
  }

  return serviceConfigs.map((item, idx) => {
    const key = `${targetCode}:${item.ServiceNo}`;
    const timing = simulatedStateMap.get(key)!;
    const s1 = Math.max(-30, timing.next1);
    const s2 = Math.max(s1 + 180, timing.next2);
    const s3 = Math.max(s2 + 240, timing.next3);

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
 * Parses response from custom backend, replacing bus stop code dynamically.
 */
export async function fetchArrivalsFromCustomBackend(
  busStopCode: string,
  config: BackendConfig,
  starredServices: string[]
): Promise<BusServiceArrival[]> {
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

  // Interpolate user-input bus stop code into backend URL
  let targetUrl = config.customBusUrl;
  if (targetUrl.includes(':busStopCode')) {
    targetUrl = targetUrl.replace(':busStopCode', busStopCode);
  } else if (targetUrl.includes('04179') || targetUrl.includes('04121')) {
    targetUrl = targetUrl.replace(/04179|04121/g, busStopCode);
  } else if (targetUrl.includes('?')) {
    targetUrl += `&BusStopCode=${busStopCode}`;
  } else {
    targetUrl += `?BusStopCode=${busStopCode}`;
  }

  const response = await fetch(targetUrl, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Custom backend returned status ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  const now = Date.now();

  const rawServices: any[] = Array.isArray(data) 
    ? data 
    : (data?.Services || data?.services || data?.data || []);

  if (!rawServices.length) {
    throw new Error(`No bus services found for stop ${busStopCode}.`);
  }

  return rawServices.map((raw: any) => {
    const serviceNo = String(raw.ServiceNo || raw.serviceNo || raw.service_number || '');
    const meta = ALL_TRANSIT_SERVICES[serviceNo];

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
