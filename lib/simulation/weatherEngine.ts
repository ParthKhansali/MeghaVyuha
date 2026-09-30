// MEGHAVYUHA — Deterministic Weather Evolution Simulation Engine
// Generates synthetic but physically plausible rainfall field evolution.
// All outputs are DEMO DATA — not operational forecast products.

import type { ForecastModel, ViewMode, DemoScenarioId } from "@/types/forecast";

// ── Geographic bounds for the simulation domain ───────────────────────────────
export const SIM_BOUNDS = { west: 62, south: 4, east: 102, north: 40 } as const;
export const BITMAP_W = 300;
export const BITMAP_H = 216; // aspect ≈ (102-62)/(40-4) = 1.11 → scaled up

// ── Types ─────────────────────────────────────────────────────────────────────
export interface WeatherSystem {
  id: string;
  lon0: number;    // initial center longitude (°E)
  lat0: number;    // initial center latitude (°N)
  uVel: number;    // eastward velocity (°/day)
  vVel: number;    // northward velocity (°/day)
  sigLon: number;  // longitudinal std-dev of Gaussian kernel (°)
  sigLat: number;  // latitudinal std-dev of Gaussian kernel (°)
  peak: number;    // peak rainfall rate at centre (mm/day)
  fHour: number;   // formation hour (0 = sim start)
  pHour: number;   // peak-intensity hour
  dHour: number;   // dissipation hour
  // Model-specific multiplicative bias relative to base
  modelBias: Partial<Record<ForecastModel, number>>;
}

// ── Seeded PRNG (LCG) ─────────────────────────────────────────────────────────
function makePrng(seed: number) {
  let s = (seed ^ 0x5a5a5a5a) >>> 0;
  return function () {
    s = Math.imul(s, 1664525) + 1013904223;
    s >>>= 0;
    return s / 0x100000000;
  };
}

// ── Lifecycle function (smooth trapezoidal ramp) ──────────────────────────────
function lifecycle(h: number, f: number, p: number, d: number): number {
  if (h <= f || h >= d) return 0;
  const ramp = Math.min(1, (h - f) / Math.max(1, 0.5 * (p - f)));
  const decay = Math.min(1, (d - h) / Math.max(1, 0.5 * (d - p)));
  return Math.min(ramp, decay);
}

// ── Single-system rainfall contribution at a point ────────────────────────────
function systemRain(
  lon: number, lat: number,
  hour: number, sys: WeatherSystem,
  model: ForecastModel
): number {
  const days = hour / 24;
  const cLon = sys.lon0 + sys.uVel * days;
  const cLat = sys.lat0 + sys.vVel * days;
  const lc = lifecycle(hour, sys.fHour, sys.pHour, sys.dHour);
  if (lc <= 0) return 0;
  const dL = (lon - cLon) / sys.sigLon;
  const dA = (lat - cLat) / sys.sigLat;
  const g = Math.exp(-0.5 * (dL * dL + dA * dA));
  const bias = sys.modelBias[model] ?? 1.0;
  return sys.peak * lc * g * bias;
}

// ── Total rainfall at a point (all systems) ───────────────────────────────────
export function getPointRainfall(
  lon: number, lat: number,
  hour: number, systems: WeatherSystem[],
  model: ForecastModel
): number {
  let total = 0;
  for (const s of systems) total += systemRain(lon, lat, hour, s, model);
  return total;
}

// ── Ensemble: N perturbed members ─────────────────────────────────────────────
const N_MEMBERS = 15;

function getEnsembleMembers(
  lon: number, lat: number,
  hour: number, systems: WeatherSystem[]
): number[] {
  const results: number[] = new Array(N_MEMBERS);
  const leadDays = hour / 24;
  for (let m = 0; m < N_MEMBERS; m++) {
    const rng = makePrng(m * 13337 + Math.round(lon * 100) + Math.round(lat * 100));
    const spread = Math.min(1, leadDays / 10) * 0.35; // grows with lead time
    let rain = 0;
    for (const s of systems) {
      const pertSys: WeatherSystem = {
        ...s,
        lon0: s.lon0 + (rng() - 0.5) * 2.0 * spread * (s.sigLon * 1.2),
        lat0: s.lat0 + (rng() - 0.5) * 2.0 * spread * (s.sigLat * 1.2),
        peak: s.peak * (0.80 + rng() * 0.40 * (1 + spread)),
        pHour: s.pHour * (0.85 + rng() * 0.30),
      };
      rain += systemRain(lon, lat, hour, pertSys, "adaptive");
    }
    results[m] = Math.max(0, rain);
  }
  return results;
}

