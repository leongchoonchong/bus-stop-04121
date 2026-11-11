import type { Request, Response } from 'express';

export default async function handler(req: Request | any, res: Response | any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  const startTime = Date.now();
  let dataGovStatus = 'unknown';

  try {
    const probe = await fetch('https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast', {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    dataGovStatus = probe.ok ? 'connected' : `http_${probe.status}`;
  } catch (err: any) {
    dataGovStatus = `error: ${err.message || 'timeout'}`;
  }

  const responsePayload = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? Math.floor(process.uptime()) : undefined,
    latencyMs: Date.now() - startTime,
    service: 'sg-bus-04121-weather-serverless',
    dataGovEndpoints: {
      status: dataGovStatus,
      twoHrForecast: 'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast',
      airTemperature: 'https://api-open.data.gov.sg/v2/real-time/api/air-temperature',
      rainfall: 'https://api-open.data.gov.sg/v2/real-time/api/rainfall',
    },
    targetStop: {
      busStopCode: '04121',
      description: 'Opp The Treasury',
      roadName: 'North Bridge Rd',
      sector: 'City',
      coordinates: { latitude: 1.2902, longitude: 103.8502 },
    },
  };

  return res.status(200).json(responsePayload);
}
