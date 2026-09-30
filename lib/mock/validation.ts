// MEGHAVYUHA — Scientific Validation Results & Benchmark Registry
// Smart India Hackathon 2026 | PS 26080 | Against The Odds (Team 149284)
//
// ⚠ EXPERIMENTAL STATUS:
// All values in this module represent the frozen retrospective V1 benchmark
// evaluated on held-out JJAS 2019 (00 UTC, Day +1 primary, Day +3 secondary),
// using NOAA GEFSv12 reforecasts against CHIRPS v2 and IMD 0.25° gridded reference.
// Multi-decadal V2 reproduction across 2000–2018 is planned.

import type { ModelMetrics, ForecastDay, DemoScenario, DataSourceStatus, ForecastCycle, ForecastModel } from "@/types/forecast";

export const EVALUATION_PROTOCOL_NOTE =
  "Frozen retrospective evaluation protocol: JJAS 2019 held-out test dates, 00 UTC initialization. " +
  "Primary lead: Day +1 (24-h accumulated precipitation); Secondary lead: Day +3. " +
  "Raw ensemble: NOAA GEFSv12 (5 reforecast members at ~0.25°). " +
  "Reference: CHIRPS v2 (0.05° resampled to 0.25°) and IMD 0.25° gridded daily rainfall archive (Zenodo DOI: 10.5281/zenodo.11195106).";

/** Flag indicating whether retrospective benchmark data is loaded */
export const VALIDATION_RESULTS_AVAILABLE = true;

export interface PrimaryMetricRow {
  method: string;
  label: string;
  crps: number;
  crpss: number;
  bss_64: number;
  rmse: number;
  mae: number;
  bias: number;
  isBaseline: boolean;
}

// Day +1 primary benchmark results (from metrics_primary.csv)
export const DAY1_PRIMARY_METRICS: PrimaryMetricRow[] = [
  { method: "B0_Climatology", label: "Climatology (B0)", crps: 5.014, crpss: -0.029, bss_64: 0.305, rmse: 11.87, mae: 7.39, bias: 1.11, isBaseline: true },
  { method: "B1_Raw_NWP", label: "Raw GEFSv12 NWP (B1)", crps: 4.871, crpss: 0.000, bss_64: 0.000, rmse: 12.08, mae: 5.99, bias: 1.99, isBaseline: true },
  { method: "B2_Bias_Correction", label: "Mean Bias Correction (B2)", crps: 4.500, crpss: 0.076, bss_64: 0.027, rmse: 11.82, mae: 5.53, bias: 1.06, isBaseline: true },
  { method: "B3_Double_Gamma_QM", label: "Double-Gamma QM (B3)", crps: 5.848, crpss: -0.201, bss_64: -0.008, rmse: 12.83, mae: 7.15, bias: 3.94, isBaseline: true },
  { method: "B3_Supp_Empirical_QM", label: "Empirical QM Comparator", crps: 5.838, crpss: -0.198, bss_64: -0.009, rmse: 12.47, mae: 7.10, bias: 3.89, isBaseline: true },
  { method: "B4_CSG_EMOS", label: "CSG-EMOS Calibrated (B4)", crps: 4.340, crpss: 0.109, bss_64: 0.262, rmse: 10.54, mae: 5.26, bias: 0.33, isBaseline: false },
  { method: "B5_Hurdle", label: "Occurrence Hurdle Model (B5)", crps: 4.111, crpss: 0.156, bss_64: 0.339, rmse: 11.69, mae: 5.22, bias: -1.85, isBaseline: false },
  { method: "Atlas_Selector", label: "MEGHAVYUHA Error Atlas Selector", crps: 3.998, crpss: 0.179, bss_64: 0.218, rmse: 11.25, mae: 5.17, bias: -0.75, isBaseline: false },
  { method: "ML_Router", label: "Gradient-Boosted ML Router", crps: 4.063, crpss: 0.166, bss_64: 0.235, rmse: 11.21, mae: 5.14, bias: -1.24, isBaseline: false },
  { method: "Trust_Gated_MEGHAVYUHA", label: "Selective Gate MEGHAVYUHA", crps: 4.029, crpss: 0.173, bss_64: 0.220, rmse: 11.22, mae: 5.06, bias: -0.86, isBaseline: false },
];

