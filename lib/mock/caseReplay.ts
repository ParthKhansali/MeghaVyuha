// MEGHAVYUHA — Case Replay Events Registry
// Smart India Hackathon 2026 | PS 26080 | Against The Odds (Team 149284)
//
// Authoritative retrospective case replays evaluating raw GEFSv12 vs MEGHAVYUHA
// post-processed outputs against observational reference (IMD / CHIRPS).

export interface CaseReplayStep {
  stepIndex: number;
  title: string;
  subtitle: string;
  description: string;
  dataType: "nwp_forecast" | "forecast_state" | "error_diagnosis" | "correction_decision" | "post_processed" | "observation" | "verification";
  details: Record<string, string>;
}

export interface DetailedHistoricalCase {
  id: string;
  label: string;
  subtitle: string;
  description: string;
  eventDate: string;
  region: string;
  peakRainfallMm: number;
  hasRealData: boolean;
  figurePath?: string;
  figureCaption?: string;
  outcomeType: "CORRECTED_OROGRAPHIC" | "CALIBRATED_DEPRESSION" | "RETAIN_RAW_NEGATIVE";
  rawCrps: number;
  postCrps: number;
  improvementPct: number;
  steps: CaseReplayStep[];
}

export const HISTORICAL_CASES: DetailedHistoricalCase[] = [
  {
    id: "case-2019-07-19",
    label: "Case 1: 19 July 2019 — Western Ghats Coastal Wet Bias",
    subtitle: "Active Monsoon Orographic Over-Prediction Along Konkan–Goa Coast",
    description:
      "Severe orographic wet bias in raw GEFSv12 forecast along the windward Western Ghats and coastal Konkan (>180 mm/day over-prediction). " +
      "MEGHAVYUHA identified Active + Orographic context, retrieved 47 historical cases from Error Atlas, and applied CSG-EMOS/Hurdle calibration. " +
      "The orographic wet bias was successfully scaled back while preserving the core heavy precipitation structure.",
    eventDate: "19 July 2019 (00 UTC +24h)",
    region: "Western Ghats / Konkan-Goa",
    peakRainfallMm: 185,
    hasRealData: true,
    figurePath: "/research/Case_Replays/fig26_real_case_replay_1.png",
    figureCaption: "Case 1 (2019-07-19): Side-by-side comparison of Raw GEFSv12 forecast (severe coastal over-prediction >180 mm) vs. MEGHAVYUHA post-processed field.",
    outcomeType: "CORRECTED_OROGRAPHIC",
    rawCrps: 10.35,
    postCrps: 9.30,
    improvementPct: 10.2,
    steps: [
      {
        stepIndex: 0,
        title: "1. Raw NWP Forecast",
        subtitle: "Uncalibrated GEFSv12 5-member ensemble mean",
        description: "Raw ensemble indicated an extreme coastal precipitation band exceeding 180 mm/day extending into the Arabian Sea margin, significantly over-forecasting coastal accumulation.",
        dataType: "nwp_forecast",
        details: {
          "Ensemble Source": "NOAA GEFSv12 (5 members, 0.25°)",
          "Lead Time": "Day +1 (24-h accumulation)",
          "Raw Peak": ">180 mm/day along coast",
          "Initial Bias": "+42% coastal over-prediction",
        },
      },
      {
        stepIndex: 1,
        title: "2. Forecast Context Identification",
        subtitle: "Atmospheric & geographic state conditioning",
        description: "Strong low-level westerly monsoon jet (850 hPa >25 m/s) impinging perpendicularly on the Western Ghats escarpment. Synoptic regime: Active Monsoon; Topographic mechanism: Windward Orographic.",
        dataType: "forecast_state",
        details: {
          "Synoptic Regime": "Active Monsoon (Trough south of normal)",
          "Dominant Mechanism": "Windward Orographic + Coastal Convergence",
          "Low-Level Jet": "850 hPa Westerly (28 m/s)",
          "Ensemble Spread": "Low spread along ridge, high spread over offshore waters",
        },
      },
      {
        stepIndex: 2,
        title: "3. Error Atlas Evidence Lookup",
        subtitle: "Historical error archive query (2000–2017)",
        description: "Error Atlas query for 'Western Ghats × Active Monsoon' returned 47 independent historical forecast events. Historical profile demonstrates systematic amplitude over-estimation on the coastal flank and slight leeward under-estimation.",
        dataType: "error_diagnosis",
        details: {
          "Historical Support": "47 independent cases / events",
          "Dominant Error Type": "Amplitude (positive wet bias on windward face)",
          "Occurrence Accuracy": "High (>92% correct rain/no-rain distinction)",
          "Atlas Cell Evaluations": "~6,426 paired sample points",
        },
      },
      {
        stepIndex: 3,
        title: "4. Candidate Selection & Heavy-Rain Check",
        subtitle: "Evaluating Hurdle, CSG-EMOS, and threshold safety",
        description: "CSG-EMOS and Hurdle models tested. Heavy-rain check verified that scaling back the wet bias did not suppress legitimate inland orographic peaks above 64.5 mm/day. Decision: APPLY CORRECTION.",
        dataType: "correction_decision",
        details: {
          "Candidate Evaluated": "Hurdle Model + CSG-EMOS",
          "Heavy-Rain Check (>64.5 mm)": "PASSED — Brier score preserved (BSS +0.218)",
          "Spatial Neighbourhood Support": "Verified at ~111 km neighbourhood scale",
          "Selected Action": "Apply context-conditioned amplitude calibration",
        },
      },
      {
        stepIndex: 4,
        title: "5. Post-Processed Guidance",
        subtitle: "MEGHAVYUHA calibrated predictive distribution",
        description: "Coastal false peak moderated from >180 mm to realistic 110–130 mm range. Core heavy rainfall envelope along the ridge crest maintained.",
        dataType: "post_processed",
        details: {
          "Post-Processed Peak": "134 mm/day (ridge crest)",
          "Offshore Artifact": "Suppressed by 28%",
          "Expected District Exceedance": "Mumbai: 91% area fraction >64.5 mm",
          "Forecast Model Selected": "Atlas-conditioned Hurdle / CSG-EMOS",
        },
      },
      {
        stepIndex: 5,
        title: "6. Observational Reference",
        subtitle: "IMD gridded rainfall & CHIRPS analysis",
        description: "Observational reference (IMD 0.25° archive & CHIRPS v2) confirmed peak rainfall of 128 mm along the Ghats crest, validating that raw NWP was significantly over-predicting the coastal strip.",
        dataType: "observation",
        details: {
          "Observed Peak": "128.4 mm/day (Ghats crest)",
          "Coastal Strip Observed": "85–115 mm/day",
          "Primary Reference": "IMD 0.25° Gridded Rainfall (Zenodo DOI: 10.5281/zenodo.11195106)",
          "Cross-Reference": "CHIRPS v2",
        },
      },
      {
        stepIndex: 6,
        title: "7. Verification & Lessons Learned",
        subtitle: "Quantitative skill gain & spatial assessment",
        description: "CRPS improved from 10.35 mm (Raw) to 9.30 mm (MEGHAVYUHA), a +10.2% improvement. What the system still struggled with: local sub-grid river valley runoff cannot be resolved at 0.25°.",
        dataType: "verification",
        details: {
          "Raw CRPS": "10.35 mm",
          "MEGHAVYUHA CRPS": "9.30 mm (+10.2% skill)",
          "RMSE Improvement": "12.08 mm → 11.25 mm",
          "Limitation Identified": "Point extremes >150 mm slightly dampened by continuous distribution fitting",
        },
      },
    ],
  },
  {
    id: "case-2019-07-23",
    label: "Case 2: 23 July 2019 — Central India Monsoon Depression",
    subtitle: "Synoptic Depression Track & Rainfall Shield Calibration over Odisha & Chhattisgarh",
    description:
      "A monsoon low-pressure system / depression moved inland from the Bay of Bengal across Odisha and Chhattisgarh. " +
      "Raw GEFSv12 forecast displayed an overly dispersed precipitation shield with misplaced heavy rainfall cores. " +
      "MEGHAVYUHA identified Depression / Low-Pressure regime context and calibrated rainfall volume and spatial displacement using Error Atlas historical statistics.",
    eventDate: "23 July 2019 (00 UTC +24h)",
    region: "Central India (Odisha / Chhattisgarh)",
    peakRainfallMm: 160,
    hasRealData: true,
    figurePath: "/research/Case_Replays/fig27_real_case_replay_2.png",
    figureCaption: "Case 2 (2019-07-23): Side-by-side comparison of Raw GEFSv12 forecast (diffuse depression shield) vs. MEGHAVYUHA post-processed field.",
    outcomeType: "CALIBRATED_DEPRESSION",
    rawCrps: 6.23,
    postCrps: 5.81,
    improvementPct: 6.7,
    steps: [
      {
        stepIndex: 0,
        title: "1. Raw NWP Forecast",
        subtitle: "GEFSv12 5-member ensemble mean",
        description: "Raw forecast captured the synoptic low but spread heavy precipitation across an excessively wide area of eastern and central India.",
        dataType: "nwp_forecast",
        details: {
          "Ensemble Source": "NOAA GEFSv12 (5 members, 0.25°)",
          "Synoptic Feature": "Monsoon Low Pressure System (BoB to inland)",
          "Raw Volume Bias": "Over-dispersed precipitation area (+24% spatial extent)",
        },
      },
      {
        stepIndex: 1,
        title: "2. Forecast Context Identification",
        subtitle: "Monsoon Depression vortex tracking",
        description: "Well-marked low-pressure area over Northwest Bay of Bengal and adjoining coastal Odisha. Context classified: Monsoon Depression / Low; Mechanism: Synoptic Convergence.",
        dataType: "forecast_state",
        details: {
          "Synoptic Context": "Monsoon Low / Depression Track",
          "Vorticity Center": "20.5°N, 86.5°E",
          "Mechanism": "Deep synoptic convergence + moisture transport",
        },
      },
      {
        stepIndex: 2,
        title: "3. Error Atlas Evidence Lookup",
        subtitle: "Central India Depression historical error fingerprint",
        description: "Error Atlas showed 38 historical depression passage cases. Error fingerprint: slight westward displacement bias and over-dispersion of the outer rainbands.",
        dataType: "error_diagnosis",
        details: {
          "Historical Support": "38 depression events across 2000–2017",
          "Dominant Error": "Over-dispersion of convective periphery",
          "Candidate Suitability": "CSG-EMOS volume calibration",
        },
      },
      {
        stepIndex: 3,
        title: "4. Candidate Selection & Heavy-Rain Check",
        subtitle: "Selecting CSG-EMOS calibration model",
        description: "CSG-EMOS selected over Hurdle because depression events feature broad continuous rain areas rather than dry/wet boundaries. Heavy-rain check passed.",
        dataType: "correction_decision",
        details: {
          "Selected Model": "CSG-EMOS (Censored & Shifted Gamma)",
          "Heavy-Rain Check (>64.5 mm)": "PASSED — BSS = +0.262",
          "Action": "Apply spatial volume calibration",
        },
      },
      {
        stepIndex: 4,
        title: "5. Post-Processed Guidance",
        subtitle: "Calibrated precipitation field",
        description: "Precipitation shield sharpened around the vortex track. Outer diffuse drizzle dampened; primary rain core preserved at 130–150 mm/day.",
        dataType: "post_processed",
        details: {
          "Calibrated Shield": "Sharpened core over Odisha/Chhattisgarh border",
          "Area Fraction >64.5 mm": "Sambalpur: 74% expected area fraction",
        },
      },
      {
        stepIndex: 5,
        title: "6. Observational Reference",
        subtitle: "IMD gridded rainfall & station reports",
        description: "Observational reference confirmed that the heaviest rains were concentrated along the southern sector of the depression center, matching the calibrated field.",
        dataType: "observation",
        details: {
          "Observed Center": "Heavy rain confined to southern quadrant",
          "Observed Peak": "142 mm/day (Titlagarh / Bolangir sector)",
        },
      },
      {
        stepIndex: 6,
        title: "7. Verification & Lessons Learned",
        subtitle: "Regional metric gains",
        description: "CRPS in Central India improved from 6.23 mm to 5.81 mm (+6.7%). System limitation: rapid depression track deviations beyond Day +2 remain sensitive to raw NWP vortex positioning.",
        dataType: "verification",
        details: {
          "Raw CRPS": "6.23 mm",
          "MEGHAVYUHA CRPS": "5.81 mm (+6.7% skill)",
          "Spatial FSS (111 km)": "0.62 (skillful at mesoscale)",
        },
      },
    ],
  },
  {
    id: "case-2019-08-14",
    label: "Case 3: 14 August 2019 — Negative / Sparse Evidence Case",
    subtitle: "Break Phase & Arid Northwest — System Deliberately Retains Raw NWP",
    description:
      "A negative / control case reinforcing scientific honesty: During a monsoon break phase over West Rajasthan, " +
      "raw NWP predicted sporadic light drizzle (1–3 mm). Historical Error Atlas lookup showed sparse historical support (<5 independent events). " +
      "Candidate models risked introducing spurious rain occurrence artifacts. MEGHAVYUHA's hierarchical fallback safely triggered: RETAIN RAW NWP.",
    eventDate: "14 August 2019 (00 UTC +24h)",
    region: "Northwest Arid / West Rajasthan",
    peakRainfallMm: 6,
    hasRealData: true,
    outcomeType: "RETAIN_RAW_NEGATIVE",
    rawCrps: 2.54,
    postCrps: 2.54,
    improvementPct: 0.0,
    steps: [
      {
        stepIndex: 0,
        title: "1. Raw NWP Forecast",
        subtitle: "GEFSv12 raw output over arid sector",
        description: "Raw ensemble indicated dry conditions with isolated, noisy grid-point drizzle (1–3 mm) over Jodhpur and Bikaner divisions.",
        dataType: "nwp_forecast",
        details: {
          "Raw Forecast": "Mostly zero rain; scattered 1–3 mm drizzle",
          "Ensemble Agreement": "High dry agreement, sporadic trace members",
        },
      },
      {
        stepIndex: 1,
        title: "2. Forecast Context Identification",
        subtitle: "Break Monsoon / Arid regime",
        description: "Monsoon trough shifted north to Himalayan foothills. Dry continental northwesterly winds prevailing over northwest India.",
        dataType: "forecast_state",
        details: {
          "Synoptic Regime": "Break Monsoon Phase",
          "Regional Domain": "Northwest Arid (Jodhpur / Bikaner / Jaisalmer)",
          "Mean Humidity (850 hPa)": "<35%",
        },
      },
      {
        stepIndex: 2,
        title: "3. Error Atlas Evidence Lookup",
        subtitle: "Hierarchical backoff check for sparse data",
        description: "Error Atlas lookup for 'NW Arid × Break Phase' found only 4 independent historical events in archive. Hierarchical backoff check triggered: insufficient independent evidence for localized correction.",
        dataType: "error_diagnosis",
        details: {
          "Independent Case Support": "4 cases (threshold minimum: 15)",
          "Hierarchical Backoff": "SPECIFIC CONTEXT → BROADER CONTEXT → FIXED CALIBRATED BASELINE",
          "Risk Identified": "High risk of introducing false-positive occurrence bias",
        },
      },
      {
        stepIndex: 3,
        title: "4. Correction Decision & Safeguard",
        subtitle: "System deliberately executes RETAIN RAW NWP",
        description: "Because historical support was sparse and candidate correction showed negative expected validation gain, the system chose NOT to alter the forecast.",
        dataType: "correction_decision",
        details: {
          "Decision": "RETAIN RAW NWP (Hierarchical Fallback)",
          "Reason": "Insufficient independent evidence; correction not justified",
          "Safeguard Status": "TRIGGERED — Protected against degrading raw forecast",
        },
      },
      {
        stepIndex: 4,
        title: "5. Final Guidance",
        subtitle: "Raw NWP distribution delivered with transparency",
        description: "Final product transparently served unmodified raw NWP distribution, displaying an explicit 'Evidence Sparse — Raw Retained' audit badge to the forecaster.",
        dataType: "post_processed",
        details: {
          "Delivered Output": "Unmodified GEFSv12 ensemble distribution",
          "Audit Badge": "RETAIN RAW (Evidence < 15 cases)",
          "Forecaster Transparency": "No black-box distortion applied",
        },
      },
      {
        stepIndex: 5,
        title: "6. Observational Reference",
        subtitle: "Verification against IMD station observations",
        description: "IMD stations recorded completely dry weather across all arid districts (0.0 mm).",
        dataType: "observation",
        details: {
          "Observed Rainfall": "0.0 mm (entire division dry)",
          "Verification Result": "Retaining raw successfully avoided false rain alerts",
        },
      },
      {
        stepIndex: 6,
        title: "7. Verification & Scientific Significance",
        subtitle: "Why the negative case proves system integrity",
        description: "A post-processing system that modifies every forecast indiscriminately degrades dry regimes. MEGHAVYUHA proves its ability to say 'no correction earned its place here.'",
        dataType: "verification",
        details: {
          "Raw CRPS": "2.54 mm",
          "Delivered CRPS": "2.54 mm (Zero degradation)",
          "Key Takeaway": "Selective restraint is as important as active correction",
        },
      },
    ],
  },
];
