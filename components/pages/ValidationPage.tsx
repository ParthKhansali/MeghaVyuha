"use client";

// MEGHAVYUHA — Validation Page
// Scientific Verification Workbench & Retrospective Benchmark Archive
// Smart India Hackathon 2026 | PS 26080 | Against The Odds (Team 149284)

import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  DAY1_PRIMARY_METRICS,
  DAY3_SECONDARY_METRICS,
  ABLATION_STEPS,
  REGIONAL_SKILL,
  RAINFALL_TIER_SKILL,
  CLAIM_EVIDENCE_MATRIX,
  EVALUATION_PROTOCOL_NOTE,
} from "@/lib/mock/validation";

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

const RESEARCH_FIGURES = [
  { id: "fig07", title: "Baseline CRPS Comparison", path: "/research/Main/fig07_baseline_crps.png", caption: "Figure 7: CRPS (mm) across candidate post-processing baselines for JJAS 2019 test dates (Day +1). Atlas Selector achieves lowest overall error (3.998 mm vs. Raw 4.871 mm)." },
  { id: "fig08", title: "Brier Skill Score (>64.5 mm)", path: "/research/Main/fig08_baseline_bss.png", caption: "Figure 8: Brier Skill Score for heavy precipitation (>64.5 mm/day). Both CSG-EMOS (+0.262) and Error Atlas (+0.218) demonstrate positive heavy-rain probabilistic discrimination over raw NWP." },
  { id: "fig23", title: "Spatial Verification (FSS by Scale)", path: "/research/Main/fig23_fss_by_scale.png", caption: "Figure 23: Fractions Skill Score (FSS) as a function of spatial scale. Effective resolution of skillful probabilistic signal crosses the useful threshold (FSS=0.58) at ~100 km neighbourhood scale." },
  { id: "fig24", title: "Ablation Progression (A0–A7)", path: "/research/Main/fig24_ablation_progression.png", caption: "Figure 24: Step-by-step ablation from raw ensemble (A0) through calibrated EMOS (A1), hurdle occurrence (A3), and contextual Error Atlas (A4). Complex ML routing (A6) adds no generalization advantage." },
  { id: "fig09", title: "Reliability Diagram", path: "/research/Main/fig09_reliability_diagram.png", caption: "Figure 9: Probability calibration and reliability curves for heavy rainfall thresholds." },
  { id: "fig11", title: "Ensemble Spread vs. Skill", path: "/research/Main/fig11_spread_skill.png", caption: "Figure 11: Spread-skill relationship across raw GEFSv12 ensemble members vs. observation variance." },
  { id: "fig16", title: "Regional Skill Distribution", path: "/research/Main/fig16_regional_skill.png", caption: "Figure 16: Regional CRPSS gains across Western Ghats, Central India, Northeast, and Indo-Gangetic Plains." },
  { id: "fig22", title: "Degradation Rate Analysis", path: "/research/Validation/fig22_degradation_rate.png", caption: "Figure 22: Honest degradation audit: Ungated Atlas degrades 33.19% of grid evaluations; Selective Gate achieves 32.21% but constrains overall gain (proving original Trust Gate criterion failed)." },
  { id: "fig29", title: "Full System Architecture", path: "/research/Main/fig29_final_architecture_diagram.png", caption: "Figure 29: Complete MEGHAVYUHA operational architecture from NWP ingestion through Decision Evidence trace to district guidance products." },
];

type SectionTab = "overview" | "ablation" | "claims" | "regional" | "gallery";

