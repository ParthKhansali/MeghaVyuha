// MEGHAVYUHA Mock Data — Forecast Grid
// Generates deterministic rainfall spatial fields using mathematical patterns.
// These simulate what a real NWP/ML output would look like at grid scale.

import type { GridCell, ForecastModel, ViewMode } from "@/types/forecast";

// India bounding box: ~68°E-97°E, ~8°N-37°N
const INDIA_BOUNDS = { minLon: 68, maxLon: 98, minLat: 8, maxLat: 37 };
const GRID_RES = 0.5; // degrees

// Seeded pseudo-random for reproducibility
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return ((s >>> 0) / 0xffffffff);
  };
}

// Rainfall source regions (lon, lat, intensity, radius) — simulate monsoon patterns
const MONSOON_SOURCES = [
  // Western Ghats / Kerala heavy
  { lon: 75.5, lat: 10.5, intensity: 220, radius: 4.5, id: "wghats" },
  // NE India / Assam heavy
  { lon: 92.0, lat: 26.5, intensity: 185, radius: 5.0, id: "northeast" },
  // Uttarakhand / Western Himalaya
  { lon: 78.5, lat: 30.5, intensity: 120, radius: 3.5, id: "uttarakhand" },
  // Mumbai coast
  { lon: 72.8, lat: 18.9, intensity: 140, radius: 3.0, id: "mumbai" },
  // Bihar / IGP trough
  { lon: 85.5, lat: 25.8, intensity: 95, radius: 6.0, id: "igp" },
  // Odisha coast
  { lon: 84.5, lat: 20.5, intensity: 90, radius: 4.0, id: "odisha" },
  // Central India moderate
  { lon: 79.0, lat: 22.0, intensity: 70, radius: 5.0, id: "central" },
  // Rajasthan dry
  { lon: 72.5, lat: 27.0, intensity: 8, radius: 4.0, id: "rajasthan" },
];

function gaussianKernel(lon: number, lat: number, cx: number, cy: number, radius: number): number {
  const dx = lon - cx;
  const dy = lat - cy;
  const d2 = dx * dx + dy * dy;
  return Math.exp(-d2 / (2 * radius * radius));
}

// Model perturbation multipliers — each model adjusts the field differently
const MODEL_PARAMS: Record<ForecastModel, { scale: number; spread: number; bias: number }> = {
  raw: { scale: 1.0, spread: 0.0, bias: 0.0 },
  qm: { scale: 0.92, spread: 0.05, bias: -2.0 },
  emos: { scale: 0.88, spread: 0.08, bias: -3.5 },
  "ml-emos": { scale: 0.85, spread: 0.12, bias: -4.0 },
  adaptive: { scale: 0.83, spread: 0.10, bias: -5.0 },
};

// Lead-time decay factor — longer lead = less intense
function leadTimeFactor(leadDay: number): number {
  return Math.max(0.4, 1.0 - (leadDay - 1) * 0.06);
}

export function generateRainfallGrid(
  model: ForecastModel,
  leadDay: number,
  _viewMode: "amount"
): GridCell[] {
  const params = MODEL_PARAMS[model];
  const ltf = leadTimeFactor(leadDay);
  const rng = seededRandom(leadDay * 7919 + model.length * 31);
  const cells: GridCell[] = [];

  for (let lon = INDIA_BOUNDS.minLon; lon <= INDIA_BOUNDS.maxLon; lon += GRID_RES) {
    for (let lat = INDIA_BOUNDS.minLat; lat <= INDIA_BOUNDS.maxLat; lat += GRID_RES) {
      let base = 0;
      for (const src of MONSOON_SOURCES) {
        const k = gaussianKernel(lon, lat, src.lon, src.lat, src.radius);
        // Each model perturbs the source differently
        const srcMod = 1.0 + params.spread * (rng() - 0.5) * 2;
        base += src.intensity * k * srcMod;
      }

      // Apply model scaling and lead-time decay
      let value = base * params.scale * ltf + params.bias;
      // Small spatial noise (seeded) for realism
      value += (rng() - 0.5) * 4 * params.spread;
      value = Math.max(0, value);

      if (value > 0.5) {
        cells.push({ lon: lon + GRID_RES / 2, lat: lat + GRID_RES / 2, value });
      }
    }
  }
  return cells;
}

