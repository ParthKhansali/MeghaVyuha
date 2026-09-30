"use client";

import React, { useState, useMemo } from "react";
import { DEMO_ALERTS } from "@/lib/mock/alerts";
import { useRaiseStore } from "@/store/useRaiseStore";
import { DEMO_DISTRICTS } from "@/lib/mock/districtForecasts";
import type { Alert, AlertSeverity } from "@/types/forecast";

const SEV_ORDER: Record<AlertSeverity, number> = { HIGH: 0, MODERATE: 1, LOW: 2 };

const ALERT_TYPE_LABELS: Record<Alert["type"], string> = {
  "very-heavy": "Very Heavy Rainfall",
  heavy: "Heavy Rainfall",
  "area-exceedance": "Area Exceedance",
  "model-disagreement": "Model Disagreement",
};

const ALERT_TYPE_ICONS: Record<Alert["type"], string> = {
  "very-heavy": "⚡",
  heavy: "🌧",
  "area-exceedance": "◼",
  "model-disagreement": "△",
};

export default function AlertsPage() {
  const { selectDistrict, requestFlyTo, setPage } = useRaiseStore();
  const [filter, setFilter] = useState<AlertSeverity | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<Alert["type"] | "ALL">("ALL");

  const filtered = useMemo(() => {
    return DEMO_ALERTS
      .filter((a) => filter === "ALL" || a.severity === filter)
      .filter((a) => typeFilter === "ALL" || a.type === typeFilter)
      .sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity]);
  }, [filter, typeFilter]);

  const handleAlertClick = (alert: Alert) => {
    selectDistrict(alert.districtId);
    requestFlyTo(alert.lon, alert.lat, 9);
    setPage("district-intelligence");
  };

  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", height: "100%", background: "var(--bg)" }}>
      <div className="page-header">
        <div>
          <div className="page-title">Alerts</div>
          <div className="page-subtitle">Threshold exceedances and spatial-risk events</div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {(["ALL", "HIGH", "MODERATE", "LOW"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`btn ${filter === s ? (s === "HIGH" ? "active-red" : s === "MODERATE" ? "active-amber" : s === "LOW" ? "active-green" : "active") : ""}`}
              style={{ fontSize: 10 }}
            >
              {s}
            </button>
          ))}
          <div style={{ width: 1, height: 20, background: "var(--hairline)", margin: "0 4px" }} />
          <select
            className="select"
            style={{ width: 160, fontSize: 10 }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          >
            <option value="ALL">All Types</option>
            <option value="very-heavy">Very Heavy Rainfall</option>
            <option value="heavy">Heavy Rainfall</option>
            <option value="area-exceedance">Area Exceedance</option>
            <option value="model-disagreement">Model Disagreement</option>
          </select>
          <span className="badge badge-demo badge">Demo Data</span>
        </div>
      </div>

      {/* Summary counts */}
      <div className="metric-grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: "HIGH alerts", value: DEMO_ALERTS.filter((a) => a.severity === "HIGH").length, color: "var(--red)" },
          { label: "MODERATE alerts", value: DEMO_ALERTS.filter((a) => a.severity === "MODERATE").length, color: "var(--amber)" },
          { label: "Districts affected", value: new Set(DEMO_ALERTS.map((a) => a.districtId)).size, color: "var(--cyan)" },
          { label: "States affected", value: new Set(DEMO_ALERTS.map((a) => a.state)).size, color: "var(--text)" },
        ].map((m) => (
          <div key={m.label} className="metric-card">
            <div className="metric-value large" style={{ color: m.color }}>{m.value}</div>
            <div className="metric-label">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Alert cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className="panel-solid"
            onClick={() => handleAlertClick(alert)}
            style={{
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              cursor: "pointer",
              borderLeft: `3px solid ${
                alert.severity === "HIGH"
                  ? "var(--red)"
                  : alert.severity === "MODERATE"
                  ? "var(--amber)"
                  : "var(--green)"
              }`,
              transition: "background 0.15s",
              borderRadius: "var(--radius)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(0,212,255,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-sm)",
                  background:
                    alert.severity === "HIGH"
                      ? "rgba(255, 59, 78, 0.12)"
                      : alert.severity === "MODERATE"
                      ? "rgba(245, 166, 35, 0.12)"
                      : "rgba(34, 214, 138, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                {ALERT_TYPE_ICONS[alert.type]}
              </div>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                    {alert.districtName}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--cyan)" }}>{alert.state}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                  {ALERT_TYPE_LABELS[alert.type]}
                </div>
                {alert.threshold && (
                  <div style={{ fontSize: 10, color: "var(--text-faint)", fontFamily: "var(--font-mono)", marginTop: 1 }}>
                    {alert.threshold}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
              {alert.probability > 0 && (
                <div style={{ fontSize: 20, fontWeight: 800, color: alert.severity === "HIGH" ? "var(--red)" : alert.severity === "MODERATE" ? "var(--amber)" : "var(--green)" }}>
                  {alert.probability}%
                </div>
              )}
              <span className={`badge badge-${alert.severity}`}>{alert.severity}</span>
              <span style={{ fontSize: 9, color: "var(--text-faint)" }}>→ View on map</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-faint)", fontSize: 13 }}>
            No alerts match the current filter.
          </div>
        )}
      </div>
    </div>
  );
}
