"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Legend,
} from "recharts";
import { MODEL_METRICS, REGIONAL_SKILL, REGIME_SKILL } from "@/lib/mock/validation";
import type { ForecastModel } from "@/types/forecast";

const MODEL_COLORS: Record<ForecastModel, string> = {
  adaptive: "#00d4ff",
  raw: "#7a8ba4",
  emos: "#22d68a",
  qm: "#f5a623",
  "ml-emos": "#8f7cff",
};

type MetricKey = "crps" | "rmse" | "ets" | "csi" | "pod" | "far" | "fss" | "bss";

const METRIC_INFO: Record<MetricKey, { label: string; desc: string; lowerBetter?: boolean }> = {
  crps: { label: "CRPS", desc: "Continuous Ranked Probability Score — lower is better", lowerBetter: true },
  rmse: { label: "RMSE", desc: "Root Mean Square Error — lower is better", lowerBetter: true },
  ets: { label: "ETS", desc: "Equitable Threat Score — higher is better" },
  csi: { label: "CSI", desc: "Critical Success Index — higher is better" },
  pod: { label: "POD", desc: "Probability of Detection — higher is better" },
  far: { label: "FAR", desc: "False Alarm Ratio — lower is better", lowerBetter: true },
  fss: { label: "FSS", desc: "Fractions Skill Score — higher is better" },
  bss: { label: "Brier SS", desc: "Brier Skill Score vs. Raw NWP — higher is better" },
};

const METRICS_ORDER: MetricKey[] = ["crps", "rmse", "ets", "csi", "pod", "far", "fss", "bss"];