// ── Exceedance probability (from ensemble) ─────────────────────────────────────
export function getExceedanceProb(
  lon: number, lat: number,
  hour: number, systems: WeatherSystem[],
  thresholdMm: number
): number {
  const members = getEnsembleMembers(lon, lat, hour, systems);
  return members.filter((v) => v > thresholdMm).length / N_MEMBERS;
}

// ── Ensemble spread (uncertainty) ─────────────────────────────────────────────
export function getEnsembleSpread(
  lon: number, lat: number,
  hour: number, systems: WeatherSystem[]
): number {
  const members = getEnsembleMembers(lon, lat, hour, systems);
  const mean = members.reduce((a, b) => a + b, 0) / N_MEMBERS;
  const variance = members.reduce((a, b) => a + (b - mean) ** 2, 0) / N_MEMBERS;
  return Math.sqrt(variance);
}

// ── District-level point forecast ─────────────────────────────────────────────
export function getDistrictForecast(
  lon: number, lat: number,
  hour: number, systems: WeatherSystem[]
): {
  adaptive: number; raw: number; emos: number; qm: number; "ml-emos": number;
  probHeavy: number; probVeryHeavy: number; probExtreme: number;
  spread: number;
} {
  const models: ForecastModel[] = ["adaptive", "raw", "emos", "qm", "ml-emos"];
  const rainfall = Object.fromEntries(
    models.map((m) => [m, Math.max(0, getPointRainfall(lon, lat, hour, systems, m))])
  ) as Record<ForecastModel, number>;

  return {
    ...rainfall,
    probHeavy: Math.round(getExceedanceProb(lon, lat, hour, systems, 64.5) * 100),
    probVeryHeavy: Math.round(getExceedanceProb(lon, lat, hour, systems, 115.6) * 100),
    probExtreme: Math.round(getExceedanceProb(lon, lat, hour, systems, 204.5) * 100),
    spread: getEnsembleSpread(lon, lat, hour, systems),
  };
}

// ── Bitmap generation ─────────────────────────────────────────────────────────
// Returns a flat RGBA Uint8ClampedArray (BITMAP_W × BITMAP_H × 4)
// for use with deck.gl BitmapLayer / ImageData.

export function generateBitmap(
  systems: WeatherSystem[],
  hour: number,
  model: ForecastModel,
  viewMode: ViewMode,
  thresholdMm = 64.5,
  baselineModel: ForecastModel = "raw"
): Uint8ClampedArray {
  const data = new Uint8ClampedArray(BITMAP_W * BITMAP_H * 4);
  const { west, east, south, north } = SIM_BOUNDS;
  const dLon = east - west;
  const dLat = north - south;

  for (let py = 0; py < BITMAP_H; py++) {
    for (let px = 0; px < BITMAP_W; px++) {
      const lon = west + (px / (BITMAP_W - 1)) * dLon;
      const lat = north - (py / (BITMAP_H - 1)) * dLat;

      let r = 0, g = 0, b = 0, a = 0;

      if (viewMode === "amount") {
        const mm = getPointRainfall(lon, lat, hour, systems, model);
        [r, g, b, a] = rainfallToRGBA(mm);
      } else if (viewMode === "probability") {
        const prob = getExceedanceProb(lon, lat, hour, systems, thresholdMm);
        [r, g, b, a] = probabilityToRGBA(prob);
      } else if (viewMode === "uncertainty") {
        const spread = getEnsembleSpread(lon, lat, hour, systems);
        [r, g, b, a] = uncertaintyToRGBA(spread);
      } else if (viewMode === "difference") {
        const v1 = getPointRainfall(lon, lat, hour, systems, model);
        const v2 = getPointRainfall(lon, lat, hour, systems, baselineModel);
        [r, g, b, a] = differenceToRGBA(v1 - v2);
      }

      // Edge fade to prevent hard rectangular boundary
      const edgePx = Math.min(px, BITMAP_W - 1 - px);
      const edgePy = Math.min(py, BITMAP_H - 1 - py);
      const fadeMargin = 18;
      const fade = Math.min(1, edgePx / fadeMargin) * Math.min(1, edgePy / fadeMargin);

      const idx = (py * BITMAP_W + px) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = Math.round(a * fade);
    }
  }

  return data;
}

