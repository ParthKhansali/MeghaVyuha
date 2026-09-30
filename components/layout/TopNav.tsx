"use client";

import React from "react";
import { useRaiseStore, type NavPage } from "@/store/useRaiseStore";
import { CURRENT_CYCLE } from "@/lib/mock/validation";

const NAV_ITEMS: { id: NavPage; label: string; badge?: string }[] = [
  { id: "overview", label: "OVERVIEW" },
  { id: "district-intelligence", label: "DISTRICT INTEL" },
  { id: "error-atlas", label: "ERROR ATLAS" },
  { id: "correction-engine", label: "CORRECTION ENGINE" },
  { id: "validation", label: "VALIDATION" },
  { id: "case-replay", label: "CASE REPLAY" },
  { id: "data-provenance", label: "DATA & PROVENANCE" },
];

export function TopNav() {
  const { activePage, setPage, setScenarioSelectorOpen, setSearchOpen } =
    useRaiseStore();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 14px",
        height: 50,
        background: "rgba(3, 5, 12, 0.99)",
        borderBottom: "1px solid rgba(80, 140, 255, 0.14)",
        flexShrink: 0,
        zIndex: 100,
        position: "relative",
        boxShadow: "0 1px 20px rgba(0, 0, 0, 0.6)",
      }}
    >
      {/* ── Brand ── */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}
        onClick={() => setPage("overview")}
        aria-label="MEGHAVYUHA — return to overview"
        role="button"
      >
        <div
          style={{
            width: 32,
            height: 32,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            borderRadius: 6,
            background: "rgba(0, 80, 180, 0.2)",
            border: "1px solid rgba(80, 140, 255, 0.3)",
          }}
        >
          <img
            src="/meghavyuha-logo.png"
            alt="MEGHAVYUHA"
            style={{ width: 28, height: 28, objectFit: "contain" }}
          />
        </div>

        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.08em",
              lineHeight: 1.1,
              color: "#ffffff",
              fontFamily: "var(--font-ui)",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: "#7ab4ff" }}>M</span>EGHA
            <span
              style={{
                background: "linear-gradient(90deg, #4a8fff, #00d4ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              VYUHA
            </span>
          </div>
          <div
            style={{
              fontSize: 7.5,
              color: "rgba(130, 170, 220, 0.65)",
              letterSpacing: "0.04em",
              lineHeight: 1,
              marginTop: 2,
              textTransform: "uppercase",
            }}
          >
            Regime- & Error-Aware Rainfall Intelligence
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "center", overflow: "hidden" }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              style={{
                position: "relative",
                padding: "5px 10px",
                borderRadius: 4,
                border: isActive
                  ? "1px solid rgba(74, 143, 255, 0.5)"
                  : "1px solid transparent",
                background: isActive
                  ? "rgba(30, 70, 160, 0.25)"
                  : "transparent",
                color: isActive ? "#c8deff" : "var(--text-dim)",
                fontSize: 9.5,
                fontWeight: isActive ? 700 : 500,
                letterSpacing: "0.06em",
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "var(--font-ui)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "#c8deff";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--text-dim)";
              }}
            >
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span
                  style={{
                    width: 15, height: 15, borderRadius: "50%",
                    background: "#ff3b4e", color: "#ffffff",
                    fontSize: 8, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    lineHeight: 1,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Right side: Search + Cycle + DEMO pill + Settings ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          aria-label="Search districts"
          title="Search districts (Ctrl+K)"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--hairline)",
            borderRadius: 5,
            color: "var(--text-dim)",
            cursor: "pointer",
            padding: "4px 9px",
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 10.5,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span style={{ color: "var(--text-faint)" }}>Search…</span>
        </button>

        {/* Forecast cycle */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 8, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Init
          </div>
          <div style={{ fontSize: 10, color: "var(--text)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            {CURRENT_CYCLE.label}
          </div>
        </div>

        {/* DEMO DATA pill */}
        <div
          onClick={() => setScenarioSelectorOpen(true)}
          title="Prototype — illustrative demo data"
          aria-label="Illustrative demo data — click to switch scenario"
          role="button"
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "3px 8px",
            background: "rgba(245, 166, 35, 0.10)",
            border: "1px solid rgba(245, 166, 35, 0.35)",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#f5a623" }} />
          <span style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: "0.08em", color: "#f5a623", textTransform: "uppercase" }}>
            Concept Demo
          </span>
        </div>

        {/* Settings gear */}
        <button
          onClick={() => setScenarioSelectorOpen(true)}
          title="Demo Scenarios & Settings"
          aria-label="Open settings"
          style={{
            background: "transparent", border: "none",
            color: "var(--text-dim)", cursor: "pointer",
            padding: 4, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cyan)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
