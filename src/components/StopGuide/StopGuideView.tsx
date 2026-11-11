import React from 'react';
import { Building2, Bus, Compass, Landmark, MapPin, Navigation, ShieldCheck, Train } from 'lucide-react';
import { BUS_STOP_04121 } from '../../services/busService';

export const StopGuideView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-1 bg-emerald-700 text-white font-mono font-bold text-sm rounded">
                04121
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                Official LTA Code
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Opp The Treasury (North Bridge Road)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              A major arterial transit bus stop situated in Singapore's Civic District. It serves government offices, cultural heritage sites, and major MRT interchanges.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 font-mono text-xs text-slate-600 dark:text-slate-300">
            <div>Latitude: 1.2902° N</div>
            <div>Longitude: 103.8502° E</div>
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
            Nearby MRT Interchanges
          </h3>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <strong className="text-slate-800 dark:text-slate-200">City Hall (NS25/EW13)</strong>
              <span className="text-slate-400">· 4 min walk</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <strong className="text-slate-800 dark:text-slate-200">Clarke Quay (NE5)</strong>
              <span className="text-slate-400">· 6 min walk</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <strong className="text-slate-800 dark:text-slate-200">Fort Canning (DT20)</strong>
              <span className="text-slate-400">· 8 min walk</span>
            </li>
          </ul>
        </div>

        {/* Civic Landmarks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
            <Landmark className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">
            Key Landmarks
          </h3>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <li>• The Treasury (Ministry of Finance)</li>
            <li>• Parliament House of Singapore</li>
            <li>• Funan Mall (IT & Lifestyle)</li>
            <li>• National Gallery Singapore</li>
            <li>• Peninsula Plaza & High Street Centre</li>
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
            <li>• Continuous sheltered walkway into The Treasury</li>
            <li>• Wheelchair accessible kerb boarding (WAB)</li>
            <li>• Real-time digital electronic bus arrival board</li>
            <li>• Dual bus bay to handle multiple peak-hour arrivals</li>
          </ul>
        </div>
      </div>

      {/* Services Calling at 04121 Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">
          All 13 Bus Services Calling at Stop 04121
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { svc: '51', dest: 'Hougang Central Int', via: 'Bugis, Kallang, Kovan' },
            { svc: '61', dest: 'Eunos Int', via: 'Chinatown, Boat Quay, Telok Blangah' },
            { svc: '63', dest: 'Eunos Int (Loop)', via: 'Circuit Rd, MacPherson' },
            { svc: '80', dest: 'Sengkang Int', via: 'Lavender, Geylang, Hougang' },
            { svc: '124', dest: "St. Michael's Ter", via: 'Orchard, Newton, Balestier' },
            { svc: '145', dest: 'Toa Payoh Int', via: 'Bugis, Balestier, Toa Payoh' },
            { svc: '166', dest: 'Ang Mo Kio Int', via: 'Thomson, Bishan, AMK' },
            { svc: '174', dest: 'Boon Lay Int', via: 'Orchard, Bt Timah, Jurong' },
            { svc: '197', dest: 'Bedok Int', via: 'Marine Parade, Bedok' },
            { svc: '851', dest: 'Yishun Int', via: 'Little India, Novena, Marymount' },
            { svc: '851e', dest: 'Yishun Int (Express)', via: 'Express via CTE to Yishun' },
            { svc: '961', dest: 'Woodlands Int', via: 'Chinatown, Bt Timah, Woodlands' },
            { svc: '961M', dest: 'Woodlands Int (Sun/PH)', via: 'Marina Centre & Suntec' },
          ].map((s) => (
            <div
              key={s.svc}
              className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/60 dark:border-slate-700/60"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-bold text-xs rounded">
                  {s.svc}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">
                  {s.dest}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {s.via}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
