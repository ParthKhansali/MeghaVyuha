"use client";

import React from "react";
import { useRaiseStore, type RaiseLayerId } from "@/store/useRaiseStore";
import type { ForecastModel, ViewMode, ProbabilityThreshold } from "@/types/forecast";

const LEAD_DAYS = [
  { day: 1, label: "Day 1" },
  { day: 3, label: "Day 3" },
  { day: 5, label: "Day 5" },
  { day: 7, label: "Day 7" },
  { day: 10, label: "Day 10" },
];

const VIEW_MODES: { id: ViewMode; label: string }[] = [
  { id: "amount", label: "Amount" },
  { id: "probability", label: "Probability" },
  { id: "uncertainty", label: "Uncertainty" },
];

const MODELS: { id: ForecastModel; label: string }[] = [
  { id: "adaptive", label: "Adaptive" },
  { id: "raw", label: "Raw NWP" },
  { id: "emos", label: "EMOS" },
  { id: "qm", label: "QM" },
  { id: "ml-emos", label: "ML-EMOS" },
];

const PROB_THRESHOLDS: { id: ProbabilityThreshold; label: string }[] = [
  { id: "any", label: "P(R > 0)" },
  { id: "heavy", label: "P(R > 64.5 mm)" },
  { id: "very-heavy", label: "P(R > 115.6 mm)" },
  { id: "extreme", label: "P(R > 204.5 mm)" },
];

const MAP_LAYERS: { id: RaiseLayerId; label: string }[] = [
  { id: "stateBoundaries", label: "State Boundaries" },
  { id: "districtBoundaries", label: "District Boundaries" },
  { id: "rivers", label: "Rivers & Basins" },
  { id: "terrain", label: "Terrain / Elevation" },
  { id: "cities", label: "Major Cities" },
  { id: "stations", label: "Weather Stations" },
  { id: "physiographic", label: "Physiographic Regions" },
];

export function ForecastControlPanel() {
  const {
    model,
    setModel,
    viewMode,
    setViewMode,
    leadDay,
    setLeadDay,
    probabilityThreshold,
    setProbabilityThreshold,
    mapLayers,
    toggleMapLayer,
  } = useRaiseStore();

  return (
    <aside
      style={{
        width: 260,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: "16px 14px",
        overflowY: "auto",
        overflowX: "hidden",
        borderRight: "1px solid rgba(80, 140, 255, 0.18)",
        background: "rgba(6, 10, 20, 0.95)",
        zIndex: 10,
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "var(--cyan)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        FORECAST CONTROLS
      </div>

      {/* Forecast Date */}
      <div>
        <label style={labelStyle}>Forecast Date</label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "7px 10px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(80, 140, 255, 0.2)",
            borderRadius: 5,
            color: "var(--text)",
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
          }}
        >
          <span>25 Sep 2026 00 UTC</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
      </div>

      {/* Lead Time */}
      <div>
        <label style={labelStyle}>Lead Time</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5, marginBottom: 5 }}>
          {LEAD_DAYS.slice(0, 3).map((d) => (
            <button
              key={d.day}
              onClick={() => setLeadDay(d.day)}
              style={pillButtonStyle(leadDay === d.day)}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 5 }}>
          {LEAD_DAYS.slice(3).map((d) => (
            <button
              key={d.day}
              onClick={() => setLeadDay(d.day)}
              style={pillButtonStyle(leadDay === d.day)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Variable */}
      <div>
        <label style={labelStyle}>Variable</label>
        <div style={{ position: "relative" }}>
          <select
            defaultValue="precipitation"
            style={{
              width: "100%",
              padding: "7px 10px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(80, 140, 255, 0.2)",
              borderRadius: 5,
              color: "var(--text)",
              fontSize: 11,
              fontFamily: "var(--font-ui)",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="precipitation" style={{ background: "#0a0f1c" }}>
              Precipitation (mm)
            </option>
            <option value="probability" style={{ background: "#0a0f1c" }}>
              Exceedance Probability (%)
            </option>
            <option value="uncertainty" style={{ background: "#0a0f1c" }}>
              Ensemble Spread / Disagreement
            </option>
          </select>
        </div>
      </div>

      {/* View Mode */}
      <div>
        <label style={labelStyle}>View Mode</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5 }}>
          {VIEW_MODES.map((vm) => (
            <button
              key={vm.id}
              onClick={() => setViewMode(vm.id)}
              style={pillButtonStyle(viewMode === vm.id)}
            >
              {vm.label}
            </button>
          ))}
        </div>
      </div>

      {/* Model */}
      <div>
        <label style={labelStyle}>Model</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5, marginBottom: 5 }}>
          {MODELS.slice(0, 3).map((m) => (
            <button
              key={m.id}
              onClick={() => setModel(m.id)}
              style={pillButtonStyle(model === m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 5 }}>
          {MODELS.slice(3).map((m) => (
            <button
              key={m.id}
              onClick={() => setModel(m.id)}
              style={pillButtonStyle(model === m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Probability Threshold (for Probability view) */}
      <div>
        <label style={labelStyle}>Probability Threshold (for Probability view)</label>
        <select
          value={probabilityThreshold}
          onChange={(e) => setProbabilityThreshold(e.target.value as ProbabilityThreshold)}
          style={{
            width: "100%",
            padding: "7px 10px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(80, 140, 255, 0.2)",
            borderRadius: 5,
            color: "var(--text)",
            fontSize: 11,
            fontFamily: "var(--font-ui)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {PROB_THRESHOLDS.map((t) => (
            <option key={t.id} value={t.id} style={{ background: "#0a0f1c" }}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Map Layers */}
      <div>
        <label style={labelStyle}>Map Layers</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
          {MAP_LAYERS.map((layer) => {
            const isChecked = mapLayers[layer.id];
            return (
              <div
                key={layer.id}
                onClick={() => toggleMapLayer(layer.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "5px 6px",
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {/* Custom Checkbox */}
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      border: isChecked ? "1px solid var(--cyan)" : "1px solid rgba(80, 140, 255, 0.3)",
                      background: isChecked ? "#0070cc" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      transition: "all 0.15s",
                    }}
                  >
                    {isChecked && (
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="2 6 5 9 10 3" />
                      </svg>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: isChecked ? "var(--text)" : "var(--text-dim)",
                      fontWeight: isChecked ? 500 : 400,
                    }}
                  >
                    {layer.label}
                  </span>
                </div>

                {/* 3-dots icon */}
                <div
                  style={{
                    color: "var(--text-faint)",
                    fontSize: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    padding: "0 2px",
                  }}
                >
                  <span style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: "currentColor" }} />
                  <span style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: "currentColor" }} />
                  <span style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: "currentColor" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 10,
  color: "var(--text-dim)",
  fontWeight: 500,
  marginBottom: 5,
};

function pillButtonStyle(active: boolean): React.CSSProperties {
  return {
    padding: "6px 8px",
    borderRadius: 5,
    border: active ? "1px solid var(--cyan)" : "1px solid rgba(80, 140, 255, 0.18)",
    background: active ? "#0070cc" : "rgba(255, 255, 255, 0.03)",
    color: active ? "#ffffff" : "var(--text-dim)",
    fontSize: 11,
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    fontFamily: "var(--font-ui)",
    textAlign: "center",
    transition: "all 0.15s ease",
    boxShadow: active ? "0 0 8px rgba(0, 112, 204, 0.4)" : "none",
  };
}