// ── Bitmap → HTMLImageElement (for BitmapLayer) ───────────────────────────────
export function bitmapToDataURL(rgba: Uint8ClampedArray): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = BITMAP_W;
  canvas.height = BITMAP_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const imgData = ctx.createImageData(BITMAP_W, BITMAP_H);
  imgData.data.set(rgba);
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL("image/png");
}

// ── Color scales ──────────────────────────────────────────────────────────────

// IMD-inspired rainfall color scale (mm/day)
export function rainfallToRGBA(mm: number): [number, number, number, number] {
  if (mm < 0.5) return [0, 0, 0, 0];

  // Stops: [mm, r, g, b, alpha]
  const stops: [number, number, number, number, number][] = [
    [0.5,   100, 180, 255,  60],
    [2,     30,  130, 240,  80],
    [10,    0,   90,  200, 100],
    [25,    0,   200, 130, 120],
    [50,    50,  220,  20, 140],
    [100,   255, 230,   0, 160],
    [150,   255, 140,   0, 175],
    [200,   255,  50,   0, 185],
    [300,   220,   0, 180, 200],
  ];

  if (mm >= stops[stops.length - 1][0]) {
    const s = stops[stops.length - 1];
    return [s[1], s[2], s[3], s[4]];
  }

  for (let i = 1; i < stops.length; i++) {
    if (mm <= stops[i][0]) {
      const [mm0, r0, g0, b0, a0] = stops[i - 1];
      const [mm1, r1, g1, b1, a1] = stops[i];
      const t = (mm - mm0) / (mm1 - mm0);
      return [
        Math.round(r0 + t * (r1 - r0)),
        Math.round(g0 + t * (g1 - g0)),
        Math.round(b0 + t * (b1 - b0)),
        Math.round(a0 + t * (a1 - a0)),
      ];
    }
  }
  return [0, 0, 0, 0];
}

export function probabilityToRGBA(p: number): [number, number, number, number] {
  if (p < 0.02) return [0, 0, 0, 0];
  const stops: [number, number, number, number, number][] = [
    [0.02, 100, 180, 255,  50],
    [0.1,  30,  130, 240,  80],
    [0.2,  0,   200, 130, 100],
    [0.3,  50,  220,  20, 120],
    [0.5,  255, 230,   0, 145],
    [0.7,  255, 140,   0, 165],
    [0.85, 255,  50,   0, 180],
    [1.0,  220,   0, 180, 200],
  ];
  if (p >= 1.0) {
    const s = stops[stops.length - 1];
    return [s[1], s[2], s[3], s[4]];
  }
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i][0]) {
      const [p0, r0, g0, b0, a0] = stops[i - 1];
      const [p1, r1, g1, b1, a1] = stops[i];
      const t = (p - p0) / (p1 - p0);
      return [
        Math.round(r0 + t * (r1 - r0)),
        Math.round(g0 + t * (g1 - g0)),
        Math.round(b0 + t * (b1 - b0)),
        Math.round(a0 + t * (a1 - a0)),
      ];
    }
  }
  return [0, 0, 0, 0];
}

export function uncertaintyToRGBA(spread: number): [number, number, number, number] {
  if (spread < 1) return [0, 0, 0, 0];
  const stops: [number, number, number, number, number][] = [
    [1,   80,  90, 120, 40],
    [10,  90, 100, 180, 80],
    [30,  120,  60, 200, 110],
    [60,  180,  30, 200, 130],
    [100, 220,  20, 120, 150],
    [200, 255, 200,   0, 170],
  ];
  const maxSpread = 200;
  const s = Math.min(spread, maxSpread);
  for (let i = 1; i < stops.length; i++) {
    if (s <= stops[i][0]) {
      const [s0, r0, g0, b0, a0] = stops[i - 1];
      const [s1, r1, g1, b1, a1] = stops[i];
      const t = (s - s0) / (s1 - s0);
      return [
        Math.round(r0 + t * (r1 - r0)),
        Math.round(g0 + t * (g1 - g0)),
        Math.round(b0 + t * (b1 - b0)),
        Math.round(a0 + t * (a1 - a0)),
      ];
    }
  }
  const ls = stops[stops.length - 1];
  return [ls[1], ls[2], ls[3], ls[4]];
}