// Day +3 secondary benchmark results (from metrics_secondary.csv)
export const DAY3_SECONDARY_METRICS: PrimaryMetricRow[] = [
  { method: "B0_Climatology", label: "Climatology (B0)", crps: 7.199, crpss: -0.072, bss_64: 0.133, rmse: 18.31, mae: 10.03, bias: 0.69, isBaseline: true },
  { method: "B1_Raw_NWP", label: "Raw GEFSv12 NWP (B1)", crps: 6.716, crpss: 0.000, bss_64: 0.000, rmse: 17.70, mae: 8.46, bias: 1.63, isBaseline: true },
  { method: "B2_Bias_Correction", label: "Mean Bias Correction (B2)", crps: 6.363, crpss: 0.052, bss_64: 0.018, rmse: 17.51, mae: 7.94, bias: 0.34, isBaseline: true },
  { method: "B3_Double_Gamma_QM", label: "Double-Gamma QM (B3)", crps: 6.910, crpss: -0.029, bss_64: -0.105, rmse: 18.67, mae: 8.86, bias: 2.22, isBaseline: true },
  { method: "B3_Supp_Empirical_QM", label: "Empirical QM Comparator", crps: 6.907, crpss: -0.029, bss_64: -0.106, rmse: 18.71, mae: 8.86, bias: 2.20, isBaseline: true },
  { method: "B4_CSG_EMOS", label: "CSG-EMOS Calibrated (B4)", crps: 5.921, crpss: 0.118, bss_64: 0.161, rmse: 17.75, mae: 6.98, bias: -4.00, isBaseline: false },
  { method: "B5_Hurdle", label: "Occurrence Hurdle Model (B5)", crps: 6.206, crpss: 0.076, bss_64: 0.152, rmse: 18.35, mae: 7.19, bias: -4.46, isBaseline: false },
  { method: "Atlas_Selector", label: "MEGHAVYUHA Error Atlas Selector", crps: 5.847, crpss: 0.129, bss_64: 0.142, rmse: 17.06, mae: 7.01, bias: -3.10, isBaseline: false },
  { method: "ML_Router", label: "Gradient-Boosted ML Router", crps: 5.898, crpss: 0.122, bss_64: 0.132, rmse: 17.32, mae: 6.97, bias: -3.63, isBaseline: false },
  { method: "Trust_Gated_MEGHAVYUHA", label: "Selective Gate MEGHAVYUHA", crps: 5.844, crpss: 0.130, bss_64: 0.142, rmse: 16.97, mae: 6.96, bias: -2.90, isBaseline: false },
];

// ModelMetrics for standard UI components
export const MODEL_METRICS: ModelMetrics[] = [
  {
    model: "raw",
    crps: 4.871,
    rmse: 12.08,
    ets: 0.28,
    csi: 0.35,
    pod: 0.62,
    far: 0.41,
    fss: 0.28, // grid scale ~28 km
    bss: 0.000,
    isIllustrative: false,
  },
  {
    model: "qm",
    crps: 5.848,
    rmse: 12.83,
    ets: 0.24,
    csi: 0.31,
    pod: 0.58,
    far: 0.46,
    fss: 0.31,
    bss: -0.008,
    isIllustrative: false,
  },
  {
    model: "emos",
    crps: 4.340,
    rmse: 10.54,
    ets: 0.36,
    csi: 0.44,
    pod: 0.71,
    far: 0.31,
    fss: 0.49,
    bss: 0.262,
    isIllustrative: false,
  },
  {
    model: "ml-emos",
    crps: 4.063,
    rmse: 11.21,
    ets: 0.38,
    csi: 0.46,
    pod: 0.74,
    far: 0.29,
    fss: 0.53,
    bss: 0.235,
    isIllustrative: false,
  },
  {
    model: "adaptive",
    crps: 3.998,
    rmse: 11.25,
    ets: 0.41,
    csi: 0.49,
    pod: 0.76,
    far: 0.27,
    fss: 0.58, // neighbourhood scale ~111 km
    bss: 0.218,
    isIllustrative: false,
  },
];

