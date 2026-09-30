"use client";

// MEGHAVYUHA — Error Atlas Page
// HOW DOES THE FORECAST FAIL? — Regime- and Context-Stratified NWP Error Diagnostics
// Smart India Hackathon 2026 | PS 26080 | Against The Odds (Team 149284)

import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import {
  REGIONAL_ERROR_PROFILES,
  ERROR_TYPE_DEFINITIONS,
  ERROR_ATLAS_FIGURES,
  type ErrorFingerprint,
} from "@/lib/mock/errorAtlas";

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

function ErrorLevel({ level }: { level: "LOW" | "MODERATE" | "HIGH" }) {
  const color = level === "HIGH" ? "#ff3b4e" : level === "MODERATE" ? "#f5a623" : "#22d68a";
  const bg =
    level === "HIGH"
      ? "rgba(255,59,78,0.12)"
      : level === "MODERATE"
      ? "rgba(245,166,35,0.12)"
      : "rgba(34,214,138,0.12)";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 3,
        background: bg,
        color,
        fontSize: 10,
        fontWeight: 800,
        border: `1px solid ${color}44`,
        letterSpacing: "0.04em",
      }}
    >
      {level}
    </span>
  );
}

function FingerprintCard({
  fingerprint,
  notes,
  independentCases,
  pairedGridSamples,
  rawCrps,
  hurdleCrps,
  emosCrps,
  preferredModel,
  hierarchicalBackoff,
}: {
  fingerprint: ErrorFingerprint;
  notes: string;
  independentCases: number;
  pairedGridSamples: number;
  rawCrps: number;
  hurdleCrps: number;
  emosCrps: number;
  preferredModel: string;
  hierarchicalBackoff: string;
}) {
  const entries = [
    { label: "Occurrence", val: fingerprint.occurrenceError },
    { label: "Amplitude", val: fingerprint.amplitudeError },
    { label: "Displacement", val: fingerprint.displacementError },
    { label: "Pattern", val: fingerprint.patternError },
    { label: "Spread", val: fingerprint.spreadError },
  ] as const;

  const barData = entries.map((e) => ({
    name: e.label,
    value: e.val === "HIGH" ? 3 : e.val === "MODERATE" ? 2 : 1,
    fill: e.val === "HIGH" ? "#ff3b4e" : e.val === "MODERATE" ? "#f5a623" : "#22d68a",
  }));

  const isSparse = independentCases < 15;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Evidence Sample Header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 5 }}>
          <div style={{ fontSize: 8, color: "var(--text-faint)" }}>INDEPENDENT SUPPORT</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: isSparse ? "#f5a623" : "#22d68a", marginTop: 2 }}>
            {independentCases} <span style={{ fontSize: 10, fontWeight: 500 }}>independent dates</span>
          </div>
          <div style={{ fontSize: 7.5, color: "var(--text-faint)", marginTop: 2 }}>
            {isSparse ? "⚠ Sparse support — hierarchical fallback required" : "✓ Sufficient independent sample (&ge;15)"}
          </div>
        </div>

        <div style={{ padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 5 }}>
          <div style={{ fontSize: 8, color: "var(--text-faint)" }}>PAIRED GRID EVALUATIONS</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#c8deff", marginTop: 2 }}>
            {pairedGridSamples.toLocaleString()} <span style={{ fontSize: 10, fontWeight: 500 }}>grid cells</span>
          </div>
          <div style={{ fontSize: 7.5, color: "var(--text-faint)", marginTop: 2 }}>
            *Spatial pixels are correlated; date count is primary
          </div>
        </div>
      </div>

      {/* 5-Dimension Fingerprint Chart */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: "#fff" }}>
            Forecast Error Fingerprint Vector
          </div>
          <div style={{ fontSize: 8.5, color: "var(--text-faint)", textTransform: "uppercase" }}>
            Dominant: <span style={{ color: "#f5a623", fontWeight: 700 }}>{fingerprint.dominantError}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          {entries.map((e) => (
            <div key={e.label} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.02)", padding: "3px 6px", borderRadius: 4 }}>
              <span style={{ fontSize: 9, color: "var(--text-dim)" }}>{e.label}:</span>
              <ErrorLevel level={e.val} />
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={90}>
          <BarChart data={barData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(80,140,255,0.08)" />
            <XAxis dataKey="name" tick={{ fontSize: 8, fill: "var(--text-faint)" }} />
            <YAxis
              domain={[0, 3]}
              ticks={[1, 2, 3]}
              tickFormatter={(v) => ["LOW", "MOD", "HIGH"][v - 1]}
              tick={{ fontSize: 7, fill: "var(--text-faint)" }}
            />
            <Bar dataKey="value" radius={[3, 3, 0, 0]}>
              {barData.map((entry, idx) => (
                <rect key={idx} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Candidate Loss Comparison */}
      <div style={{ padding: "10px", background: "rgba(74, 143, 255, 0.05)", border: "1px solid rgba(74, 143, 255, 0.15)", borderRadius: 6 }}>
        <div style={{ fontSize: 9, color: "var(--text-faint)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>
          Candidate Performance Under This Context (CRPS mm, lower is better)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          <div style={{ textAlign: "center", padding: "6px", background: "rgba(0,0,0,0.2)", borderRadius: 4 }}>
            <div style={{ fontSize: 8, color: "var(--text-faint)" }}>Raw NWP</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#7a8ba4", marginTop: 2 }}>{rawCrps.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: "center", padding: "6px", background: "rgba(0,0,0,0.2)", borderRadius: 4 }}>
            <div style={{ fontSize: 8, color: "var(--text-faint)" }}>Hurdle Model</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#22d68a", marginTop: 2 }}>{hurdleCrps.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: "center", padding: "6px", background: "rgba(0,0,0,0.2)", borderRadius: 4 }}>
            <div style={{ fontSize: 8, color: "var(--text-faint)" }}>CSG-EMOS</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#4a8fff", marginTop: 2 }}>{emosCrps.toFixed(2)}</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 9, color: "var(--text-dim)" }}>
            Preferred Correction: <strong style={{ color: "#7ab4ff" }}>{preferredModel}</strong>
          </div>
          <div style={{ fontSize: 8, color: isSparse ? "#f5a623" : "#22d68a", fontFamily: "var(--font-mono)" }}>
            [{hierarchicalBackoff.replace("_", " ")}]
          </div>
        </div>
      </div>

      {/* Meteorological Notes */}
      {notes && (
        <div
          style={{
            padding: "8px 10px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--hairline)",
            borderRadius: 4,
            fontSize: 9.5,
            color: "var(--text-dim)",
            lineHeight: 1.5,
          }}
        >
          <strong>Meteorological Evidence:</strong> {notes}
        </div>
      )}
    </div>
  );
}

export default function ErrorAtlasPage() {
  const [selectedRegion, setSelectedRegion] = useState("Western Ghats");
  const [selectedRegime, setSelectedRegime] = useState("Active Monsoon");
  const [selectedLead, setSelectedLead] = useState(1);
  const [activeFigureTab, setActiveFigureTab] = useState<string>("fig13");

  const regions = useMemo(() => [...new Set(REGIONAL_ERROR_PROFILES.map((p) => p.region))], []);
  const regimes = useMemo(() => [...new Set(REGIONAL_ERROR_PROFILES.map((p) => p.regime))], []);

  const profile = useMemo(() => {
    return (
      REGIONAL_ERROR_PROFILES.find(
        (p) => p.region === selectedRegion && p.regime === selectedRegime && p.leadDay === selectedLead
      ) ??
      REGIONAL_ERROR_PROFILES.find(
        (p) => p.region === selectedRegion && p.regime === selectedRegime
      ) ??
      REGIONAL_ERROR_PROFILES[0]
    );
  }, [selectedRegion, selectedRegime, selectedLead]);

  const activeFigure = ERROR_ATLAS_FIGURES.find((f) => f.id === activeFigureTab) ?? ERROR_ATLAS_FIGURES[1];

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
            Error Atlas — Meteorological Error Diagnostics
          </div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 3 }}>
            WHAT HISTORICALLY GOES WRONG IN EACH FORECAST CONTEXT?
          </div>
          <div style={{ fontSize: 9, color: "var(--text-faint)", marginTop: 4 }}>
            Building upon weather-conditioned forecast error distribution precedents (e.g. ECMWF ecPoint).
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
            2000–2017 HISTORICAL ERROR ARCHIVE
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
            HIERARCHICAL BACKOFF ENABLED
          </div>
        </div>
      </div>

      {/* Controls: Region, Regime, Lead Time */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div style={SECTION_LABEL}>Region</div>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--hairline)",
              borderRadius: 5,
              color: "var(--text)",
              fontSize: 11,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            {regions.map((r) => (
              <option key={r} value={r} style={{ background: "#0a0f1c" }}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <div style={SECTION_LABEL}>Synoptic Regime Context</div>
          <select
            value={selectedRegime}
            onChange={(e) => setSelectedRegime(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--hairline)",
              borderRadius: 5,
              color: "var(--text)",
              fontSize: 11,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            {regimes.map((r) => (
              <option key={r} value={r} style={{ background: "#0a0f1c" }}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <div style={SECTION_LABEL}>Lead Time</div>
          <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedLead(d)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 4,
                  fontSize: 11,
                  cursor: "pointer",
                  border: selectedLead === d ? "1px solid rgba(74,143,255,0.5)" : "1px solid var(--hairline)",
                  background: selectedLead === d ? "rgba(30,70,160,0.25)" : "rgba(255,255,255,0.03)",
                  color: selectedLead === d ? "#c8deff" : "var(--text-dim)",
                  fontWeight: selectedLead === d ? 700 : 400,
                }}
              >
                Day +{d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Diagnostic Card + Right Figure & Atlas Registry */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        
        {/* Left Column: Context Error Diagnostic Card */}
        <div style={PANEL}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={SECTION_LABEL}>
              {profile.region} × {profile.regime} (Day +{profile.leadDay})
            </div>
            <span
              style={{
                fontSize: 8,
                padding: "2px 6px",
                borderRadius: 3,
                background: "rgba(74, 143, 255, 0.12)",
                color: "#7ab4ff",
                fontWeight: 700,
              }}
            >
              RECORDED PROFILE
            </span>
          </div>

          <FingerprintCard
            fingerprint={profile.fingerprint}
            notes={profile.notes}
            independentCases={profile.independentCases}
            pairedGridSamples={profile.pairedGridSamples}
            rawCrps={profile.rawCrps}
            hurdleCrps={profile.hurdleCrps}
            emosCrps={profile.emosCrps}
            preferredModel={profile.preferredModel}
            hierarchicalBackoff={profile.hierarchicalBackoff}
          />
        </div>

        {/* Right Column: Embedded Research Evaluation Figures */}
        <div style={PANEL}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={SECTION_LABEL}>Spatial Diagnostic Maps (Research Package)</div>
            <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>NOAA GEFSv12 vs. IMD/CHIRPS</div>
          </div>

          {/* Figure Selector Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
            {ERROR_ATLAS_FIGURES.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFigureTab(f.id)}
                style={{
                  padding: "4px 8px",
                  borderRadius: 4,
                  fontSize: 9,
                  cursor: "pointer",
                  border: activeFigureTab === f.id ? "1px solid rgba(74,143,255,0.5)" : "1px solid var(--hairline)",
                  background: activeFigureTab === f.id ? "rgba(74,143,255,0.15)" : "rgba(255,255,255,0.02)",
                  color: activeFigureTab === f.id ? "#7ab4ff" : "var(--text-dim)",
                  fontWeight: activeFigureTab === f.id ? 700 : 400,
                }}
              >
                {f.diagnosticType}
              </button>
            ))}
          </div>

          {/* Embedded Image Display */}
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
              src={activeFigure.path}
              alt={activeFigure.title}
              style={{
                width: "100%",
                maxHeight: 280,
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>

          <div style={{ fontSize: 9.5, color: "var(--text-dim)", marginTop: 8, fontStyle: "italic", lineHeight: 1.4 }}>
            {activeFigure.caption}
          </div>
        </div>
      </div>

      {/* Bottom Full-Width Table: All Context Error Profiles & Hierarchical Fallback */}
      <div style={PANEL}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={SECTION_LABEL}>Full Error Atlas Registry — All Regional Contexts</div>
          <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>
            Click any row to load into active diagnostic panel
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(80, 140, 255, 0.2)", textAlign: "left", color: "var(--text-faint)" }}>
                <th style={{ padding: "6px 8px" }}>REGION</th>
                <th style={{ padding: "6px 8px" }}>REGIME CONTEXT</th>
                <th style={{ padding: "6px 8px" }}>LEAD</th>
                <th style={{ padding: "6px 8px" }}>INDEP. DATES</th>
                <th style={{ padding: "6px 8px" }}>DOMINANT ERROR</th>
                <th style={{ padding: "6px 8px" }}>RAW CRPS</th>
                <th style={{ padding: "6px 8px" }}>PREFERRED CORRECTION</th>
                <th style={{ padding: "6px 8px" }}>BACKOFF STATUS</th>
              </tr>
            </thead>
            <tbody>
              {REGIONAL_ERROR_PROFILES.map((p, idx) => {
                const isSelected = p.region === selectedRegion && p.regime === selectedRegime;
                const isSparse = p.independentCases < 15;
                return (
                  <tr
                    key={idx}
                    onClick={() => {
                      setSelectedRegion(p.region);
                      setSelectedRegime(p.regime);
                      setSelectedLead(p.leadDay);
                    }}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                      background: isSelected ? "rgba(74, 143, 255, 0.1)" : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <td style={{ padding: "7px 8px", fontWeight: isSelected ? 700 : 400, color: isSelected ? "#7ab4ff" : "#fff" }}>
                      {p.region}
                    </td>
                    <td style={{ padding: "7px 8px", color: "var(--text-dim)" }}>{p.regime}</td>
                    <td style={{ padding: "7px 8px", color: "var(--text-faint)" }}>D+{p.leadDay}</td>
                    <td style={{ padding: "7px 8px", fontWeight: 700, color: isSparse ? "#f5a623" : "#22d68a" }}>
                      {p.independentCases} {isSparse && "⚠"}
                    </td>
                    <td style={{ padding: "7px 8px" }}>
                      <span style={{ textTransform: "capitalize", color: p.fingerprint.dominantError === "amplitude" ? "#ff7043" : "#f5a623" }}>
                        {p.fingerprint.dominantError}
                      </span>
                    </td>
                    <td style={{ padding: "7px 8px", color: "#7a8ba4", fontFamily: "var(--font-mono)" }}>
                      {p.rawCrps.toFixed(2)}
                    </td>
                    <td style={{ padding: "7px 8px", fontWeight: 600, color: isSparse ? "var(--text-dim)" : "#22d68a" }}>
                      {p.preferredModel}
                    </td>
                    <td style={{ padding: "7px 8px", fontSize: 9, color: isSparse ? "#f5a623" : "var(--text-faint)" }}>
                      {p.hierarchicalBackoff.replace("_", " ")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Error Type Formal Taxonomy Card */}
      <div style={PANEL}>
        <div style={SECTION_LABEL}>Formal Error Taxonomy & Calibration Prescriptions</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          {ERROR_TYPE_DEFINITIONS.map((def) => (
            <div
              key={def.id}
              style={{
                padding: "10px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--hairline)",
                borderRadius: 5,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 3 }}>
                {def.label}
              </div>
              <div style={{ fontSize: 9, color: "var(--text-dim)", lineHeight: 1.4, marginBottom: 6 }}>
                {def.description}
              </div>
              <div style={{ fontSize: 8, color: "var(--text-faint)" }}>
                <strong>Fix:</strong> {def.candidateFixes.join(", ")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
