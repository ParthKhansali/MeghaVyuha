"use client";

// MEGHAVYUHA — Data & Provenance Page
// Every data source, its role, status, and provenance.

import React, { useState } from "react";
import { DATA_SOURCES } from "@/lib/mock/validation";
import type { DataSourceStatus } from "@/types/forecast";

const PANEL: React.CSSProperties = {
  background: "rgba(8, 12, 22, 0.82)",
  border: "1px solid rgba(80, 140, 255, 0.12)",
  borderRadius: 8,
  padding: 16,
};

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "rgba(160, 185, 220, 0.6)",
  marginBottom: 10,
};

type StatusKey = DataSourceStatus["status"];

const STATUS_CONFIG: Record<StatusKey, { color: string; label: string; bg: string; icon: string }> = {
  REAL_DATA: { color: "#22d68a", label: "REAL DATA", bg: "rgba(34,214,138,0.1)", icon: "●" },
  REPLAY: { color: "#4a8fff", label: "REPLAY", bg: "rgba(74,143,255,0.1)", icon: "◎" },
  DEMO_DATA: { color: "#f5a623", label: "DEMO DATA", bg: "rgba(245,166,35,0.1)", icon: "◆" },
  PENDING_ACCESS: { color: "#7a8ba4", label: "PENDING ACCESS", bg: "rgba(122,139,164,0.1)", icon: "○" },
  ADAPTER_PLANNED: { color: "#7a8ba4", label: "ADAPTER PLANNED", bg: "rgba(122,139,164,0.08)", icon: "◌" },
};

function StatusPill({ status }: { status: StatusKey }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "2px 7px", borderRadius: 4,
        background: cfg.bg, color: cfg.color,
        border: `1px solid ${cfg.color}44`,
        fontSize: 8, fontWeight: 800, letterSpacing: "0.06em",
      }}
    >
      <span>{cfg.icon}</span>
      <span>{cfg.label}</span>
    </span>
  );
}

