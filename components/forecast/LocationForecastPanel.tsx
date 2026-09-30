"use client";

import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRaiseStore, hourOffsetToLabel } from "@/store/useRaiseStore";
import { DEMO_DISTRICTS, ROUTER_DECISIONS } from "@/lib/mock/districtForecasts";
import { DEMO_ALERTS } from "@/lib/mock/alerts";
import { getForecastEvolution } from "@/lib/mock/validation";
import type { ForecastModel } from "@/types/forecast";

const MODEL_COLORS: Record<ForecastModel, string> = {
  adaptive: "#00d4ff",
  raw: "#8899aa",
  emos: "#f77f00",
  qm: "#22d68a",
  "ml-emos": "#c77dff",
};

function IndiaOverviewContent({
  onSelectDistrict,
}: {
  onSelectDistrict: (districtId: string, lon: number, lat: number) => void;
}) {
  const { hourOffset, setSearchOpen, setWhyOpen } = useRaiseStore();
  const validLabel = hourOffsetToLabel(hourOffset);

  const topDistricts = useMemo(
    () =>
      [...DEMO_DISTRICTS]
        .sort((a, b) => b.expectedRainfallMm - a.expectedRainfallMm)
        .slice(0, 5),
    []
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "16px 16px 24px" }}>
      {/* Overview Title Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(0, 112, 204, 0.22) 0%, rgba(0, 212, 255, 0.08) 100%)",
          border: "1px solid rgba(0, 212, 255, 0.35)",
          borderRadius: 8,
          padding: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--cyan)",
                boxShadow: "0 0 8px var(--cyan)",
              }}
            />
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "0.02em" }}>
              India Forecast Overview
            </div>
          </div>
          <span
            style={{
              fontSize: 9,
              padding: "2px 6px",
              background: "rgba(0, 230, 118, 0.15)",
              color: "#00e676",
              borderRadius: 4,
              fontWeight: 700,
              border: "1px solid rgba(0, 230, 118, 0.3)",
            }}
          >
            NATIONAL
          </span>
        </div>
        <div style={{ fontSize: 10.5, color: "rgba(180, 220, 255, 0.75)", lineHeight: 1.4 }}>
          Synoptic regime synthesis & probabilistic risk across the Indian subcontinent
        </div>
        <div style={{ fontSize: 10, color: "var(--cyan)", fontFamily: "var(--font-mono)", marginTop: 6 }}>
          Valid: {validLabel} (+{hourOffset}h)
        </div>
      </div>

      {/* National Metric Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div
          style={{
            background: "rgba(12, 20, 36, 0.7)",
            border: "1px solid var(--hairline)",
            borderRadius: 6,
            padding: "9px 10px",
          }}
        >
          <div style={{ fontSize: 9.5, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Subcontinent Peak
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "var(--cyan)",
              fontFamily: "var(--font-mono)",
              marginTop: 2,
            }}
          >
            112 <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-dim)" }}>mm</span>
          </div>
          <div style={{ fontSize: 9, color: "var(--text-faint)", marginTop: 2 }}>Konkan / Mumbai Coast</div>
        </div>

        <div
          style={{
            background: "rgba(12, 20, 36, 0.7)",
            border: "1px solid var(--hairline)",
            borderRadius: 6,
            padding: "9px 10px",
          }}
        >
          <div style={{ fontSize: 9.5, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Active Warnings
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#ff5252",
              fontFamily: "var(--font-mono)",
              marginTop: 2,
            }}
          >
            3 <span style={{ fontSize: 11, fontWeight: 500, color: "#ffab40" }}>Red / 5 Org</span>
          </div>
          <div style={{ fontSize: 9, color: "var(--text-faint)", marginTop: 2 }}>High runoff potential</div>
        </div>

        <div
          style={{
            background: "rgba(12, 20, 36, 0.7)",
            border: "1px solid var(--hairline)",
            borderRadius: 6,
            padding: "9px 10px",
          }}
        >
          <div style={{ fontSize: 9.5, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Heavy Rain Area
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "var(--text)",
              fontFamily: "var(--font-mono)",
              marginTop: 2,
            }}
          >
            14.8%
          </div>
          <div style={{ fontSize: 9, color: "var(--text-faint)", marginTop: 2 }}>P(Rain &gt; 64.5mm)</div>
        </div>

        <div
          style={{
            background: "rgba(12, 20, 36, 0.7)",
            border: "1px solid var(--hairline)",
            borderRadius: 6,
            padding: "9px 10px",
          }}
        >
          <div style={{ fontSize: 9.5, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Disagreement
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#22d68a",
              fontFamily: "var(--font-mono)",
              marginTop: 2,
            }}
          >
            0.28 <span style={{ fontSize: 10, fontWeight: 600, color: "#22d68a" }}>LOW</span>
          </div>
          <div style={{ fontSize: 9, color: "var(--text-faint)", marginTop: 2 }}>Ensemble consistency</div>
        </div>
      </div>

      {/* Active Meteorological Regimes */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-dim)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Active Synoptic Regimes
        </div>
        {[
          { name: "Active Monsoon Trough", region: "Northern Plains & Foothills", status: "Active", desc: "Strong cyclonic shear zone, high orographic lift in Uttarakhand & Himachal.", color: "#00d4ff" },
          { name: "Coastal Convergence", region: "Konkan & Western Ghats", status: "Active", desc: "Strong low-level monsoon westerlies impinging on coastal topography.", color: "#00e676" },
          { name: "Bay of Bengal Moist Shear", region: "Northeast & Assam Valley", status: "Active", desc: "Vorticity maximum driving sustained heavy rainbands into foothills.", color: "#ffab40" },
          { name: "Dry Subsidence", region: "Northwest India / Rajasthan", status: "Break / Dry", desc: "Anticyclonic divergence; correction selectively skipped to protect Raw NWP skill.", color: "#8899aa" },
        ].map((rg, idx) => (
          <div
            key={idx}
            style={{
              padding: "9px 11px",
              background: "rgba(10, 16, 30, 0.6)",
              border: "1px solid rgba(80, 140, 255, 0.15)",
              borderRadius: 6,
              borderLeft: `3px solid ${rg.color}`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text)" }}>{rg.name}</div>
              <span style={{ fontSize: 9, color: rg.color, fontWeight: 600 }}>{rg.status}</span>
            </div>
            <div style={{ fontSize: 9.5, color: "var(--text-faint)", marginTop: 2 }}>{rg.region}</div>
            <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 4, lineHeight: 1.4 }}>{rg.desc}</div>
          </div>
        ))}
      </div>

      {/* Top Heavy Rainfall Districts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-dim)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Priority Districts (Click to View)
          </div>
          <button
            onClick={() => setSearchOpen(true)}
            style={{ background: "transparent", border: "none", color: "var(--cyan)", fontSize: 10, cursor: "pointer", fontWeight: 600 }}
          >
            Search All →
          </button>
        </div>

        {topDistricts.map((d) => (
          <div
            key={d.districtId}
            onClick={() => onSelectDistrict(d.districtId, d.lon, d.lat)}
            role="button"
            tabIndex={0}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              background: "rgba(12, 20, 36, 0.6)",
              border: "1px solid rgba(80, 140, 255, 0.15)",
              borderRadius: 6,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--cyan)";
              e.currentTarget.style.background = "rgba(0, 112, 204, 0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(80, 140, 255, 0.15)";
              e.currentTarget.style.background = "rgba(12, 20, 36, 0.6)";
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>
                {d.districtName}, <span style={{ fontSize: 10, color: "var(--text-dim)", fontWeight: 500 }}>{d.state}</span>
              </div>
              <div style={{ fontSize: 9.5, color: "var(--text-faint)", marginTop: 2 }}>
                Regime: {d.regime}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: d.expectedRainfallMm > 64 ? "#ff5252" : "var(--cyan)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {d.expectedRainfallMm} mm
              </div>
              <div style={{ fontSize: 8.5, color: d.probabilityVeryHeavy > 40 ? "#ff5252" : "#ffab40", fontWeight: 700 }}>
                {d.probabilityVeryHeavy > 40 ? "RED ALERT" : "ORANGE"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Adaptive Router Telemetry */}
      <div
        style={{
          padding: 12,
          background: "rgba(0, 112, 204, 0.08)",
          border: "1px solid rgba(0, 112, 204, 0.25)",
          borderRadius: 6,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--cyan)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Decision Evidence Trace
          </div>
          <button
            onClick={() => setWhyOpen(true)}
            style={{
              padding: "3px 9px",
              background: "#0070cc",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 9.5,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            DECISION TRACE ▼
          </button>
        </div>
        <div style={{ fontSize: 10, color: "var(--text-dim)", lineHeight: 1.5 }}>
          MEGHAVYUHA tests which rainfall correction earns its place in each forecast context.
          Inspect historical Error Atlas evidence, heavy-rain check, and neighbourhood spatial support.
        </div>
      </div>
    </div>
  );
}

export function LocationForecastPanel() {
  const {
    selectedDistrictId,
    setWhyOpen,
    requestFlyTo,
    selectDistrict,
  } = useRaiseStore();

  const [activeTab, setActiveTab] = useState<"forecast" | "analysis" | "why" | "alerts">("forecast");
  const [collapsed, setCollapsed] = useState(false);

  const district = useMemo(() => {
    if (!selectedDistrictId) return null;
    return DEMO_DISTRICTS.find((d) => d.districtId === selectedDistrictId) ?? null;
  }, [selectedDistrictId]);

  const router = useMemo(() => {
    if (!district) return null;
    return ROUTER_DECISIONS[district.districtId] ?? ROUTER_DECISIONS["uttarakhand-dehradun"];
  }, [district]);

  const evolution = useMemo(() => {
    if (!district) return [];
    return getForecastEvolution(district.districtId, district.expectedRainfallMm);
  }, [district]);

  return (
    <aside
      style={{
        width: 380,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        borderLeft: "1px solid rgba(80, 140, 255, 0.18)",
        background: "rgba(6, 10, 20, 0.95)",
        zIndex: 10,
      }}
    >
      {!district || !router ? (
        <IndiaOverviewContent
          onSelectDistrict={(id, lon, lat) => {
            selectDistrict(id);
            requestFlyTo(lon, lat, 8);
          }}
        />
      ) : (
        <>
          {/* Navigation Back to National Overview */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 16px 4px 16px",
              borderBottom: "1px solid rgba(80, 140, 255, 0.08)",
            }}
          >
            <button
              onClick={() => selectDistrict(null)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--cyan)",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "2px 0",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              All India Overview
            </button>
            <button
              onClick={() => selectDistrict(null)}
              title="Return to National Overview"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-faint)",
                fontSize: 12,
                cursor: "pointer",
                padding: "2px 4px",
              }}
            >
              ✕
            </button>
          </div>

          {/* ── District Header ── */}
          <div
            style={{
              padding: "10px 16px 10px 16px",
              borderBottom: "1px solid rgba(80, 140, 255, 0.15)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          {/* Location Pin */}
          <div
            style={{
              color: "var(--cyan)",
              marginTop: 2,
              cursor: "pointer",
            }}
            onClick={() => requestFlyTo(district.lon, district.lat, 8)}
            title="Fly to district"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
              {district.districtName}, {district.state}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(180, 210, 240, 0.7)",
                fontFamily: "var(--font-mono)",
                marginTop: 2,
              }}
            >
              {district.lat.toFixed(2)}° N, {district.lon.toFixed(2)}° E
            </div>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-dim)",
            cursor: "pointer",
            padding: 4,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>

      {!collapsed && (
        <>
          {/* ── Subtabs: Forecast | Analysis | Why? | Alerts ── */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid rgba(80, 140, 255, 0.15)",
              padding: "0 16px",
            }}
          >
            {[
              { id: "forecast" as const, label: "Forecast" },
              { id: "analysis" as const, label: "Analysis" },
              { id: "why" as const, label: "Why?" },
              { id: "alerts" as const, label: "Alerts" },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === "why") setWhyOpen(true);
                  }}
                  style={{
                    padding: "8px 12px",
                    background: "transparent",
                    border: "none",
                    borderBottom: isSelected ? "2px solid var(--cyan)" : "2px solid transparent",
                    color: isSelected ? "var(--cyan)" : "var(--text-dim)",
                    fontSize: 12,
                    fontWeight: isSelected ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── Tab: FORECAST Content ── */}
          {activeTab === "forecast" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "14px 16px" }}>
              {/* 4 Stats Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ fontSize: 9.5, color: "var(--text-dim)", textTransform: "uppercase" }}>
                    Expected Rainfall
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--cyan)", lineHeight: 1.2 }}>
                    {district.expectedRainfallMm}{" "}
                    <span style={{ fontSize: 13, fontWeight: 500 }}>mm</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 9.5, color: "var(--text-dim)" }}>P(&gt;64.5)</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#f77f00", lineHeight: 1.2 }}>
                    {district.probabilityHeavy}%
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 9.5, color: "var(--text-dim)" }}>P(&gt;115.6)</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#ff5252", lineHeight: 1.2 }}>
                    {district.probabilityVeryHeavy}%
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 9.5, color: "var(--text-dim)" }}>P(&gt;204.5)</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#ff1744", lineHeight: 1.2 }}>
                    {district.probabilityExtreme}%
                  </div>
                </div>
              </div>

              {/* ── Atmospheric Regime Box ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  background: "rgba(138, 43, 226, 0.08)",
                  border: "1px solid rgba(138, 43, 226, 0.25)",
                  borderRadius: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: "rgba(138, 43, 226, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#c77dff",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: "var(--text-faint)", textTransform: "uppercase" }}>
                      Regime
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#d18cff" }}>
                      {district.regime}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right", fontSize: 10 }}>
                  <div style={{ color: "var(--text-dim)" }}>
                    Synoptic Regime <span style={{ color: "var(--text)", fontWeight: 600 }}>{district.synopticRegime}</span>
                  </div>
                  <div style={{ color: "var(--text-dim)", marginTop: 2 }}>
                    Rainfall Mechanism <span style={{ color: "var(--text)", fontWeight: 600 }}>{district.mechanism}</span>
                  </div>
                </div>
              </div>

              {/* ── 3 Column Stats Row ── */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8,
                  padding: "8px 0",
                  borderTop: "1px solid rgba(80, 140, 255, 0.1)",
                  borderBottom: "1px solid rgba(80, 140, 255, 0.1)",
                }}
              >
                <div>
                  <div style={{ fontSize: 9.5, color: "var(--text-dim)" }}>Forecast Reliability</div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: district.reliability === "HIGH" ? "#00e676" : "#ffd166",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {district.reliability}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 9.5, color: "var(--text-dim)" }}>Ensemble Spread</div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: district.ensembleSpread === "LOW" ? "#00e676" : "#ffd166",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {district.ensembleSpread}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 9.5, color: "var(--text-dim)" }}>Model Disagreement</div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: district.modelDisagreement === "LOW" ? "#00e676" : "#ffd166",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {district.modelDisagreement}
                  </div>
                </div>
              </div>

              {/* ── Correction Decision & Router Weights ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 12 }}>
                {/* Left: Decision */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 4 }}>
                      Correction Decision
                    </div>
                    <div
                      style={{
                        padding: "5px 10px",
                        borderRadius: 14,
                        background: router.correctionActive
                          ? "rgba(0, 230, 118, 0.15)"
                          : "rgba(120, 140, 170, 0.15)",
                        border: router.correctionActive
                          ? "1px solid rgba(0, 230, 118, 0.4)"
                          : "1px solid rgba(120, 140, 170, 0.3)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: router.correctionActive ? "#00e676" : "#8899aa",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: router.correctionActive ? "#00e676" : "#8899aa",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {router.correctionActive ? "CORRECTION ACTIVE" : "CORRECTION SKIPPED"}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>
                    {router.selectedModel.toUpperCase()} SELECTED
                  </div>

                  <div>
                    <div style={{ fontSize: 9.5, color: "var(--text-dim)" }}>
                      Expected Correction Benefit
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: router.expectedBenefit === "HIGH" ? "#00e676" : "#ffd166",
                      }}
                    >
                      {router.expectedBenefit}
                    </div>
                  </div>
                </div>

                {/* Right: Router Weights */}
                <div>
                  <div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 6 }}>
                    Router Weights
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {[
                      { label: "EMOS", weight: router.emosWeight, color: "#00d4ff" },
                      { label: "ML-EMOS", weight: router.mlEmosWeight, color: "#0088cc" },
                      { label: "QM", weight: router.qmWeight, color: "#005599" },
                      { label: "Raw NWP", weight: router.rawWeight, color: "#1a3355" },
                    ].map((w) => (
                      <div key={w.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 9.5, color: "var(--text-dim)", width: 48, flexShrink: 0 }}>
                          {w.label}
                        </span>
                        <div
                          style={{
                            flex: 1,
                            height: 6,
                            borderRadius: 3,
                            background: "rgba(255, 255, 255, 0.06)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${w.weight}%`,
                              height: "100%",
                              background: w.color,
                              borderRadius: 3,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 9,
                            fontFamily: "var(--font-mono)",
                            color: "var(--text)",
                            width: 26,
                            textAlign: "right",
                          }}
                        >
                          {w.weight}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Fallback & WHY button */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 8,
                  borderTop: "1px solid rgba(80, 140, 255, 0.1)",
                }}
              >
                <div style={{ fontSize: 10, color: "var(--text-dim)" }}>
                  Fallback Model:{" "}
                  <span style={{ color: "var(--text)", fontWeight: 600, textTransform: "uppercase" }}>
                    {router.fallbackModel}
                  </span>
                </div>

                <button
                  onClick={() => setWhyOpen(true)}
                  style={{
                    padding: "4px 14px",
                    borderRadius: 5,
                    border: "1px solid #0070cc",
                    background: "rgba(0, 112, 204, 0.35)",
                    color: "var(--cyan)",
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    boxShadow: "0 0 10px rgba(0, 112, 204, 0.3)",
                    transition: "all 0.15s ease",
                  }}
                >
                  WHY?
                </button>
              </div>

              {/* ── Forecast Evolution (District Average) Chart ── */}
              <div style={{ marginTop: 4 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--text)",
                    marginBottom: 4,
                  }}
                >
                  Forecast Evolution{" "}
                  <span style={{ fontSize: 9.5, color: "var(--text-dim)", fontWeight: 400 }}>
                    (District Average)
                  </span>
                </div>

                {/* Legend indicators */}
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    fontSize: 9,
                    color: "var(--text-dim)",
                    marginBottom: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 12, height: 2, background: MODEL_COLORS.adaptive }} /> Adaptive
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 12, height: 2, borderTop: "2px dashed #8899aa" }} /> Raw NWP
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 12, height: 2, background: MODEL_COLORS.emos }} /> EMOS
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 12, height: 2, background: MODEL_COLORS.qm }} /> QM
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 12, height: 2, background: MODEL_COLORS["ml-emos"] }} /> ML-EMOS
                  </span>
                </div>

                {/* Line chart container */}
                <div style={{ height: 130, width: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolution} margin={{ top: 5, right: 10, left: -22, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 8.5, fill: "var(--text-faint)" }}
                        axisLine={{ stroke: "rgba(80, 140, 255, 0.2)" }}
                      />
                      <YAxis
                        tick={{ fontSize: 8.5, fill: "var(--text-faint)" }}
                        axisLine={{ stroke: "rgba(80, 140, 255, 0.2)" }}
                        domain={[0, "auto"]}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#0a0f1c",
                          border: "1px solid rgba(80, 140, 255, 0.3)",
                          borderRadius: 6,
                          fontSize: 10,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="rainfall.adaptive"
                        name="Adaptive"
                        stroke={MODEL_COLORS.adaptive}
                        strokeWidth={2}
                        dot={{ r: 3, fill: MODEL_COLORS.adaptive }}
                      />
                      <Line
                        type="monotone"
                        dataKey="rainfall.raw"
                        name="Raw NWP"
                        stroke="#8899aa"
                        strokeDasharray="4 3"
                        strokeWidth={1.5}
                        dot={{ r: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="rainfall.emos"
                        name="EMOS"
                        stroke={MODEL_COLORS.emos}
                        strokeWidth={1.5}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="rainfall.qm"
                        name="QM"
                        stroke={MODEL_COLORS.qm}
                        strokeWidth={1.5}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="rainfall.ml-emos"
                        name="ML-EMOS"
                        stroke={MODEL_COLORS["ml-emos"]}
                        strokeWidth={1.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: ANALYSIS Content ── */}
          {activeTab === "analysis" && (
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>
                Model Performance for {district.districtName}
              </div>
              <div style={{ fontSize: 10.5, color: "var(--text-dim)", lineHeight: 1.5 }}>
                Local verification metrics computed over hindcast archive under{" "}
                <span style={{ color: "var(--cyan)" }}>{district.regime}</span> conditions.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                {[
                  { metric: "CRPS (mm)", adaptive: "2.8", emos: "3.4", mlEmos: "3.2", qm: "4.1", raw: "5.8" },
                  { metric: "Brier Score (>64.5mm)", adaptive: "0.14", emos: "0.18", mlEmos: "0.16", qm: "0.22", raw: "0.31" },
                  { metric: "ETS (>64.5mm)", adaptive: "0.48", emos: "0.42", mlEmos: "0.45", qm: "0.36", raw: "0.28" },
                  { metric: "Reliability Index", adaptive: "0.92", emos: "0.88", mlEmos: "0.89", qm: "0.78", raw: "0.62" },
                ].map((row) => (
                  <div
                    key={row.metric}
                    style={{
                      padding: "8px 10px",
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: 5,
                      border: "1px solid rgba(80, 140, 255, 0.1)",
                    }}
                  >
                    <div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 4 }}>
                      {row.metric}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5 }}>
                      <span>
                        Adaptive: <strong style={{ color: "var(--cyan)" }}>{row.adaptive}</strong>
                      </span>
                      <span>EMOS: {row.emos}</span>
                      <span>ML-EMOS: {row.mlEmos}</span>
                      <span>Raw: {row.raw}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tab: WHY? Inline Summary ── */}
          {activeTab === "why" && (
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--cyan)" }}>
                Correction Rationale Audit
              </div>
              <div
                style={{
                  padding: 10,
                  background: "rgba(0, 112, 204, 0.12)",
                  border: "1px solid rgba(0, 112, 204, 0.3)",
                  borderRadius: 6,
                  fontSize: 11,
                  lineHeight: 1.5,
                  color: "var(--text)",
                }}
              >
                Why was {router.selectedModel.toUpperCase()} selected?
              </div>
              <ul style={{ paddingLeft: 18, fontSize: 10.5, color: "var(--text-dim)", lineHeight: 1.6, margin: 0 }}>
                {router.reason.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <button
                onClick={() => setWhyOpen(true)}
                style={{
                  padding: "6px 12px",
                  background: "#0070cc",
                  color: "#fff",
                  border: "none",
                  borderRadius: 5,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: 6,
                }}
              >
                Open Full Scientific Audit Drawer →
              </button>
            </div>
          )}

          {/* ── Tab: ALERTS Content ── */}
          {activeTab === "alerts" && (
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>
                Active Warnings for {district.districtName}
              </div>
              {district.probabilityVeryHeavy > 25 && (
                <div
                  style={{
                    padding: 10,
                    background: "rgba(255, 82, 82, 0.1)",
                    border: "1px solid rgba(255, 82, 82, 0.3)",
                    borderRadius: 6,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#ff5252" }}>
                    🔴 Very Heavy Rainfall Warning
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 2 }}>
                    P(&gt; 115.6 mm) is {district.probabilityVeryHeavy}%. High localized runoff potential.
                  </div>
                </div>
              )}
              <div
                style={{
                  padding: 10,
                  background: "rgba(247, 127, 0, 0.1)",
                  border: "1px solid rgba(247, 127, 0, 0.3)",
                  borderRadius: 6,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: "#f77f00" }}>
                  🟠 District Area Exceedance
                </div>
                <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 2 }}>
                  {district.spatialExceedanceProbability}% probability that ≥25% of district exceeds heavy threshold.
                </div>
              </div>
            </div>
          )}
            </>
          )}
        </>
      )}
    </aside>
  );
}
