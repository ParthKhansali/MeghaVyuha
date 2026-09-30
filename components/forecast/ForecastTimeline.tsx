"use client";

import React, { useState, useCallback } from "react";
import { useRaiseStore } from "@/store/useRaiseStore";
import { DEMO_DISTRICTS } from "@/lib/mock/districtForecasts";
import { DEMO_SCENARIOS } from "@/lib/mock/validation";

export function ForecastTimeline() {
  const { leadDay, setLeadDay, requestFlyTo, setScenario, model } = useRaiseStore();
  const [playing, setPlaying] = useState(false);
  const [playRef, setPlayRef] = useState<ReturnType<typeof setInterval> | null>(null);

  const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const dateLabels: Record<number, string> = {
    1: "26 Sep", 2: "27 Sep", 3: "28 Sep", 4: "29 Sep", 5: "30 Sep",
    6: "01 Oct", 7: "02 Oct", 8: "03 Oct", 9: "04 Oct", 10: "05 Oct",
  };

  const togglePlay = useCallback(() => {
    if (playing) {
      if (playRef) clearInterval(playRef);
      setPlayRef(null);
      setPlaying(false);
    } else {
      setPlaying(true);
      const interval = setInterval(() => {
        setLeadDay((prev: number) => {
          if (prev >= 10) {
            clearInterval(interval);
            setPlaying(false);
            return 1;
          }
          return prev + 1;
        });
      }, 900);
      setPlayRef(interval);
    }
  }, [playing, playRef, setLeadDay]);

  return (
    <div
      className="panel"
      style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 16px",
        borderRadius: 0,
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "none",
        borderTop: "1px solid var(--hairline-accent)",
        background: "rgba(6, 8, 16, 0.95)",
        zIndex: "var(--z-hud)",
      }}
    >
      {/* Play button */}
      <button
        onClick={togglePlay}
        className="btn"
        style={{ width: 32, height: 32, padding: 0, justifyContent: "center", flexShrink: 0 }}
        aria-label={playing ? "Pause forecast" : "Play forecast"}
      >
        {playing ? "⏸" : "▶"}
      </button>

      {/* Timeline steps */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 3, overflow: "hidden" }}>
        {/* Track */}
        <div
          style={{
            flex: 1,
            height: 3,
            background: "var(--bg-input)",
            borderRadius: 2,
            position: "relative",
            cursor: "pointer",
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            const day = Math.max(1, Math.min(10, Math.round(pct * 9) + 1));
            setLeadDay(day);
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${((leadDay - 1) / 9) * 100}%`,
              background: "var(--cyan)",
              borderRadius: 2,
              transition: "width 0.3s ease",
            }}
          />
          {/* Day markers */}
          {days.map((d) => (
            <button
              key={d}
              onClick={(e) => { e.stopPropagation(); setLeadDay(d); }}
              title={`Day ${d} — ${dateLabels[d]}`}
              style={{
                position: "absolute",
                top: "50%",
                left: `${((d - 1) / 9) * 100}%`,
                transform: "translate(-50%, -50%)",
                width: d === leadDay ? 14 : 10,
                height: d === leadDay ? 14 : 10,
                borderRadius: "50%",
                background: d === leadDay ? "var(--cyan)" : "var(--bg-panel-solid)",
                border: `2px solid ${d === leadDay ? "var(--cyan)" : "var(--hairline-strong)"}`,
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: d === leadDay ? "0 0 10px rgba(0, 212, 255, 0.5)" : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Day labels below */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 80,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--cyan)",
          }}
        >
          Day {leadDay}
        </div>
        <div style={{ fontSize: 10, color: "var(--text-dim)" }}>{dateLabels[leadDay]}</div>
      </div>

      {/* Speed indicator */}
      <div
        style={{
          fontSize: 10,
          color: "var(--text-faint)",
          fontFamily: "var(--font-mono)",
          flexShrink: 0,
          minWidth: 24,
        }}
      >
        1×
      </div>

      {/* Scenario selector */}
      <select
        className="select"
        style={{ maxWidth: 160, fontSize: 10 }}
        defaultValue=""
        onChange={(e) => {
          const scenario = DEMO_SCENARIOS.find((s) => s.id === e.target.value);
          if (scenario) {
            setScenario(scenario.id);
            if (scenario.districtId) {
              const d = DEMO_DISTRICTS.find((d) => d.districtId === scenario.districtId);
              if (d) requestFlyTo(scenario.mapCenter[0], scenario.mapCenter[1], scenario.mapZoom);
            } else {
              requestFlyTo(scenario.mapCenter[0], scenario.mapCenter[1], scenario.mapZoom);
            }
          }
          e.target.value = "";
        }}
      >
        <option value="" disabled>Demo Scenario…</option>
        {DEMO_SCENARIOS.map((s) => (
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
