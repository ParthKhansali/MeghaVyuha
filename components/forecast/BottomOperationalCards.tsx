"use client";

import React from "react";
import { useRaiseStore } from "@/store/useRaiseStore";
import { DEMO_DISTRICTS } from "@/lib/mock/districtForecasts";

export function BottomOperationalCards() {
  const { setPage, selectDistrict, requestFlyTo } = useRaiseStore();

  const handleAlertClick = (districtName: string, lat: number, lon: number) => {
    const d = DEMO_DISTRICTS.find(
      (x) => x.districtName.toLowerCase() === districtName.toLowerCase()
    );
    if (d) {
      selectDistrict(d.districtId);
      requestFlyTo(d.lon, d.lat, 8);
    } else {
      requestFlyTo(lon, lat, 8);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr 1fr 1.05fr",
        gap: 10,
        padding: "10px 14px",
        background: "rgba(4, 7, 14, 0.98)",
        borderTop: "1px solid rgba(80, 140, 255, 0.2)",
        flexShrink: 0,
        zIndex: 20,
      }}
    >
      {/* ── CARD 1: ALERTS (3) ── */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text)" }}>
            ALERTS (3)
          </span>
          <button
            onClick={() => setPage("district-intelligence")}
            style={linkButtonStyle}
          >
            View All →
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 4 }}>
          {/* Alert 1 */}
          <div
            onClick={() => handleAlertClick("Dehradun", 30.32, 78.03)}
            style={alertRowStyle}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ color: "#ff3b4e", fontSize: 13 }}>●</div>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--text)" }}>
                  Very Heavy Rainfall
                </div>
                <div style={{ fontSize: 9, color: "var(--text-faint)" }}>
                  Dehradun, Uttarakhand • P &gt; 115.6 mm
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text)" }}>32%</span>
              <span style={badgeStyle("#ff9100")}>MODERATE</span>
            </div>
          </div>

          {/* Alert 2 */}
          <div
            onClick={() => handleAlertClick("Dehradun", 30.32, 78.03)}
            style={alertRowStyle}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ color: "#ff9100", fontSize: 13 }}>●</div>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--text)" }}>
                  District Area Exceedance
                </div>
                <div style={{ fontSize: 9, color: "var(--text-faint)" }}>
                  Dehradun, Uttarakhand • ≥25% area &gt; 115.6 mm
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text)" }}>82%</span>
              <span style={badgeStyle("#ff3b4e")}>HIGH</span>
            </div>
          </div>

          {/* Alert 3 */}
          <div
            onClick={() => handleAlertClick("Mumbai", 19.08, 72.88)}
            style={alertRowStyle}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ color: "#ffd166", fontSize: 13 }}>●</div>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--text)" }}>
                  Heavy Rainfall
                </div>
                <div style={{ fontSize: 9, color: "var(--text-faint)" }}>
                  Mumbai, Maharashtra • P &gt; 64.5 mm
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text)" }}>78%</span>
              <span style={badgeStyle("#ff3b4e")}>HIGH</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CARD 2: MODEL ANALYSIS (India-wide) ── */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text)" }}>
            MODEL ANALYSIS (India-wide)
          </span>
          <button
            onClick={() => setPage("validation")}
            style={linkButtonStyle}
          >
            View Details →
          </button>
        </div>

        <div style={{ fontSize: 9, color: "var(--text-dim)", marginTop: 2, marginBottom: 4 }}>
          CRPS (Lower is Better)
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { model: "Raw NWP", value: 0.72, color: "#ff6b6b" },
            { model: "QM", value: 0.58, color: "#ffa94d" },
            { model: "EMOS", value: 0.46, color: "#4dabf7" },
            { model: "ML-EMOS", value: 0.39, color: "#20c997" },
            { model: "Adaptive", value: 0.32, color: "#cc5de8" },
          ].map((item) => (
            <div key={item.model} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 9.5 }}>
              <span style={{ width: 56, color: "var(--text-dim)", flexShrink: 0 }}>
                {item.model}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 7,
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 3.5,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(item.value / 0.8) * 100}%`,
                    height: "100%",
                    background: item.color,
                    borderRadius: 3.5,
                  }}
                />
              </div>
              <span style={{ width: 28, textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--text)" }}>
                {item.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CARD 3: VALIDATION SUMMARY ── */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text)" }}>
            VALIDATION SUMMARY
          </span>
          <button
            onClick={() => setPage("validation")}
            style={linkButtonStyle}
          >
            View Details →
          </button>
        </div>

        {/* 2x3 Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 4 }}>
          <div style={metricBoxStyle}>
            <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>CRPS</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#00e676" }}>↓ 28%</div>
          </div>
          <div style={metricBoxStyle}>
            <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>Brier Skill</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>0.42</div>
          </div>
          <div style={metricBoxStyle}>
            <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>FSS</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>0.61</div>
          </div>
          <div style={metricBoxStyle}>
            <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>ETS</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>0.38</div>
          </div>
          <div style={metricBoxStyle}>
            <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>POD</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>0.71</div>
          </div>
          <div style={metricBoxStyle}>
            <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>FAR</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>0.29</div>
          </div>
        </div>
      </div>

      {/* ── CARD 4: DATA SOURCES / SYSTEM HEALTH ── */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text)" }}>
            DATA SOURCES / SYSTEM HEALTH
          </span>
          <span style={{ fontSize: 9, color: "#00e676", fontWeight: 600 }}>
            ● All Systems Nominal
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 3.5, marginTop: 3 }}>
          {[
            { name: "NCMRWF / NEPS-G", status: "Available (Demo)", ok: true },
            { name: "IMD Observations", status: "Available (Demo)", ok: true },
            { name: "ERA5 Reanalysis", status: "Available (Demo)", ok: true },
            { name: "Satellite Data", status: "Available (Demo)", ok: true },
            { name: "District Boundaries", status: "Available (Open Data)", ok: true },
          ].map((src) => (
            <div
              key={src.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 9.5,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#00e676", fontSize: 9 }}>●</span>
                <span style={{ color: "var(--text-dim)" }}>{src.name}</span>
              </div>
              <span style={{ color: "var(--text-faint)", fontFamily: "var(--font-mono)", fontSize: 8.5 }}>
                {src.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "rgba(10, 15, 26, 0.75)",
  border: "1px solid rgba(80, 140, 255, 0.15)",
  borderRadius: 6,
  padding: "8px 12px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid rgba(80, 140, 255, 0.1)",
  paddingBottom: 4,
};

const linkButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "var(--cyan)",
  fontSize: 9.5,
  fontWeight: 600,
  cursor: "pointer",
  padding: 0,
};

const alertRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  padding: "2px 4px",
  borderRadius: 4,
  transition: "background 0.15s",
};

const metricBoxStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(80, 140, 255, 0.08)",
  borderRadius: 4,
  padding: "4px 6px",
  textAlign: "center",
};

function badgeStyle(color: string): React.CSSProperties {
  return {
    fontSize: 8,
    fontWeight: 700,
    color,
    background: `${color}18`,
    border: `1px solid ${color}40`,
    padding: "1px 5px",
    borderRadius: 3,
    letterSpacing: "0.04em",
  };
}
