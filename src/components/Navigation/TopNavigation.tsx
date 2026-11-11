import React from 'react';
import { Bus, CloudSun, Code, Moon, Sun, RefreshCw, Radio } from 'lucide-react';
import { BackendConfig } from '../../types/transit';

interface TopNavigationProps {
  currentStopCode: string;
  backendConfig: BackendConfig;
  onOpenBackendModal: () => void;
  onRefreshAll: () => void;
  isRefreshing: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  activeTab: 'arrivals' | 'weather' | 'stops' | 'docs';
  setActiveTab: (tab: 'arrivals' | 'weather' | 'stops' | 'docs') => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentStopCode,
  backendConfig,
  onOpenBackendModal,
  onRefreshAll,
  isRefreshing,
  theme,
  onToggleTheme,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
          <Bus className="w-4 h-4" />
        </div>
        <button
          onClick={() => setActiveTab('arrivals')}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap hover:opacity-85 transition-opacity text-left"
        >
          SG Transit · Stop {currentStopCode}
        </button>
      </div>

      {/* Zone 2: 4 single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        <button
          onClick={() => setActiveTab('arrivals')}
          className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'arrivals' ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-500' : ''
          }`}
        >
          Bus Board
        </button>
        <button
          onClick={() => setActiveTab('weather')}
          className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'weather' ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-500' : ''
          }`}
        >
          Civic Weather
        </button>
        <button
          onClick={() => setActiveTab('stops')}
          className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'stops' ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-500' : ''
          }`}
        >
          Stop 04121 Guide
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'docs' ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-500' : ''
          }`}
        >
          Backend API Contract
        </button>
      </nav>

      {/* Zone 3: 1 primary action block with quick utility triggers */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={onRefreshAll}
          disabled={isRefreshing}
          title="Refresh arrivals and weather"
          className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          aria-label="Refresh data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
        </button>

        <button
          onClick={onOpenBackendModal}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-white transition-colors whitespace-nowrap shrink-0 shadow-xs"
        >
          <Code className="w-3.5 h-3.5" />
          <span>{backendConfig.mode === 'custom_api' ? 'Backend: Connected' : 'Connect Backend'}</span>
          {backendConfig.mode === 'custom_api' ? (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          ) : (
            <span className="text-[10px] opacity-75 font-normal">(Demo Mode)</span>
          )}
        </button>
      </div>
    </header>
  );
};
