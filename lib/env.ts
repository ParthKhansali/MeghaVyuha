/**
 * MEGHAVYUHA — Environment & Configuration
 *
 * MEGHAVYUHA runs fully key-free by default for all demonstration, replay,
 * and statistical validation workflows.
 *
 * Smart India Hackathon 2026 | PS 26080 | Against The Odds (Team 149284)
 */

export const env = {
  // Optional basemap style override (defaults to Carto / OpenFreeMap dark tile endpoints)
  basemapStyle: process.env.NEXT_PUBLIC_BASEMAP_STYLE?.trim() || "",
  
  // Custom MapLibre / Mapbox token if a custom vector tileset is configured
  mapToken: process.env.NEXT_PUBLIC_MAP_TOKEN?.trim() || "",
  
  // Optional data archive URL or local proxy endpoint for future live integrations
  forecastApiUrl: process.env.NEXT_PUBLIC_FORECAST_API_URL?.trim() || "",
  
  // Custom user agent for upstream academic metadata queries
  userAgent:
    process.env.MEGHAVYUHA_USER_AGENT?.trim() ||
    "MEGHAVYUHA/1.0 (+https://github.com/ParthKhansali/MeghaVyuha) SIH2026-PS26080",
} as const;

export const features = {
  customBasemap: env.basemapStyle.length > 0,
  remoteForecastApi: env.forecastApiUrl.length > 0,
} as const;

export type FeatureName = keyof typeof features;