export function differenceToRGBA(diff: number): [number, number, number, number] {
  const absDiff = Math.abs(diff);
  if (absDiff < 1) return [120, 120, 130, 0];
  const intensity = Math.min(1, absDiff / 80);
  if (diff > 0) {
    // Positive: blue (model > baseline)
    return [
      Math.round(20 + intensity * 30),
      Math.round(80 + intensity * 100),
      Math.round(200 + intensity * 55),
      Math.round(100 + intensity * 80),
    ];
  } else {
    // Negative: orange-red (model < baseline = correction reduced rainfall)
    return [
      Math.round(200 + intensity * 55),
      Math.round(100 - intensity * 80),
      Math.round(20 - intensity * 10),
      Math.round(100 + intensity * 80),
    ];
  }
}

// Backwards-compatible color functions (used elsewhere)
export function rainfallColor(mm: number): [number, number, number, number] {
  return rainfallToRGBA(mm);
}
export function probabilityColor(p: number): [number, number, number, number] {
  return probabilityToRGBA(p);
}
export function uncertaintyColor(s: number): [number, number, number, number] {
  return uncertaintyToRGBA(s);
}
export function differenceColor(d: number): [number, number, number, number] {
  return differenceToRGBA(d);
}

// ── Scenario definitions ──────────────────────────────────────────────────────
// Each scenario is a list of weather systems that produce a coherent evolving field.

