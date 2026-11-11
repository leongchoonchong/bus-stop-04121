import React from 'react';
import { BusServiceArrival } from '../../types/transit';
import { formatEta } from '../../services/busService';

interface BusLedBoardProps {
  services: BusServiceArrival[];
  stopCode?: string;
  stopRoad?: string;
  stopSector?: string;
  onSelectService: (service: BusServiceArrival) => void;
  onToggleStar: (serviceNo: string) => void;
}

export const BusLedBoard: React.FC<BusLedBoardProps> = ({
  services,
  stopCode = '04179',
  stopRoad = 'NORTH BRIDGE RD',
  stopSector = 'CIVIC DISTRICT',
  onSelectService,
  onToggleStar,
}) => {
  return (
    <div className="bg-[#0b0f19] border-2 border-slate-800 rounded-xl p-4 sm:p-6 shadow-2xl overflow-hidden font-mono text-slate-100">
      {/* LED Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
          <span className="text-emerald-400 font-bold tracking-widest uppercase">
            BUS ARRIVAL DISPLAY · STOP {stopCode}
          </span>
        </div>
        <div className="text-slate-400 text-[11px] tracking-wider uppercase">
          {stopRoad} · {stopSector}
        </div>
      </div>

      {/* LED Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 pb-2">
              <th className="py-2.5 px-3 w-16 text-center">SVC</th>
              <th className="py-2.5 px-3">DESTINATION</th>
              <th className="py-2.5 px-3 text-center w-28 text-amber-400">NEXT BUS</th>
              <th className="py-2.5 px-3 text-center w-24 text-slate-300">2ND BUS</th>
              <th className="py-2.5 px-3 text-center w-24 text-slate-400">3RD BUS</th>
              <th className="py-2.5 px-3 text-center w-20">DECK</th>
              <th className="py-2.5 px-3 text-right w-24">CROWD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {services.map((service) => {
              const eta1 = formatEta(service.NextBus?.secondsRemaining);
              const eta2 = formatEta(service.NextBus2?.secondsRemaining);
              const eta3 = formatEta(service.NextBus3?.secondsRemaining);

              const isArr = eta1.isArr;
              const loadColor =
                service.NextBus?.Load === 'SEA'
                  ? 'text-emerald-400'
                  : service.NextBus?.Load === 'SDA'
                  ? 'text-amber-400'
                  : 'text-rose-400';

              const loadText =
                service.NextBus?.Load === 'SEA'
                  ? 'SEATS'
                  : service.NextBus?.Load === 'SDA'
                  ? 'STAND'
                  : 'FULL';

              return (
                <tr
                  key={service.ServiceNo}
                  onClick={() => onSelectService(service)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  {/* Service Number */}
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 bg-amber-500/10 text-amber-300 font-extrabold rounded text-base tracking-wide border border-amber-500/30 group-hover:bg-amber-500/20 group-hover:text-amber-200">
                      {service.ServiceNo}
                    </span>
                  </td>

                  {/* Destination */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
                      {service.DestinationName}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">
                      {service.RouteDescription}
                    </div>
                  </td>

                  {/* Next Bus ETA */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-lg font-extrabold tracking-wider ${
                        isArr
                          ? 'text-emerald-400 animate-pulse drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                          : 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]'
                      }`}
                    >
                      {eta1.label}
                    </span>
                  </td>

                  {/* 2nd Bus */}
                  <td className="py-3 px-3 text-center text-slate-300 font-medium">
                    {eta2.label}
                  </td>

                  {/* 3rd Bus */}
                  <td className="py-3 px-3 text-center text-slate-400">
                    {eta3.label}
                  </td>

                  {/* Deck Type */}
                  <td className="py-3 px-3 text-center">
                    {service.NextBus?.Type === 'DD' ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700 font-bold">
                        DOUBLE
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">SINGLE</span>
                    )}
                  </td>

                  {/* Crowd Level */}
                  <td className="py-3 px-3 text-right">
                    <span className={`text-xs font-bold ${loadColor}`}>
                      {loadText}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Board Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Seats Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Standing Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Limited Standing
          </span>
        </div>
        <div className="text-slate-400">
          Click any row for route timeline & vehicle specs
        </div>
      </div>
    </div>
  );
};