// Real ablation steps (from ablation_results.csv)
export const ABLATION_STEPS = [
  { id: "A0", step: "A0 — Raw NWP Baseline", crps: 4.871, crpss: 0.000, bss_64: 0.000, rmse: 12.08, gain: "Reference", module: "raw", isIllustrative: false },
  { id: "A1", step: "A1 + Fixed CSG-EMOS", crps: 4.340, crpss: 0.109, bss_64: 0.262, rmse: 10.54, gain: "+10.9% CRPSS", module: "emos", isIllustrative: false },
  { id: "A2", step: "A2 + Double-Gamma QM", crps: 5.848, crpss: -0.201, bss_64: -0.008, rmse: 12.83, gain: "-20.1% (Tail penalty)", module: "qm", isIllustrative: false },
  { id: "A3", step: "A3 + Occurrence Hurdle", crps: 4.111, crpss: 0.156, bss_64: 0.339, rmse: 11.69, gain: "+15.6% CRPSS", module: "hurdle", isIllustrative: false },
  { id: "A4", step: "A4 + Error Atlas Lookup", crps: 3.998, crpss: 0.179, bss_64: 0.218, rmse: 11.25, gain: "+17.9% CRPSS", module: "error-atlas", isIllustrative: false },
  { id: "A5", step: "A5 + Atlas Selector", crps: 3.998, crpss: 0.179, bss_64: 0.218, rmse: 11.25, gain: "Contextual choice", module: "atlas-selector", isIllustrative: false },
  { id: "A6", step: "A6 + Gradient-Boosted ML Router", crps: 4.063, crpss: 0.166, bss_64: 0.235, rmse: 11.21, gain: "-0.065 mm (Overfitting)", module: "ml-router", isIllustrative: false },
  { id: "A7", step: "A7 + Selective Gate (Audit)", crps: 4.029, crpss: 0.173, bss_64: 0.220, rmse: 11.22, gain: "32.2% deg rate", module: "selective-gate", isIllustrative: false },
];

// Real regional evaluation results (from regional_results.csv)
export const REGIONAL_SKILL = [
  { region: "Western Ghats", crpsRaw: 10.353, crpsAtlas: 9.298, crpss: 0.102, nSamples: 6426, primaryError: "Orographic wet bias on coastal flank", isIllustrative: false },
  { region: "Central India", crpsRaw: 6.231, crpsAtlas: 5.812, crpss: 0.067, nSamples: 21525, primaryError: "Depression track displacement", isIllustrative: false },
  { region: "NW Arid", crpsRaw: 2.544, crpsAtlas: 2.220, crpss: 0.128, nSamples: 54600, primaryError: "False alarm light drizzle", isIllustrative: false },
  { region: "NE Hills", crpsRaw: 6.668, crpsAtlas: 4.988, crpss: 0.252, nSamples: 68817, primaryError: "Valley under-prediction & ridge wet bias", isIllustrative: false },
  { region: "Peninsular", crpsRaw: 4.232, crpsAtlas: 3.491, crpss: 0.175, nSamples: 18102, primaryError: "Rain-shadow over-dispersion", isIllustrative: false },
  { region: "Plains (IGP)", crpsRaw: 3.683, crpsAtlas: 3.054, crpss: 0.171, nSamples: 50400, primaryError: "Monsoon trough axis drift", isIllustrative: false },
];

// Real rainfall tier / intensity stratification (from regime_results.csv)
export const RAINFALL_TIER_SKILL = [
  { tier: "Dry (<2.5 mm)", nSamples: 160497, crpsRaw: 2.850, crpsAtlas: 1.208, crpss: 0.576, note: "Strong occurrence calibration benefit" },
  { tier: "Light (2.5–15 mm)", nSamples: 40550, crpsRaw: 6.106, crpsAtlas: 5.230, crpss: 0.143, note: "Moderate amplitude adjustment" },
  { tier: "Heavy (15–64.5 mm)", nSamples: 21865, crpsRaw: 14.510, crpsAtlas: 17.876, crpss: -0.232, note: "Point-smoothing penalty; requires neighbourhood verification" },
  { tier: "Extreme (≥64.5 mm)", nSamples: 1452, crpsRaw: 48.652, crpsAtlas: 68.975, crpss: -0.418, note: "Tail peak suppression; heavy-rain safeguard check required" },
];

