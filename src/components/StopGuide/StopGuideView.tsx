import React from 'react';
import { Building2, Bus, Compass, Landmark, MapPin, Navigation, ShieldCheck, Train } from 'lucide-react';
import { BusServiceArrival, BusStopInfo } from '../../types/transit';

interface StopGuideViewProps {
  stopInfo: BusStopInfo;
  services: BusServiceArrival[];
}

export const StopGuideView: React.FC<StopGuideViewProps> = ({ stopInfo, services }) => {
  return (
    <div className="space-y-6">
      {/* Hero Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-1 bg-emerald-700 text-white font-mono font-bold text-sm rounded">
                {stopInfo.BusStopCode}
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                Official LTA Code {stopInfo.BusStopCode === '04179' && '· Default Stop'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {stopInfo.Description} ({stopInfo.RoadName})
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              An active public bus transit stop located along Singapore's road network in the {stopInfo.Sector || 'City'} sector. Serving arterial commuter routes and MRT connections.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 font-mono text-xs text-slate-600 dark:text-slate-300">
            <div>Latitude: {stopInfo.Latitude}° N</div>
            <div>Longitude: {stopInfo.Longitude}° E</div>
            <div className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Status: Active & Covered</div>
          </div>
        </div>
      </div>

      {/* Grid of Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Nearby MRT */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <Train className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">
            Nearby Transit & MRT
          </h3>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <strong className="text-slate-800 dark:text-slate-200">
                {stopInfo.BusStopCode === '04179' ? 'City Hall MRT (Exit B)' : 'Connected MRT Station'}
              </strong>
              <span className="text-slate-400">· Direct link</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <strong className="text-slate-800 dark:text-slate-200">Clarke Quay (NE5)</strong>
              <span className="text-slate-400">· 5–7 min walk</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <strong className="text-slate-800 dark:text-slate-200">Downtown Line Interchange</strong>
              <span className="text-slate-400">· Bus feeder</span>
            </li>
          </ul>
        </div>

        {/* Civic Landmarks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
            <Landmark className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">
            Surrounding Landmarks
          </h3>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            {stopInfo.Landmarks && stopInfo.Landmarks.length > 0 ? (
              stopInfo.Landmarks.map((lm, idx) => <li key={idx}>• {lm}</li>)
            ) : (
              <>
                <li>• St. Andrew's Cathedral</li>
                <li>• Capitol Singapore & Piazza</li>
                <li>• Peninsula Plaza</li>
                <li>• City Hall MRT Station</li>
              </>
            )}
          </ul>
        </div>

        {/* Shelter & Accessibility */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">
            Shelter & Commuter Comfort
          </h3>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <li>• Covered rain shelter with continuous linkway</li>
            <li>• Wheelchair accessible boarding kerb (WAB standard)</li>
            <li>• Real-time digital electronic bus arrival display</li>
            <li>• Multi-bay transit berth for simultaneous boarding</li>
          </ul>
        </div>
      </div>

      {/* Services Calling at Current Bus Stop Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">
          All {services.length} Bus Services Calling at Stop {stopInfo.BusStopCode}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {services.map((s) => (
            <div
              key={s.ServiceNo}
              className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/60 dark:border-slate-700/60"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-bold text-xs rounded">
                  {s.ServiceNo}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">
                  {s.DestinationName}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {s.RouteDescription}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
