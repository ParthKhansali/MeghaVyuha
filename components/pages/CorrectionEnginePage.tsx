"use client";

// MEGHAVYUHA — Correction Engine Page
// FORECAST CONTEXT → ERROR EVIDENCE → CORRECTION SELECTION → HEAVY-RAIN CHECK → SPATIAL EVIDENCE → FINAL GUIDANCE
// Smart India Hackathon 2026 | PS 26080 | Against The Odds (Team 149284)

import React, { useState } from "react";

const PANEL: React.CSSProperties = {
  background: "rgba(8, 12, 22, 0.85)",
  border: "1px solid rgba(80, 140, 255, 0.14)",
  borderRadius: 8,
  padding: 16,
};

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 9.5,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "rgba(160, 185, 220, 0.7)",
  marginBottom: 10,
};

type ModuleStatus = "operational" | "evaluated" | "experimental" | "planned";

interface PipelineModule {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  description: string;
  status: ModuleStatus;
  inputs: string[];
  outputs: string[];
  decisionLogic: string;
}

interface CorrectionMethod {
  id: string;
  label: string;
  fullName: string;
  status: ModuleStatus;
  crpsResult: string;
  description: string;
  distributionType: string;
  tailHandling: string;
  errorTypes: string[];
  regimes: string[];
}

const PIPELINE_MODULES: PipelineModule[] = [
  {
    id: "context-identification",
    step: 1,
    title: "Forecast Context Identification",
    subtitle: "Atmospheric, geographical, and ensemble state conditioning",
    description: "Evaluates forecast-available synoptic circulation (850 hPa wind vectors, vorticity, moisture flux), geographical features (orographic slope, coast distance), and ensemble spread.",
    status: "evaluated",
    inputs: ["NOAA GEFSv12 ensemble mean & spread", "850 hPa low-level wind fields", "Local terrain elevation & coast proximity"],
    outputs: ["Synoptic regime context proxy", "Physical mechanism vector (Orographic, Coastal, Convective, Plains)", "Ensemble dispersion index"],
    decisionLogic: "Conditioning variables must be available at forecast initialization time — no observational look-ahead permitted.",
  },
  {
    id: "error-atlas-lookup",
    step: 2,
    title: "Historical Error Atlas Lookup",
    subtitle: "Evidence archive query & sample support check",
    description: "Queries the Error Atlas for historical forecast events under the matched context. Verifies that independent case support is sufficient (&ge;15 independent dates) before allowing specific routing.",
    status: "evaluated",
    inputs: ["Context vector", "Lead time (Day +1 to +3)", "Historical archive (2000–2017)"],
    outputs: ["Recorded error fingerprint (Occurrence, Amplitude, Displacement, Spread)", "Independent case support count", "Hierarchical backoff flag"],
    decisionLogic: "If independent events < 15, system automatically triggers hierarchical backoff: Specific Context → Broader Context → Fixed Calibrated Baseline.",
  },
  {
    id: "candidate-selection",
    step: 3,
    title: "Candidate Correction Selection",
    subtitle: "Parsimonious calibrated models matched to diagnosed error",
    description: "Selects among compact parametric models (Raw Ensemble, CSG-EMOS, Two-stage Hurdle model, Double-Gamma QM comparator). Every candidate produces a complete, proper predictive distribution.",
    status: "evaluated",
    inputs: ["Diagnosed error fingerprint", "Ensemble forecast members", "Error Atlas empirical loss matrix"],
    outputs: ["Selected candidate model", "Distribution parameters", "Benchmark expected CRPS gain"],
    decisionLogic: "Empirical evaluation confirmed: Complex ML routers show an overfitting penalty (+0.065 mm CRPS). Parsimonious calibrated models in an Error Atlas are superior.",
  },
  {
    id: "heavy-rain-check",
    step: 4,
    title: "Heavy-Rain Safeguard Check",
    subtitle: "Operational threshold safety (>64.5 mm/day)",
    description: "Evaluates whether the candidate correction preserves or improves heavy-rainfall discernment. Brier Skill Score (BSS) must remain positive; otherwise correction is flagged for safeguard fallback.",
    status: "evaluated",
    inputs: ["Threshold exceedances (64.5 mm, 115.6 mm, 204.5 mm)", "Raw ensemble heavy-rain spread", "Historical BSS"],
    outputs: ["Heavy-rain check status (PASSED / SAFEGUARD TRIGGERED)", "Calibrated threshold exceedance probabilities"],
    decisionLogic: "Prevents over-smoothing in extreme convective cells. If correction dampens legitimate tail peaks below raw skill, system retains raw forecast.",
  },
  {
    id: "spatial-evidence",
    step: 5,
    title: "Spatial Evidence & Resolution Support",
    subtitle: "Fractions Skill Score (FSS) neighbourhood scaling",
    description: "Evaluates the spatial scale at which the probabilistic signal has verified skill. Aggregates to district administrative boundaries via mathematically sound area-fraction expectations.",
    status: "evaluated",
    inputs: ["Gridded probabilistic fields (0.25°)", "FSS scale curves (28 km to 200 km)", "Survey of India district polygons"],
    outputs: ["Effective verified scale (~111 km neighbourhood)", "Expected district area fraction exceeding threshold (%)"],
    decisionLogic: "Does NOT falsely equate average grid probability to 'district-wide probability'; explicitly formats output as expected district area fraction.",
  },
  {
    id: "final-guidance",
    step: 6,
    title: "Final Guidance & Decision Evidence Trace",
    subtitle: "Transparent forecaster decision product",
    description: "Produces the final post-processed probabilistic guidance accompanied by an inspectable audit trace showing exactly why the correction was applied or why raw NWP was retained.",
    status: "evaluated",
    inputs: ["Calibrated distribution", "Safeguard check result", "Resolution support"],
    outputs: ["Final probabilistic forecast", "Full 6-step Decision Evidence trace", "Fallback transparency tag"],
    decisionLogic: "Every forecast delivered carries an inspectable audit trail. A 'retain raw' outcome is treated as a successful safeguard, not a system failure.",
  },
];

