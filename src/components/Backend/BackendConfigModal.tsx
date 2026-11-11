import React, { useState } from 'react';
import { Check, CheckCircle2, Code2, Copy, ExternalLink, HelpCircle, Radio, RefreshCw, Server, X } from 'lucide-react';
import { BackendConfig } from '../../types/transit';

interface BackendConfigModalProps {
  config: BackendConfig;
  onSaveConfig: (newConfig: BackendConfig) => void;
  onClose: () => void;
}

export const BackendConfigModal: React.FC<BackendConfigModalProps> = ({
  config,
  onSaveConfig,
  onClose,
}) => {
  const [mode, setMode] = useState<'simulator' | 'custom_api'>(config.mode);
  const [customBusUrl, setCustomBusUrl] = useState(config.customBusUrl);
  const [customWeatherUrl, setCustomWeatherUrl] = useState(config.customWeatherUrl);
  const [headersJson, setHeadersJson] = useState(config.headersJson);
  const [activeTab, setActiveTab] = useState<'config' | 'lta_guide' | 'express_code'>('config');

  const [testStatus, setTestStatus] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
    payloadPreview?: string;
  }>({ loading: false });

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTestConnection = async () => {
    setTestStatus({ loading: true });
    try {
      let headers: Record<string, string> = { 'Accept': 'application/json' };
      if (headersJson.trim()) {
        try {
          headers = { ...headers, ...JSON.parse(headersJson) };
        } catch {
          throw new Error('Invalid JSON format in custom headers.');
        }
      }

      const res = await fetch(customBusUrl, { headers });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      const count = Array.isArray(data)
        ? data.length
        : data?.Services?.length || data?.data?.length || 0;

      setTestStatus({
        loading: false,
        success: true,
        message: `Connection successful! Detected ${count} bus services in response.`,
        payloadPreview: JSON.stringify(data, null, 2).slice(0, 400) + '...',
      });
    } catch (err: any) {
      setTestStatus({
        loading: false,
        success: false,
        message: `Connection failed: ${err.message || String(err)}`,
      });
    }
  };

  const handleSave = () => {
    onSaveConfig({
      mode,
      customBusUrl,
      customWeatherUrl,
      headersJson,
      autoRefreshInterval: 30,
    });
    onClose();
  };

  const sampleExpressCode = `// In server.ts or your Node backend:
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const LTA_API_KEY = process.env.LTA_API_KEY; // Get free key from LTA DataMall

// 1. Bus Arrival Endpoint for Stop 04121
app.get('/api/bus/04121', async (req, res) => {
  try {
    const response = await fetch(
      'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=04121',
      {
        headers: {
          AccountKey: LTA_API_KEY,
          accept: 'application/json',
        },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bus arrivals' });
  }
});

// 2. Weather Endpoint (Optional: or client calls Open-Meteo directly)
app.get('/api/weather', async (req, res) => {
  // Return weather JSON or proxy NEA/data.gov.sg
});

app.listen(3000, () => console.log('Server running on port 3000'));`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Backend Connection & API Setup
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Front-end is ready. Connect your custom backend or LTA DataMall proxy whenever ready.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 px-5 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 transition-colors border-b-2 ${
              activeTab === 'config'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Connection Settings
          </button>
          <button
            onClick={() => setActiveTab('express_code')}
            className={`py-3 transition-colors border-b-2 ${
              activeTab === 'express_code'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Express.js Sample Code
          </button>
          <button
            onClick={() => setActiveTab('lta_guide')}
            className={`py-3 transition-colors border-b-2 ${
              activeTab === 'lta_guide'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            LTA API Contract
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 max-h-[65vh] overflow-y-auto">
          {activeTab === 'config' && (
            <div className="space-y-4">
              {/* Mode Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  Operating Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setMode('simulator')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      mode === 'simulator'
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/80 ring-1 ring-emerald-500/20'
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">
                        Built-in Transit Simulator
                      </span>
                      {mode === 'simulator' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Realistic dynamic arrivals for stop 04121 (51, 61, 63, 80, 145, 166, etc.) with real second countdowns. No backend required!
                    </p>
                  </div>

                  <div
                    onClick={() => setMode('custom_api')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      mode === 'custom_api'
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/80 ring-1 ring-emerald-500/20'
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">
                        Custom Backend API
                      </span>
                      {mode === 'custom_api' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Connect to your own Express/FastAPI/Nest server or local proxy endpoint.
                    </p>
                  </div>
                </div>
              </div>

              {/* Custom API Fields */}
              {mode === 'custom_api' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Bus Arrival Endpoint URL (Stop 04121)
                    </label>
                    <input
                      type="text"
                      value={customBusUrl}
                      onChange={(e) => setCustomBusUrl(e.target.value)}
                      placeholder="/api/bus/04121 or http://localhost:3000/api/bus/04121"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Custom Weather Endpoint URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={customWeatherUrl}
                      onChange={(e) => setCustomWeatherUrl(e.target.value)}
                      placeholder="Leave blank to use Open-Meteo live Singapore feed"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Custom HTTP Headers (JSON format)
                    </label>
                    <textarea
                      value={headersJson}
                      onChange={(e) => setHeadersJson(e.target.value)}
                      placeholder='{ "Authorization": "Bearer ...", "AccountKey": "..." }'
                      rows={2}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Test Connection Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={testStatus.loading || !customBusUrl.trim()}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${testStatus.loading ? 'animate-spin' : ''}`} />
                      <span>Test Endpoint Ping</span>
                    </button>

                    {testStatus.message && (
                      <div
                        className={`mt-2.5 p-3 rounded-lg text-xs ${
                          testStatus.success
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        <div className="font-semibold">{testStatus.message}</div>
                        {testStatus.payloadPreview && (
                          <pre className="mt-1.5 p-2 bg-slate-900 text-emerald-400 rounded text-[10px] overflow-x-auto font-mono">
                            {testStatus.payloadPreview}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'express_code' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ready-to-use Express.js Backend Endpoint
                </span>
                <button
                  onClick={() => copyToClipboard(sampleExpressCode, 'express')}
                  className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {copiedCode === 'express' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'express' ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                {sampleExpressCode}
              </pre>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                This endpoint proxies Singapore LTA DataMall's <code>BusArrivalv2</code> API so you don't expose your AccountKey to client browsers.
              </p>
            </div>
          )}

          {activeTab === 'lta_guide' && (
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Singapore LTA DataMall Standard JSON Format
              </h4>
              <p>
                The front-end automatically parses the official LTA DataMall schema:
              </p>
              <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto">
{`{
  "BusStopCode": "04121",
  "Services": [
    {
      "ServiceNo": "51",
      "Operator": "SBST",
      "NextBus": {
        "OriginCode": "55009",
        "DestinationCode": "28009",
        "EstimatedArrival": "2026-11-11T04:15:00+08:00",
        "Latitude": "1.2905",
        "Longitude": "103.8504",
        "VisitNumber": "1",
        "Load": "SEA",    // SEA = Seats Avail, SDA = Standing, LSD = Limited Standing
        "Feature": "WAB", // WAB = Wheelchair Accessible Bus
        "Type": "DD"      // SD = Single Deck, DD = Double Deck, BD = Bendy
      },
      "NextBus2": { ... },
      "NextBus3": { ... }
    }
  ]
}`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-400">
            Current mode: <strong className="text-slate-700 dark:text-slate-200">{mode === 'simulator' ? 'Simulator (Active)' : 'Custom Backend'}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
