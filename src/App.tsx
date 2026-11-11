import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BackendConfig, BusServiceArrival, WeatherData } from './types/transit';
import { BUS_STOP_04121, fetchArrivalsFromCustomBackend, formatEta, getSimulatedArrivals } from './services/busService';
import { fetchCivicDistrictWeather } from './services/weatherService';
import { TopNavigation } from './components/Navigation/TopNavigation';
import { WeatherCard } from './components/Weather/WeatherCard';
import { BusBoardHeader } from './components/BusBoard/BusBoardHeader';
import { BusServiceCard } from './components/BusBoard/BusServiceCard';
import { BusLedBoard } from './components/BusBoard/BusLedBoard';
import { ServiceDetailModal } from './components/BusBoard/ServiceDetailModal';
import { BackendConfigModal } from './components/Backend/BackendConfigModal';
import { StopGuideView } from './components/StopGuide/StopGuideView';
import { ApiDocsView } from './components/Docs/ApiDocsView';
import { AlertCircle, Bus, CheckCircle2, Clock, Info, Layers, Sparkles, Star, Users } from 'lucide-react';

const LOCAL_STORAGE_KEY_CONFIG = 'sg_transit_04121_config';
const LOCAL_STORAGE_KEY_STARRED = 'sg_transit_04121_starred';
const LOCAL_STORAGE_KEY_THEME = 'sg_transit_04121_theme';