const CORRECTION_METHODS: CorrectionMethod[] = [
  {
    id: "raw",
    label: "Raw NWP Ensemble",
    fullName: "Uncalibrated GEFSv12 Ensemble Baseline",
    status: "operational",
    crpsResult: "4.871 mm (B1 Baseline)",
    distributionType: "Empirical 5-member ensemble distribution",
    tailHandling: "Unmodified raw ensemble variance",
    description: "Unmodified numerical weather prediction ensemble output. Baseline for all skill comparisons. Retained when historical evidence is sparse or when corrections degrade extreme tails.",
    errorTypes: ["Reference baseline"],
    regimes: ["All regimes — operational reference and safeguard fallback"],
  },
  {
    id: "hurdle",
    label: "Occurrence Hurdle Model",
    fullName: "Two-Stage Logistic + Truncated Gamma Hurdle",
    status: "evaluated",
    crpsResult: "4.111 mm (+15.6% CRPSS)",
    distributionType: "Mixture: Bernoulli P(R>0) + Truncated Gamma for amount",
    tailHandling: "Separate tail fitting via non-linear gamma shape parameter",
    description: "Decomposes rainfall forecasting into two explicit stages: occurrence probability via logistic regression, and amount given occurrence via truncated Gamma distribution. Excels at removing false-alarm drizzle in break phases.",
    errorTypes: ["Occurrence", "Amplitude"],
    regimes: ["Plains (IGP)", "Break Phase", "Northwest Dry Transition"],
  },
  {
    id: "emos",
    label: "CSG-EMOS",
    fullName: "Censored & Shifted Gamma Ensemble Model Output Statistics",
    status: "evaluated",
    crpsResult: "4.340 mm (+10.9% CRPSS)",
    distributionType: "Censored & Shifted Gamma continuous predictive distribution",
    tailHandling: "Shifted gamma parameter prevents zero-inflation distortion",
    description: "Parametric post-processing that calibrates ensemble mean and spread jointly. Non-homogeneous regression ensures predictive distribution widens under high atmospheric uncertainty and sharpens under consensus.",
    errorTypes: ["Amplitude", "Spread", "Dispersion"],
    regimes: ["Active Monsoon", "Monsoon Depression", "Western Ghats Coastal Face"],
  },
  {
    id: "qm",
    label: "Double-Gamma QM (Comparator)",
    fullName: "Parametric Double-Gamma Quantile Mapping",
    status: "evaluated",
    crpsResult: "5.848 mm (-20.1% CRPSS — Tail Penalty)",
    distributionType: "Quantile-to-quantile CDF transfer function",
    tailHandling: "Unstable extrapolation in extreme tails (>99th percentile)",
    description: "Evaluated strictly as a baseline comparator. While QM adjusts mean climatology, our empirical audit proved it severely degrades extreme precipitation tails (-20.1% CRPSS), demonstrating why MEGHAVYUHA avoids standalone QM.",
    errorTypes: ["Amplitude (mean only)"],
    regimes: ["Baseline comparator only — not recommended for extreme monsoon rainfall"],
  },
  {
    id: "bias",
    label: "Mean Bias Correction",
    fullName: "Context-Stratified Mean Bias Adjustment",
    status: "evaluated",
    crpsResult: "4.500 mm (+7.6% CRPSS)",
    distributionType: "Shifted empirical ensemble members",
    tailHandling: "Uniform additive/multiplicative scaling",
    description: "Simple linear or multiplicative bias removal conditioned on physiographic region. Serves as a useful lower benchmark; fails to resolve conditional spread errors.",
    errorTypes: ["Linear amplitude bias"],
    regimes: ["Broad regional domains"],
  },
];

