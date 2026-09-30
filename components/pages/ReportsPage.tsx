"use client";

import React from "react";
import { DEMO_DISTRICTS } from "@/lib/mock/districtForecasts";
import { DEMO_ALERTS } from "@/lib/mock/alerts";
import { DATA_SOURCES, CURRENT_CYCLE } from "@/lib/mock/validation";
import { useRaiseStore } from "@/store/useRaiseStore";

export default function ReportsPage() {
  const { model, leadDay } = useRaiseStore();

  const highRisk = DEMO_DISTRICTS
    .filter((d) => d.probabilityVeryHeavy >= 30)
    .sort((a, b) => b.expectedRainfallMm - a.expectedRainfallMm)
    .slice(0, 6);

  const highAlerts = DEMO_ALERTS.filter((a) => a.severity === "HIGH");

  const handleExport = () => {
    const html = document.getElementById("meghavyuha-report")?.innerHTML ?? "";
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>MEGHAVYUHA Forecast Report</title>
            <style>
              body { font-family: sans-serif; padding: 32px; color: #111; max-width: 900px; margin: 0 auto; }
              .header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
              .logo { width: 48px; height: 48px; }
              h1 { color: #0055aa; margin: 0; } h2 { color: #0077cc; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
              table { width: 100%; border-collapse: collapse; margin: 16px 0; }
              th { background: #eef; text-align: left; padding: 8px; border-bottom: 2px solid #aac; }
              td { padding: 7px 8px; border-bottom: 1px solid #eee; }
              .badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: bold; }
              .high { background: #ffe0e0; color: #c00; }
              .mod { background: #fff3d0; color: #880; }
              .note { background: #f0f4ff; border: 1px solid #aac; border-radius: 5px; padding: 12px; margin: 12px 0; font-size: 13px; }
            </style>
          </head>
          <body>
            <div class="header">
              <img src="/meghavyuha-logo.png" class="logo" alt="MEGHAVYUHA" />
              <div>
                <h1>MEGHAVYUHA</h1>
                <div style="color: #666; font-size: 13px;">Regime- and Error-Aware Probabilistic Rainfall Intelligence for India</div>
              </div>
            </div>
            ${html}
          </body>
        </html>
      `);
      win.document.close();
      win.print();
    }
  };

  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", height: "100%", background: "var(--bg)" }}>
      <div className="page-header">
        <div>
          <div className="page-title">Reports</div>
          <div className="page-subtitle">Forecast audit summary and data-source status</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="badge badge-demo badge">Demo Data</span>
          <button onClick={handleExport} className="btn btn-primary" style={{ gap: 6 }}>
            ⬇ Export Report
          </button>
        </div>
      </div>

      <div id="meghavyuha-report">
        {/* Cycle info */}
        <div className="panel-solid" style={{ padding: 16, marginBottom: 16 }}>
          <h2 style={{ color: "var(--cyan)", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
            MEGHAVYUHA Forecast Summary
          </h2>
          <div className="metric-grid-4">
            {[
              { label: "Forecast Cycle", value: CURRENT_CYCLE.label },
              { label: "Active Model", value: model.toUpperCase() },
              { label: "Lead Time", value: `Day ${leadDay}` },
              { label: "Mode", value: "Prototype" },
            ].map((m) => (
              <div key={m.label} className="metric-card">
                <div style={{ fontSize: 9, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-mono)" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* High-risk districts */}
        <div className="panel-solid" style={{ padding: 16, marginBottom: 16 }}>
          <div className="section-label">Highest-Risk Districts (P Very Heavy ≥ 30%)</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>District</th>
                <th>State</th>
                <th>Expected (mm)</th>
                <th>P Heavy</th>
                <th>P Very Heavy</th>
                <th>Regime</th>
                <th>Selected Expert</th>
                <th>Correction</th>
              </tr>
            </thead>
            <tbody>
              {highRisk.map((d) => {
                const { ROUTER_DECISIONS } = require("@/lib/mock/districtForecasts");
                const router = ROUTER_DECISIONS[d.districtId];
                return (
                  <tr key={d.districtId}>
                    <td className="primary">{d.districtName}</td>
                    <td>{d.state}</td>
                    <td className="cyan">{d.expectedRainfallMm}</td>
                    <td style={{ color: "var(--amber)" }}>{d.probabilityHeavy}%</td>
                    <td style={{ color: "var(--red)" }}>{d.probabilityVeryHeavy}%</td>
                    <td style={{ fontSize: 11 }}>{d.regime}</td>
                    <td style={{ color: "var(--teal)", fontWeight: 700, textTransform: "uppercase", fontSize: 11 }}>
                      {router?.selectedModel}
                    </td>
                    <td>
                      <span style={{ fontSize: 10, fontWeight: 700, color: router?.correctionActive ? "var(--teal)" : "var(--text-faint)" }}>
                        {router?.correctionActive ? "ACTIVE" : "SKIPPED"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Active alerts */}
        <div className="panel-solid" style={{ padding: 16, marginBottom: 16 }}>
          <div className="section-label">Active HIGH Severity Alerts</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {highAlerts.map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  background: "rgba(255,59,78,0.06)",
                  border: "1px solid rgba(255,59,78,0.18)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: "var(--text)" }}>{a.districtName}</span>
                  <span style={{ color: "var(--cyan)", marginLeft: 8, fontSize: 11 }}>{a.state}</span>
                  <span style={{ color: "var(--text-dim)", marginLeft: 8, fontSize: 11 }}>— {a.title}</span>
                  {a.threshold && <span style={{ color: "var(--text-faint)", marginLeft: 6, fontSize: 10, fontFamily: "var(--font-mono)" }}>{a.threshold}</span>}
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {a.probability > 0 && <span style={{ fontWeight: 700, color: "var(--red)", fontFamily: "var(--font-mono)" }}>{a.probability}%</span>}
                  <span className="badge badge-HIGH">HIGH</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data source status */}
        <div className="panel-solid" style={{ padding: 16, marginBottom: 16 }}>
          <div className="section-label">Data Source Status</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {DATA_SOURCES.map((src) => (
              <div
                key={src.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 10px",
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--hairline)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className={`status-dot ${src.available ? "ok" : "down"}`} />
                  <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{src.name}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {src.isDemo && <span className="badge badge-demo badge">Simulated</span>}
                  <span style={{ fontSize: 10, color: src.available ? "var(--green)" : "var(--red)" }}>
                    {src.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast audit note */}
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(0, 212, 255, 0.05)",
            border: "1px solid rgba(0, 212, 255, 0.15)",
            borderRadius: "var(--radius)",
            fontSize: 11,
            color: "var(--text-dim)",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "var(--cyan)" }}>Forecast Audit Note:</strong> This is a prototype demonstration.
          The MEGHAVYUHA adaptive selector identifies the calibrated post-processing model (CSG-EMOS, Hurdle, QM comparator, or Raw NWP) based on
          synoptic context, lead time, ensemble spread and historical Error Atlas evidence. Corrections are applied only when
          supported by retrospective evaluation. All values shown are simulation data.
        </div>
      </div>
    </div>
  );
}
