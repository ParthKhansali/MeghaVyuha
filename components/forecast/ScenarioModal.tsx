"use client";

import React from "react";
import { useRaiseStore } from "@/store/useRaiseStore";
import { DEMO_SCENARIOS } from "@/lib/mock/validation";

export function ScenarioModal() {
  const {
    scenarioSelectorOpen,
    setScenarioSelectorOpen,
    activeScenario,
    setScenario,
    selectDistrict,
    setModel,
    setViewMode,
    setLeadDay,
    requestFlyTo,
  } = useRaiseStore();

  if (!scenarioSelectorOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => setScenarioSelectorOpen(false)}
    >
      <div
        style={{
          width: 580,
          background: "#0a0f1c",
          border: "1px solid rgba(0, 212, 255, 0.35)",
          borderRadius: 8,
          boxShadow: "0 16px 48px rgba(0, 0, 0, 0.85)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid rgba(80, 140, 255, 0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--cyan)", letterSpacing: "0.05em" }}>
              DEMO SCENARIO SELECTOR
            </div>
            <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2 }}>
              Select a simulated meteorological scenario to test operational workflows
            </div>
          </div>
          <button
            onClick={() => setScenarioSelectorOpen(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-dim)",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Scenarios Grid */}
        <div style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {DEMO_SCENARIOS.map((sc) => {
            const isSelected = activeScenario === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => {
                  setScenario(sc.id);
                  setModel(sc.model);
                  setViewMode(sc.viewMode);
                  setLeadDay(sc.leadTime);
                  if (sc.districtId) selectDistrict(sc.districtId);
                  requestFlyTo(sc.mapCenter[0], sc.mapCenter[1], sc.mapZoom);
                  setScenarioSelectorOpen(false);
                }}
                style={{
                  padding: "12px 14px",
                  borderRadius: 6,
                  border: isSelected
                    ? "2px solid var(--cyan)"
                    : "1px solid rgba(80, 140, 255, 0.2)",
                  background: isSelected
                    ? "rgba(0, 212, 255, 0.12)"
                    : "rgba(255, 255, 255, 0.03)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: isSelected ? "var(--cyan)" : "var(--text)" }}>
                    {sc.label}
                  </div>
                  {isSelected && (
                    <span style={{ fontSize: 9, color: "var(--cyan)", fontWeight: 700 }}>ACTIVE</span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 4, lineHeight: 1.4 }}>
                  {sc.description}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 8,
                    fontSize: 9,
                    color: "var(--text-faint)",
                  }}
                >
                  <span>Lead: Day {sc.leadTime}</span>
                  <span>•</span>
                  <span>Model: {sc.model.toUpperCase()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