const STATUS_CONFIG: Record<ModuleStatus, { color: string; label: string; bg: string }> = {
  operational: { color: "#22d68a", label: "OPERATIONAL BASELINE", bg: "rgba(34,214,138,0.12)" },
  evaluated: { color: "#4a8fff", label: "BENCHMARK EVALUATED", bg: "rgba(74,143,255,0.12)" },
  experimental: { color: "#f5a623", label: "EXPERIMENTAL", bg: "rgba(245,166,35,0.12)" },
  planned: { color: "#7a8ba4", label: "PLANNED V2", bg: "rgba(122,139,164,0.12)" },
};

export default function CorrectionEnginePage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>("candidate-selection");
  const [selectedMethodId, setSelectedMethodId] = useState<string>("hurdle");

  const activeModule = PIPELINE_MODULES.find((m) => m.id === selectedModuleId) ?? PIPELINE_MODULES[2];
  const activeMethod = CORRECTION_METHODS.find((m) => m.id === selectedMethodId) ?? CORRECTION_METHODS[1];

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "16px 20px 28px",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "0.01em" }}>
            Correction Engine & Post-Processing Architecture
          </div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 3 }}>
            Context → Error Evidence → Correction Selection → Heavy-Rain Safeguard → Spatial Support → Final Guidance
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div
            style={{
              padding: "4px 9px",
              background: "rgba(34, 214, 138, 0.12)",
              border: "1px solid rgba(34, 214, 138, 0.35)",
              borderRadius: 4,
              fontSize: 9,
              fontWeight: 700,
              color: "#22d68a",
              letterSpacing: "0.06em",
            }}
          >
            PARSIMONIOUS CALIBRATED MODELS
          </div>
          <div
            style={{
              padding: "4px 9px",
              background: "rgba(74, 143, 255, 0.12)",
              border: "1px solid rgba(74, 143, 255, 0.35)",
              borderRadius: 4,
              fontSize: 9,
              fontWeight: 700,
              color: "#7ab4ff",
              letterSpacing: "0.06em",
            }}
          >
            PROPER PREDICTIVE DISTRIBUTIONS
          </div>
        </div>
      </div>

      {/* Core Principle Alert */}
      <div
        style={{
          padding: "10px 14px",
          background: "rgba(74, 143, 255, 0.05)",
          border: "1px solid rgba(74, 143, 255, 0.2)",
          borderRadius: 6,
          fontSize: 10,
          color: "var(--text-dim)",
          lineHeight: 1.5,
        }}
      >
        <strong style={{ color: "#7ab4ff" }}>Scientific Thesis:</strong> MEGHAVYUHA rejects black-box deep learning models in favor of compact, calibrated statistical post-processing methods (CSG-EMOS, Hurdle) conditioned on an inspectable Error Atlas. 
        In retrospective JJAS 2019 evaluation, a complex gradient-boosted ML router produced an overfitting penalty (+0.065 mm higher CRPS) compared to the Error Atlas lookup, validating that scientific rigor and parsimony outperform model complexity.
      </div>

      {/* 6-Stage Pipeline Interactive Stepper */}
      <div style={PANEL}>
        <div style={SECTION_LABEL}>Operational Post-Processing Decision Chain (Click to Inspect)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
          {PIPELINE_MODULES.map((m) => {
            const isSelected = m.id === selectedModuleId;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedModuleId(m.id)}
                style={{
                  padding: "10px 8px",
                  borderRadius: 6,
                  cursor: "pointer",
                  border: isSelected ? "1px solid #7ab4ff" : "1px solid var(--hairline)",
                  background: isSelected ? "rgba(74, 143, 255, 0.16)" : "rgba(255,255,255,0.02)",
                  color: isSelected ? "#fff" : "var(--text-dim)",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ fontSize: 8, color: isSelected ? "#7ab4ff" : "var(--text-faint)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                  STEP 0{m.step}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.2 }}>
                  {m.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Deep Dive Card */}
        <div
          style={{
            marginTop: 14,
            padding: 14,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(80,140,255,0.2)",
            borderRadius: 6,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#7ab4ff" }}>
                Step 0{activeModule.step}: {activeModule.title}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 2 }}>
                {activeModule.subtitle}
              </div>
            </div>
            <span
              style={{
                fontSize: 8,
                padding: "2px 7px",
                borderRadius: 3,
                fontWeight: 800,
                background: STATUS_CONFIG[activeModule.status].bg,
                color: STATUS_CONFIG[activeModule.status].color,
                border: `1px solid ${STATUS_CONFIG[activeModule.status].color}44`,
              }}
            >
              {STATUS_CONFIG[activeModule.status].label}
            </span>
          </div>

          <div style={{ fontSize: 10.5, color: "var(--text-dim)", lineHeight: 1.6 }}>
            {activeModule.description}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ padding: "8px 10px", background: "rgba(0,0,0,0.25)", borderRadius: 5 }}>
              <div style={{ fontSize: 8, color: "var(--text-faint)", textTransform: "uppercase" }}>INPUT VARIABLES</div>
              <ul style={{ margin: "4px 0 0 14px", padding: 0, fontSize: 9.5, color: "var(--text-dim)" }}>
                {activeModule.inputs.map((inp, idx) => (
                  <li key={idx}>{inp}</li>
                ))}
              </ul>
            </div>

            <div style={{ padding: "8px 10px", background: "rgba(0,0,0,0.25)", borderRadius: 5 }}>
              <div style={{ fontSize: 8, color: "var(--text-faint)", textTransform: "uppercase" }}>DELIVERED OUTPUTS</div>
              <ul style={{ margin: "4px 0 0 14px", padding: 0, fontSize: 9.5, color: "#22d68a" }}>
                {activeModule.outputs.map((out, idx) => (
                  <li key={idx}>{out}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ fontSize: 9.5, color: "var(--text-dim)", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 8 }}>
            <strong>Governing Decision Logic:</strong> {activeModule.decisionLogic}
          </div>
        </div>
      </div>

      {/* Candidate Calibrated Models Section */}
      <div style={PANEL}>
        <div style={SECTION_LABEL}>Candidate Post-Processing Models (Complete Predictive Distributions)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 12 }}>
          {CORRECTION_METHODS.map((m) => {
            const isSelected = m.id === selectedMethodId;
            const isQm = m.id === "qm";
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMethodId(m.id)}
                style={{
                  padding: "10px",
                  borderRadius: 6,
                  cursor: "pointer",
                  border: isSelected ? "1px solid #22d68a" : "1px solid var(--hairline)",
                  background: isSelected ? "rgba(34, 214, 138, 0.12)" : "rgba(255,255,255,0.02)",
                  color: isSelected ? "#fff" : "var(--text-dim)",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: isSelected ? "#22d68a" : "#fff" }}>
                    {m.label}
                  </span>
                  {isQm && <span style={{ fontSize: 7, color: "#ff7043", fontWeight: 700 }}>BASELINE ONLY</span>}
                </div>
                <div style={{ fontSize: 8.5, color: isSelected ? "#22d68a" : "var(--text-faint)", fontFamily: "var(--font-mono)" }}>
                  {m.crpsResult.split(" (")[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Method Details Card */}
        <div
          style={{
            padding: 14,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(34,214,138,0.25)",
            borderRadius: 6,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{activeMethod.fullName}</div>
              <div style={{ fontSize: 10, color: "#22d68a", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                Measured Held-Out Performance: {activeMethod.crpsResult}
              </div>
            </div>
            <span
              style={{
                fontSize: 8,
                padding: "2px 7px",
                borderRadius: 3,
                fontWeight: 800,
                background: STATUS_CONFIG[activeMethod.status].bg,
                color: STATUS_CONFIG[activeMethod.status].color,
                border: `1px solid ${STATUS_CONFIG[activeMethod.status].color}44`,
              }}
            >
              {STATUS_CONFIG[activeMethod.status].label}
            </span>
          </div>

          <div style={{ fontSize: 10.5, color: "var(--text-dim)", lineHeight: 1.6 }}>
            {activeMethod.description}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
            <div style={{ fontSize: 9.5, color: "var(--text-dim)" }}>
              <strong>Distribution Formulation:</strong> {activeMethod.distributionType}
            </div>
            <div style={{ fontSize: 9.5, color: "var(--text-dim)" }}>
              <strong>Extreme-Tail Handling:</strong> {activeMethod.tailHandling}
            </div>
          </div>
        </div>
      </div>

      {/* System Architecture Diagram Card */}
      <div style={PANEL}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={SECTION_LABEL}>End-to-End System Architecture (Figure 29)</div>
          <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>NOAA GEFSv12 &rarr; MEGHAVYUHA &rarr; District Delivery</div>
        </div>

        <div
          style={{
            borderRadius: 6,
            overflow: "hidden",
            border: "1px solid rgba(80, 140, 255, 0.2)",
            background: "#050811",
            display: "flex",
            justifyContent: "center",
            padding: 10,
          }}
        >
          <img
            src="/research/Main/fig29_final_architecture_diagram.png"
            alt="MEGHAVYUHA Final Architecture Diagram"
            style={{
              maxWidth: "100%",
              maxHeight: 380,
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}