const SCENARIO_SYSTEMS: Record<string, WeatherSystem[]> = {
  "dehradun-heavy-rain": [
    {
      id: "deh-main", lon0: 78.0, lat0: 30.5, uVel: -0.6, vVel: 0.2,
      sigLon: 3.0, sigLat: 2.5, peak: 200,
      fHour: 0, pHour: 30, dHour: 96,
      modelBias: { raw: 1.20, emos: 0.86, qm: 0.92, "ml-emos": 0.84, adaptive: 0.86 },
    },
    {
      id: "deh-secondary", lon0: 76.8, lat0: 31.0, uVel: -0.4, vVel: 0.3,
      sigLon: 2.0, sigLat: 1.8, peak: 120,
      fHour: 6, pHour: 42, dHour: 84,
      modelBias: { raw: 1.15, emos: 0.89, qm: 0.93, "ml-emos": 0.87, adaptive: 0.88 },
    },
    {
      id: "deh-bg-gangetic", lon0: 78.5, lat0: 27.0, uVel: 0.8, vVel: 0.3,
      sigLon: 9.0, sigLat: 5.5, peak: 40,
      fHour: 0, pHour: 60, dHour: 220,
      modelBias: { raw: 1.10, emos: 0.93, qm: 0.96, "ml-emos": 0.91, adaptive: 0.93 },
    },
    {
      id: "deh-ne-flow", lon0: 88.0, lat0: 24.0, uVel: -1.2, vVel: 0.5,
      sigLon: 4.0, sigLat: 3.0, peak: 75,
      fHour: 24, pHour: 72, dHour: 150,
      modelBias: { raw: 1.12, emos: 0.91, qm: 0.94, "ml-emos": 0.89, adaptive: 0.91 },
    },
  ],

  "mumbai-coastal": [
    {
      id: "mum-main", lon0: 72.2, lat0: 18.0, uVel: 1.2, vVel: 0.4,
      sigLon: 2.2, sigLat: 3.5, peak: 240,
      fHour: 0, pHour: 18, dHour: 60,
      modelBias: { raw: 1.22, emos: 0.85, qm: 0.90, "ml-emos": 0.82, adaptive: 0.84 },
    },
    {
      id: "mum-konkan", lon0: 73.5, lat0: 16.5, uVel: 0.6, vVel: 0.8,
      sigLon: 1.8, sigLat: 4.0, peak: 160,
      fHour: 0, pHour: 24, dHour: 72,
      modelBias: { raw: 1.18, emos: 0.88, qm: 0.92, "ml-emos": 0.85, adaptive: 0.87 },
    },
    {
      id: "mum-bg-arabian", lon0: 70.0, lat0: 18.0, uVel: 1.5, vVel: 0.2,
      sigLon: 6.0, sigLat: 4.0, peak: 30,
      fHour: 0, pHour: 48, dHour: 200,
      modelBias: { raw: 1.08, emos: 0.95, qm: 0.97, "ml-emos": 0.93, adaptive: 0.94 },
    },
    {
      id: "mum-trough", lon0: 75.0, lat0: 20.0, uVel: 0.5, vVel: 0.3,
      sigLon: 7.0, sigLat: 3.0, peak: 55,
      fHour: 12, pHour: 60, dHour: 130,
      modelBias: { raw: 1.12, emos: 0.91, qm: 0.94, "ml-emos": 0.89, adaptive: 0.91 },
    },
  ],

  "northeast-rainfall": [
    {
      id: "ne-main", lon0: 92.0, lat0: 26.0, uVel: -0.8, vVel: 0.2,
      sigLon: 4.5, sigLat: 3.5, peak: 180,
      fHour: 0, pHour: 24, dHour: 96,
      modelBias: { raw: 1.18, emos: 0.88, qm: 0.92, "ml-emos": 0.85, adaptive: 0.87 },
    },
    {
      id: "ne-assam", lon0: 93.5, lat0: 26.5, uVel: -1.0, vVel: -0.1,
      sigLon: 3.0, sigLat: 2.0, peak: 130,
      fHour: 0, pHour: 30, dHour: 80,
      modelBias: { raw: 1.14, emos: 0.90, qm: 0.93, "ml-emos": 0.87, adaptive: 0.89 },
    },
    {
      id: "ne-bg", lon0: 90.0, lat0: 24.0, uVel: -0.5, vVel: 0.4,
      sigLon: 8.0, sigLat: 5.0, peak: 50,
      fHour: 0, pHour: 72, dHour: 220,
      modelBias: { raw: 1.09, emos: 0.94, qm: 0.96, "ml-emos": 0.92, adaptive: 0.93 },
    },
  ],

  "northwest-dry": [
    {
      id: "nw-bg", lon0: 74.0, lat0: 25.0, uVel: 0.3, vVel: 0.2,
      sigLon: 12.0, sigLat: 8.0, peak: 12,
      fHour: 0, pHour: 120, dHour: 240,
      modelBias: { raw: 0.95, emos: 1.02, qm: 1.01, "ml-emos": 1.03, adaptive: 1.01 },
    },
    {
      id: "nw-isolated", lon0: 71.0, lat0: 27.0, uVel: 0.8, vVel: 0.1,
      sigLon: 2.0, sigLat: 2.0, peak: 25,
      fHour: 48, pHour: 72, dHour: 110,
      modelBias: { raw: 1.05, emos: 0.97, qm: 0.98, "ml-emos": 0.96, adaptive: 0.97 },
    },
  ],

  "central-monsoon": [
    {
      id: "central-trough", lon0: 78.0, lat0: 22.0, uVel: 0.4, vVel: 0.2,
      sigLon: 9.0, sigLat: 4.0, peak: 100,
      fHour: 0, pHour: 36, dHour: 120,
      modelBias: { raw: 1.14, emos: 0.89, qm: 0.93, "ml-emos": 0.87, adaptive: 0.89 },
    },
    {
      id: "central-western", lon0: 74.0, lat0: 21.0, uVel: 0.6, vVel: 0.3,
      sigLon: 5.0, sigLat: 3.0, peak: 70,
      fHour: 0, pHour: 48, dHour: 140,
      modelBias: { raw: 1.12, emos: 0.91, qm: 0.94, "ml-emos": 0.89, adaptive: 0.91 },
    },
    {
      id: "central-cg", lon0: 82.0, lat0: 21.5, uVel: -0.3, vVel: 0.3,
      sigLon: 4.0, sigLat: 3.0, peak: 85,
      fHour: 12, pHour: 60, dHour: 130,
      modelBias: { raw: 1.16, emos: 0.88, qm: 0.93, "ml-emos": 0.86, adaptive: 0.88 },
    },
    {
      id: "central-bg", lon0: 79.0, lat0: 24.0, uVel: 0.5, vVel: 0.1,
      sigLon: 14.0, sigLat: 7.0, peak: 30,
      fHour: 0, pHour: 96, dHour: 240,
      modelBias: { raw: 1.08, emos: 0.94, qm: 0.96, "ml-emos": 0.92, adaptive: 0.94 },
    },
  ],

  "india-overview": [
    // Broad overview with representative systems all across India
    {
      id: "ov-himalayan", lon0: 78.0, lat0: 30.0, uVel: -0.5, vVel: 0.2,
      sigLon: 4.0, sigLat: 3.0, peak: 90,
      fHour: 0, pHour: 24, dHour: 96,
      modelBias: { raw: 1.18, emos: 0.88, qm: 0.93, "ml-emos": 0.85, adaptive: 0.87 },
    },
    {
      id: "ov-western-ghats", lon0: 75.5, lat0: 14.0, uVel: 0.4, vVel: 0.5,
      sigLon: 1.5, sigLat: 5.0, peak: 130,
      fHour: 0, pHour: 36, dHour: 120,
      modelBias: { raw: 1.15, emos: 0.89, qm: 0.92, "ml-emos": 0.86, adaptive: 0.88 },
    },
    {
      id: "ov-ne", lon0: 92.0, lat0: 26.0, uVel: -0.8, vVel: 0.2,
      sigLon: 4.0, sigLat: 3.0, peak: 120,
      fHour: 0, pHour: 30, dHour: 96,
      modelBias: { raw: 1.16, emos: 0.89, qm: 0.93, "ml-emos": 0.86, adaptive: 0.88 },
    },
    {
      id: "ov-central", lon0: 79.0, lat0: 21.0, uVel: 0.4, vVel: 0.3,
      sigLon: 8.0, sigLat: 4.0, peak: 60,
      fHour: 12, pHour: 60, dHour: 150,
      modelBias: { raw: 1.12, emos: 0.91, qm: 0.94, "ml-emos": 0.89, adaptive: 0.91 },
    },
    {
      id: "ov-mumbai", lon0: 72.5, lat0: 18.5, uVel: 1.0, vVel: 0.3,
      sigLon: 2.0, sigLat: 3.0, peak: 150,
      fHour: 0, pHour: 18, dHour: 60,
      modelBias: { raw: 1.20, emos: 0.86, qm: 0.91, "ml-emos": 0.83, adaptive: 0.85 },
    },
    {
      id: "ov-kerala", lon0: 76.5, lat0: 10.0, uVel: 0.3, vVel: 0.6,
      sigLon: 1.5, sigLat: 3.0, peak: 110,
      fHour: 0, pHour: 48, dHour: 130,
      modelBias: { raw: 1.14, emos: 0.90, qm: 0.93, "ml-emos": 0.87, adaptive: 0.89 },
    },
  ],
};

