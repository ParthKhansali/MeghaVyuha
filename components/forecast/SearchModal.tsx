"use client";

import React, { useState, useMemo } from "react";
import { useRaiseStore } from "@/store/useRaiseStore";
import { DEMO_DISTRICTS } from "@/lib/mock/districtForecasts";
import { MAJOR_CITIES } from "@/lib/geo/indiaGeoData";

export function SearchModal() {
  const { searchOpen, setSearchOpen, selectDistrict, requestFlyTo } = useRaiseStore();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return DEMO_DISTRICTS.slice(0, 8);
    const q = query.toLowerCase();
    const matchedDistricts = DEMO_DISTRICTS.filter(
      (d) =>
        d.districtName.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.regime.toLowerCase().includes(q)
    );
    return matchedDistricts;
  }, [query]);

  if (!searchOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 80,
      }}
      onClick={() => setSearchOpen(false)}
    >
      <div
        style={{
          width: 520,
          background: "#0a0f1c",
          border: "1px solid rgba(0, 212, 255, 0.3)",
          borderRadius: 8,
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.8)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            borderBottom: "1px solid rgba(80, 140, 255, 0.15)",
            gap: 10,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            autoFocus
            type="text"
            placeholder="Search district, state, or city (e.g., Dehradun, Mumbai, Assam)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 14,
              outline: "none",
              fontFamily: "var(--font-ui)",
            }}
          />
          <button
            onClick={() => setSearchOpen(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-dim)",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: 340, overflowY: "auto", padding: "6px 8px" }}>
          {results.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center", color: "var(--text-faint)", fontSize: 12 }}>
              No districts found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((d) => (
              <div
                key={d.districtId}
                onClick={() => {
                  selectDistrict(d.districtId);
                  requestFlyTo(d.lon, d.lat, 8);
                  setSearchOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  borderRadius: 5,
                  cursor: "pointer",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 212, 255, 0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                    {d.districtName},{" "}
                    <span style={{ color: "var(--cyan)", fontWeight: 500 }}>{d.state}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2 }}>
                    Regime: {d.regime} • {d.lat.toFixed(2)}°N, {d.lon.toFixed(2)}°E
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--cyan)" }}>
                    {d.expectedRainfallMm} mm
                  </div>
                  <div style={{ fontSize: 9.5, color: "var(--text-dim)" }}>
                    P(&gt;64.5): {d.probabilityHeavy}%
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
