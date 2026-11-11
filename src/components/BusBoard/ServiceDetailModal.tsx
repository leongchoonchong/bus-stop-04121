import React from 'react';
import { Accessibility, ArrowRight, Bus, CheckCircle2, Clock, MapPin, Star, Users, X } from 'lucide-react';
import { BusServiceArrival } from '../../types/transit';
import { formatEta } from '../../services/busService';

interface ServiceDetailModalProps {
  service: BusServiceArrival | null;
  onClose: () => void;
  onToggleStar: (serviceNo: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onToggleStar,
}) => {
  if (!service) return null;

  const eta1 = formatEta(service.NextBus?.secondsRemaining);
  const eta2 = formatEta(service.NextBus2?.secondsRemaining);
  const eta3 = formatEta(service.NextBus3?.secondsRemaining);

  const getLoadText = (load?: string) => {
    switch (load) {
      case 'SEA':
        return { text: 'Seats Available', desc: 'Plenty of seating available on board', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
      case 'SDA':
        return { text: 'Standing Available', desc: 'Moderate crowd, seats likely filled', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
      case 'LSD':
        return { text: 'Limited Standing', desc: 'High passenger load, tight space', badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' };
      default:
        return { text: 'Normal', desc: 'Schedule operating nominally', badge: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  const arrivals = [
    { label: 'Next Bus', eta: eta1, bus: service.NextBus },
    { label: '2nd Bus', eta: eta2, bus: service.NextBus2 },
    { label: '3rd Bus', eta: eta3, bus: service.NextBus3 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl flex flex-col items-center justify-center font-mono shrink-0 shadow-xs">
              <span className="font-extrabold text-lg leading-none">{service.ServiceNo}</span>
              <span className="text-[9px] opacity-70 tracking-wider font-sans uppercase mt-0.5">{service.Operator}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Direction:</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {service.DestinationName}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calling at Stop 04121 (Opp The Treasury)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleStar(service.ServiceNo)}
              className="p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Pin to top"
            >
              <Star className={`w-5 h-5 ${service.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-5">
          {/* 3 Upcoming Arrivals Detail */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Upcoming Scheduled Arrivals
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {arrivals.map((item, idx) => {
                const load = getLoadText(item.bus?.Load);
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-colors ${
                      idx === 0
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                        : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      {item.label}
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                        {item.eta.label}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.eta.sublabel}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Type:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                          {item.bus?.Type === 'DD' ? 'Double Deck (DD)' : 'Single Deck (SD)'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Crowd:</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${load.badge}`}>
                          {load.text}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Wheelchair:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1 text-[11px]">
                          {item.bus?.Feature === 'WAB' ? (
                            <>
                              <Accessibility className="w-3 h-3 text-emerald-500" /> Yes
                            </>
                          ) : (
                            'Standard'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Route Overview */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Route Trajectory from Stop 04121</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              {service.RouteDescription}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Stop 04121</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Next corridor</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-900 dark:text-white truncate">
                {service.DestinationName}
              </span>
            </div>
          </div>

          {/* Operating Hours & Headway */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Operating Hours</span>
              </div>
              <div className="font-mono font-bold text-slate-900 dark:text-white">
                {service.firstBus} – {service.lastBus}
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>Typical Frequency</span>
              </div>
              <div className="font-mono font-bold text-slate-900 dark:text-white">
                {service.frequencyRange}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400">
            Source: LTA Singapore DataMall Bus Arrival Standard
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