export default function DataProvenancePage() {
  const [filterStatus, setFilterStatus] = useState<StatusKey | "ALL">("ALL");

  const filtered = filterStatus === "ALL"
    ? DATA_SOURCES
    : DATA_SOURCES.filter((s) => s.status === filterStatus);

  const statusCounts = DATA_SOURCES.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] ?? 0) + 1;
    return acc;
  }, {} as Record<StatusKey, number>);

  return (
    <div
      style={{
        height: "100%", overflowY: "auto", padding: "16px 20px 28px",
        background: "var(--bg)", display: "flex", flexDirection: "column", gap: 16,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "0.01em" }}>
            Data & Provenance
          </div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 3 }}>
            Every input source, its role, status and provenance
          </div>
        </div>
      </div>

      {/* Status Legend + Filter */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ fontSize: 9, color: "var(--text-faint)", marginRight: 4 }}>FILTER:</div>
        <button
          onClick={() => setFilterStatus("ALL")}
          style={{
            padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 9.5,
            border: filterStatus === "ALL" ? "1px solid rgba(74,143,255,0.5)" : "1px solid var(--hairline)",
            background: filterStatus === "ALL" ? "rgba(74,143,255,0.15)" : "rgba(255,255,255,0.03)",
            color: filterStatus === "ALL" ? "#c8deff" : "var(--text-dim)", fontWeight: filterStatus === "ALL" ? 700 : 400,
          }}
        >
          ALL ({DATA_SOURCES.length})
        </button>
        {(Object.keys(STATUS_CONFIG) as StatusKey[]).map((status) => {
          const cfg = STATUS_CONFIG[status];
          const count = statusCounts[status] ?? 0;
          const isActive = filterStatus === status;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 9,
                border: isActive ? `1px solid ${cfg.color}55` : "1px solid var(--hairline)",
                background: isActive ? cfg.bg : "rgba(255,255,255,0.03)",
                color: isActive ? cfg.color : "var(--text-dim)", fontWeight: isActive ? 700 : 400,
              }}
            >
              {cfg.icon} {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Data Source Table */}
      <div style={PANEL}>
        <div style={SECTION_LABEL}>Data Sources ({filtered.length} shown)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((source) => (
            <div
              key={source.id}
              style={{
                padding: "12px 14px",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid var(--hairline)",
                borderRadius: 6,
                display: "grid",
                gridTemplateColumns: "220px 1fr 160px",
                gap: 12,
                alignItems: "start",
              }}
            >
              {/* Source identity */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                  {source.name}
                </div>
                <StatusPill status={source.status} />
                {source.resolution && (
                  <div style={{ fontSize: 8.5, color: "var(--text-faint)", marginTop: 5 }}>
                    Resolution: {source.resolution}
                  </div>
                )}
                {source.timeCoverage && (
                  <div style={{ fontSize: 8.5, color: "var(--text-faint)", marginTop: 2 }}>
                    Coverage: {source.timeCoverage}
                  </div>
                )}
              </div>

              {/* Role + Provenance */}
              <div>
                <div style={{ fontSize: 8.5, color: "#4a8fff", fontWeight: 700, marginBottom: 3, letterSpacing: "0.06em" }}>
                  ROLE
                </div>
                <div style={{ fontSize: 10, color: "var(--text-dim)", lineHeight: 1.5, marginBottom: 6 }}>
                  {source.role}
                </div>
                {source.provenance && (
                  <>
                    <div style={{ fontSize: 8.5, color: "var(--text-faint)", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 2 }}>
                      PROVENANCE
                    </div>
                    <div style={{ fontSize: 9, color: "var(--text-faint)", lineHeight: 1.4, fontStyle: "italic" }}>
                      {source.provenance}
                    </div>
                  </>
                )}
              </div>

              {/* Availability */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 5, fontSize: 9.5, fontWeight: 700,
                    color: source.available ? "#22d68a" : "#7a8ba4",
                  }}
                >
                  <div
                    style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: source.available ? "#22d68a" : "#4a5668",
                    }}
                  />
                  {source.available ? "Available" : "Not Available"}
                </div>
                <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>
                  {source.isDemo ? "Demo / illustrative" : "Real data"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Normalised schema */}
      <div style={PANEL}>
        <div style={SECTION_LABEL}>Normalised Data Schema — Future Backend</div>
        <div style={{ fontSize: 10, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 10 }}>
          All forecast data, regardless of source, will be normalised into the following schema
          before being consumed by MEGHAVYUHA. This ensures BharatFS and future source adapters
          can be connected without redesigning the UI or model logic.
        </div>
        <pre
          style={{
            background: "rgba(0,0,0,0.35)", border: "1px solid rgba(80,140,255,0.12)",
            borderRadius: 5, padding: "12px 14px", fontSize: 9.5,
            color: "#c8deff", fontFamily: "var(--font-mono)", lineHeight: 1.7,
            overflowX: "auto",
          }}
        >
{`{
  forecast_init:        string,   // ISO UTC "2026-09-25T00:00:00Z"
  valid_time:           string,   // ISO UTC
  lead_time_hours:      number,   // 6, 12, 24, ...
  latitude:             number,   // degrees north
  longitude:            number,   // degrees east
  member:               number,   // ensemble member index (0 = det/mean)
  variable:             string,   // "precipitation", "u10", "v10", ...
  value:                number,   // in SI units
  model_id:             string,   // "NEPS-G", "GEFSv12", ...
  model_version:        string,   // e.g. "v3.0"
  units:                string,   // "kg m-2" (accumulation), "mm" (derived)
  accumulation_period:  number,   // hours (always explicit — never implicit)
  source_file:          string,   // GRIB2 / NetCDF file origin
  processing_chain:     string[], // ["raw", "qc", "regrid", "accumulation_diff"]
}`}
        </pre>
        <div style={{ fontSize: 8.5, color: "var(--text-faint)", marginTop: 8 }}>
          Accumulation windows must always be explicit. UTC/IST conversion is tracked.
          All grid remapping operations must be logged in processing_chain.
        </div>
      </div>

      {/* Disclaimer */}
      <div
        style={{
          padding: "10px 14px",
          background: "rgba(122, 139, 164, 0.07)", border: "1px solid rgba(122, 139, 164, 0.2)",
          borderRadius: 6, fontSize: 9, color: "#7a8ba4", lineHeight: 1.7,
        }}
      >
        <strong>Honesty policy:</strong> Data labelled REAL DATA is used in demo mode with limited scope.
        Data labelled PENDING ACCESS has not been acquired. Data labelled DEMO DATA uses placeholder
        fixtures. Data labelled ADAPTER PLANNED has no integration code yet.
        No data source is labelled &quot;available&quot; if only an illustrative placeholder exists.
      </div>
    </div>
  );
}
