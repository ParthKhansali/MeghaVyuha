"use client";

// MEGHAVYUHA — District Intelligence Page
// REGIME → ERROR → CORRECTION → TRUST — district-level decision product
// ⚠ ALL FORECAST VALUES ARE ILLUSTRATIVE PROTOTYPE DATA — NOT VALIDATED RESULTS

import React, { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useMeghaVyuhaStore } from "@/store/useMeghaVyuhaStore";
import { DEMO_DISTRICTS, ROUTER_DECISIONS } from "@/lib/mock/districtForecasts";
import { getForecastEvolution } from "@/lib/mock/validation";
import type { DistrictForecast, ForecastModel } from "@/types/forecast";

// ── Illustrative Soft Regime State for a given district ──────────────────────
function getSoftRegime(district: DistrictForecast) {
  const sm = district.synopticRegime;
  if (sm === "Active") return { active: 54, depression: 28, breakPhase: 9, westernDisturbance: 5, other: 4 };
  if (sm === "Moderate") return { active: 22, depression: 18, breakPhase: 38, westernDisturbance: 12, other: 10 };
  if (sm === "Break") return { active: 5, depression: 8, breakPhase: 72, westernDisturbance: 10, other: 5 };
  return { active: 30, depression: 20, breakPhase: 20, westernDisturbance: 20, other: 10 };
}

function getSoftMechanism(district: DistrictForecast) {
  const m = district.mechanism;
  if (m === "Orographic") return { orographic: 72, coastal: 8, convective: 12, plains: 8 };
  if (m === "Coastal") return { orographic: 10, coastal: 68, convective: 18, plains: 4 };
  if (m === "Convective") return { orographic: 15, coastal: 5, convective: 65, plains: 15 };
  return { orographic: 20, coastal: 15, convective: 25, plains: 40 };
}

// ── IMD-style 4×4 Probability Matrix ─────────────────────────────────────────
const THRESHOLDS = ["No Heavy Rain\n(<64.5mm)", "Heavy\n(>64.5mm)", "Very Heavy\n(>115.6mm)", "Extremely Heavy\n(>204.5mm)"];
const PROB_BINS = [">90%", "60–90%", "30–60%", "0–30%"];

function computeMatrix(district: DistrictForecast): number[][] {
  const pH = district.probabilityHeavy / 100;
  const pVH = district.probabilityVeryHeavy / 100;
  const pE = district.probabilityExtreme / 100;
  const pNone = 1 - pH;
  const pHeavyOnly = pH - pVH;
  const pVHOnly = pVH - pE;

  const toBin = (p: number): number => {
    if (p > 0.9) return 0; // >90%
    if (p > 0.6) return 1; // 60-90%
    if (p > 0.3) return 2; // 30-60%
    return 3;               // 0-30%
  };

  const matrix: number[][] = Array(4).fill(null).map(() => Array(4).fill(0));
  matrix[toBin(pNone)][0] = Math.round(pNone * 100);
  matrix[toBin(pHeavyOnly)][1] = Math.round(pHeavyOnly * 100);
  matrix[toBin(pVHOnly)][2] = Math.round(pVHOnly * 100);
  matrix[toBin(pE)][3] = Math.round(pE * 100);
  return matrix;
}

// ── Shared tokens ─────────────────────────────────────────────────────────────
const PANEL_STYLE: React.CSSProperties = {
  background: "rgba(8, 12, 22, 0.82)",
  border: "1px solid rgba(80, 140, 255, 0.12)",
  borderRadius: 8,
  padding: 14,
};

const SECTION_LABEL_STYLE: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "rgba(160, 185, 220, 0.6)",
  marginBottom: 8,
};

const ILLUS_BADGE: React.CSSProperties = {
  display: "inline-block",
  fontSize: 8,
  padding: "2px 6px",
  background: "rgba(245, 166, 35, 0.12)",
  border: "1px solid rgba(245, 166, 35, 0.3)",
  borderRadius: 3,
  color: "#f5a623",
  letterSpacing: "0.04em",
  fontWeight: 700,
  marginLeft: 6,
};

function IllusBadge({ label = "ILLUSTRATIVE" }: { label?: string }) {
  return <span style={ILLUS_BADGE}>{label}</span>;
}

