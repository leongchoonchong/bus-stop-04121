import type { Request, Response } from 'express';

const DATA_GOV_2HR_FORECAST_URL = 'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast';

export default async function handler(req: Request | any, res: Response | any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

  try {
    const upstreamRes = await fetch(DATA_GOV_2HR_FORECAST_URL, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SGBus04121-Weather/1.0',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json({
        code: upstreamRes.status,
        errorMsg: `Upstream data.gov.sg error: HTTP ${upstreamRes.status}`,
        source: DATA_GOV_2HR_FORECAST_URL,
      });
    }

    const payload = await upstreamRes.json();
    const items = payload?.data?.items || [];
    const latestItem = items[0] || null;

    // Find localized forecast for the "City" area (Stop 04121 Opp The Treasury)
    const cityForecast = latestItem?.forecasts?.find(
      (f: { area: string; forecast: string }) => f.area.toLowerCase() === 'city'
    );

    return res.status(200).json({
      code: 0,
      source: DATA_GOV_2HR_FORECAST_URL,
      retrievedAt: new Date().toISOString(),
      stop04121Context: {
        area: 'City',
        forecast: cityForecast?.forecast || 'Fair (Day)',
        validPeriod: latestItem?.valid_period || null,
        updateTimestamp: latestItem?.update_timestamp || null,
      },
      raw: payload,
    });
  } catch (error: any) {
    console.error('Error fetching two-hr-forecast:', error);
    return res.status(502).json({
      code: 502,
      errorMsg: error.message || 'Failed to fetch live 2-hour forecast from data.gov.sg',
      source: DATA_GOV_2HR_FORECAST_URL,
    });
  }
}