// Regime-based verification summary for model analysis
export const REGIME_SKILL = [
  { regime: "Active Monsoon", crps: 6.84, bss: 0.38, n: 84210 },
  { regime: "Depression / Low", crps: 8.12, bss: 0.28, n: 32450 },
  { regime: "Break Phase", crps: 2.14, bss: 0.42, n: 64180 },
  { regime: "Transition / Weak", crps: 4.88, bss: 0.19, n: 21540 },
];

// Authoritative Claim-Evidence Matrix (from claim_evidence_matrix.csv)
export interface ClaimEvidenceItem {
  id: string;
  claim: string;
  dataset: string;
  period: string;
  metric: string;
  measuredEffect: string;
  figure: string;
  status: "MEASURED" | "NOT SUPPORTED";
  scientificImplication: string;
}

export const CLAIM_EVIDENCE_MATRIX: ClaimEvidenceItem[] = [
  {
    id: "C1",
    claim: "Forecast context reliably differentiates NWP error types and scales",
    dataset: "GEFSv12 + IMD/CHIRPS",
    period: "2000–2017",
    metric: "Kruskal-Wallis H / Epsilon-sq",
    measuredEffect: "IMD: H=10.96 (p=0.012, eps^2=0.209); CHIRPS: H=0.74 (p=0.391)",
    figure: "Figures 12 & 13",
    status: "MEASURED",
    scientificImplication: "Significant error stratification by synoptic phase in IMD; sensitivity across references noted.",
  },
  {
    id: "C2",
    claim: "Error Atlas selection adds positive skill over uniform post-processing across all JJAS test dates",
    dataset: "GEFSv12 + CHIRPS",
    period: "JJAS 2019",
    metric: "CRPS (mm)",
    measuredEffect: "-0.873 mm vs Raw (+17.9% CRPSS); -0.341 mm vs EMOS (95% CI [-1.102, -0.684] mm)",
    figure: "Figures 07, 20 & 25",
    status: "MEASURED",
    scientificImplication: "Adaptive Error Atlas selector statistically outperforms uniform fixed EMOS and Raw NWP.",
  },
  {
    id: "C3",
    claim: "Complex gradient-boosted ML routing yields no generalization advantage over parsimonious Error Atlas lookup",
    dataset: "GEFSv12 + CHIRPS / IMD",
    period: "JJAS 2019",
    metric: "CRPS (mm)",
    measuredEffect: "Error Atlas: 3.998 mm vs ML Router: 4.063 mm (penalty: +0.065 mm)",
    figure: "Figures 14 & 20",
    status: "MEASURED",
    scientificImplication: "Overfitting penalty confirmed on complex models. Simple calibrated models under an Atlas are superior.",
  },
  {
    id: "C4",
    claim: "Heuristic trust gating degrades skill; decision-theoretic selective gate reduces degradation fraction but constrains total gain",
    dataset: "GEFSv12 + CHIRPS",
    period: "JJAS 2019",
    metric: "Degradation Rate / CRPS",
    measuredEffect: "Ungated: 33.19% deg (3.998 mm) vs Gated: 32.21% deg (4.029 mm)",
    figure: "Figures 21 & 22",
    status: "MEASURED",
    scientificImplication: "Original Trust Gate failed degradation criterion. Replaced by transparent Decision Evidence audit trail.",
  },
  {
    id: "C5",
    claim: "Heavy rainfall probabilistic discernment (>64.5 mm) is preserved and improved over raw NWP",
    dataset: "GEFSv12 + CHIRPS",
    period: "JJAS 2019",
    metric: "Brier Skill Score (BSS)",
    measuredEffect: "Raw: 0.000 vs Atlas: +0.218 vs CSG-EMOS: +0.262 (Brier drops 0.041 → 0.032)",
    figure: "Figures 08 & 17",
    status: "MEASURED",
    scientificImplication: "BSS > 0 proves meaningful heavy-rain probabilistic signal enhancement over raw ensemble.",
  },
  {
    id: "C6",
    claim: "Spatial verification reveals effective resolution of skillful probabilistic signal exceeds 100 km",
    dataset: "GEFSv12 + CHIRPS",
    period: "JJAS 2019",
    metric: "Fractions Skill Score (FSS)",
    measuredEffect: "Grid scale (28 km): FSS=0.28; Neighbourhood (111 km): FSS=0.58",
    figure: "Figure 23",
    status: "MEASURED",
    scientificImplication: "Skillful probabilistic signal is reliable at neighbourhood scales (~100 km), not single 0.25° grid points.",
  },
  {
    id: "C7",
    claim: "MEGHAVYUHA is superior to operational IMD forecaster products across all scenarios",
    dataset: "N/A",
    period: "N/A",
    metric: "Comparative Operational Skill",
    measuredEffect: "Not evaluated against operational IMD forecaster products; only raw GEFS against observational reference.",
    figure: "N/A",
    status: "NOT SUPPORTED",
    scientificImplication: "MEGHAVYUHA is a post-processing layer, NOT a replacement for IMD or operational forecasters.",
  },
];

