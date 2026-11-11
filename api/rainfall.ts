import type { Request, Response } from 'express';

const DATA_GOV_RAINFALL_URL = 'https://api-open.data.gov.sg/v2/real-time/api/rainfall';
const TARGET_04121 = { lat: 1.2902, lon: 103.8502 }; // Opp The Treasury, North Bridge Rd

export default async function handler(req: Request | any, res: Response | any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

  try {
    const upstreamRes = await fetch(DATA_GOV_RAINFALL_URL, {
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
        source: DATA_GOV_RAINFALL_URL,
      });
    }

    const payload = await upstreamRes.json();
    const stations = payload?.data?.stations || [];
    const readings = payload?.data?.readings || [];
    const latestReading = readings[0] || null;
    const readingData: Array<{ stationId: string; value: number }> = latestReading?.data || [];

    // Map stations with distances to Stop 04121
    const stationsWithDistance = stations.map((st: any) => {
      const loc = st.location || {};
      const dist = Math.hypot((loc.latitude || 0) - TARGET_04121.lat, (loc.longitude || 0) - TARGET_04121.lon);
      const valObj = readingData.find(r => r.stationId === st.id);
      return {
        id: st.id,
        name: st.name,
        location: st.location,
        distanceDegrees: dist,
        rainfallMm: valObj ? valObj.value : null,
      };
    }).sort((a: any, b: any) => a.distanceDegrees - b.distanceDegrees);

    const nearestStation = stationsWithDistance.find((s: any) => s.rainfallMm !== null) || stationsWithDistance[0] || null;

    return res.status(200).json({
      code: 0,
      source: DATA_GOV_RAINFALL_URL,
      retrievedAt: new Date().toISOString(),
      stop04121Context: {
        nearestStation: nearestStation
          ? {
              id: nearestStation.id,
              name: nearestStation.name,
              rainfallMm: nearestStation.rainfallMm ?? 0,
            }
          : null,
        timestamp: latestReading?.timestamp || null,
      },
      raw: payload,
    });
  } catch (error: any) {
    console.error('Error fetching rainfall:', error);
    return res.status(502).json({
      code: 502,
      errorMsg: error.message || 'Failed to fetch live rainfall from data.gov.sg',
      source: DATA_GOV_RAINFALL_URL,
    });
  }
}
