"use client";

import React, { useState } from "react";
import { useRaiseStore, INDIA_VIEW } from "@/store/useRaiseStore";
import type { ForecastModel, ViewMode } from "@/types/forecast";

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
];

export function MapFloatingControls() {
  const {
    model,
    setModel,
    viewMode,
    setViewMode,
    differenceBaseline,
    setDifferenceBaseline,
    requestFlyTo,
    setSearchOpen,
    toggleMapLayer,
  } = useRaiseStore();

  const [diffOpen, setDiffOpen] = useState(false);

  return (
    <>
      {/* ── Top-Left Floating Model Switcher ── */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 14,
          zIndex: "var(--z-hud)",
          display: "flex",
          gap: 4,
          padding: "3px 4px",
          background: "rgba(6, 10, 20, 0.82)",
          border: "1px solid rgba(80, 140, 255, 0.22)",
          borderRadius: 7,
          backdropFilter: "blur(14px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
        }}
      >
        {MODELS.map((m) => {
          const isSelected = model === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setModel(m.id)}
              style={{
                padding: "5px 12px",
                borderRadius: 5,
                border: isSelected ? "1px solid var(--cyan)" : "1px solid transparent",
                background: isSelected ? "#0070cc" : "transparent",
                color: isSelected ? "#ffffff" : "var(--text-dim)",
                fontSize: 11,
                fontWeight: isSelected ? 600 : 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: isSelected ? "0 0 10px rgba(0, 112, 204, 0.5)" : "none",
                fontFamily: "var(--font-ui)",
              }}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* ── Top-Right Floating View Mode Switcher ── */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 14,
          zIndex: "var(--z-hud)",
          display: "flex",
          gap: 4,
          padding: "3px 4px",
          background: "rgba(6, 10, 20, 0.82)",
          border: "1px solid rgba(80, 140, 255, 0.22)",
          borderRadius: 7,
          backdropFilter: "blur(14px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
        }}
      >
        {VIEW_MODES.map((vm) => {
          const isSelected = viewMode === vm.id;
          return (
            <button
              key={vm.id}
              onClick={() => setViewMode(vm.id)}
              style={{
                padding: "5px 12px",
                borderRadius: 5,
                border: isSelected ? "1px solid var(--cyan)" : "1px solid transparent",
                background: isSelected ? "#0070cc" : "transparent",
                color: isSelected ? "#ffffff" : "var(--text-dim)",
                fontSize: 11,
                fontWeight: isSelected ? 600 : 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: isSelected ? "0 0 10px rgba(0, 112, 204, 0.5)" : "none",
                fontFamily: "var(--font-ui)",
              }}
            >
              {vm.label}
            </button>
          );
        })}

        {/* Difference Dropdown Pill */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              if (viewMode !== "difference") setViewMode("difference");
              setDiffOpen(!diffOpen);
            }}
            style={{
              padding: "5px 10px",
              borderRadius: 5,
              border: viewMode === "difference" ? "1px solid var(--cyan)" : "1px solid transparent",
              background: viewMode === "difference" ? "#0070cc" : "transparent",
              color: viewMode === "difference" ? "#ffffff" : "var(--text-dim)",
              fontSize: 11,
              fontWeight: viewMode === "difference" ? 600 : 500,
              cursor: "pointer",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontFamily: "var(--font-ui)",
            }}
          >
            <span>Difference</span>
            <span style={{ fontSize: 9 }}>▾</span>
          </button>

          {diffOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 4,
                background: "rgba(8, 14, 28, 0.95)",
                border: "1px solid rgba(80, 140, 255, 0.3)",
                borderRadius: 6,
                padding: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: 150,
                boxShadow: "0 8px 24px rgba(0,0,0,0.7)",
                backdropFilter: "blur(12px)",
                zIndex: 100,
              }}
            >
              {[
                { id: "raw" as const, label: "Adaptive − Raw NWP" },
                { id: "emos" as const, label: "Adaptive − EMOS" },
                { id: "qm" as const, label: "Adaptive − QM" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setViewMode("difference");
                    setDifferenceBaseline(opt.id);
                    setDiffOpen(false);
                  }}
                  style={{
                    padding: "6px 10px",
                    background:
                      viewMode === "difference" && differenceBaseline === opt.id
                        ? "rgba(0, 112, 204, 0.25)"
                        : "transparent",
                    color:
                      viewMode === "difference" && differenceBaseline === opt.id
                        ? "var(--cyan)"
                        : "var(--text)",
                    border: "none",
                    borderRadius: 4,
                    fontSize: 11,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Left Vertical Toolstrip ── */}
      <div
        style={{
          position: "absolute",
          top: 58,
          left: 14,
          zIndex: "var(--z-hud)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 3,
          background: "rgba(6, 10, 20, 0.82)",
          border: "1px solid rgba(80, 140, 255, 0.22)",
          borderRadius: 7,
          backdropFilter: "blur(14px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
        }}
      >
        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          title="Search District / City"
          style={verticalBtnStyle}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        <div style={{ width: "80%", height: 1, background: "rgba(255,255,255,0.08)", margin: "2px auto" }} />

        {/* Zoom In */}
        <button
          onClick={() => requestFlyTo(78.5, 20.5, 6)}
          title="Zoom In"
          style={verticalBtnStyle}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => requestFlyTo(INDIA_VIEW.longitude, INDIA_VIEW.latitude, INDIA_VIEW.zoom)}
          title="Zoom Out"
          style={verticalBtnStyle}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <div style={{ width: "80%", height: 1, background: "rgba(255,255,255,0.08)", margin: "2px auto" }} />

        {/* Recenter Target */}
        <button
          onClick={() => requestFlyTo(INDIA_VIEW.longitude, INDIA_VIEW.latitude, INDIA_VIEW.zoom)}
          title="Reset to India View"
          style={verticalBtnStyle}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="7" />
            <line x1="12" y1="2" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="2" y1="12" x2="5" y2="12" />
            <line x1="19" y1="12" x2="22" y2="12" />
          </svg>
        </button>

        {/* Layers quick toggle */}
        <button
          onClick={() => toggleMapLayer("physiographic")}
          title="Toggle Physiographic Regions"
          style={verticalBtnStyle}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </button>
      </div>
    </>
  );
}

const verticalBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 5,
  border: "none",
  background: "transparent",
  color: "var(--text-dim)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.15s ease",
};