export function generateProbabilityGrid(
  model: ForecastModel,
  leadDay: number,
  threshold: number // mm
): GridCell[] {
  const rainfallGrid = generateRainfallGrid(model, leadDay, "amount");
  const ltf = leadTimeFactor(leadDay);

  return rainfallGrid.map((cell) => {
    // Logistic transform from rainfall amount to exceedance probability
    const mu = cell.value;
    const sigma = Math.max(10, mu * 0.35) * (1 + (leadDay - 1) * 0.08); // spread increases with lead
    const z = (threshold - mu) / sigma;
    const prob = 1 / (1 + Math.exp(z * 1.4)) * ltf;
    return { ...cell, value: Math.min(1, Math.max(0, prob)) };
  });
}

export function generateUncertaintyGrid(
  model: ForecastModel,
  leadDay: number
): GridCell[] {
  const rainfallGrid = generateRainfallGrid(model, leadDay, "amount");
  const params = MODEL_PARAMS[model];

  return rainfallGrid.map((cell) => {
    // Uncertainty is higher where rainfall is higher and at longer lead times
    const baseUncertainty = (cell.value / 300) * 0.6 + 0.1;
    const leadFactor = Math.min(1, (leadDay - 1) * 0.1 + 0.2);
    const modelFactor = 1.0 - params.scale * 0.3; // corrected models have less uncertainty
    const value = Math.min(1, baseUncertainty + leadFactor * modelFactor);
    return { ...cell, value };
  });
}

export function generateDifferenceGrid(
  modelA: ForecastModel,
  modelB: ForecastModel,
  leadDay: number
): GridCell[] {
  const gridA = generateRainfallGrid(modelA, leadDay, "amount");
  const gridB = generateRainfallGrid(modelB, leadDay, "amount");
  const bMap = new Map(gridB.map((c) => [`${c.lon.toFixed(2)},${c.lat.toFixed(2)}`, c.value]));

  return gridA.map((cell) => {
    const key = `${cell.lon.toFixed(2)},${cell.lat.toFixed(2)}`;
    const bVal = bMap.get(key) ?? 0;
    return { ...cell, value: cell.value - bVal };
  });
}

// Rainfall color scale — standard meteorological precipitation palette
export function rainfallColor(mm: number): [number, number, number, number] {
  if (mm <= 0) return [0, 0, 0, 0];
  if (mm < 1) return [180, 220, 255, 60];
  if (mm < 5) return [100, 180, 255, 100];
  if (mm < 10) return [50, 140, 255, 140];
  if (mm < 25) return [0, 200, 100, 160];
  if (mm < 50) return [50, 220, 50, 180];
  if (mm < 100) return [255, 220, 0, 190];
  if (mm < 150) return [255, 140, 0, 200];
  if (mm < 200) return [255, 60, 0, 210];
  if (mm < 300) return [200, 0, 60, 220];
  return [140, 0, 180, 240];
}

export function probabilityColor(p: number): [number, number, number, number] {
  if (p <= 0.02) return [0, 0, 0, 0];
  if (p < 0.1) return [200, 230, 255, 80];
  if (p < 0.2) return [100, 180, 255, 110];
  if (p < 0.35) return [50, 140, 255, 140];
  if (p < 0.5) return [0, 200, 120, 160];
  if (p < 0.65) return [100, 220, 0, 180];
  if (p < 0.8) return [255, 200, 0, 195];
  if (p < 0.9) return [255, 120, 0, 210];
  return [255, 30, 30, 230];
}

export function uncertaintyColor(u: number): [number, number, number, number] {
  if (u < 0.15) return [30, 180, 80, 100];   // LOW — green
  if (u < 0.45) return [255, 180, 0, 140];   // MODERATE — amber
  if (u < 0.7) return [255, 80, 20, 175];    // HIGH — orange-red
  return [200, 0, 120, 200];                  // VERY HIGH — magenta
}

export function differenceColor(diff: number): [number, number, number, number] {
  if (Math.abs(diff) < 2) return [180, 180, 180, 40];
  if (diff < -50) return [0, 60, 200, 220];
  if (diff < -20) return [20, 120, 255, 185];
  if (diff < -5) return [80, 180, 255, 150];
  if (diff < 0) return [150, 210, 255, 110];
  if (diff < 5) return [255, 200, 150, 110];
  if (diff < 20) return [255, 130, 50, 160];
  if (diff < 50) return [255, 50, 50, 195];
  return [180, 0, 0, 220];
}
