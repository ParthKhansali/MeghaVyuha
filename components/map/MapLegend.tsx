"use client";

import React, { useMemo } from "react";
import { useRaiseStore } from "@/store/useRaiseStore";

export function MapLegend() {
  const { viewMode, probabilityThreshold, model, differenceBaseline } = useRaiseStore();

  const config = useMemo(() => {
    if (viewMode === "amount") {
      return {
        title: "Rainfall (mm)",
        gradient: "linear-gradient(to right, #001030 0%, #1e5ba8 8%, #00b4d8 18%, #2ec4b6 30%, #a7c957 45%, #ffd166 60%, #f77f00 75%, #d62828 88%, #c77dff 100%)",
        labels: ["0", "1", "5", "10", "25", "50", "100", "200", "300+"],
      };
    }
    if (viewMode === "probability") {
      const threshStr =
        probabilityThreshold === "heavy"
          ? ">64.5 mm"
          : probabilityThreshold === "very-heavy"
          ? ">115.6 mm"
          : probabilityThreshold === "extreme"
          ? ">204.5 mm"
          : ">0 mm";
      return {
        title: `Probability P(R ${threshStr})`,
        gradient: "linear-gradient(to right, #0a1020 0%, #1e4580 15%, #00b4d8 35%, #2ec4b6 50%, #ffd166 70%, #f77f00 85%, #d62828 100%)",
        labels: ["0%", "10%", "20%", "35%", "50%", "65%", "80%", "90%", "100%"],
      };
    }
    if (viewMode === "uncertainty") {
      return {
        title: "Ensemble Uncertainty Index",
        gradient: "linear-gradient(to right, #22d68a 0%, #f5a623 50%, #ff3b4e 80%, #c77dff 100%)",
        labels: ["Low", "Moderate", "High", "Very High"],
      };
    }
    return {
      title: `Difference (Adaptive − ${differenceBaseline.toUpperCase()}) mm`,
      gradient: "linear-gradient(to right, #0044cc 0%, #3a88f8 35%, #888888 50%, #ff8833 65%, #dd1111 100%)",
      labels: ["< -50", "-20", "-5", "0", "+5", "+20", "+50+"],
    };
  }, [viewMode, probabilityThreshold, differenceBaseline]);

  return (
    <>
      {/* 300 km scale indicator on bottom left of map */}
      <div
        style={{
          position: "absolute",
          bottom: 96,
          left: 18,
          zIndex: "var(--z-hud)",
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <div style={{ fontSize: 9, color: "rgba(220,235,255,0.7)", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
          300 km
        </div>
        <div
          style={{
            width: 72,
            height: 3,
            background: "rgba(255,255,255,0.85)",
            borderLeft: "2px solid #fff",
            borderRight: "2px solid #fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.8)",
          }}
        />
      </div>

      {/* Floating horizontal gradient legend on bottom right of map */}
      <div
        style={{
          position: "absolute",
          bottom: 96,
          right: 18,
          zIndex: "var(--z-hud)",
          padding: "7px 12px",
          background: "rgba(6, 10, 20, 0.88)",
          border: "1px solid rgba(80, 140, 255, 0.22)",
          borderRadius: 6,
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.6)",
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          gap: 5,
          minWidth: 260,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "var(--text)",
            letterSpacing: "0.03em",
          }}
        >
          {config.title}
        </div>

        {/* Continuous gradient bar */}
        <div
          style={{
            width: "100%",
            height: 9,
            borderRadius: 3,
            background: config.gradient,
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.2)",
          }}
        />

        {/* Labels row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {config.labels.map((lbl) => (
            <span
              key={lbl}
              style={{
                fontSize: 8.5,
                color: "var(--text-faint)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "-0.2px",
              }}
            >
              {lbl}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
