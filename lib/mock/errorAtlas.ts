// MEGHAVYUHA — Error Atlas Diagnostic Registry & Historical Error Profiles
// Smart India Hackathon 2026 | PS 26080 | Against The Odds (Team 149284)
//
// HOW DOES THE FORECAST FAIL?
// Context-stratified NWP error diagnostics derived from NOAA GEFSv12 against
// IMD 0.25° gridded rainfall and CHIRPS v2 (2000–2017 historical archive).
//
// ⚠ SCIENTIFIC PRINCIPLE:
// Support is counted primarily in INDEPENDENT FORECAST DATES / EVENTS,
// NOT simply correlated grid pixels. Where cases are sparse (<15),
// the Atlas executes hierarchical backoff:
// SPECIFIC CONTEXT → BROADER CONTEXT → FIXED CALIBRATED BASELINE.

import type { ErrorType } from "@/types/forecast";

export interface ErrorFingerprint {
  occurrenceError: "LOW" | "MODERATE" | "HIGH";
  amplitudeError: "LOW" | "MODERATE" | "HIGH";
  displacementError: "LOW" | "MODERATE" | "HIGH";
  patternError: "LOW" | "MODERATE" | "HIGH";
  spreadError: "LOW" | "MODERATE" | "HIGH";
  dominantError: ErrorType;
  isIllustrative: boolean;
}

export interface RegionalErrorProfile {
  region: string;
  regime: string;
  leadDay: number;
  fingerprint: ErrorFingerprint;
  independentCases: number;
  pairedGridSamples: number;
  rawCrps: number;
  hurdleCrps: number;
  emosCrps: number;
  preferredModel: string;
  hierarchicalBackoff: "SPECIFIC_CONTEXT" | "BROADER_CONTEXT" | "FIXED_BASELINE";
  notes: string;
}