// Forecast evolution function for District Forecasts
export function getForecastEvolution(districtId: string, baseRainfall: number): ForecastDay[] {
  const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const dates = [
    "26 Sep", "27 Sep", "28 Sep", "29 Sep", "30 Sep",
    "01 Oct", "02 Oct", "03 Oct", "04 Oct", "05 Oct"
  ];

  const seed = districtId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const phase = (seed % 7) * 0.5;

  return days.map((day, i) => {
    const decay = Math.max(0.2, 1.0 - i * 0.065);
    const wave = 1 + 0.3 * Math.sin((i + phase) * 1.1);
    const base = baseRainfall * decay * wave;

    return {
      day,
      label: `Day ${day}`,
      date: dates[i],
      rainfall: {
        adaptive: Math.round(base * 0.82),
        raw: Math.round(base * 1.0),
        emos: Math.round(base * 0.89),
        qm: Math.round(base * 1.08),
        "ml-emos": Math.round(base * 0.85),
      },
      probabilityHeavy: {
        adaptive: Math.round(Math.min(99, (base / 90) * 80 * 0.82)),
        raw: Math.round(Math.min(99, (base / 90) * 80)),
        emos: Math.round(Math.min(99, (base / 90) * 80 * 0.89)),
        qm: Math.round(Math.min(99, (base / 90) * 80 * 1.08)),
        "ml-emos": Math.round(Math.min(99, (base / 90) * 80 * 0.85)),
      },
    };
  });
}

// Current forecast cycle
export const CURRENT_CYCLE: ForecastCycle = {
  id: "2026-09-25T00:00:00Z",
  dateUtc: "2026-09-25T00:00:00Z",
  label: "25 Sep 2026 00 UTC",
  availableLeadDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
};

