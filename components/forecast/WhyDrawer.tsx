"use client";

// MEGHAVYUHA — Decision Evidence Panel (WhyDrawer)
// FORECAST CONTEXT → ERROR EVIDENCE → CORRECTION SELECTION → HEAVY-RAIN CHECK → SPATIAL EVIDENCE → FINAL GUIDANCE
// Smart India Hackathon 2026 | PS 26080 | Against The Odds (Team 149284)

import React from "react";
import { useRaiseStore } from "@/store/useRaiseStore";
import { DEMO_DISTRICTS, ROUTER_DECISIONS } from "@/lib/mock/districtForecasts";

export function WhyDrawer() {
  const { whyOpen, setWhyOpen, selectedDistrictId, leadDay } = useRaiseStore();

  if (!whyOpen) return null;

  const district = selectedDistrictId
    ? DEMO_DISTRICTS.find((d) => d.districtId === selectedDistrictId)
    : DEMO_DISTRICTS.find((d) => d.districtId === "uttarakhand-dehradun") ?? DEMO_DISTRICTS[0];
  const router = selectedDistrictId
    ? ROUTER_DECISIONS[selectedDistrictId]
    : ROUTER_DECISIONS["uttarakhand-dehradun"];

  const isRawRetained = !router?.correctionActive || router?.selectedModel === "raw";

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) setWhyOpen(false);
      }}
      style={{ zIndex: 1000 }}
    >
      <div
        className="panel modal-panel"
        style={{
          padding: 0,
          overflow: "hidden",
          maxWidth: 680,
          width: "92vw",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          background: "#080c16",
          border: "1px solid rgba(80, 140, 255, 0.25)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid rgba(80, 140, 255, 0.18)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(90deg, rgba(74, 143, 255, 0.08), rgba(0, 212, 255, 0.03))",
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7ab4ff" }}>
                DECISION EVIDENCE TRACE
              </div>
              <span
                style={{
                  fontSize: 7.5,
                  padding: "1px 6px",
                  borderRadius: 3,
                  fontWeight: 700,
                  background: isRawRetained ? "rgba(245, 166, 35, 0.15)" : "rgba(34, 214, 138, 0.15)",
                  color: isRawRetained ? "#f5a623" : "#22d68a",
                  border: `1px solid ${isRawRetained ? "rgba(245,166,35,0.3)" : "rgba(34,214,138,0.3)"}`,
                }}
              >
                {isRawRetained ? "RETAIN RAW OUTCOME" : "CORRECTION APPLIED"}
              </span>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
              {district?.districtName}, {district?.state} · Lead Day +{leadDay} · Evaluated Against Historical Error Archive
            </div>
          </div>
          <button
            onClick={() => setWhyOpen(false)}
            aria-label="Close Decision Evidence Drawer"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-dim)",
              cursor: "pointer",
              padding: "5px 10px",
              fontSize: 12,
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: "18px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* Conceptual Flow Banner */}
          <div
            style={{
              padding: "8px 12px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--hairline)",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 8.5,
              color: "var(--text-faint)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span style={{ color: "#7ab4ff" }}>1. CONTEXT</span>
            <span>→</span>
            <span style={{ color: "#f5a623" }}>2. ERROR ATLAS</span>
            <span>→</span>
            <span style={{ color: "#22d68a" }}>3. SELECTION</span>
            <span>→</span>
            <span style={{ color: "#ff7043" }}>4. HEAVY RAIN</span>
            <span>→</span>
            <span style={{ color: "#8f7cff" }}>5. SPATIAL</span>
            <span>→</span>
            <span style={{ color: "#00d4ff", fontWeight: 700 }}>6. GUIDANCE</span>
          </div>

          {/* STEP 1: FORECAST CONTEXT */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--hairline)", borderRadius: 6, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: "#7ab4ff", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                1. Forecast Context Identification
              </div>
              <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>Conditioning Basis</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              <div style={{ padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 4 }}>
                <div style={{ fontSize: 8, color: "var(--text-faint)" }}>SYNOPTIC REGIME</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginTop: 2 }}>{district?.regime}</div>
              </div>
              <div style={{ padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 4 }}>
                <div style={{ fontSize: 8, color: "var(--text-faint)" }}>PHYSICAL MECHANISM</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginTop: 2 }}>{district?.mechanism}</div>
              </div>
              <div style={{ padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 4 }}>
                <div style={{ fontSize: 8, color: "var(--text-faint)" }}>ENSEMBLE DISPERSION</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#f5a623", marginTop: 2 }}>{district?.ensembleSpread} Spread</div>
              </div>
            </div>
          </div>

          {/* STEP 2: ERROR ATLAS EVIDENCE */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--hairline)", borderRadius: 6, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: "#f5a623", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                2. Historical Error Atlas Lookup
              </div>
              <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>Archive: 2000–2017 JJAS</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <div style={{ padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 4 }}>
                <div style={{ fontSize: 8, color: "var(--text-faint)" }}>INDEPENDENT CASE SUPPORT</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#c8deff", marginTop: 2 }}>
                  42 Independent Forecast Dates
                </div>
                <div style={{ fontSize: 7.5, color: "var(--text-faint)", marginTop: 2 }}>
                  *Counted at date/event level, not correlated grid pixels
                </div>
              </div>
              <div style={{ padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 4 }}>
                <div style={{ fontSize: 8, color: "var(--text-faint)" }}>RECORDED ERROR BEHAVIOUR</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#f5a623", marginTop: 2 }}>
                  {district?.regime.includes("Orographic")
                    ? "Systematic Windward Wet Bias (+35%)"
                    : district?.regime.includes("Coastal")
                    ? "Coastal Convergence Displacement Error"
                    : "Moderate Amplitude & Trace Occurrence Bias"}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 9, color: "var(--text-dim)", lineHeight: 1.4 }}>
              <strong>Hierarchical Backoff Status:</strong> Sufficient specific context events exist (&gt;15 independent dates). Specific regional Atlas lookup active; fallback to broader climatological baseline not required.
            </div>
          </div>

          {/* STEP 3: CANDIDATE CORRECTION SELECTION */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--hairline)", borderRadius: 6, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: "#22d68a", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                3. Candidate Method Evaluation & Selection
              </div>
              <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>Predictive Distribution Loss</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 8 }}>
              {[
                { name: "Raw NWP", crps: "4.87 mm", selected: router?.selectedModel === "raw" },
                { name: "CSG-EMOS", crps: "4.34 mm", selected: router?.selectedModel === "emos" },
                { name: "Hurdle Model", crps: "4.11 mm", selected: router?.selectedModel === "adaptive" || router?.selectedModel === "ml-emos" },
                { name: "Double-Gamma QM", crps: "5.85 mm", selected: router?.selectedModel === "qm" },
              ].map((cand) => (
                <div
                  key={cand.name}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 4,
                    background: cand.selected ? "rgba(34, 214, 138, 0.12)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${cand.selected ? "rgba(34, 214, 138, 0.4)" : "var(--hairline)"}`,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 8, color: cand.selected ? "#22d68a" : "var(--text-faint)", fontWeight: cand.selected ? 700 : 400 }}>
                    {cand.name}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: cand.selected ? "#22d68a" : "var(--text-dim)", marginTop: 2 }}>
                    {cand.crps}
                  </div>
                  {cand.selected && (
                    <div style={{ fontSize: 7, color: "#22d68a", fontWeight: 800, marginTop: 1 }}>SELECTED</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 4: HEAVY-RAIN SAFEGUARD CHECK */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--hairline)", borderRadius: 6, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: "#ff7043", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                4. Heavy-Rain Safeguard Check (&gt;64.5 mm)
              </div>
              <div style={{ fontSize: 8.5, color: "#22d68a", fontWeight: 700 }}>STATUS: PASSED</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
              <div style={{ padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 4 }}>
                <div style={{ fontSize: 8, color: "var(--text-faint)" }}>HEAVY THRESHOLD</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#f5a623", marginTop: 2 }}>P(&gt;64.5mm): {district?.probabilityHeavy}%</div>
              </div>
              <div style={{ padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 4 }}>
                <div style={{ fontSize: 8, color: "var(--text-faint)" }}>VERY HEAVY THRESHOLD</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#ff7043", marginTop: 2 }}>P(&gt;115.6mm): {district?.probabilityVeryHeavy}%</div>
              </div>
              <div style={{ padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 4 }}>
                <div style={{ fontSize: 8, color: "var(--text-faint)" }}>EXTREME THRESHOLD</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#ff3b4e", marginTop: 2 }}>P(&gt;204.5mm): {district?.probabilityExtreme}%</div>
              </div>
            </div>
            <div style={{ fontSize: 9, color: "var(--text-dim)", lineHeight: 1.4 }}>
              <strong>Verification Metric:</strong> Heavy-rain Brier Skill Score preserved at +0.218 vs. raw 0.000. Post-processing calibrates probability spread without truncating legitimate tail extremes.
            </div>
          </div>

          {/* STEP 5: SPATIAL EVIDENCE */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--hairline)", borderRadius: 6, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: "#8f7cff", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                5. Spatial Evidence & Resolution Support
              </div>
              <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>FSS Scale Analysis</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <div style={{ padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 4 }}>
                <div style={{ fontSize: 8, color: "var(--text-faint)" }}>VERIFIED EFFECTIVE SCALE</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#c8deff", marginTop: 2 }}>
                  ~111 km (Neighbourhood Scale)
                </div>
                <div style={{ fontSize: 7.5, color: "var(--text-faint)", marginTop: 2 }}>
                  FSS crosses skill threshold (0.58) at ~100 km; raw grid (28 km) FSS is 0.28.
                </div>
              </div>
              <div style={{ padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 4 }}>
                <div style={{ fontSize: 8, color: "var(--text-faint)" }}>DISTRICT AGGREGATION</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#f5a623", marginTop: 2 }}>
                  {district?.spatialExceedanceProbability}% Expected Area Fraction
                </div>
                <div style={{ fontSize: 7.5, color: "var(--text-faint)", marginTop: 2 }}>
                  Expected fraction of district area exceeding 64.5 mm (accounts for point-correlation).
                </div>
              </div>
            </div>
          </div>

          {/* STEP 6: FINAL GUIDANCE */}
          <div
            style={{
              padding: "12px 14px",
              background: isRawRetained ? "rgba(122, 139, 164, 0.08)" : "rgba(0, 196, 167, 0.08)",
              border: `1px solid ${isRawRetained ? "var(--hairline)" : "rgba(0, 196, 167, 0.3)"}`,
              borderRadius: 6,
            }}
          >
            <div style={{ fontSize: 9.5, fontWeight: 700, color: isRawRetained ? "var(--text-dim)" : "var(--teal)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
              6. Final Post-Processing Guidance & Deterministic Rationale
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
              {isRawRetained
                ? "DECISION: RETAIN RAW NWP (Hierarchical Safeguard Active)"
                : `DECISION: APPLY CALIBRATED ${router?.selectedModel.toUpperCase()} GUIDANCE`}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {router?.reason.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 6, fontSize: 10, color: "var(--text-dim)", lineHeight: 1.4 }}>
                  <span style={{ color: "var(--cyan)" }}>◆</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 8.5, color: "var(--text-faint)", marginTop: 8, fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 6 }}>
              Fallback Policy: If downstream spatial checks fail, automatic hierarchical backoff defaults to {router?.fallbackModel.toUpperCase()}.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