function ReliabilityDot({ level }: { level: string }) {
  const color = level === "HIGH" ? "#22d68a" : level === "MODERATE" ? "#f5a623" : "#7a8ba4";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0, display: "inline-block" }} />
      <span style={{ color, fontSize: 10, fontWeight: 700 }}>{level}</span>
    </span>
  );
}

function DecisionActionBlock({ gate }: { gate: "CORRECT" | "RETAIN_RAW" }) {
  const isCorrect = gate === "CORRECT";
  return (
    <div
      style={{
        background: isCorrect ? "rgba(0, 196, 167, 0.12)" : "rgba(120, 120, 140, 0.12)",
        border: `1px solid ${isCorrect ? "rgba(0, 196, 167, 0.4)" : "rgba(100, 100, 120, 0.35)"}`,
        borderRadius: 6,
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: isCorrect ? "rgba(0, 196, 167, 0.2)" : "rgba(100, 100, 120, 0.2)",
          border: `2px solid ${isCorrect ? "#00c4a7" : "#6a6a80"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 14,
        }}
      >
        {isCorrect ? "✓" : "🛡️"}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: isCorrect ? "#00c4a7" : "#c8deff", letterSpacing: "0.04em" }}>
          {isCorrect ? "APPLY CORRECTION" : "RETAIN RAW NWP"}
        </div>
        <div style={{ fontSize: 9.5, color: "var(--text-faint)", marginTop: 2 }}>
          {isCorrect
            ? "Historical Error Atlas evidence indicates calibrated post-processing adds skill"
            : "Hierarchical safeguard active: sparse evidence or raw forecast is already optimal"}
        </div>
      </div>
      <IllusBadge />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DistrictIntelligencePage() {
  const { selectDistrict, requestFlyTo } = useMeghaVyuhaStore();
  const [selectedId, setSelectedId] = useState("uttarakhand-dehradun");
  const [leadDay, setLeadDay] = useState(1);
  const [showAudit, setShowAudit] = useState(false);

  const district = useMemo(
    () => DEMO_DISTRICTS.find((d) => d.districtId === selectedId) ?? DEMO_DISTRICTS[0],
    [selectedId]
  );
  const routerDecision = useMemo(
    () => ROUTER_DECISIONS[selectedId] ?? Object.values(ROUTER_DECISIONS)[0],
    [selectedId]
  );
  const softRegime = useMemo(() => getSoftRegime(district), [district]);
  const softMech = useMemo(() => getSoftMechanism(district), [district]);
  const matrix = useMemo(() => computeMatrix(district), [district]);
  const evolution = useMemo(() => getForecastEvolution(district.districtId, district.expectedRainfallMm), [district]);

  const trustGate: "CORRECT" | "RETAIN_RAW" = district.reliability === "HIGH" ? "CORRECT" : "RETAIN_RAW";
  const likelyError = district.mechanism === "Orographic" ? "Amplitude (wet bias)" :
    district.mechanism === "Coastal" ? "Amplitude / occurrence" : "Occurrence";
  const correctionCandidate = routerDecision.selectedModel === "emos" ? "EMOS" :
    routerDecision.selectedModel === "qm" ? "Quantile Mapping" : "EMOS";

  function handleDistrictChange(id: string) {
    setSelectedId(id);
    const d = DEMO_DISTRICTS.find((x) => x.districtId === id);
    if (d) { selectDistrict(id); requestFlyTo(d.lon, d.lat, 8); }
  }

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
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "0.01em" }}>
            District Intelligence
          </div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 3 }}>
            Forecast Context → Error Evidence → Correction Selection → Spatial Guidance
          </div>
        </div>
        <div
          style={{
            padding: "5px 10px",
            background: "rgba(245, 166, 35, 0.1)",
            border: "1px solid rgba(245, 166, 35, 0.3)",
            borderRadius: 4,
            fontSize: 9,
            fontWeight: 700,
            color: "#f5a623",
            letterSpacing: "0.06em",
          }}
        >
          ILLUSTRATIVE PROTOTYPE — NOT VALIDATED RESULTS
        </div>
      </div>

      {/* ── Controls Row ── */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={SECTION_LABEL_STYLE}>District</label>
          <select
            value={selectedId}
            onChange={(e) => handleDistrictChange(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid var(--hairline)",
              borderRadius: 5, color: "var(--text)", fontSize: 11, padding: "5px 10px", cursor: "pointer",
            }}
          >
            {DEMO_DISTRICTS.map((d) => (
              <option key={d.districtId} value={d.districtId} style={{ background: "#0a0f1c" }}>
                {d.districtName}, {d.state}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={SECTION_LABEL_STYLE}>Lead Day</label>
          <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3, 5, 7].map((d) => (
              <button
                key={d}
                onClick={() => setLeadDay(d)}
                style={{
                  padding: "4px 10px", borderRadius: 4, fontSize: 11, cursor: "pointer",
                  border: leadDay === d ? "1px solid rgba(74, 143, 255, 0.5)" : "1px solid var(--hairline)",
                  background: leadDay === d ? "rgba(30, 70, 160, 0.25)" : "rgba(255,255,255,0.03)",
                  color: leadDay === d ? "#c8deff" : "var(--text-dim)",
                }}
              >
                D{d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3-column main grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>

        {/* Column 1: Forecast + Threshold probs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Forecast Card */}
          <div style={PANEL_STYLE}>
            <div style={SECTION_LABEL_STYLE}>Forecast — {district.districtName}, {district.state}</div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 10 }}>
              Lead Day {leadDay} · <IllusBadge label="ILLUSTRATIVE VALUE" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: "var(--text-faint)", marginBottom: 2 }}>EXPECTED RAINFALL</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#4a8fff", lineHeight: 1 }}>
                {district.expectedRainfallMm}
                <span style={{ fontSize: 14, color: "var(--text-dim)", marginLeft: 4 }}>mm</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { label: "P(>64.5mm)", val: district.probabilityHeavy, color: "#f5a623" },
                { label: "P(>115.6mm)", val: district.probabilityVeryHeavy, color: "#ff7043" },
                { label: "P(>204.5mm)", val: district.probabilityExtreme, color: "#ff3b4e" },
              ].map((t) => (
                <div key={t.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 5, padding: "8px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 8, color: "var(--text-faint)", marginBottom: 4 }}>{t.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: t.color }}>{t.val}%</div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 10, padding: "7px 10px",
                background: "rgba(255,255,255,0.03)", borderRadius: 5,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <div style={{ fontSize: 9, color: "var(--text-faint)" }}>
                Expected District Area Fraction ≥ 64.5mm (Heavy Rain)
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#f5a623" }}>{district.spatialExceedanceProbability}%</div>
            </div>
            <div style={{ fontSize: 7.5, color: "var(--text-faint)", marginTop: 4, fontStyle: "italic" }}>
              * Formulated as expected area fraction above threshold; not conflated with point exceedance probability without spatial correlation.
            </div>
          </div>

          {/* 10-day Evolution Chart */}
          <div style={PANEL_STYLE}>
            <div style={SECTION_LABEL_STYLE}>Forecast Evolution <IllusBadge /></div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={evolution} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(80,140,255,0.08)" />
                <XAxis dataKey="date" tick={{ fontSize: 8, fill: "var(--text-faint)" }} />
                <YAxis tick={{ fontSize: 8, fill: "var(--text-faint)" }} />
                <Tooltip contentStyle={{ background: "#0a0f1c", border: "1px solid var(--hairline)", fontSize: 10 }} />
                <Line type="monotone" dataKey="rainfall.raw" stroke="#7a8ba4" strokeWidth={1} dot={false} name="Raw NWP" />
                <Line type="monotone" dataKey="rainfall.emos" stroke="#22d68a" strokeWidth={1} dot={false} name="EMOS" />
                <Line type="monotone" dataKey="rainfall.adaptive" stroke="#4a8fff" strokeWidth={2} dot={false} name="MEGHAVYUHA" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Column 2: Regime + Mechanism + Forecast Trust */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Soft Regime State */}
          <div style={PANEL_STYLE}>
            <div style={SECTION_LABEL_STYLE}>Synoptic State <IllusBadge /></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
              {[
                { label: "Active", val: softRegime.active, color: "#22d68a" },
                { label: "Depression", val: softRegime.depression, color: "#f5a623" },
                { label: "Break Phase", val: softRegime.breakPhase, color: "#7a8ba4" },
                { label: "Western Disturbance", val: softRegime.westernDisturbance, color: "#8f7cff" },
                { label: "Other", val: softRegime.other, color: "#4a5668" },
              ].map((r) => (
                <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 70, fontSize: 9.5, color: "var(--text-dim)", flexShrink: 0 }}>{r.label}</div>
                  <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${r.val}%`, height: "100%", background: r.color, borderRadius: 3 }} />
                  </div>
                  <div style={{ width: 30, fontSize: 9.5, color: r.color, fontWeight: 700, textAlign: "right" }}>{r.val}%</div>
                </div>
              ))}
            </div>

            <div style={SECTION_LABEL_STYLE}>Rainfall Mechanism <IllusBadge /></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {[
                { label: "Orographic", val: softMech.orographic, color: "#00c4a7" },
                { label: "Coastal", val: softMech.coastal, color: "#4a8fff" },
                { label: "Convective", val: softMech.convective, color: "#f5a623" },
                { label: "Plains / Background", val: softMech.plains, color: "#7a8ba4" },
              ].map((m) => (
                <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 100, fontSize: 9.5, color: "var(--text-dim)", flexShrink: 0 }}>{m.label}</div>
                  <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${m.val}%`, height: "100%", background: m.color, borderRadius: 3 }} />
                  </div>
                  <div style={{ width: 30, fontSize: 9, color: m.color, fontWeight: 700, textAlign: "right" }}>{m.val}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Forecast Context Dimensions */}
          <div style={PANEL_STYLE}>
            <div style={SECTION_LABEL_STYLE}>Forecast Context & Evidence Dimensions <IllusBadge /></div>
            <div style={{ fontSize: 9, color: "var(--text-faint)", marginBottom: 8, fontStyle: "italic", lineHeight: 1.4 }}>
              These dimensions represent atmospheric and historical evidence — not a black-box score.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "Regime Certainty", val: district.reliability },
                { label: "Ensemble Spread", val: district.ensembleSpread },
                { label: "Model Disagreement", val: district.modelDisagreement },
                { label: "Obs. Coverage", val: "MODERATE" },
                { label: "Historical Correction Benefit", val: district.historicalCorrectionBenefit },
              ].map((ev) => (
                <div key={ev.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 10, color: "var(--text-dim)" }}>{ev.label}</div>
                  <ReliabilityDot level={ev.val} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Correction Decision + IMD Matrix */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Decision Action Block */}
          <div style={PANEL_STYLE}>
            <div style={SECTION_LABEL_STYLE}>Correction Action <IllusBadge /></div>
            <DecisionActionBlock gate={trustGate} />
          </div>

          {/* Correction Decision */}
          <div style={PANEL_STYLE}>
            <div style={SECTION_LABEL_STYLE}>Correction Decision <IllusBadge /></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {[
                { label: "LIKELY ERROR", val: likelyError, color: "#f5a623" },
                { label: "PRIMARY CANDIDATE", val: correctionCandidate, color: "#4a8fff" },
                { label: "SECONDARY", val: "Tail calibration", color: "#7a8ba4" },
                { label: "SPATIAL", val: "Neighbourhood correction", color: "#7a8ba4" },
                { label: "FALLBACK", val: "Raw NWP", color: "#7a8ba4" },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 8.5, color: "var(--text-faint)", letterSpacing: "0.06em" }}>{row.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: row.color }}>{row.val}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAudit(!showAudit)}
              style={{
                marginTop: 10, width: "100%", padding: "6px 0", borderRadius: 4, cursor: "pointer",
                background: "rgba(74, 143, 255, 0.1)", border: "1px solid rgba(74, 143, 255, 0.3)",
                color: "#7ab4ff", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
              }}
            >
              {showAudit ? "CLOSE EVIDENCE TRACE ▲" : "DECISION EVIDENCE TRACE ▼"}
            </button>
            {showAudit && (
              <div
                style={{
                  marginTop: 8, padding: 10,
                  background: "rgba(0,0,0,0.3)", borderRadius: 5,
                  border: "1px solid var(--hairline)",
                  display: "flex", flexDirection: "column", gap: 6,
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 700, color: "#7ab4ff", letterSpacing: "0.06em", marginBottom: 2 }}>
                  6-STEP DECISION EVIDENCE CHAIN <IllusBadge />
                </div>
                {[
                  { step: "1. FORECAST CONTEXT", detail: `Active monsoon (${softRegime.active}%), ${district.mechanism} forcing` },
                  { step: "2. ERROR EVIDENCE", detail: `Historical Error Atlas confirms systematic ${likelyError.toLowerCase()}` },
                  { step: "3. CORRECTION SELECTION", detail: `${correctionCandidate} selected based on historical CRPS gain` },
                  { step: "4. HEAVY-RAIN CHECK", detail: `Evaluated against 64.5mm threshold; extreme tail preserved` },
                  { step: "5. SPATIAL EVIDENCE", detail: `Evaluated at 0.25° grid with neighbourhood verification support` },
                  { step: "6. FINAL GUIDANCE", detail: trustGate === "CORRECT" ? "APPLY CORRECTION (supported by historical archive)" : "RETAIN RAW NWP (safeguard active)" },
                ].map((a) => (
                  <div key={a.step}>
                    <span style={{ fontSize: 8.5, color: "#4a8fff", fontWeight: 700 }}>{a.step}: </span>
                    <span style={{ fontSize: 8.5, color: "var(--text-dim)" }}>{a.detail}</span>
                  </div>
                ))}
                <div style={{ fontSize: 8, color: "var(--text-faint)", marginTop: 4, borderTop: "1px solid var(--hairline)", paddingTop: 6 }}>
                  Research prototype — transparent historical evidence behind post-processing decisions.
                </div>
              </div>
            )}
          </div>

          {/* IMD-style Probability Matrix */}
          <div style={PANEL_STYLE}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={SECTION_LABEL_STYLE}>IMD Probability Matrix <IllusBadge /></div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "3px", fontSize: 9 }}>
                <thead>
                  <tr>
                    <th style={{ color: "var(--text-faint)", textAlign: "left", fontWeight: 600, padding: "2px 4px", fontSize: 8 }}>
                      Prob ↓ / Category →
                    </th>
                    {["No Heavy\n(<64.5)", "Heavy\n(>64.5)", "V.Heavy\n(>115.6)", "Extreme\n(>204.5)"].map((h) => (
                      <th key={h} style={{ color: "var(--text-dim)", fontWeight: 700, padding: "2px 4px", textAlign: "center", fontSize: 8, whiteSpace: "pre" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PROB_BINS.map((bin, rowIdx) => (
                    <tr key={bin}>
                      <td style={{ color: "var(--text-faint)", fontSize: 8, padding: "2px 4px", whiteSpace: "nowrap" }}>{bin}</td>
                      {matrix[rowIdx].map((val, colIdx) => {
                        const isEmpty = val === 0;
                        const col = colIdx === 0 ? "#7a8ba4" : colIdx === 1 ? "#f5a623" : colIdx === 2 ? "#ff7043" : "#ff3b4e";
                        return (
                          <td
                            key={colIdx}
                            style={{
                              textAlign: "center",
                              padding: "5px 4px",
                              borderRadius: 3,
                              background: isEmpty ? "rgba(255,255,255,0.02)" : `${col}22`,
                              border: `1px solid ${isEmpty ? "rgba(255,255,255,0.05)" : `${col}44`}`,
                              color: isEmpty ? "var(--text-faint)" : col,
                              fontWeight: isEmpty ? 400 : 800,
                              fontSize: isEmpty ? 8 : 11,
                            }}
                          >
                            {isEmpty ? "—" : `${val}%`}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              style={{
                marginTop: 8, padding: "6px 8px",
                background: "rgba(74, 143, 255, 0.06)",
                borderRadius: 4, border: "1px solid rgba(74, 143, 255, 0.15)",
                fontSize: 8, color: "var(--text-faint)", lineHeight: 1.5,
              }}
            >
              Probabilities shown are intended to feed an India-compatible decision workflow.
              They are calibrated post-processed guidance, not replacement warnings.
              Not integrated with IMD operational systems.
              <span style={{ color: "#f5a623", display: "block", marginTop: 3 }}>
                ⚠ ILLUSTRATIVE PROTOTYPE — NOT VALIDATED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
