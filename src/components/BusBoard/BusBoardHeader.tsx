import React, { useState } from 'react';
import { ArrowRight, Bus, Check, Clock, ChevronDown, LayoutGrid, MapPin, Monitor, RefreshCw, Search, Sparkles, Star } from 'lucide-react';
import { BusStopInfo } from '../../types/transit';
import { KNOWN_BUS_STOPS } from '../../services/busService';

interface BusBoardHeaderProps {
  stopInfo: BusStopInfo;
  onBusStopChange: (newCode: string) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  activeFilter: 'all' | 'starred' | 'dd' | 'arriving';
  setActiveFilter: (f: 'all' | 'starred' | 'dd' | 'arriving') => void;
  displayMode: 'cards' | 'led';
  setDisplayMode: (m: 'cards' | 'led') => void;
  refreshSecondsRemaining: number;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  totalServicesCount: number;
  filteredCount: number;
  starredCount: number;
}

export const BusBoardHeader: React.FC<BusBoardHeaderProps> = ({
  stopInfo,
  onBusStopChange,
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  displayMode,
  setDisplayMode,
  refreshSecondsRemaining,
  onManualRefresh,
  isRefreshing,
  totalServicesCount,
  filteredCount,
  starredCount,
}) => {
  const [inputCode, setInputCode] = useState(stopInfo.BusStopCode);
  const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState(false);

  const handleApplyCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = inputCode.trim();
    if (clean) {
      onBusStopChange(clean);
      setIsPresetDropdownOpen(false);
    }
  };

  const handleSelectPreset = (code: string) => {
    setInputCode(code);
    onBusStopChange(code);
    setIsPresetDropdownOpen(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-5 shadow-xs transition-colors">
      {/* Top Section: Bus Stop Code User Input & Current Station Details */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex-1">
          {/* Input Bar for Bus Stop Number */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Bus Stop Code:
            </span>

            <form onSubmit={handleApplyCode} className="inline-flex items-center gap-1.5">
              <div className="relative">
                <input
                  type="text"
                  maxLength={5}
                  value={inputCode}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    setInputCode(val);
                    if (val.length === 5) {
                      onBusStopChange(val);
                    }
                  }}
                  placeholder="04179"
                  className="w-24 px-2.5 py-1 bg-emerald-700 text-white placeholder:text-emerald-200/60 font-mono text-base font-bold rounded tracking-wider shadow-xs border border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
                  aria-label="Bus stop number"
                />
              </div>

              <button
                type="submit"
                className="px-2.5 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-md hover:opacity-90 transition-opacity"
              >
                Go
              </button>
            </form>

            {/* Quick Presets Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPresetDropdownOpen(prev => !prev)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
              >
                <span>Popular Stops</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isPresetDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-1.5 text-xs">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Singapore Bus Stop
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-0.5">
                    {Object.values(KNOWN_BUS_STOPS).map((stop) => (
                      <button
                        key={stop.BusStopCode}
                        onClick={() => handleSelectPreset(stop.BusStopCode)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                          stopInfo.BusStopCode === stop.BusStopCode
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-mono font-bold text-slate-900 dark:text-white">
                            {stop.BusStopCode}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {stop.Description}
                          </div>
                        </div>
                        {stopInfo.BusStopCode === stop.BusStopCode && (
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {stopInfo.BusStopCode === '04179' && (
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                (Default Stop)
              </span>
            )}
          </div>

          {/* Station Title & Dynamic Metadata */}
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {stopInfo.Description}
          </h1>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap mt-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {stopInfo.RoadName}
            </span>
            <span aria-hidden="true">·</span>
            <span>Sector: {stopInfo.Sector || 'City'}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{totalServicesCount} Transit Lines</span>
            {stopInfo.Landmarks && stopInfo.Landmarks[0] && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate max-w-xs">{stopInfo.Landmarks[0]}</span>
              </>
            )}
          </div>
        </div>

        {/* Live Refresh Status & View Mode */}
        <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
          {/* Refresh Timer Widget */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-600 dark:text-slate-300">
              Refresh in{' '}
              <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                {refreshSecondsRemaining}s
              </span>
            </span>
            <button
              onClick={onManualRefresh}
              disabled={isRefreshing}
              title="Refresh now"
              className="ml-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>

          {/* View Mode Toggle: Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setDisplayMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                displayMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Modern</span>
            </button>
            <button
              onClick={() => setDisplayMode('led')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                displayMode === 'led'
                  ? 'bg-slate-900 text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>LED Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
        {/* Search Input for Bus Services */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bus number (e.g. 32, 51, 145) or destination..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({totalServicesCount})
          </button>

          <button
            onClick={() => setActiveFilter('starred')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeFilter === 'starred'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Star className="w-3 h-3 fill-current" />
            <span>Pinned ({starredCount})</span>
          </button>

          <button
            onClick={() => setActiveFilter('arriving')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeFilter === 'arriving'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Arriving (&lt;5m)
          </button>

          <button
            onClick={() => setActiveFilter('dd')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeFilter === 'dd'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Double Deck
          </button>
        </div>
      </div>
    </div>
  );
};