const DEFAULT_CONFIG: BackendConfig = {
  mode: 'simulator',
  customBusUrl: '/api/bus/04121',
  customWeatherUrl: '',
  headersJson: '',
  autoRefreshInterval: 30,
};

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_THEME);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Backend config
  const [backendConfig, setBackendConfig] = useState<BackendConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CONFIG);
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  // Starred services (defaults to key services 51, 63, 145, 851)
  const [starredServices, setStarredServices] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_STARRED);
      return saved ? JSON.parse(saved) : ['51', '63', '145', '851'];
    } catch {
      return ['51', '63', '145', '851'];
    }
  });

  const toggleStar = useCallback((serviceNo: string) => {
    setStarredServices(prev => {
      const next = prev.includes(serviceNo)
        ? prev.filter(s => s !== serviceNo)
        : [...prev, serviceNo];
      localStorage.setItem(LOCAL_STORAGE_KEY_STARRED, JSON.stringify(next));
      return next;
    });
  }, []);

  // UI state
  const [activeTab, setActiveTab] = useState<'arrivals' | 'weather' | 'stops' | 'docs'>('arrivals');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'starred' | 'dd' | 'arriving'>('all');
  const [displayMode, setDisplayMode] = useState<'cards' | 'led'>('cards');
  const [selectedService, setSelectedService] = useState<BusServiceArrival | null>(null);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);

  // Data states
  const [services, setServices] = useState<BusServiceArrival[]>(() => getSimulatedArrivals(starredServices));
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [refreshCountdown, setRefreshCountdown] = useState(30);

  // Load weather
  const loadWeather = useCallback(async () => {
    setWeatherLoading(true);
    try {
      const data = await fetchCivicDistrictWeather(backendConfig.customWeatherUrl);
      setWeather(data);
    } catch (err: any) {
      console.error('Weather load error:', err);
    } finally {
      setWeatherLoading(false);
    }
  }, [backendConfig.customWeatherUrl]);

  // Load bus arrivals
  const loadArrivals = useCallback(async () => {
    setIsRefreshing(true);
    setErrorNotice(null);

    try {
      if (backendConfig.mode === 'custom_api') {
        const data = await fetchArrivalsFromCustomBackend(backendConfig, starredServices);
        setServices(data);
      } else {
        const data = getSimulatedArrivals(starredServices);
        setServices(data);
      }
    } catch (err: any) {
      console.error('Arrivals fetch error:', err);
      setErrorNotice(
        `Failed to reach custom backend (${err.message || 'Network Error'}). Falling back to simulated live transit data.`
      );
      // Fallback to simulation so UI never breaks
      const data = getSimulatedArrivals(starredServices);
      setServices(data);
    } finally {
      setIsRefreshing(false);
      setRefreshCountdown(backendConfig.autoRefreshInterval || 30);
    }
  }, [backendConfig, starredServices]);

  // Initial load
  useEffect(() => {
    loadArrivals();
    loadWeather();
  }, [loadArrivals, loadWeather]);

  // 1-Second countdown clock for real-time live refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCountdown(prev => {
        if (prev <= 1) {
          loadArrivals();
          return backendConfig.autoRefreshInterval || 30;
        }
        return prev - 1;
      });

      // Also tick down arrival seconds locally for instantaneous responsive countdowns
      setServices(prev =>
        prev.map(s => {
          const tick = (bus: any) =>
            bus && bus.secondsRemaining !== undefined
              ? { ...bus, secondsRemaining: Math.max(-30, bus.secondsRemaining - 1) }
              : bus;
          return {
            ...s,
            NextBus: tick(s.NextBus),
            NextBus2: tick(s.NextBus2),
            NextBus3: tick(s.NextBus3),
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [backendConfig.autoRefreshInterval, loadArrivals]);

  // Save backend config handler
  const handleSaveBackendConfig = (newConfig: BackendConfig) => {
    setBackendConfig(newConfig);
    localStorage.setItem(LOCAL_STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
  };

  // Filtered & sorted bus list
  const filteredServices = useMemo(() => {
    let result = [...services];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        s =>
          s.ServiceNo.toLowerCase().includes(q) ||
          s.DestinationName.toLowerCase().includes(q) ||
          s.RouteDescription.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (activeFilter === 'starred') {
      result = result.filter(s => s.isStarred);
    } else if (activeFilter === 'dd') {
      result = result.filter(
        s => s.NextBus?.Type === 'DD' || s.NextBus2?.Type === 'DD' || s.NextBus3?.Type === 'DD'
      );
    } else if (activeFilter === 'arriving') {
      result = result.filter(
        s => s.NextBus?.secondsRemaining !== undefined && s.NextBus.secondsRemaining <= 300
      );
    }

    // Primary sorting: Starred items float to top, then sorted numerically / arrival time
    result.sort((a, b) => {
      if (a.isStarred && !b.isStarred) return -1;
      if (!a.isStarred && b.isStarred) return 1;

      const aTime = a.NextBus?.secondsRemaining ?? 9999;
      const bTime = b.NextBus?.secondsRemaining ?? 9999;
      return aTime - bTime;
    });

    return result;
  }, [services, searchTerm, activeFilter]);

  // Quick stats
  const arrivingSoonCount = useMemo(() => {
    return services.filter(
      s => s.NextBus?.secondsRemaining !== undefined && s.NextBus.secondsRemaining <= 180
    ).length;
  }, [services]);

  const doubleDeckCount = useMemo(() => {
    return services.filter(s => s.NextBus?.Type === 'DD').length;
  }, [services]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-emerald-500/30">
      {/* 3-Zone Top Navigation */}
      <TopNavigation
        backendConfig={backendConfig}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
        onRefreshAll={() => {
          loadArrivals();
          loadWeather();
        }}
        isRefreshing={isRefreshing || weatherLoading}
        theme={theme}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error notification banner if custom backend fails */}
        {errorNotice && (
          <div className="flex items-center justify-between gap-3 p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{errorNotice}</span>
            </div>
            <button
              onClick={() => setIsBackendModalOpen(true)}
              className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 text-amber-900 dark:text-amber-100 font-semibold rounded text-[11px] whitespace-nowrap"
            >
              Check Backend Config
            </button>
          </div>
        )}

        {/* Dynamic Content Views */}
        {activeTab === 'arrivals' && (
          <div className="space-y-6">
            {/* Top Quick Status Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Stat 1: Total Services */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Stop 04121 Services
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {BUS_STOP_04121.ServicesCount}
                  </span>
                  <span className="text-xs text-slate-400">Lines Active</span>
                </div>
              </div>

              {/* Stat 2: Arriving Soon */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Arriving Soon (&le;3m)
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                    {arrivingSoonCount}
                  </span>
                  <span className="text-xs text-slate-400">Buses</span>
                </div>
              </div>

              {/* Stat 3: Double Deckers */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Double Deckers (DD)
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                    {doubleDeckCount}
                  </span>
                  <span className="text-xs text-slate-400">High Capacity</span>
                </div>
              </div>

              {/* Stat 4: Civic Weather Snapshot */}
              <div
                onClick={() => setActiveTab('weather')}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-colors"
              >
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Civic Weather</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">View Detail</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {weather?.temperature ?? 31}°C
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[100px]">
                    {weather?.conditionText ?? 'Partly Cloudy'}
                  </span>
                </div>
              </div>
            </div>

            {/* Weather Glance Card */}
            <WeatherCard
              weather={weather}
              isLoading={weatherLoading}
              onRefresh={loadWeather}
              compact={false}
            />

            {/* Bus Board Main Container */}
            <div>
              <BusBoardHeader
                stopInfo={BUS_STOP_04121}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                displayMode={displayMode}
                setDisplayMode={setDisplayMode}
                refreshSecondsRemaining={refreshCountdown}
                onManualRefresh={loadArrivals}
                isRefreshing={isRefreshing}
                totalServicesCount={services.length}
                filteredCount={filteredServices.length}
                starredCount={starredServices.length}
              />

              {/* View 1: Modern Card Grid */}
              {displayMode === 'cards' ? (
                filteredServices.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {filteredServices.map(service => (
                      <BusServiceCard
                        key={service.ServiceNo}
                        service={service}
                        onToggleStar={toggleStar}
                        onSelectService={setSelectedService}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
                    <Bus className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      No matching bus services
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      No services match your search query "{searchTerm}" or selected filter.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setActiveFilter('all');
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:opacity-90"
                    >
                      Reset Filters
                    </button>
                  </div>
                )
              ) : (
                /* View 2: High-Contrast LED Electronic Board */
                <BusLedBoard
                  services={filteredServices}
                  onSelectService={setSelectedService}
                  onToggleStar={toggleStar}
                />
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Full Weather View */}
        {activeTab === 'weather' && (
          <div className="space-y-6">
            <WeatherCard
              weather={weather}
              isLoading={weatherLoading}
              onRefresh={loadWeather}
              compact={false}
            />

            {/* Weather & Transit Advisory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                  Singapore Civic District Microclimate
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  Located near the Singapore River and Fort Canning Hill, bus stop 04121 (Opp The Treasury) experiences typical tropical microclimates with afternoon convection showers and brisk river breezes.
                </p>
                <div className="text-xs text-slate-500 space-y-1">
                  <div>• Open-Meteo GPS Sensor: 1.2902°N, 103.8502°E</div>
                  <div>• Elevation: 11m above sea level</div>
                  <div>• Timezone: Asia/Singapore (SGT, UTC+8)</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                  Rain Shelter Connectivity
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  If sudden tropical rain occurs, Bus Stop 04121 offers 100% sheltered linkways connecting to:
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <li>• Covered overhead bridge into Peninsula Plaza</li>
                  <li>• Sheltered walkway to City Hall MRT Exit B</li>
                  <li>• Direct basement link to Funan Mall</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Stop 04121 Metadata Guide */}
        {activeTab === 'stops' && <StopGuideView />}

        {/* Tab 4: Backend API Docs */}
        {activeTab === 'docs' && <ApiDocsView />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span>Bus Stop 04121 (Opp The Treasury)</span>
            <span aria-hidden="true">·</span>
            <span>Civic District Transit Monitor</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBackendModalOpen(true)}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              {backendConfig.mode === 'simulator' ? 'Simulated Transit Mode' : 'Custom Backend API'}
            </button>
            <span aria-hidden="true">·</span>
            <span>LTA DataMall & Open-Meteo</span>
          </div>
        </div>
      </footer>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onToggleStar={toggleStar}
      />

      {/* Backend Setup Modal */}
      {isBackendModalOpen && (
        <BackendConfigModal
          config={backendConfig}
          onSaveConfig={handleSaveBackendConfig}
          onClose={() => setIsBackendModalOpen(false)}
        />
      )}
    </div>
  );
}
