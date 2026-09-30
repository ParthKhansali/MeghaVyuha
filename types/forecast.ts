// MEGHAVYUHA — Core Data Types
// These interfaces define the data contract between the frontend and (future) research backend.
// REGIME → ERROR → CORRECTION → TRUST

export type ForecastModel = "adaptive" | "raw" | "emos" | "qm" | "ml-emos";

export type ViewMode = "amount" | "probability" | "uncertainty" | "difference";

export type ProbabilityThreshold =
  | "any"         // P(R > 0)
  | "heavy"       // P(R > 64.5 mm)
  | "very-heavy"  // P(R > 115.6 mm)
  | "extreme";    // P(R > 204.5 mm)

export type AlertSeverity = "HIGH" | "MODERATE" | "LOW";

export type ReliabilityLevel = "HIGH" | "MODERATE" | "LOW";

/** Trust gate decision — should post-processing be applied? */
export type TrustGateDecision = "CORRECT" | "RETAIN_RAW";

/** Error type identified by the error fingerprint */
export type ErrorType =
  | "amplitude"      // Too wet / too dry
  | "occurrence"     // Rain vs no-rain
  | "displacement"   // Right event, wrong location
  | "pattern"        // Spatial structure error
  | "spread";        // Ensemble under/over-dispersion

export type CorrectionCandidate =
  | "emos"
  | "qm"
  | "ml-emos"
  | "occurrence-model"
  | "spatial-correction"
  | "tail-correction"
  | "raw";

/** Marks that a value is from prototype/demo fixtures, not measured results */
export interface IllustrativeMarker {
  isIllustrative: true;
  pendingReason: string;
}

export interface DistrictForecast {
  districtId: string;
  districtName: string;
  state: string;
  lat: number;
  lon: number;
  expectedRainfallMm: number;
  probabilityHeavy: number; // 0-100
  probabilityVeryHeavy: number; // 0-100
  probabilityExtreme: number; // 0-100
  spatialExceedanceProbability: number; // 0-100 — P(>=25% of district exceeds heavy)
  regime: string;            // e.g. "Active + Orographic"
  synopticRegime: string;    // e.g. "Active"
  mechanism: string;         // e.g. "Orographic"
  reliability: ReliabilityLevel;
  ensembleSpread: ReliabilityLevel;
  modelDisagreement: ReliabilityLevel;
  historicalCorrectionBenefit: ReliabilityLevel;
}

/** Soft (probabilistic) regime state — replaces hard regime label */
export interface SoftRegimeState {
  active: number;       // 0-100 probability
  depression: number;
  breakPhase: number;
  westernDisturbance: number;
  other: number;
}

/** Soft mechanism scores — separate dimensions, not exclusive */
export interface SoftMechanismScores {
  orographic: number;   // 0-100
  coastal: number;
  convective: number;
  plains: number;
}

/** Correction decision — Regime → Error → Correction → Trust */
export interface CorrectionDecision {
  districtId: string;
  trustGate: TrustGateDecision;
  likelyErrorType: ErrorType;
  primaryCandidate: CorrectionCandidate;
  secondaryCandidate?: CorrectionCandidate;
  spatialCandidate?: CorrectionCandidate;
  fallbackModel: ForecastModel;
  /** Regime state that triggered this decision */
  regimeProbabilities: SoftRegimeState;
  /** Mechanism scores at decision time */
  mechanismScores: SoftMechanismScores;
  /** All values in this decision are prototype demo values, not measured */
  illustrative: IllustrativeMarker;
  /** Audit trail for the WHY? panel */
  auditTrail: AuditStep[];
}

export interface AuditStep {
  stepName: string;
  description: string;
  value?: string;
}

/** Legacy RouterDecision shape — kept for backward compat with LocationForecastPanel */
export interface RouterDecision {
  districtId: string;
  selectedModel: ForecastModel;
  rawWeight: number;
  qmWeight: number;
  emosWeight: number;
  mlEmosWeight: number;
  correctionActive: boolean;
  expectedBenefit: ReliabilityLevel;
  fallbackModel: ForecastModel;
  reason: string[];
  leadTime: number;
}

export interface ForecastDay {
  day: number;
  label: string;
  date: string;
  rainfall: Record<ForecastModel, number>;
  probabilityHeavy: Record<ForecastModel, number>;
}

export interface GridCell {
  lon: number;
  lat: number;
  value: number; // mm or 0-1 probability or spread index
}

export interface ForecastCycle {
  id: string;
  dateUtc: string;
  label: string;
  availableLeadDays: number[];
}

/** Model metric — only valid when sourced from actual experiment output */
export interface ModelMetrics {
  model: ForecastModel;
  crps: number;
  rmse: number;
  ets: number;
  csi: number;
  pod: number;
  far: number;
  fss: number;
  bss: number;
  /** Whether these are measured or illustrative prototype values */
  isIllustrative: boolean;
}

export interface Alert {
  id: string;
  districtId: string;
  districtName: string;
  state: string;
  lat: number;
  lon: number;
  type: "very-heavy" | "heavy" | "area-exceedance" | "model-disagreement";
  title: string;
  probability: number;
  severity: AlertSeverity;
  threshold?: string;
}

export interface DataSourceStatus {
  id: string;
  name: string;
  role: string;
  resolution?: string;
  timeCoverage?: string;
  status: "REAL_DATA" | "REPLAY" | "DEMO_DATA" | "PENDING_ACCESS" | "ADAPTER_PLANNED";
  available: boolean;
  isDemo: boolean;
  provenance?: string;
}

export type DemoScenarioId =
  | "india-overview"
  | "dehradun-heavy-rain"
  | "mumbai-coastal"
  | "northeast-rainfall"
  | "northwest-dry"
  | "central-monsoon";

export interface DemoScenario {
  id: DemoScenarioId;
  label: string;
  description: string;
  districtId: string;
  leadTime: number;
  model: ForecastModel;
  viewMode: ViewMode;
  mapCenter: [number, number];
  mapZoom: number;
}

export interface PhysiographicRegion {
  id: string;
  name: string;
  color: string;
  description: string;
}

/** Historical case for Case Replay page */
export interface HistoricalCase {
  id: string;
  label: string;
  description: string;
  eventDate: string;
  region: string;
  peakRainfallMm: number;
  hasRealData: boolean;
}
