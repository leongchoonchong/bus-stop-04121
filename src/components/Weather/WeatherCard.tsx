import React from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSun, Droplets, RefreshCw, Sun, Umbrella, Wind } from 'lucide-react';
import { WeatherData } from '../../types/transit';

interface WeatherCardProps {
  weather: WeatherData | null;
  isLoading: boolean;
  onRefresh: () => void;
  compact?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  isLoading,
  onRefresh,
  compact = false,
}) => {
  if (isLoading && !weather) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-3"></div>
        <div className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded w-full"></div>
      </div>
    );
  }

  if (!weather) return null;

  const getWeatherIcon = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('thunder') || lower.includes('lightning')) {
      return <CloudLightning className="w-8 h-8 text-amber-500" />;
    }
    if (lower.includes('rain') || lower.includes('shower')) {
      return <CloudRain className="w-8 h-8 text-sky-500" />;
    }
    if (lower.includes('drizzle')) {
      return <CloudDrizzle className="w-8 h-8 text-sky-400" />;
    }
    if (lower.includes('fog') || lower.includes('haze')) {
      return <CloudFog className="w-8 h-8 text-slate-400" />;
    }
    if (lower.includes('cloud')) {
      return <CloudSun className="w-8 h-8 text-amber-500" />;
    }
    return <Sun className="w-8 h-8 text-amber-500" />;
  };

  const isRainLikely = weather.precipitationProbability >= 40 || weather.precipitation > 0;

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="shrink-0">{getWeatherIcon(weather.conditionText)}</div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {weather.temperature}°C
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {weather.conditionText}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <span>Civic District · 04121</span>
              <span aria-hidden="true">·</span>
              <span>Feels {weather.apparentTemperature}°C</span>
              <span aria-hidden="true">·</span>
              <span>Rain {weather.precipitationProbability}%</span>
            </div>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Refresh weather"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Current Weather · Civic District
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span>North Bridge Rd (Stop 04121 area)</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
              {weather.source || 'data.gov.sg NEA'}
            </span>
            <span aria-hidden="true">·</span>
            <span>Updated {weather.lastUpdated}</span>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2.5 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Temp & Condition */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="md:col-span-6 flex items-center gap-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl shrink-0">
            {getWeatherIcon(weather.conditionText)}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
                {weather.temperature}°C
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Feels like <span className="font-mono tabular-nums">{weather.apparentTemperature}°C</span>
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
              {weather.conditionText}
            </div>
          </div>
        </div>

        {/* 3 Metric Readouts */}
        <div className="md:col-span-6 grid grid-cols-3 gap-3">
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              <Droplets className="w-3.5 h-3.5 text-sky-500" />
              <span>Humidity</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {weather.humidity}%
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              <Umbrella className="w-3.5 h-3.5 text-indigo-500" />
              <span>Rain Risk</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {weather.precipitationProbability}%
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              <Wind className="w-3.5 h-3.5 text-teal-500" />
              <span>Wind</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {weather.windSpeed} km/h
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Forecast Strip */}
      <div className="pt-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2.5">
          <span>Upcoming Forecast (Next 5 Hours)</span>
          {isRainLikely && (
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              Passing showers expected · Carry umbrella
            </span>
          )}
        </div>

        <div className="grid grid-cols-5 gap-2 text-center">
          {weather.hourlyForecast.map((h, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg transition-colors ${
                i === 0
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40'
                  : 'bg-slate-50/70 dark:bg-slate-800/40'
              }`}
            >
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                {h.time}
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white font-mono tabular-nums mb-1">
                {h.temperature}°
              </div>
              <div className="text-[10px] text-sky-600 dark:text-sky-400 font-mono tabular-nums">
                {h.rainProbability}% rain
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commuter Tip & Station Telemetry */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div>
          <span>Stop 04121 covered linkway connects to The Treasury & City Hall MRT.</span>
          {weather.temperatureStation && (
            <span className="block sm:inline sm:ml-2 text-[11px] text-slate-400">
              [Sensors: Temp @ {weather.temperatureStation.name} · Rain @ {weather.rainfallStation?.name || 'Nicoll Hwy'}]
            </span>
          )}
        </div>
        <span className="font-mono text-[11px] text-slate-400 shrink-0">
          Sector: {weather.sector || 'City'} · 1.2902°N, 103.8502°E
        </span>
      </div>
    </div>
  );
};