export const REGIONAL_ERROR_PROFILES: RegionalErrorProfile[] = [
  {
    region: "Western Ghats",
    regime: "Active Monsoon",
    leadDay: 1,
    independentCases: 47,
    pairedGridSamples: 6426,
    rawCrps: 10.35,
    hurdleCrps: 9.30,
    emosCrps: 9.46,
    preferredModel: "Hurdle Model / CSG-EMOS",
    hierarchicalBackoff: "SPECIFIC_CONTEXT",
    fingerprint: {
      occurrenceError: "LOW",
      amplitudeError: "HIGH",
      displacementError: "LOW",
      patternError: "MODERATE",
      spreadError: "MODERATE",
      dominantError: "amplitude",
      isIllustrative: false,
    },
    notes: "Active-phase orographic flow against Western Ghats escarpment produces systematic windward wet bias (+35% to +45%). Amplitude calibration yields consistent +10.2% CRPSS gain.",
  },
  {
    region: "Western Ghats",
    regime: "Moderate / Transition",
    leadDay: 2,
    independentCases: 34,
    pairedGridSamples: 4890,
    rawCrps: 9.12,
    hurdleCrps: 8.35,
    emosCrps: 8.42,
    preferredModel: "CSG-EMOS",
    hierarchicalBackoff: "SPECIFIC_CONTEXT",
    fingerprint: {
      occurrenceError: "MODERATE",
      amplitudeError: "HIGH",
      displacementError: "LOW",
      patternError: "LOW",
      spreadError: "MODERATE",
      dominantError: "amplitude",
      isIllustrative: false,
    },
    notes: "Moderate monsoon westerly flow. Coastal drizzle over-forecast; CSG-EMOS recalibration reduces false rain area.",
  },
  {
    region: "Central India",
    regime: "Monsoon Depression / Low",
    leadDay: 1,
    independentCases: 38,
    pairedGridSamples: 21525,
    rawCrps: 6.23,
    hurdleCrps: 6.10,
    emosCrps: 5.81,
    preferredModel: "CSG-EMOS",
    hierarchicalBackoff: "SPECIFIC_CONTEXT",
    fingerprint: {
      occurrenceError: "LOW",
      amplitudeError: "MODERATE",
      displacementError: "HIGH",
      patternError: "HIGH",
      spreadError: "LOW",
      dominantError: "displacement",
      isIllustrative: false,
    },
    notes: "Monsoon low-pressure vortex passage over Odisha and Chhattisgarh. Rain shield over-dispersed; CSG-EMOS volume calibration sharpens core (+6.7% CRPSS).",
  },
  {
    region: "Plains (Indo-Gangetic)",
    regime: "Active Monsoon",
    leadDay: 1,
    independentCases: 52,
    pairedGridSamples: 50400,
    rawCrps: 3.68,
    hurdleCrps: 3.12,
    emosCrps: 3.25,
    preferredModel: "Hurdle Model",
    hierarchicalBackoff: "SPECIFIC_CONTEXT",
    fingerprint: {
      occurrenceError: "LOW",
      amplitudeError: "MODERATE",
      displacementError: "LOW",
      patternError: "LOW",
      spreadError: "LOW",
      dominantError: "amplitude",
      isIllustrative: false,
    },
    notes: "Strong monsoon trough alignment across IGP. Consistent rainfall occurrence; Hurdle occurrence/amount decomposition improves skill by +17.1%.",
  },
  {
    region: "Plains (Indo-Gangetic)",
    regime: "Break Phase",
    leadDay: 2,
    independentCases: 21,
    pairedGridSamples: 28400,
    rawCrps: 4.10,
    hurdleCrps: 3.45,
    emosCrps: 3.82,
    preferredModel: "Hurdle Model",
    hierarchicalBackoff: "SPECIFIC_CONTEXT",
    fingerprint: {
      occurrenceError: "HIGH",
      amplitudeError: "LOW",
      displacementError: "LOW",
      patternError: "LOW",
      spreadError: "HIGH",
      dominantError: "occurrence",
      isIllustrative: false,
    },
    notes: "Monsoon break: trough shifted north toward Himalaya. Raw ensemble continues generating light convective false alarms across plains. Occurrence hurdle suppresses unobserved drizzle.",
  },
  {
    region: "Northeast Hills",
    regime: "Active Monsoon",
    leadDay: 1,
    independentCases: 49,
    pairedGridSamples: 68817,
    rawCrps: 6.67,
    hurdleCrps: 5.12,
    emosCrps: 5.48,
    preferredModel: "Hurdle Model / Atlas Selector",
    hierarchicalBackoff: "SPECIFIC_CONTEXT",
    fingerprint: {
      occurrenceError: "LOW",
      amplitudeError: "HIGH",
      displacementError: "MODERATE",
      patternError: "MODERATE",
      spreadError: "HIGH",
      dominantError: "amplitude",
      isIllustrative: false,
    },
    notes: "Complex valley topography (Brahmaputra vs. Meghalaya plateau). Valley under-prediction and ridge crest wet bias. Error Atlas selection achieves +25.2% CRPSS.",
  },
  {
    region: "Northwest Arid",
    regime: "Break Phase / Dry",
    leadDay: 1,
    independentCases: 4, // SPARSE SUPPORT!
    pairedGridSamples: 54600,
    rawCrps: 2.54,
    hurdleCrps: 2.78,
    emosCrps: 2.65,
    preferredModel: "Raw NWP (Hierarchical Fallback)",
    hierarchicalBackoff: "FIXED_BASELINE",
    fingerprint: {
      occurrenceError: "HIGH",
      amplitudeError: "LOW",
      displacementError: "LOW",
      patternError: "LOW",
      spreadError: "LOW",
      dominantError: "occurrence",
      isIllustrative: false,
    },
    notes: "Sparse historical event support (<15 independent cases in specific sub-context). Hierarchical backoff triggers: statistical post-processing risks adding false drizzle. RETAIN RAW NWP.",
  },
  {
    region: "Peninsular Interior",
    regime: "Active Monsoon",
    leadDay: 2,
    independentCases: 36,
    pairedGridSamples: 18102,
    rawCrps: 4.23,
    hurdleCrps: 3.55,
    emosCrps: 3.58,
    preferredModel: "Hurdle Model",
    hierarchicalBackoff: "SPECIFIC_CONTEXT",
    fingerprint: {
      occurrenceError: "MODERATE",
      amplitudeError: "MODERATE",
      displacementError: "LOW",
      patternError: "LOW",
      spreadError: "MODERATE",
      dominantError: "amplitude",
      isIllustrative: false,
    },
    notes: "Rain-shadow leeward sector (Deccan plateau). Strong westerly shadow reduces rainfall; CSG-EMOS and Hurdle calibrate moisture boundary (+17.5% CRPSS).",
  },
];

export interface ErrorAtlasFigureInfo {
  id: string;
  title: string;
  path: string;
  caption: string;
  diagnosticType: string;
}

