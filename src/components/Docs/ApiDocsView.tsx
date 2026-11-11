import React, { useState } from 'react';
import { Check, CheckCircle2, Code2, Copy, ExternalLink, FileCode, Play, RefreshCw, Server, Terminal } from 'lucide-react';

export const ApiDocsView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeEndpoint, setActiveEndpoint] = useState<string>('/api/health');
  const [testResult, setTestResult] = useState<{
    loading: boolean;
    status?: number;
    latency?: number;
    data?: any;
    error?: string;
  }>({ loading: false });

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleTestApi = async (path: string) => {
    setActiveEndpoint(path);
    setTestResult({ loading: true });
    const start = Date.now();
    try {
      const res = await fetch(path, { headers: { Accept: 'application/json' } });
      const latency = Date.now() - start;
      const data = await res.json();
      setTestResult({
        loading: false,
        status: res.status,
        latency,
        data,
      });
    } catch (err: any) {
      setTestResult({
        loading: false,
        status: 0,
        latency: Date.now() - start,
        error: err.message || 'Request failed',
      });
    }
  };

  const serverlessEndpoints = [
    {
      name: 'System & Upstream Health',
      path: '/api/health',
      file: '/api/health.ts',
      desc: 'Checks backend status and tests real-time connectivity to data.gov.sg',
    },
    {
      name: '2-Hour NEA Forecast',
      path: '/api/two-hr-forecast',
      file: '/api/two-hr-forecast.ts',
      desc: 'Pulls live keyless data from https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast and extracts City sector for stop 04121',
    },
    {
      name: 'Air Temperature Telemetry',
      path: '/api/air-temperature',
      file: '/api/air-temperature.ts',
      desc: 'Pulls live keyless data from https://api-open.data.gov.sg/v2/real-time/api/air-temperature and finds nearest station (Scotts Rd S111)',
    },
    {
      name: 'Rainfall Telemetry',
      path: '/api/rainfall',
      file: '/api/rainfall.ts',
      desc: 'Pulls live keyless data from https://api-open.data.gov.sg/v2/real-time/api/rainfall and finds nearest rain gauge (Nicoll Hwy S119)',
    },
    {
      name: 'Correlated Civic Weather',
      path: '/api/weather',
      file: '/api/weather.ts',
      desc: 'Aggregates all 3 data.gov.sg streams into a single localized forecast for Bus Stop 04121 Opp The Treasury',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-mono text-xs font-bold rounded">
                Live & Keyless
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                data.gov.sg v2 Real-Time API Suite
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Serverless Endpoints in /api
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
              All live government weather & environment connections are isolated as serverless handlers inside the <code>/api</code> folder. They are wired into Express (running via <code>server.ts</code>) and can also be deployed to Vercel, Netlify, or Google Cloud Run.
            </p>
          </div>
        </div>
      </div>

      {/* Live Interactive Endpoint Tester */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Live Endpoint Inspector & Tester
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Click any endpoint below to execute a real serverless request and inspect the live data.gov.sg response payload:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-5">
          {serverlessEndpoints.map((ep) => (
            <button
              key={ep.path}
              onClick={() => handleTestApi(ep.path)}
              className={`p-3 text-left rounded-xl border transition-all ${
                activeEndpoint === ep.path
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500/80 ring-1 ring-emerald-500/30'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                  {ep.path}
                </span>
                <Play className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              </div>
              <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                {ep.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {ep.file}
              </div>
            </button>
          ))}
        </div>

        {/* Live Response Panel */}
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-4 text-xs font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-slate-200 font-bold">{activeEndpoint}</span>
              {testResult.status !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    testResult.status === 200
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  HTTP {testResult.status}
                </span>
              )}
              {testResult.latency !== undefined && (
                <span className="text-[10px] text-slate-400">
                  {testResult.latency}ms
                </span>
              )}
            </div>

            <button
              onClick={() => handleTestApi(activeEndpoint)}
              disabled={testResult.loading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${testResult.loading ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{testResult.loading ? 'Fetching...' : 'Send Request'}</span>
            </button>
          </div>

          <div className="pt-3 max-h-72 overflow-y-auto">
            {testResult.loading ? (
              <div className="py-6 text-center text-slate-400 animate-pulse">
                Pinging data.gov.sg via {activeEndpoint}...
              </div>
            ) : testResult.error ? (
              <div className="text-rose-400 py-2">
                Error: {testResult.error}
              </div>
            ) : testResult.data ? (
              <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed text-[11px]">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            ) : (
              <div className="py-6 text-center text-slate-400">
                Click "Send Request" or select an endpoint above to view live data.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Directory Structure & Upstream URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* /api folder layout */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 dark:text-white text-sm">
            <FileCode className="w-4 h-4 text-emerald-600" />
            <span>Files Created in /api Directory</span>
          </div>
          <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
            <li className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <code className="font-bold text-emerald-600 dark:text-emerald-400">/api/health.ts</code>
              <div className="text-[11px] text-slate-500 mt-0.5">System health probe & upstream test</div>
            </li>
            <li className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <code className="font-bold text-emerald-600 dark:text-emerald-400">/api/two-hr-forecast.ts</code>
              <div className="text-[11px] text-slate-500 mt-0.5">Live 2-hr forecast + City sector isolation</div>
            </li>
            <li className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <code className="font-bold text-emerald-600 dark:text-emerald-400">/api/air-temperature.ts</code>
              <div className="text-[11px] text-slate-500 mt-0.5">Live thermometer station targeting for stop 04121</div>
            </li>
            <li className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <code className="font-bold text-emerald-600 dark:text-emerald-400">/api/rainfall.ts</code>
              <div className="text-[11px] text-slate-500 mt-0.5">Live precipitation telemetry for stop 04121</div>
            </li>
            <li className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <code className="font-bold text-emerald-600 dark:text-emerald-400">/api/weather.ts</code>
              <div className="text-[11px] text-slate-500 mt-0.5">Orchestrator combining all 3 data streams</div>
            </li>
          </ul>
        </div>

        {/* Upstream official sources */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 dark:text-white text-sm">
            <ExternalLink className="w-4 h-4 text-sky-600" />
            <span>Official data.gov.sg v2 Upstream Feeds</span>
          </div>
          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="font-bold text-slate-800 dark:text-slate-200">Two-Hour Weather Forecast</div>
              <div className="font-mono text-[10px] text-sky-600 dark:text-sky-400 break-all select-all">
                https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast
              </div>
            </div>

            <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="font-bold text-slate-800 dark:text-slate-200">Real-Time Air Temperature</div>
              <div className="font-mono text-[10px] text-sky-600 dark:text-sky-400 break-all select-all">
                https://api-open.data.gov.sg/v2/real-time/api/air-temperature
              </div>
            </div>

            <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="font-bold text-slate-800 dark:text-slate-200">Real-Time Rainfall Telemetry</div>
              <div className="font-mono text-[10px] text-sky-600 dark:text-sky-400 break-all select-all">
                https://api-open.data.gov.sg/v2/real-time/api/rainfall
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
