"use client";

import React from "react";
import { useRaiseStore, type BasemapMode } from "@/store/useRaiseStore";

interface BasemapOption {
  id: BasemapMode;
  label: string;
  previewBg: string;
}

const BASEMAP_OPTIONS: BasemapOption[] = [
  {
    id: "satellite",
    label: "Satellite",
    previewBg: "linear-gradient(135deg, #1b3815 0%, #2b5120 40%, #173245 100%)",
  },
  {
    id: "terrain",
    label: "Terrain",
    previewBg: "linear-gradient(135deg, #4a4b3d 0%, #7d7256 50%, #374631 100%)",
  },
  {
    id: "dark",
    label: "Dark",
    previewBg: "linear-gradient(135deg, #090e18 0%, #0d1627 60%, #060910 100%)",
  },
  {
    id: "light",
    label: "Light",
    previewBg: "linear-gradient(135deg, #e4e7eb 0%, #cbd2d9 50%, #f0f3f6 100%)",
  },
];

export function BasemapSwitcher() {
  const { basemap, setBasemap } = useRaiseStore();

  return (
    <div
      style={{
        position: "absolute",
        top: 52,
        right: 14,
        zIndex: "var(--z-hud)",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: 5,
        background: "rgba(6, 10, 20, 0.75)",
        border: "1px solid rgba(80, 140, 255, 0.22)",
        borderRadius: 8,
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 18px rgba(0,0,0,0.6)",
      }}
    >
      {BASEMAP_OPTIONS.map((opt) => {
        const isSelected = basemap === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setBasemap(opt.id)}
            style={{
              width: 52,
              height: 44,
              borderRadius: 5,
              border: isSelected
                ? "2px solid var(--cyan)"
                : "1px solid rgba(255,255,255,0.12)",
              background: opt.previewBg,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "0 0 3px 0",
              boxShadow: isSelected
                ? "0 0 10px rgba(0, 212, 255, 0.4), inset 0 0 4px rgba(0, 212, 255, 0.2)"
                : "none",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.15s ease",
            }}
          >
            {/* Label pill at bottom */}
            <span
              style={{
                fontSize: 8.5,
                fontWeight: 600,
                color: isSelected ? "#fff" : "rgba(235, 245, 255, 0.8)",
                background: "rgba(0, 0, 0, 0.7)",
                padding: "1px 5px",
                borderRadius: 3,
                letterSpacing: "0.03em",
                textTransform: "capitalize",
                backdropFilter: "blur(4px)",
              }}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