// Default systems when no scenario matches
const DEFAULT_SYSTEMS: WeatherSystem[] = SCENARIO_SYSTEMS["india-overview"];

export function getScenarioSystems(scenarioId: string | null | undefined): WeatherSystem[] {
  if (scenarioId && SCENARIO_SYSTEMS[scenarioId]) {
    return SCENARIO_SYSTEMS[scenarioId];
  }
  return DEFAULT_SYSTEMS;
}

// ── Router decision simulation ────────────────────────────────────────────────
export function getSimulatedRouterWeights(
  districtId: string,
  hour: number,
  systems: WeatherSystem[]
): { emos: number; mlEmos: number; qm: number; raw: number; correctionActive: boolean } {
  // Base weights vary with lead time and regime
  const leadDays = hour / 24;
  // Seed from district id
  const seed = districtId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = makePrng(seed + Math.round(leadDays * 100));

  // At short lead times, EMOS/ML dominates; at long lead times, uncertainty increases
  const rawBase = 5 + leadDays * 3 + rng() * 8;
  const qmBase = 8 + rng() * 10;
  const mlBase = 25 + rng() * 15 - leadDays * 2;
  const emosBase = 100 - rawBase - qmBase - mlBase;

  const total = rawBase + qmBase + mlBase + emosBase;
  const emos = Math.round((emosBase / total) * 100);
  const mlEmos = Math.round((mlBase / total) * 100);
  const qm = Math.round((qmBase / total) * 100);
  const raw = 100 - emos - mlEmos - qm;

  // Correction is active unless raw weight is dominant (break/dry regime)
  const correctionActive = raw < 35;

  return { emos, mlEmos, qm, raw, correctionActive };
}