export const ERROR_ATLAS_FIGURES: ErrorAtlasFigureInfo[] = [
  {
    id: "fig12",
    title: "Occurrence Error Diagnostic",
    path: "/research/Error_Atlas/fig12_error_atlas_occurrence.png",
    caption: "Figure 12: National occurrence bias field conditioned on synoptic phase. Identifies dry-spell over-prediction and rain/no-rain boundary errors.",
    diagnosticType: "Occurrence",
  },
  {
    id: "fig13",
    title: "Amplitude & Volume Bias",
    path: "/research/Error_Atlas/fig13_error_atlas_amplitude.png",
    caption: "Figure 13: Precipitation volume and conditional amplitude bias. Highlights persistent orographic over-estimation over Western Ghats crests.",
    diagnosticType: "Amplitude",
  },
  {
    id: "fig14",
    title: "Spatial Displacement Error",
    path: "/research/Error_Atlas/fig14_error_atlas_displacement.png",
    caption: "Figure 14: Vector displacement errors for synoptic lows and coastal convergence boundaries, mapping typical 40–120 km track shifts.",
    diagnosticType: "Displacement",
  },
  {
    id: "fig15",
    title: "Ensemble Dispersion & Calibration",
    path: "/research/Error_Atlas/fig15_error_atlas_calibration.png",
    caption: "Figure 15: Ensemble spread-to-skill ratio and dispersion reliability across physiographic sub-regions.",
    diagnosticType: "Dispersion",
  },
  {
    id: "fig19",
    title: "Error Atlas Selection Spatial Map",
    path: "/research/Main/fig19_atlas_selection_map.png",
    caption: "Figure 19: Geographical distribution of preferred candidate models across India selected via Error Atlas empirical loss minimization.",
    diagnosticType: "Atlas Selection",
  },
];

export interface ErrorTypeDefinition {
  id: ErrorType;
  label: string;
  description: string;
  typicalCauses: string[];
  candidateFixes: string[];
}

export const ERROR_TYPE_DEFINITIONS: ErrorTypeDefinition[] = [
  {
    id: "occurrence",
    label: "Occurrence Error (Rain / No-Rain)",
    description: "Raw ensemble predicts drizzle where dry weather prevails, or misses localized rain initiation.",
    typicalCauses: ["Break-phase over-prediction", "Convective trigger parameterization sensitivity", "Dry-spell trace drizzle"],
    candidateFixes: ["Two-stage Occurrence Hurdle Model", "Zero-inflation threshold calibration", "Hierarchical fallback to Raw in dry sectors"],
  },
  {
    id: "amplitude",
    label: "Amplitude & Volume Bias",
    description: "Occurrence timing is correct, but precipitation volume is systematically exaggerated or underestimated.",
    typicalCauses: ["Steep topographic orographic lift", "Excessive coastal moisture convergence", "Ensemble mean smoothing penalty"],
    candidateFixes: ["Censored & Shifted Gamma EMOS (CSG-EMOS)", "Hurdle gamma amount fitting", "Parametric Quantile Mapping comparator"],
  },
  {
    id: "displacement",
    label: "Spatial Displacement",
    description: "The storm or depression shield exists with correct intensity, but offset spatially by 40–150 km.",
    typicalCauses: ["Synoptic vortex center tracking errors", "Terrain resolution barrier offset", "Coastal boundary layer friction"],
    candidateFixes: ["Neighbourhood Fractions Skill Score (FSS) scaling", "Fuzzy spatial evaluation (~100 km scale)"],
  },
  {
    id: "pattern",
    label: "Pattern & Spatial Structure",
    description: "Correct regional volume, but spatially distorted (e.g. overly diffuse blob vs. sharp linear convective line).",
    typicalCauses: ["Ensemble averaging destroying sharp spatial gradients", "Sub-grid mesoscale convective organization limits"],
    candidateFixes: ["Neighbourhood threshold probability products", "Spatial coherence mapping"],
  },
  {
    id: "spread",
    label: "Ensemble Dispersion Error",
    description: "Ensemble spread fails to reflect actual forecast error variance (under-dispersive overconfidence or over-dispersive noise).",
    typicalCauses: ["Ensemble member clustering", "Insufficient initial condition perturbation over tropical ocean margins"],
    candidateFixes: ["EMOS variance spread recalibration", "Non-homogeneous Gaussian / Gamma regression"],
  },
];