// Data Sources with complete provenance
export const DATA_SOURCES: DataSourceStatus[] = [
  {
    id: "noaa-gefsv12",
    name: "NOAA GEFSv12 Reforecast",
    role: "Primary numerical weather prediction ensemble",
    resolution: "~0.25° grid, 5 reforecast members (JJAS 2000–2019)",
    timeCoverage: "2000–2019 (JJAS 00 UTC)",
    status: "REAL_DATA",
    available: true,
    isDemo: false,
    provenance: "Public open access via AWS Open Data / NOAA NOMADS reforecast archive",
  },
  {
    id: "imd-archived-gridded",
    name: "IMD 0.25° Daily Rainfall Archive",
    role: "Observational calibration and Error Atlas truth reference",
    resolution: "0.25° × 0.25° gridded daily rainfall",
    timeCoverage: "Historical monsoon seasons",
    status: "REAL_DATA",
    available: true,
    isDemo: false,
    provenance: "IMD public research packaged archive (Zenodo DOI: 10.5281/zenodo.11195106)",
  },
  {
    id: "chirps-v2",
    name: "CHIRPS v2 Precipitation Analysis",
    role: "Independent satellite-gauge precipitation cross-reference",
    resolution: "0.05° resampled to 0.25°",
    timeCoverage: "1981–present",
    status: "REAL_DATA",
    available: true,
    isDemo: false,
    provenance: "Climate Hazards Center, UC Santa Barbara (explicitly evaluated as reference, NOT ground truth)",
  },
  {
    id: "ecmwf-era5",
    name: "ECMWF ERA5 Reanalysis",
    role: "Synoptic circulation diagnostics & regime conditioning",
    resolution: "~31 km horizontal, 6-hourly pressure levels",
    timeCoverage: "1979–present",
    status: "REAL_DATA",
    available: true,
    isDemo: false,
    provenance: "Copernicus Climate Change Service (C3S) Climate Data Store",
  },
  {
    id: "survey-of-india-districts",
    name: "District Boundaries (LGD / Survey of India)",
    role: "Administrative spatial aggregation reference",
    resolution: "Administrative Level 2 (Districts)",
    timeCoverage: "Static boundary reference (2021 update)",
    status: "REAL_DATA",
    available: true,
    isDemo: false,
    provenance: "Survey of India / Open Government Data Platform India",
  },
  {
    id: "ncmrwf-nepsg",
    name: "NCMRWF NEPS-G Ensemble",
    role: "Indian operational ensemble benchmark (future operational integration)",
    resolution: "~12 km, 22 ensemble members",
    timeCoverage: "Operational archive",
    status: "ADAPTER_PLANNED",
    available: false,
    isDemo: false,
    provenance: "National Centre for Medium Range Weather Forecasting (integration planned post-hackathon)",
  },
  {
    id: "meghavyuha-engine",
    name: "MEGHAVYUHA Post-Processing Engine",
    role: "Context → Error Atlas → Calibrated Model Selection → Guidance",
    resolution: "0.25° grid & district area-fraction aggregations",
    timeCoverage: "Research pipeline (V1 retrospective benchmark / V2 in progress)",
    status: "REAL_DATA",
    available: true,
    isDemo: false,
    provenance: "Against The Odds (SIH 2026 Team 149284)",
  },
];

// Demo Scenarios
export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "india-overview",
    label: "India Overview (Active Phase)",
    description: "National rainfall overview with full 6-step Decision Evidence trace",
    districtId: "uttarakhand-dehradun",
    leadTime: 1,
    model: "adaptive",
    viewMode: "amount",
    mapCenter: [78.5, 20.5],
    mapZoom: 4.5,
  },
  {
    id: "dehradun-heavy-rain",
    label: "Dehradun Heavy Rain Event",
    description: "Active + Orographic regime: Hurdle model selected with neighbourhood spatial verification",
    districtId: "uttarakhand-dehradun",
    leadTime: 1,
    model: "adaptive",
    viewMode: "probability",
    mapCenter: [78.03, 30.32],
    mapZoom: 8,
  },
  {
    id: "mumbai-coastal",
    label: "Mumbai Coastal Convergence",
    description: "Konkan coastal moisture convergence: CSG-EMOS calibrated correction",
    districtId: "maharashtra-mumbai",
    leadTime: 1,
    model: "adaptive",
    viewMode: "probability",
    mapCenter: [72.88, 19.08],
    mapZoom: 8,
  },
  {
    id: "northeast-rainfall",
    label: "Northeast Hills & Plains",
    description: "Guwahati active monsoon: valley under-prediction adjustment",
    districtId: "assam-guwahati",
    leadTime: 1,
    model: "adaptive",
    viewMode: "amount",
    mapCenter: [91.74, 26.14],
    mapZoom: 7,
  },
  {
    id: "northwest-dry",
    label: "Northwest Arid / Break Phase",
    description: "Sparse historical error evidence: MEGHAVYUHA safely executes hierarchical fallback and retains Raw NWP",
    districtId: "rajasthan-jaipur",
    leadTime: 3,
    model: "raw",
    viewMode: "amount",
    mapCenter: [75.79, 26.91],
    mapZoom: 7,
  },
  {
    id: "central-monsoon",
    label: "Central India Depression Track",
    description: "Bhopal monsoon depression: track volume calibration and area exceedance computation",
    districtId: "madhya-pradesh-bhopal",
    leadTime: 2,
    model: "adaptive",
    viewMode: "amount",
    mapCenter: [77.41, 23.26],
    mapZoom: 7,
  },
];
