"use client";

import React from "react";
import { useRaiseStore } from "@/store/useRaiseStore";
import { DATA_SOURCES } from "@/lib/mock/validation";
import type { ForecastModel, ViewMode } from "@/types/forecast";

const MODEL_COLORS: Record<ForecastModel, string> = {
  adaptive: "#00d4ff",
  raw: "#7a8ba4",
  emos: "#22d68a",
  qm: "#f5a623",
  "ml-emos": "#8f7cff",
};

const MODELS: { id: ForecastModel; label: string }[] = [
  { id: "adaptive", label: "Adaptive" },
  { id: "raw", label: "Raw NWP" },
  { id: "emos", label: "EMOS" },
  { id: "qm", label: "QM" },
  { id: "ml-emos", label: "ML-EMOS" },
];

const VIEW_MODES: { id: ViewMode; label: string }[] = [
  { id: "amount", label: "Amount" },
  { id: "probability", label: "Probability" },
  { id: "uncertainty", label: "Uncertainty" },
  { id: "difference", label: "Δ Diff" },
];

export function MapToolbar() {
  const { model, setModel, viewMode, setViewMode, requestFlyTo, compareMode, setCompareMode } = useRaiseStore();
  const INDIA_CENTER = { lon: 78.5, lat: 20.5, zoom: 4.5 };

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "var(--z-hud)",
        display: "flex",
        gap: 6,
        pointerEvents: "auto",
      }}
    >
      {/* Model switcher */}
      <div
        className="panel"
        style={{
          display: "flex",
          gap: 2,
          padding: "4px 6px",
          borderRadius: "var(--radius)",
        }}
      >
        {MODELS.map((m) => (
          <button
            key={m.id}
            onClick={() => setModel(m.id)}
            style={{
              padding: "4px 10px",
              borderRadius: "var(--radius-sm)",
              border: model === m.id ? `1px solid ${MODEL_COLORS[m.id]}` : "1px solid transparent",
              background: model === m.id ? `${MODEL_COLORS[m.id]}18` : "transparent",
              color: model === m.id ? MODEL_COLORS[m.id] : "var(--text-dim)",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: model === m.id ? 700 : 400,
              fontFamily: "var(--font-ui)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "all 0.15s",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Separator */}
      <div style={{ width: 1, background: "var(--hairline)", alignSelf: "stretch", margin: "2px 0" }} />

      {/* View mode */}
      <div className="panel" style={{ display: "flex", gap: 2, padding: "4px 6px" }}>
        {VIEW_MODES.map((vm) => (
          <button
            key={vm.id}
            onClick={() => setViewMode(vm.id)}
            style={{
              padding: "4px 10px",
              borderRadius: "var(--radius-sm)",
              border: viewMode === vm.id ? "1px solid var(--cyan)" : "1px solid transparent",
              background: viewMode === vm.id ? "rgba(0,212,255,0.12)" : "transparent",
              color: viewMode === vm.id ? "var(--cyan)" : "var(--text-dim)",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: viewMode === vm.id ? 700 : 400,
              fontFamily: "var(--font-ui)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              transition: "all 0.15s",
            }}
          >
            {vm.label}
          </button>
        ))}
      </div>

      {/* India reset button */}
      <button
        className="panel btn"
        onClick={() => requestFlyTo(INDIA_CENTER.lon, INDIA_CENTER.lat, INDIA_CENTER.zoom)}
        title="Reset to India view"
        style={{ padding: "4px 10px", fontSize: 11 }}
      >
        🇮🇳 India
      </button>

      {/* Compare toggle */}
      <button
        className={`panel btn ${compareMode ? "active" : ""}`}
        onClick={() => setCompareMode(!compareMode)}
        style={{ padding: "4px 10px", fontSize: 11 }}
        title="Toggle compare mode"
      >
        ⊞ Compare
      </button>
    </div>
  );
}

export function DataSourceStrip() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 8,
        right: 46,
        zIndex: "var(--z-hud)",
        display: "flex",
        gap: 8,
        alignItems: "center",
        padding: "4px 10px",
        background: "rgba(6, 8, 16, 0.8)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-sm)",
        backdropFilter: "blur(8px)",
        pointerEvents: "none",
      }}
    >
      {DATA_SOURCES.slice(0, 4).map((src) => (
        <div key={src.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: src.available ? "var(--green)" : "var(--red)",
              animation: src.available ? "pulse 2.5s ease-in-out infinite" : "none",
            }}
          />
          <span style={{ fontSize: 9, color: "var(--text-faint)", letterSpacing: "0.04em" }}>
            {src.name}
          </span>
          {src.isDemo && (
            <span style={{ fontSize: 8, color: "var(--violet)", letterSpacing: "0.06em" }}>DEMO</span>
          )}
        </div>
      ))}
    </div>
  );
}
