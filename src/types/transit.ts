export type CrowdLoad = 'SEA' | 'SDA' | 'LSD'; // Seats Available, Standing Available, Limited Standing
export type VehicleType = 'SD' | 'DD' | 'BD'; // Single Deck, Double Deck, Bendy
export type BusFeature = 'WAB' | ''; // Wheelchair Accessible Bus

export interface NextBusArrival {
  EstimatedArrival: string; // ISO string or relative minutes
  Load: CrowdLoad;
  Feature: BusFeature;
  Type: VehicleType;
  OriginCode?: string;
  DestinationCode?: string;
  VisitNumber?: number;
  secondsRemaining?: number;
}

export interface BusServiceArrival {
  ServiceNo: string;
  Operator: 'SBST' | 'SMRT' | 'TTS' | 'GAS';
  DestinationName: string;
  RouteDescription: string;
  NextBus: NextBusArrival | null;
  NextBus2: NextBusArrival | null;
  NextBus3: NextBusArrival | null;
  firstBus: string;
  lastBus: string;
  frequencyRange: string;
  isStarred?: boolean;
}

export interface BusStopInfo {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
  ServicesCount: number;
}

export interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  weatherCode: number;
  conditionText: string;
  locationName: string;
  lastUpdated: string;
  source?: string;
  temperatureStation?: { id: string; name: string };
  rainfallStation?: { id: string; name: string };
  sector?: string;
  validPeriod?: { start?: string; end?: string; text?: string };
  hourlyForecast: {
    time: string;
    temperature: number;
    rainProbability: number;
    conditionText: string;
  }[];
}

export interface BackendConfig {
  mode: 'simulator' | 'custom_api';
  customBusUrl: string;
  customWeatherUrl: string;
  headersJson: string;
  autoRefreshInterval: number; // in seconds
}
