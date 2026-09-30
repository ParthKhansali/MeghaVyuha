"use client";

// MEGHAVYUHA — Case Replay Page
// Retrospective Event Replay: Forecast Context → Error Atlas Evidence → Correction Choice → Guidance → Observation → Verification
// Smart India Hackathon 2026 | PS 26080 | Against The Odds (Team 149284)

import React, { useState } from "react";
import { HISTORICAL_CASES, type DetailedHistoricalCase } from "@/lib/mock/caseReplay";

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

const STEP_COLORS: Record<string, string> = {
  nwp_forecast: "#7a8ba4",
  forecast_state: "#8f7cff",
  error_diagnosis: "#f5a623",
  correction_decision: "#00c4a7",
  post_processed: "#4a8fff",
  observation: "#22d68a",
  verification: "#ff7043",
};

export default function CaseReplayPage() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(HISTORICAL_CASES[0].id);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const selectedCase: DetailedHistoricalCase =
    HISTORICAL_CASES.find((c) => c.id === selectedCaseId) ?? HISTORICAL_CASES[0];
  const currentStep = selectedCase.steps[activeStepIndex] ?? selectedCase.steps[0];

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
            Case Replay — Retrospective Decision Walkthrough
          </div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 3 }}>
            Inspect how MEGHAVYUHA navigates real historical forecast cases step-by-step
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
            RETROSPECTIVE EVALUATION BENCHMARK
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
            JJAS 2019 EVALUATION ARCHIVE
          </div>
        </div>
      </div>

      {/* Main Grid: Left Event Library + Right Replay Workbench */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16, minHeight: 0 }}>
        
        {/* Left Column: Event Library */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={PANEL}>
            <div style={SECTION_LABEL}>Historical Test Cases</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {HISTORICAL_CASES.map((c) => {
                const isSelected = c.id === selectedCaseId;
                const isNegative = c.outcomeType === "RETAIN_RAW_NEGATIVE";
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCaseId(c.id);
                      setActiveStepIndex(0);
                    }}
                    style={{
                      padding: "11px 12px",
                      background: isSelected ? "rgba(74, 143, 255, 0.14)" : "rgba(255,255,255,0.025)",
                      border: `1px solid ${isSelected ? "rgba(74, 143, 255, 0.4)" : "var(--hairline)"}`,
                      borderRadius: 6,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: isSelected ? "#7ab4ff" : "#fff", lineHeight: 1.3 }}>
                        {c.label.split("—")[0]}
                      </div>
                      <span
                        style={{
                          fontSize: 7.5,
                          padding: "2px 5px",
                          borderRadius: 3,
                          fontWeight: 800,
                          letterSpacing: "0.04em",
                          background: isNegative ? "rgba(245, 166, 35, 0.15)" : "rgba(34, 214, 138, 0.15)",
                          color: isNegative ? "#f5a623" : "#22d68a",
                          border: `1px solid ${isNegative ? "rgba(245, 166, 35, 0.3)" : "rgba(34, 214, 138, 0.3)"}`,
                        }}
                      >
                        {isNegative ? "RETAIN RAW" : "CORRECTED"}
                      </span>
                    </div>

                    <div style={{ fontSize: 9.5, color: "var(--text-dim)", marginBottom: 4 }}>
                      {c.subtitle}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 8.5, color: "var(--text-faint)", marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <span>{c.eventDate.split("(")[0]}</span>
                      <span style={{ color: isNegative ? "var(--text-dim)" : "#22d68a", fontWeight: 700 }}>
                        {isNegative ? "Zero Degradation" : `CRPS +${c.improvementPct}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Case Summary Card */}
          <div style={PANEL}>
            <div style={SECTION_LABEL}>Selected Case Metrics</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              <div style={{ padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 5 }}>
                <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>RAW CRPS</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#7a8ba4", marginTop: 2 }}>
                  {selectedCase.rawCrps} <span style={{ fontSize: 9 }}>mm</span>
                </div>
              </div>
              <div style={{ padding: "8px 10px", background: "rgba(74,143,255,0.08)", borderRadius: 5 }}>
                <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>POST-PROCESSED</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#4a8fff", marginTop: 2 }}>
                  {selectedCase.postCrps} <span style={{ fontSize: 9 }}>mm</span>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 9.5, color: "var(--text-dim)", lineHeight: 1.5 }}>
              <strong>Thesis:</strong> {selectedCase.description}
            </div>
          </div>
        </div>

        {/* Right Column: Replay Execution Workbench */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          
          {/* Scientific Output Comparison Visualizer */}
          {selectedCase.figurePath && (
            <div style={PANEL}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={SECTION_LABEL}>Evaluation Plot — Raw Forecast vs. MEGHAVYUHA Guidance</div>
                <div style={{ fontSize: 8.5, color: "var(--text-faint)", fontFamily: "var(--font-mono)" }}>
                  Resolution: 0.25° · JJAS 2019 Retrospective Archive
                </div>
              </div>

              <div
                style={{
                  position: "relative",
                  borderRadius: 6,
                  overflow: "hidden",
                  border: "1px solid rgba(80, 140, 255, 0.2)",
                  background: "#050811",
                }}
              >
                <img
                  src={selectedCase.figurePath}
                  alt={selectedCase.label}
                  style={{
                    width: "100%",
                    maxHeight: 340,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>

              {selectedCase.figureCaption && (
                <div style={{ fontSize: 9.5, color: "var(--text-dim)", marginTop: 8, fontStyle: "italic", lineHeight: 1.4 }}>
                  {selectedCase.figureCaption}
                </div>
              )}
            </div>
          )}

          {/* If Negative Case (No figure), show the Hierarchical Fallback Safeguard architecture */}
          {!selectedCase.figurePath && (
            <div style={{ ...PANEL, background: "rgba(245, 166, 35, 0.04)", border: "1px solid rgba(245, 166, 35, 0.25)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ color: "#f5a623", fontSize: 18 }}>🛡️</span>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#f5a623" }}>
                  Scientific Restraint Demonstration: Hierarchical Fallback Safeguard
                </div>
              </div>
              <div style={{ fontSize: 10.5, color: "var(--text-dim)", lineHeight: 1.6 }}>
                In this break-phase case, historical Error Atlas query indicated only 4 independent events, falling below our frozen minimum support threshold (15 events). 
                Rather than applying an unsupported statistical transformation that risks creating false drizzle in an arid zone, 
                MEGHAVYUHA&apos;s decision logic deliberately triggered: <strong>RETAIN RAW NWP</strong>.
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                {[
                  { step: "Specific Context", val: "4 cases (<15)", ok: false },
                  { step: "Broader Context", val: "Under-dispersed", ok: false },
                  { step: "Fixed Baseline", val: "Risk of false alarms", ok: false },
                  { step: "Final Safeguard", val: "RETAIN RAW FORECAST", ok: true },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: 5,
                      background: s.ok ? "rgba(34,214,138,0.12)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${s.ok ? "rgba(34,214,138,0.35)" : "var(--hairline)"}`,
                    }}
                  >
                    <div style={{ fontSize: 8, color: "var(--text-faint)" }}>STEP {idx + 1}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: s.ok ? "#22d68a" : "var(--text-dim)", marginTop: 2 }}>{s.step}</div>
                    <div style={{ fontSize: 8.5, color: s.ok ? "#22d68a" : "#f5a623", marginTop: 2 }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step-through Navigation Pills */}
          <div style={PANEL}>
            <div style={SECTION_LABEL}>Decision Chain Replay Steps (Click to inspect)</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
              {selectedCase.steps.map((st, idx) => {
                const isCurrent = activeStepIndex === idx;
                const col = STEP_COLORS[st.dataType] ?? "#4a8fff";
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStepIndex(idx)}
                    style={{
                      padding: "8px 6px",
                      borderRadius: 5,
                      cursor: "pointer",
                      border: `1px solid ${isCurrent ? col : "var(--hairline)"}`,
                      background: isCurrent ? `${col}22` : "rgba(255,255,255,0.02)",
                      color: isCurrent ? col : "var(--text-dim)",
                      fontSize: 9,
                      fontWeight: isCurrent ? 800 : 500,
                      textAlign: "center",
                      transition: "all 0.15s ease",
                      lineHeight: 1.2,
                    }}
                  >
                    <div style={{ fontSize: 7.5, opacity: 0.6, marginBottom: 2 }}>STEP {idx + 1}</div>
                    {st.title.split(". ")[1]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Step Detailed Execution Audit Card */}
          <div
            style={{
              ...PANEL,
              borderLeft: `4px solid ${STEP_COLORS[currentStep.dataType] ?? "#4a8fff"}`,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: `${STEP_COLORS[currentStep.dataType]}25`,
                    border: `2px solid ${STEP_COLORS[currentStep.dataType]}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 800,
                    color: STEP_COLORS[currentStep.dataType],
                  }}
                >
                  {currentStep.stepIndex + 1}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>
                    {currentStep.title}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 2 }}>
                    {currentStep.subtitle}
                  </div>
                </div>
              </div>

              <span
                style={{
                  fontSize: 8.5,
                  padding: "3px 8px",
                  borderRadius: 4,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  background: `${STEP_COLORS[currentStep.dataType]}18`,
                  color: STEP_COLORS[currentStep.dataType],
                  border: `1px solid ${STEP_COLORS[currentStep.dataType]}44`,
                }}
              >
                {currentStep.dataType.replace("_", " ")}
              </span>
            </div>

            <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.6 }}>
              {currentStep.description}
            </div>

            {/* Step Key-Value Evidence Attributes */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8, marginTop: 4 }}>
              {Object.entries(currentStep.details).map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    padding: "8px 10px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--hairline)",
                    borderRadius: 5,
                  }}
                >
                  <div style={{ fontSize: 8, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {k}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#c8deff", marginTop: 2 }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button
                onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                disabled={activeStepIndex === 0}
                style={{
                  padding: "6px 14px",
                  borderRadius: 5,
                  cursor: activeStepIndex === 0 ? "not-allowed" : "pointer",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--hairline)",
                  color: activeStepIndex === 0 ? "var(--text-faint)" : "var(--text-dim)",
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                ← Previous Step
              </button>

              <div style={{ fontSize: 9, color: "var(--text-faint)" }}>
                Step {activeStepIndex + 1} of {selectedCase.steps.length}
              </div>

              <button
                onClick={() => setActiveStepIndex(Math.min(selectedCase.steps.length - 1, activeStepIndex + 1))}
                disabled={activeStepIndex === selectedCase.steps.length - 1}
                style={{
                  padding: "6px 14px",
                  borderRadius: 5,
                  cursor: activeStepIndex === selectedCase.steps.length - 1 ? "not-allowed" : "pointer",
                  background: "rgba(74, 143, 255, 0.12)",
                  border: "1px solid rgba(74, 143, 255, 0.35)",
                  color: activeStepIndex === selectedCase.steps.length - 1 ? "var(--text-faint)" : "#7ab4ff",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                Next Step →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