export default function ModelAnalysisPage() {
  const [primaryMetric, setPrimaryMetric] = useState<MetricKey>("crps");

  const barData = useMemo(() =>
    MODEL_METRICS.map((m) => ({
      name: m.model.toUpperCase(),
      model: m.model,
      value: m[primaryMetric],
    })), [primaryMetric]);

  const radarData = useMemo(() => {
    return (["ets", "csi", "pod", "fss", "bss"] as MetricKey[]).map((metric) => {
      const row: Record<string, string | number> = { metric: METRIC_INFO[metric].label };
      for (const m of MODEL_METRICS) {
        row[m.model] = m[metric];
      }
      return row;
    });
  }, []);

  const isLower = METRIC_INFO[primaryMetric]?.lowerBetter;

  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", height: "100%", background: "var(--bg)" }}>
      <div className="page-header">
        <div>
          <div className="page-title">Model Analysis</div>
          <div className="page-subtitle">
            Comparative verification — MEGHAVYUHA vs. baseline methods
          </div>
        </div>
        <span className="badge badge-demo badge">ILLUSTRATIVE — Not Validated</span>
      </div>

      {/* Metric overview table */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Metric bar chart */}
        <div className="panel-solid" style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div className="section-label" style={{ marginBottom: 0 }}>Score Comparison</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                {METRIC_INFO[primaryMetric]?.label}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-faint)" }}>
                {METRIC_INFO[primaryMetric]?.desc}
              </div>
            </div>
            <select
              className="select"
              style={{ width: 110 }}
              value={primaryMetric}
              onChange={(e) => setPrimaryMetric(e.target.value as MetricKey)}
            >
              {METRICS_ORDER.map((m) => (
                <option key={m} value={m}>{METRIC_INFO[m].label}</option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "var(--text-faint)" }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "var(--text-dim)" }} width={70} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-panel-solid)",
                  border: "1px solid var(--hairline)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 11,
                }}
              />
              <Bar
                dataKey="value"
                radius={[0, 3, 3, 0]}
                fill="var(--cyan)"
                label={{ position: "insideRight", fontSize: 10, fill: "rgba(255,255,255,0.6)" }}
              >
                {barData.map((entry) => (
                  <Cell key={entry.model} fill={MODEL_COLORS[entry.model as ForecastModel]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Metrics table */}
        <div className="panel-solid" style={{ padding: 16 }}>
          <div className="section-label">Full Verification Table</div>
          <table className="data-table" style={{ fontSize: 11 }}>
            <thead>
              <tr>
                <th>Model</th>
                {METRICS_ORDER.map((m) => <th key={m}>{METRIC_INFO[m].label}</th>)}
              </tr>
            </thead>
            <tbody>
              {MODEL_METRICS.map((row) => (
                <tr key={row.model}>
                  <td
                    style={{
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: 11,
                      color: MODEL_COLORS[row.model],
                    }}
                  >
                    {row.model}
                  </td>
                  {METRICS_ORDER.map((m) => (
                    <td
                      key={m}
                      style={{
                        fontFamily: "var(--font-mono)",
                        color:
                          row.model === "adaptive"
                            ? "var(--cyan)"
                            : "var(--text-dim)",
                        fontWeight: row.model === "adaptive" ? 700 : 400,
                      }}
                    >
                      {row[m].toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Radar chart + regional skill */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Radar */}
        <div className="panel-solid" style={{ padding: 16 }}>
          <div className="section-label">Skill Profile (Higher = Better)</div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "var(--text-dim)" }} />
              {MODEL_METRICS.map((m) => (
                <Radar
                  key={m.model}
                  name={m.model.toUpperCase()}
                  dataKey={m.model}
                  stroke={MODEL_COLORS[m.model]}
                  fill={MODEL_COLORS[m.model]}
                  fillOpacity={m.model === "adaptive" ? 0.15 : 0.04}
                  strokeWidth={m.model === "adaptive" ? 2 : 1}
                />
              ))}
              <Legend
                wrapperStyle={{ fontSize: 10 }}
                formatter={(v) => <span style={{ color: MODEL_COLORS[v.toLowerCase() as ForecastModel] }}>{v}</span>}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-panel-solid)",
                  border: "1px solid var(--hairline)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 11,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Regional skill */}
        <div className="panel-solid" style={{ padding: 16 }}>
          <div className="section-label">Regional Performance — Atlas Selector vs Raw</div>
          <table className="data-table" style={{ fontSize: 11 }}>
            <thead>
              <tr>
                <th>Region</th>
                <th>Raw CRPS</th>
                <th>Atlas CRPS</th>
                <th>CRPSS Gain</th>
              </tr>
            </thead>
            <tbody>
              {REGIONAL_SKILL.map((r) => (
                <tr key={r.region}>
                  <td className="primary" style={{ fontSize: 11 }}>{r.region}</td>
                  <td style={{ fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}>{r.crpsRaw.toFixed(2)}</td>
                  <td style={{ fontFamily: "var(--font-mono)", color: crpsColor(r.crpsAtlas) }}>{r.crpsAtlas.toFixed(2)}</td>
                  <td style={{ fontFamily: "var(--font-mono)", color: r.crpss > 0 ? "var(--green)" : "var(--red)" }}>{(r.crpss * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regime skill */}
      <div className="panel-solid" style={{ padding: 16 }}>
        <div className="section-label">Regime-Based Verification</div>
        <div style={{ fontSize: 10, color: "var(--text-faint)", marginBottom: 10 }}>
          Adaptive model performance stratified by synoptic regime. Note that Break and Weak regimes have fewer samples and higher uncertainty.
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Regime</th>
              <th>CRPS</th>
              <th>Brier SS</th>
              <th>n (samples)</th>
              <th>Assessment</th>
            </tr>
          </thead>
          <tbody>
            {REGIME_SKILL.map((r) => (
              <tr key={r.regime}>
                <td className="primary">{r.regime}</td>
                <td style={{ fontFamily: "var(--font-mono)", color: crpsColor(r.crps) }}>{r.crps.toFixed(1)}</td>
                <td style={{ fontFamily: "var(--font-mono)", color: bssColor(r.bss) }}>{r.bss.toFixed(2)}</td>
                <td style={{ fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}>{r.n}</td>
                <td>
                  <span
                    style={{
                      fontSize: 10, fontWeight: 700,
                      color: r.bss > 0.3 ? "var(--green)" : r.bss > 0.15 ? "var(--amber)" : "var(--text-dim)",
                    }}
                  >
                    {r.bss > 0.3 ? "Strong skill" : r.bss > 0.15 ? "Moderate skill" : "Limited skill"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(143, 124, 255, 0.06)", border: "1px solid rgba(143, 124, 255, 0.15)", borderRadius: "var(--radius-sm)", fontSize: 10, color: "var(--text-faint)" }}>
        All metrics above are demonstration data for prototype purposes. Real validation results will be populated when the MEGHAVYUHA backend is connected.
      </div>
    </div>
  );
}

const crpsColor = (v: number) => v < 8 ? "var(--green)" : v < 12 ? "var(--amber)" : "var(--red)";
const bssColor = (v: number) => v > 0.3 ? "var(--green)" : v > 0.15 ? "var(--amber)" : "var(--text-dim)";
const podColor = (v: number) => v > 0.7 ? "var(--green)" : v > 0.5 ? "var(--amber)" : "var(--red)";