export default function ValidationPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>("overview");
  const [leadView, setLeadView] = useState<"day1" | "day3">("day1");
  const [selectedFigId, setSelectedFigId] = useState<string>("fig07");

  const activeMetrics = leadView === "day1" ? DAY1_PRIMARY_METRICS : DAY3_SECONDARY_METRICS;
  const activeFig = RESEARCH_FIGURES.find((f) => f.id === selectedFigId) ?? RESEARCH_FIGURES[0];

  const chartData = activeMetrics.map((m) => ({
    name: m.label.split(" (")[0].replace("MEGHAVYUHA ", "").replace("Gradient-Boosted ", ""),
    crps: m.crps,
    bss: m.bss_64,
    isAtlas: m.method.includes("Atlas"),
    isRaw: m.method.includes("Raw"),
  }));

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
            Scientific Validation & Benchmark Evaluation
          </div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 3 }}>
            Retrospective experiment on held-out JJAS 2019 (NOAA GEFSv12 against CHIRPS v2 and IMD 0.25° gridded archive)
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div
            style={{
              padding: "4px 9px",
              background: "rgba(245, 166, 35, 0.12)",
              border: "1px solid rgba(245, 166, 35, 0.35)",
              borderRadius: 4,
              fontSize: 9,
              fontWeight: 700,
              color: "#f5a623",
              letterSpacing: "0.06em",
            }}
          >
            FROZEN EVALUATION PROTOCOL (V1)
          </div>
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
            V2 MULTI-DECADAL PLANNED
          </div>
        </div>
      </div>

      {/* Evaluation Protocol Scientific Note */}
      <div
        style={{
          padding: "8px 12px",
          background: "rgba(74, 143, 255, 0.05)",
          border: "1px solid rgba(74, 143, 255, 0.18)",
          borderRadius: 6,
          fontSize: 9.5,
          color: "var(--text-dim)",
          lineHeight: 1.5,
        }}
      >
        <strong style={{ color: "#7ab4ff" }}>Pre-Specified Evaluation Protocol:</strong> {EVALUATION_PROTOCOL_NOTE}
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: 6, borderBottom: "1px solid rgba(80, 140, 255, 0.15)", paddingBottom: 8 }}>
        {[
          { id: "overview", label: "Benchmark Metrics (Day +1 / +3)" },
          { id: "ablation", label: "Ablation Progression (A0–A7)" },
          { id: "claims", label: "Claim-Evidence Matrix (C1–C7)" },
          { id: "regional", label: "Regional & Intensity Stratification" },
          { id: "gallery", label: "Research Figure Evidence" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SectionTab)}
            style={{
              padding: "6px 12px",
              borderRadius: 5,
              fontSize: 10,
              fontWeight: activeTab === tab.id ? 800 : 500,
              cursor: "pointer",
              border: activeTab === tab.id ? "1px solid rgba(74,143,255,0.4)" : "1px solid transparent",
              background: activeTab === tab.id ? "rgba(74,143,255,0.15)" : "transparent",
              color: activeTab === tab.id ? "#7ab4ff" : "var(--text-dim)",
              transition: "all 0.15s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BENCHMARK METRICS */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Lead Selector & Summary Stats */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => setLeadView("day1")}
                style={{
                  padding: "5px 12px",
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: leadView === "day1" ? 700 : 400,
                  cursor: "pointer",
                  border: leadView === "day1" ? "1px solid #7ab4ff" : "1px solid var(--hairline)",
                  background: leadView === "day1" ? "rgba(74,143,255,0.2)" : "rgba(255,255,255,0.02)",
                  color: leadView === "day1" ? "#fff" : "var(--text-dim)",
                }}
              >
                Day +1 Primary Benchmark (00 UTC)
              </button>
              <button
                onClick={() => setLeadView("day3")}
                style={{
                  padding: "5px 12px",
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: leadView === "day3" ? 700 : 400,
                  cursor: "pointer",
                  border: leadView === "day3" ? "1px solid #7ab4ff" : "1px solid var(--hairline)",
                  background: leadView === "day3" ? "rgba(74,143,255,0.2)" : "rgba(255,255,255,0.02)",
                  color: leadView === "day3" ? "#fff" : "var(--text-dim)",
                }}
              >
                Day +3 Secondary Benchmark
              </button>
            </div>

            <div style={{ fontSize: 9, color: "var(--text-faint)" }}>
              Evaluated on {leadView === "day1" ? "296,800 paired grid samples" : "284,500 paired grid samples"} across JJAS 2019
            </div>
          </div>

          {/* CRPS Bar Chart */}
          <div style={PANEL}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={SECTION_LABEL}>Continuous Ranked Probability Score (CRPS mm, lower is better)</div>
              <div style={{ fontSize: 8.5, color: "#22d68a", fontWeight: 700 }}>
                {leadView === "day1" ? "Atlas Selector: 3.998 mm vs Raw: 4.871 mm (+17.9% CRPSS)" : "Atlas Selector: 5.847 mm vs Raw: 6.716 mm (+12.9% CRPSS)"}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(80,140,255,0.08)" />
                <XAxis dataKey="name" tick={{ fontSize: 8, fill: "var(--text-faint)" }} angle={-15} textAnchor="end" />
                <YAxis domain={["dataMin - 0.5", "dataMax + 0.5"]} tick={{ fontSize: 8, fill: "var(--text-faint)" }} />
                <Tooltip contentStyle={{ background: "#0a0f1c", border: "1px solid var(--hairline)", fontSize: 10 }} />
                <Bar dataKey="crps" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, idx) => (
                    <rect
                      key={idx}
                      fill={entry.isAtlas ? "#22d68a" : entry.isRaw ? "#7a8ba4" : "#4a8fff"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Complete Metrics Table */}
          <div style={PANEL}>
            <div style={SECTION_LABEL}>Authoritative Benchmark Verification Table</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(80, 140, 255, 0.2)", textAlign: "left", color: "var(--text-faint)" }}>
                    <th style={{ padding: "6px 8px" }}>METHOD / MODEL</th>
                    <th style={{ padding: "6px 8px" }}>CRPS (mm) ↓</th>
                    <th style={{ padding: "6px 8px" }}>CRPSS vs RAW ↑</th>
                    <th style={{ padding: "6px 8px" }}>BSS (&gt;64.5mm) ↑</th>
                    <th style={{ padding: "6px 8px" }}>RMSE (mm) ↓</th>
                    <th style={{ padding: "6px 8px" }}>MAE (mm) ↓</th>
                    <th style={{ padding: "6px 8px" }}>BIAS (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {activeMetrics.map((row) => {
                    const isAtlas = row.method.includes("Atlas");
                    const isRaw = row.method.includes("Raw");
                    return (
                      <tr
                        key={row.method}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.03)",
                          background: isAtlas ? "rgba(34, 214, 138, 0.08)" : isRaw ? "rgba(255,255,255,0.02)" : "transparent",
                          fontWeight: isAtlas ? 700 : 400,
                        }}
                      >
                        <td style={{ padding: "7px 8px", color: isAtlas ? "#22d68a" : isRaw ? "#c8deff" : "#fff" }}>
                          {row.label}
                        </td>
                        <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", color: isAtlas ? "#22d68a" : "#fff" }}>
                          {row.crps.toFixed(3)}
                        </td>
                        <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", color: row.crpss > 0 ? "#22d68a" : row.crpss < 0 ? "#ff7043" : "var(--text-dim)" }}>
                          {row.crpss >= 0 ? `+${(row.crpss * 100).toFixed(1)}%` : `${(row.crpss * 100).toFixed(1)}%`}
                        </td>
                        <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", color: row.bss_64 > 0 ? "#22d68a" : row.bss_64 < 0 ? "#ff7043" : "var(--text-dim)" }}>
                          {row.bss_64.toFixed(3)}
                        </td>
                        <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}>
                          {row.rmse.toFixed(2)}
                        </td>
                        <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}>
                          {row.mae.toFixed(2)}
                        </td>
                        <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", color: row.bias > 0 ? "#ff7043" : row.bias < 0 ? "#4a8fff" : "var(--text-dim)" }}>
                          {row.bias > 0 ? `+${row.bias.toFixed(2)}` : row.bias.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 8.5, color: "var(--text-faint)", marginTop: 8, fontStyle: "italic" }}>
              * CRPSS &gt; 0 indicates positive probabilistic skill over raw NWP ensemble. BSS computed for heavy rain &gt;64.5 mm/day.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ABLATION PROGRESSION */}
      {activeTab === "ablation" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={PANEL}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={SECTION_LABEL}>Component-Wise Ablation Progression (A0 → A7)</div>
              <div style={{ fontSize: 8.5, color: "#7ab4ff" }}>Proves where performance gains originate</div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(80, 140, 255, 0.2)", textAlign: "left", color: "var(--text-faint)" }}>
                    <th style={{ padding: "6px 8px" }}>STEP</th>
                    <th style={{ padding: "6px 8px" }}>PIPELINE COMPONENT</th>
                    <th style={{ padding: "6px 8px" }}>CRPS (mm) ↓</th>
                    <th style={{ padding: "6px 8px" }}>CRPSS ↑</th>
                    <th style={{ padding: "6px 8px" }}>BSS (&gt;64.5mm) ↑</th>
                    <th style={{ padding: "6px 8px" }}>RMSE (mm)</th>
                    <th style={{ padding: "6px 8px" }}>INCREMENTAL GAIN / PENALTY</th>
                  </tr>
                </thead>
                <tbody>
                  {ABLATION_STEPS.map((step) => {
                    const isKey = step.id === "A4" || step.id === "A5";
                    return (
                      <tr
                        key={step.id}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.03)",
                          background: isKey ? "rgba(34, 214, 138, 0.08)" : "transparent",
                          fontWeight: isKey ? 700 : 400,
                        }}
                      >
                        <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", color: "#7ab4ff" }}>{step.id}</td>
                        <td style={{ padding: "7px 8px", color: isKey ? "#22d68a" : "#fff" }}>{step.step}</td>
                        <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", color: isKey ? "#22d68a" : "#fff" }}>{step.crps.toFixed(3)}</td>
                        <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", color: step.crpss > 0 ? "#22d68a" : step.crpss < 0 ? "#ff7043" : "var(--text-dim)" }}>
                          {step.crpss >= 0 ? `+${(step.crpss * 100).toFixed(1)}%` : `${(step.crpss * 100).toFixed(1)}%`}
                        </td>
                        <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)" }}>{step.bss_64.toFixed(3)}</td>
                        <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}>{step.rmse.toFixed(2)}</td>
                        <td style={{ padding: "7px 8px", color: step.gain.includes("Tail") ? "#ff7043" : isKey ? "#22d68a" : "var(--text-dim)" }}>
                          {step.gain}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 12, padding: "10px", background: "rgba(255,255,255,0.02)", borderRadius: 6, fontSize: 9.5, color: "var(--text-dim)", lineHeight: 1.5 }}>
              <strong>Ablation Insights:</strong>
              <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                <li><strong>A1 (Fixed CSG-EMOS):</strong> Captures immediate variance correction (+10.9% CRPSS).</li>
                <li><strong>A2 (Double-Gamma QM):</strong> Severely inflates extreme tail errors (-20.1% CRPSS), proving naive quantile matching is unsafe for monsoon extremes.</li>
                <li><strong>A3 (Occurrence Hurdle):</strong> Two-stage decomposition eliminates dry-spell drizzle (+15.6% CRPSS).</li>
                <li><strong>A4 & A5 (Error Atlas):</strong> Contextual conditioning on atmospheric and geographic regime achieves the peak skill (+17.9% CRPSS).</li>
                <li><strong>A6 (ML Router):</strong> Gradient-boosted router shows slight overfitting penalty (+0.065 mm higher error), proving compact calibrated models in an Error Atlas outperform complex neural networks.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLAIM-EVIDENCE MATRIX */}
      {activeTab === "claims" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={PANEL}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={SECTION_LABEL}>Scientific Claim-Evidence Verification Matrix</div>
              <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>
                Strict audit of all research claims against empirical outputs
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CLAIM_EVIDENCE_MATRIX.map((c) => {
                const isMeasured = c.status === "MEASURED";
                return (
                  <div
                    key={c.id}
                    style={{
                      padding: "10px 12px",
                      background: "rgba(255,255,255,0.025)",
                      border: `1px solid ${isMeasured ? "rgba(80,140,255,0.18)" : "rgba(255,59,78,0.25)"}`,
                      borderRadius: 6,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 9.5, fontWeight: 800, color: "#7ab4ff", fontFamily: "var(--font-mono)" }}>
                          [{c.id}]
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>
                          {c.claim}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 8,
                          padding: "2px 7px",
                          borderRadius: 3,
                          fontWeight: 800,
                          background: isMeasured ? "rgba(34, 214, 138, 0.12)" : "rgba(255, 59, 78, 0.15)",
                          color: isMeasured ? "#22d68a" : "#ff3b4e",
                          border: `1px solid ${isMeasured ? "rgba(34,214,138,0.35)" : "rgba(255,59,78,0.35)"}`,
                        }}
                      >
                        {c.status}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 9, color: "var(--text-dim)", margin: "6px 0" }}>
                      <div>
                        <strong>Measured Effect:</strong> {c.measuredEffect}
                      </div>
                      <div>
                        <strong>Evidence Basis:</strong> {c.dataset} ({c.period}) · {c.figure}
                      </div>
                    </div>

                    <div style={{ fontSize: 8.5, color: "var(--text-faint)", fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 4 }}>
                      <strong>Scientific Implication:</strong> {c.scientificImplication}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REGIONAL & INTENSITY STRATIFICATION */}
      {activeTab === "regional" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Regional Table */}
          <div style={PANEL}>
            <div style={SECTION_LABEL}>Regional Skill Stratification across India</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(80, 140, 255, 0.2)", textAlign: "left", color: "var(--text-faint)" }}>
                    <th style={{ padding: "6px 8px" }}>PHYSIOGRAPHIC REGION</th>
                    <th style={{ padding: "6px 8px" }}>SAMPLE SIZE (N)</th>
                    <th style={{ padding: "6px 8px" }}>RAW CRPS (mm)</th>
                    <th style={{ padding: "6px 8px" }}>ATLAS CRPS (mm)</th>
                    <th style={{ padding: "6px 8px" }}>CRPSS ↑</th>
                    <th style={{ padding: "6px 8px" }}>PRIMARY SYSTEMATIC BIAS IDENTIFIED</th>
                  </tr>
                </thead>
                <tbody>
                  {REGIONAL_SKILL.map((r) => (
                    <tr key={r.region} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td style={{ padding: "7px 8px", fontWeight: 700, color: "#fff" }}>{r.region}</td>
                      <td style={{ padding: "7px 8px", color: "var(--text-faint)" }}>{r.nSamples.toLocaleString()}</td>
                      <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", color: "#7a8ba4" }}>{r.crpsRaw.toFixed(3)}</td>
                      <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", color: "#22d68a", fontWeight: 700 }}>{r.crpsAtlas.toFixed(3)}</td>
                      <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", color: "#22d68a", fontWeight: 700 }}>+{(r.crpss * 100).toFixed(1)}%</td>
                      <td style={{ padding: "7px 8px", color: "var(--text-dim)" }}>{r.primaryError}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rainfall Intensity Breakdown */}
          <div style={PANEL}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={SECTION_LABEL}>Performance Stratified by Rainfall Intensity Tier</div>
              <div style={{ fontSize: 8.5, color: "#f5a623" }}>Critical honesty: Extreme tail behavior exposed</div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(80, 140, 255, 0.2)", textAlign: "left", color: "var(--text-faint)" }}>
                    <th style={{ padding: "6px 8px" }}>INTENSITY TIER</th>
                    <th style={{ padding: "6px 8px" }}>SAMPLE COUNT</th>
                    <th style={{ padding: "6px 8px" }}>RAW CRPS (mm)</th>
                    <th style={{ padding: "6px 8px" }}>ATLAS CRPS (mm)</th>
                    <th style={{ padding: "6px 8px" }}>CRPSS SKILL</th>
                    <th style={{ padding: "6px 8px" }}>SCIENTIFIC OBSERVATION</th>
                  </tr>
                </thead>
                <tbody>
                  {RAINFALL_TIER_SKILL.map((t) => {
                    const isPositive = t.crpss > 0;
                    return (
                      <tr key={t.tier} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <td style={{ padding: "7px 8px", fontWeight: 700, color: "#fff" }}>{t.tier}</td>
                        <td style={{ padding: "7px 8px", color: "var(--text-faint)" }}>{t.nSamples.toLocaleString()}</td>
                        <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", color: "#7a8ba4" }}>{t.crpsRaw.toFixed(3)}</td>
                        <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", color: isPositive ? "#22d68a" : "#ff7043", fontWeight: 700 }}>
                          {t.crpsAtlas.toFixed(3)}
                        </td>
                        <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", color: isPositive ? "#22d68a" : "#ff7043", fontWeight: 700 }}>
                          {isPositive ? `+${(t.crpss * 100).toFixed(1)}%` : `${(t.crpss * 100).toFixed(1)}%`}
                        </td>
                        <td style={{ padding: "7px 8px", color: isPositive ? "var(--text-dim)" : "#ff7043" }}>{t.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 10, padding: "8px 10px", background: "rgba(245, 166, 35, 0.05)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 5, fontSize: 9, color: "var(--text-dim)", lineHeight: 1.5 }}>
              <strong>Why negative CRPSS in Extreme Tier is Scientifically Defensible:</strong> In extreme events (&ge;64.5 mm), raw ensemble members exhibit large variance. 
              Any continuous distribution fitting (EMOS / Hurdle) slightly smooths localized peak values, which increases point CRPS penalty. 
              However, MEGHAVYUHA preserves <strong>probabilistic discernment</strong> (BSS = +0.218 vs. Raw 0.000) and neighborhood scale skill (~100 km FSS = 0.58).
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RESEARCH FIGURE GALLERY */}
      {activeTab === "gallery" && (
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16 }}>
          {/* Left: Figure list */}
          <div style={PANEL}>
            <div style={SECTION_LABEL}>Research Figures (JJAS 2019)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {RESEARCH_FIGURES.map((fig) => {
                const isSelected = fig.id === selectedFigId;
                return (
                  <button
                    key={fig.id}
                    onClick={() => setSelectedFigId(fig.id)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 5,
                      cursor: "pointer",
                      border: isSelected ? "1px solid #7ab4ff" : "1px solid var(--hairline)",
                      background: isSelected ? "rgba(74, 143, 255, 0.15)" : "rgba(255,255,255,0.02)",
                      color: isSelected ? "#fff" : "var(--text-dim)",
                      fontSize: 9.5,
                      fontWeight: isSelected ? 700 : 400,
                      textAlign: "left",
                    }}
                  >
                    {fig.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Embedded High-Res Image View */}
          <div style={PANEL}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
              {activeFig.title}
            </div>
            <div style={{ fontSize: 9.5, color: "var(--text-dim)", marginBottom: 12 }}>
              {activeFig.caption}
            </div>

            <div
              style={{
                borderRadius: 6,
                overflow: "hidden",
                border: "1px solid rgba(80, 140, 255, 0.2)",
                background: "#050811",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              }}
            >
              <img
                src={activeFig.path}
                alt={activeFig.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: 460,
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
