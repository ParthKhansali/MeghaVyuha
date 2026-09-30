"use client";

import React, { useState, useMemo } from "react";
import { DEMO_DISTRICTS, ROUTER_DECISIONS } from "@/lib/mock/districtForecasts";
import { useRaiseStore } from "@/store/useRaiseStore";
import type { ForecastModel } from "@/types/forecast";

const MODEL_COLS: { id: ForecastModel; label: string }[] = [
  { id: "adaptive", label: "Adaptive" },
  { id: "raw", label: "Raw NWP" },
  { id: "emos", label: "EMOS" },
  { id: "qm", label: "QM" },
  { id: "ml-emos", label: "ML-EMOS" },
];

export default function ForecastExplorerPage() {
  const { selectDistrict, setPage, requestFlyTo } = useRaiseStore();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<string>("expectedRainfallMm");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filterModel, setFilterModel] = useState<ForecastModel>("adaptive");

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return DEMO_DISTRICTS.filter(
      (d) => !s || d.districtName.toLowerCase().includes(s) || d.state.toLowerCase().includes(s)
    ).sort((a, b) => {
      const ar = a as unknown as Record<string, unknown>;
      const br = b as unknown as Record<string, unknown>;
      const av = typeof ar[sortField] === "number" ? (ar[sortField] as number) : 0;
      const bv = typeof br[sortField] === "number" ? (br[sortField] as number) : 0;
      return sortDir === "desc" ? bv - av : av - bv;
    });
  }, [search, sortField, sortDir]);

  const handleSort = (field: string) => {
    if (field === sortField) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const handleRowClick = (districtId: string) => {
    const d = DEMO_DISTRICTS.find((x) => x.districtId === districtId);
    if (d) {
      selectDistrict(districtId);
      requestFlyTo(d.lon, d.lat, 8);
      setPage("overview");
    }
  };

  const th = (label: string, field: string) => (
    <th
      onClick={() => handleSort(field)}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      {label} {sortField === field ? (sortDir === "desc" ? "↓" : "↑") : ""}
    </th>
  );

  return (
    <div
      style={{
        padding: "20px 24px",
        overflowY: "auto",
        height: "100%",
        background: "var(--bg)",
      }}
    >
      <div className="page-header">
        <div>
          <div className="page-title">Forecast Explorer</div>
          <div className="page-subtitle">Browse districts, thresholds and forecast data</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="input"
            placeholder="Search district or state…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
          <select className="select" style={{ width: 140 }} value={filterModel} onChange={(e) => setFilterModel(e.target.value as ForecastModel)}>
            {MODEL_COLS.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
          <span className="badge badge-demo badge" style={{ alignSelf: "center" }}>Demo Data</span>
        </div>
      </div>

      <div className="panel-solid" style={{ borderRadius: "var(--radius)", overflow: "hidden" }}>
        <table className="data-table" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              {th("District", "districtName")}
              {th("State", "state")}
              {th("Expected (mm)", "expectedRainfallMm")}
              {th("P > 64.5 mm", "probabilityHeavy")}
              {th("P > 115.6 mm", "probabilityVeryHeavy")}
              {th("P > 204.5 mm", "probabilityExtreme")}
              <th>Regime</th>
              {th("Reliability", "reliability")}
              <th>Selected Expert</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => {
              const router = ROUTER_DECISIONS[d.districtId];
              return (
                <tr key={d.districtId} onClick={() => handleRowClick(d.districtId)}>
                  <td className="primary">{d.districtName}</td>
                  <td>{d.state}</td>
                  <td className="cyan">{d.expectedRainfallMm}</td>
                  <td style={{ color: pctColor(d.probabilityHeavy) }}>{d.probabilityHeavy}%</td>
                  <td style={{ color: pctColor(d.probabilityVeryHeavy) }}>{d.probabilityVeryHeavy}%</td>
                  <td style={{ color: pctColor(d.probabilityExtreme) }}>{d.probabilityExtreme}%</td>
                  <td style={{ fontSize: 11 }}>{d.regime}</td>
                  <td>
                    <span
                      style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
                        color: d.reliability === "HIGH" ? "var(--green)" : d.reliability === "MODERATE" ? "var(--amber)" : "var(--red)",
                      }}
                    >
                      {d.reliability}
                    </span>
                  </td>
                  <td>
                    {router && (
                      <span
                        style={{
                          fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                          color: router.correctionActive ? "var(--teal)" : "var(--text-faint)",
                        }}
                      >
                        {router.selectedModel}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, fontSize: 10, color: "var(--text-faint)", textAlign: "center" }}>
        Click a row to fly to district on the Live Map · Prototype simulation — not operational forecast data
      </div>
    </div>
  );
}

function pctColor(pct: number) {
  if (pct >= 70) return "var(--red)";
  if (pct >= 40) return "var(--amber)";
  return "var(--text-dim)";
}
