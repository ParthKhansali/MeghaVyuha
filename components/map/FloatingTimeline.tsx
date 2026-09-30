"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRaiseStore, SIM_START_UTC, hourOffsetToLabel } from "@/store/useRaiseStore";

const MAX_HOURS = 240;

// Major time landmarks for tick display
const LANDMARKS = [
  { h: 0,   label: "+0h",  day: "Day 0" },
  { h: 24,  label: "+24h", day: "Day 1" },
  { h: 48,  label: "+48h", day: "Day 2" },
  { h: 72,  label: "+72h", day: "Day 3" },
  { h: 96,  label: "+96h", day: "Day 4" },
  { h: 120, label: "+5d",  day: "Day 5" },
  { h: 168, label: "+7d",  day: "Day 7" },
  { h: 240, label: "+10d", day: "Day 10" },
];

export function FloatingTimeline() {
  const { hourOffset, setHourOffset } = useRaiseStore();
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const isDragging = useRef(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // ── Playback animation ──────────────────────────────────────────────────
  const animate = useCallback(
    (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const delta = (timestamp - lastTimeRef.current) / 1000; // seconds elapsed
      lastTimeRef.current = timestamp;

      // Advance 8h per second at 1× speed so 10 days takes 30s
      const hoursPerSecond = 8 * speed;
      setHourOffset((h) => {
        const next = h + hoursPerSecond * delta;
        if (next >= MAX_HOURS) {
          return 0; // loop seamlessly back to start
        }
        return next;
      });

      animRef.current = requestAnimationFrame(animate);
    },
    [speed, setHourOffset]
  );

  useEffect(() => {
    if (playing) {
      lastTimeRef.current = null;
      animRef.current = requestAnimationFrame(animate);
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [playing, animate]);

  // ── Keyboard shortcut: Space to toggle play/pause ───────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        setPlaying((p) => {
          if (!p && hourOffset >= MAX_HOURS) setHourOffset(0);
          return !p;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hourOffset, setHourOffset]);

  // ── Track click/drag ────────────────────────────────────────────────────
  const getHourFromPointer = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return hourOffset;
    const rect = el.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return frac * MAX_HOURS;
  }, [hourOffset]);

  const handleTrackMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      setPlaying(false);
      const h = getHourFromPointer(e.clientX);
      setHourOffset(h);
    },
    [getHourFromPointer, setHourOffset]
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const h = getHourFromPointer(e.clientX);
      setHourOffset(h);
    };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [getHourFromPointer, setHourOffset]);

  const stepBy = useCallback(
    (delta: number) => {
      setPlaying(false);
      setHourOffset((h) => {
        if (delta > 0) {
          const currentDay = Math.floor(h / 24);
          return Math.min(MAX_HOURS, (currentDay + 1) * 24);
        } else if (delta < 0) {
          const currentDay = Math.ceil(h / 24);
          return Math.max(0, (currentDay - 1) * 24);
        }
        return Math.max(0, Math.min(MAX_HOURS, h + delta));
      });
    },
    [setHourOffset]
  );

  // ── Valid time display ──────────────────────────────────────────────────
  const validLabel = hourOffsetToLabel(Math.round(hourOffset));
  const leadH = Math.round(hourOffset);
  const leadLabel = leadH < 24 ? `+${leadH}h` : `+${(leadH / 24).toFixed(1).replace(".0", "")}d`;

  const fraction = hourOffset / MAX_HOURS;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 14,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "var(--z-hud)" as any,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "10px 18px 8px",
        background: "rgba(4, 7, 14, 0.92)",
        border: "1px solid rgba(80, 140, 255, 0.28)",
        borderRadius: 20,
        backdropFilter: "blur(18px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.65)",
        width: "min(600px, calc(100% - 36px))",
        userSelect: "none",
      }}
    >
      {/* Top row: time display + controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        {/* Valid time */}
        <div style={{ minWidth: 140 }}>
          <div style={{ fontSize: 8, color: "var(--text-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            VALID TIME
          </div>
          <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--cyan)", fontWeight: 700, lineHeight: 1.2 }}>
            {validLabel}
          </div>
          <div style={{ fontSize: 9, color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
            Lead {leadLabel}
          </div>
        </div>

        {/* Playback Controls (1-day stepping & play/pause) */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Step back 1 Day */}
          <button
            onClick={() => stepBy(-24)}
            title="Step back 1 Day (-24h)"
            aria-label="Step back 1 Day"
            style={{ ...iconBtnStyle, padding: "0 6px", width: "auto", display: "flex", alignItems: "center", gap: 3 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 700 }}>-1d</span>
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => {
              if (hourOffset >= MAX_HOURS) {
                setHourOffset(0);
              }
              setPlaying(!playing);
            }}
            title={playing ? "Pause animation (Space)" : "Play animation (Space)"}
            aria-label={playing ? "Pause animation" : "Play animation"}
            style={{
              width: 36, height: 36, borderRadius: "50%", border: "none",
              background: playing
                ? "linear-gradient(135deg, #004499 0%, #0070cc 100%)"
                : "linear-gradient(135deg, #0070cc 0%, #00d4ff 100%)",
              color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 ${playing ? 20 : 14}px rgba(0, 212, 255, ${playing ? 0.6 : 0.4})`,
              flexShrink: 0, transition: "all 0.2s ease",
            }}
          >
            {playing ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 2 }}>
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          {/* Step forward 1 Day */}
          <button
            onClick={() => stepBy(24)}
            title="Step forward 1 Day (+24h)"
            aria-label="Step forward 1 Day"
            style={{ ...iconBtnStyle, padding: "0 6px", width: "auto", display: "flex", alignItems: "center", gap: 3 }}
          >
            <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 700 }}>+1d</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Speed & Reset */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 8.5, color: "var(--text-faint)", letterSpacing: "0.08em" }}>SPEED</span>
            {[0.5, 1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                style={{
                  padding: "2px 5px",
                  borderRadius: 3,
                  border: speed === s ? "1px solid var(--cyan)" : "1px solid var(--hairline)",
                  background: speed === s ? "rgba(0,212,255,0.15)" : "transparent",
                  color: speed === s ? "var(--cyan)" : "var(--text-faint)",
                  fontSize: 8.5, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-ui)",
                }}
              >
                {s}×
              </button>
            ))}
          </div>

          {/* Reset */}
          <button onClick={() => { setPlaying(false); setHourOffset(0); }} style={iconBtnStyle} title="Reset to T+0 (Day 0)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Timeline track */}
      <div
        ref={trackRef}
        onMouseDown={handleTrackMouseDown}
        style={{
          position: "relative", height: 32, cursor: "crosshair",
          display: "flex", alignItems: "center",
        }}
      >
        {/* Rail */}
        <div
          style={{
            position: "absolute", left: 0, right: 0, height: 3,
            background: "rgba(80, 140, 255, 0.2)",
            borderRadius: 2,
          }}
        />
        {/* Progress */}
        <div
          style={{
            position: "absolute", left: 0, width: `${fraction * 100}%`, height: 3,
            background: "linear-gradient(90deg, #0070cc, #00d4ff)",
            borderRadius: 2,
            transition: playing ? "none" : "width 0.1s",
          }}
        />
        {/* Landmark ticks */}
        {LANDMARKS.map((lm) => {
          const x = (lm.h / MAX_HOURS) * 100;
          const isDay = lm.h % 24 === 0;
          const isCurrentDay = Math.abs(hourOffset - lm.h) < 12;
          return (
            <div
              key={lm.h}
              onClick={(e) => {
                e.stopPropagation();
                setPlaying(false);
                setHourOffset(lm.h);
              }}
              title={`Jump to ${lm.day} (+${lm.h}h)`}
              style={{
                position: "absolute",
                left: `${x}%`,
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                padding: "2px 4px",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  width: isDay ? 2 : 1,
                  height: isDay ? 12 : 7,
                  background: isCurrentDay ? "#00d4ff" : isDay ? "rgba(0,212,255,0.5)" : "rgba(80,140,255,0.3)",
                  borderRadius: 1,
                }}
              />
              {isDay && (
                <span
                  style={{
                    fontSize: 8,
                    color: isCurrentDay ? "#00d4ff" : "var(--text-faint)",
                    fontWeight: isCurrentDay ? 700 : 400,
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-mono)",
                    marginTop: 12,
                  }}
                >
                  {lm.day}
                </span>
              )}
            </div>
          );
        })}
        {/* Scrubber thumb */}
        <div
          style={{
            position: "absolute",
            left: `${fraction * 100}%`,
            transform: "translate(-50%, 0)",
            width: 14, height: 14, borderRadius: "50%",
            background: "#00d4ff",
            border: "2px solid #ffffff",
            boxShadow: "0 0 10px #00d4ff, 0 0 4px #fff",
            cursor: "grab",
            zIndex: 4,
            transition: playing ? "none" : "left 0.1s",
          }}
        />
      </div>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 6,
  border: "1px solid var(--hairline)",
  background: "rgba(255,255,255,0.05)",
  color: "var(--text-dim)", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  transition: "all 0.15s ease", flexShrink: 0,
};
