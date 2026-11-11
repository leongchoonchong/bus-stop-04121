import React from 'react';
import { Accessibility, ChevronRight, Layers, Star, Users } from 'lucide-react';
import { BusServiceArrival, NextBusArrival } from '../../types/transit';
import { formatEta } from '../../services/busService';

interface BusServiceCardProps {
  service: BusServiceArrival;
  onToggleStar: (serviceNo: string) => void;
  onSelectService: (service: BusServiceArrival) => void;
}

export const BusServiceCard: React.FC<BusServiceCardProps> = ({
  service,
  onToggleStar,
  onSelectService,
}) => {
  const eta1 = formatEta(service.NextBus?.secondsRemaining);
  const eta2 = formatEta(service.NextBus2?.secondsRemaining);
  const eta3 = formatEta(service.NextBus3?.secondsRemaining);

  const getLoadBadge = (load?: string) => {
    switch (load) {
      case 'SEA':
        return { label: 'Seats Avail', colorClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' };
      case 'SDA':
        return { label: 'Standing', colorClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' };
      case 'LSD':
        return { label: 'Limited Stand', colorClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30' };
      default:
        return { label: 'Normal', colorClass: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-transparent' };
    }
  };

  const getLoadDot = (load?: string) => {
    switch (load) {
      case 'SEA':
        return 'bg-emerald-500';
      case 'SDA':
        return 'bg-amber-500';
      case 'LSD':
        return 'bg-rose-500';
      default:
        return 'bg-slate-300';
    }
  };

  const load1 = getLoadBadge(service.NextBus?.Load);

  return (
    <div
      onClick={() => onSelectService(service)}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-4 sm:p-5 transition-all shadow-xs hover:shadow-sm cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Star + Service Badge + Destination info */}
        <div className="flex items-start gap-3.5 min-w-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(service.ServiceNo);
            }}
            aria-label={service.isStarred ? 'Remove from favorites' : 'Add to favorites'}
            className="mt-0.5 p-1 rounded-md text-slate-300 dark:text-slate-600 hover:text-amber-400 dark:hover:text-amber-400 transition-colors"
          >
            <Star
              className={`w-4 h-4 ${
                service.isStarred ? 'fill-amber-400 text-amber-400' : 'stroke-current'
              }`}
            />
          </button>

          {/* Bus Service Number Plate */}
          <div className="w-14 h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg flex flex-col items-center justify-center shrink-0 shadow-xs">
            <span className="font-extrabold text-base leading-none tracking-tight font-mono">
              {service.ServiceNo}
            </span>
            <span className="text-[9px] font-semibold tracking-wider opacity-70 uppercase mt-0.5">
              {service.Operator}
            </span>
          </div>

          {/* Route & Destination */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">To</span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white truncate">
                {service.DestinationName}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {service.RouteDescription}
            </p>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-2 mt-1">
              <span>Freq: {service.frequencyRange}</span>
              <span aria-hidden="true">·</span>
              <span>First {service.firstBus} / Last {service.lastBus}</span>
            </div>
          </div>
        </div>

        {/* Right: Arrivals Grid */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 self-end sm:self-center">
          {/* Next Bus (Primary) */}
          <div className="flex flex-col items-end min-w-[90px]">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums leading-none ${
                  eta1.isArr
                    ? 'text-emerald-600 dark:text-emerald-400 animate-pulse'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {eta1.label}
              </span>
            </div>

            {/* Load indicator badge */}
            <div className="flex items-center gap-1.5 mt-1.5">
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${load1.colorClass}`}
              >
                {load1.label}
              </span>
              {service.NextBus?.Type === 'DD' && (
                <span
                  title="Double Decker"
                  className="text-[10px] font-bold px-1 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-mono"
                >
                  DD
                </span>
              )}
              {service.NextBus?.Feature === 'WAB' && (
                <span title="Wheelchair Accessible" className="inline-flex">
                  <Accessibility className="w-3.5 h-3.5 text-slate-400" />
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          {/* 2nd & 3rd Upcoming Buses */}
          <div className="flex sm:flex-col gap-2 sm:gap-1 text-right">
            {/* Bus 2 */}
            <div className="flex items-center justify-end gap-1.5 text-xs">
              <span className="text-[10px] text-slate-400">Next:</span>
              <span className={`w-1.5 h-1.5 rounded-full ${getLoadDot(service.NextBus2?.Load)}`}></span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                {eta2.label}
              </span>
              {service.NextBus2?.Type === 'DD' && (
                <span className="text-[9px] font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                  DD
                </span>
              )}
            </div>

            {/* Bus 3 */}
            <div className="flex items-center justify-end gap-1.5 text-xs">
              <span className="text-[10px] text-slate-400">3rd:</span>
              <span className={`w-1.5 h-1.5 rounded-full ${getLoadDot(service.NextBus3?.Load)}`}></span>
              <span className="font-mono font-bold text-slate-600 dark:text-slate-400 tabular-nums">
                {eta3.label}
              </span>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors ml-1 hidden sm:block" />
        </div>
      </div>
    </div>
  );
};
