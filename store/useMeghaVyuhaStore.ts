// MEGHAVYUHA — Central Application State (Zustand)
// FORECAST CONTEXT → ERROR EVIDENCE → CORRECTION SELECTION → HEAVY-RAIN CHECK → SPATIAL EVIDENCE → FINAL GUIDANCE
"use client";

import { create } from "zustand";
import type { ForecastModel, ViewMode, ProbabilityThreshold, DemoScenarioId } from "@/types/forecast";

export type MeghaVyuhaLayerId =
  | "stateBoundaries"
  | "districtBoundaries"
  | "rivers"
  | "terrain"
  | "cities"
  | "stations"
  | "physiographic";

export type RaiseLayerId = MeghaVyuhaLayerId;

export type BasemapMode = "dark" | "satellite" | "terrain" | "light";

export type NavPage =
  | "overview"
  | "district-intelligence"
  | "error-atlas"
  | "correction-engine"
  | "validation"
  | "case-replay"
  | "data-provenance";

export const INDIA_VIEW = { longitude: 80.5, latitude: 22.5, zoom: 4.2 };

// hour 0 = 25 Sep 2026 00 UTC (simulation start)
export const SIM_START_UTC = "2026-09-25T00:00:00Z";

// Convert hourOffset to a human-readable label
export function hourOffsetToLabel(h: number): string {
  const date = new Date(SIM_START_UTC);
  date.setUTCHours(date.getUTCHours() + h);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const d = date.getUTCDate();
  const mo = months[date.getUTCMonth()];
  const hh = String(date.getUTCHours()).padStart(2, "0");
  return `${d} ${mo} ${hh}:00 UTC`;
}

// Convert hourOffset to lead day integer (for backward compat)
export function hourOffsetToLeadDay(h: number): number {
  return Math.max(1, Math.round(h / 24));
}

const DEFAULT_LAYERS: Record<MeghaVyuhaLayerId, boolean> = {
  stateBoundaries: true,
  districtBoundaries: true,
  rivers: true,
  terrain: false,
  cities: true,
  stations: false,
  physiographic: false,
};

interface MeghaVyuhaState {
  // Navigation
  activePage: NavPage;
  // Forecast controls
  model: ForecastModel;
  viewMode: ViewMode;
  /** Continuous hour offset from simulation start (0–240) */
  hourOffset: number;
  /** Legacy accessor — derived from hourOffset */
  leadDay: number;
  probabilityThreshold: ProbabilityThreshold;
  differenceBaseline: ForecastModel;
  // Selection
  selectedDistrictId: string | null;
  // Map state
  basemap: BasemapMode;
  mapLayers: Record<MeghaVyuhaLayerId, boolean>;
  compareMode: boolean;
  // Decision Evidence / Audit drawer
  whyOpen: boolean;
  // Demo scenario
  activeScenario: DemoScenarioId | null;
  // Fly-to request
  flyTo: { lon: number; lat: number; zoom?: number; nonce: number } | null;
  // Modals
  searchOpen: boolean;
  scenarioSelectorOpen: boolean;

  // Actions
  setPage: (page: NavPage) => void;
  setModel: (model: ForecastModel) => void;
  setViewMode: (mode: ViewMode) => void;
  setHourOffset: (h: number | ((prev: number) => number)) => void;
  /** Legacy setter — converts day to hours */
  setLeadDay: (day: number | ((prev: number) => number)) => void;
  setProbabilityThreshold: (t: ProbabilityThreshold) => void;
  setDifferenceBaseline: (m: ForecastModel) => void;
  selectDistrict: (id: string | null) => void;
  setBasemap: (b: BasemapMode) => void;
  toggleMapLayer: (id: MeghaVyuhaLayerId) => void;
  setCompareMode: (on: boolean) => void;
  setWhyOpen: (open: boolean) => void;
  setScenario: (scenario: DemoScenarioId) => void;
  setSearchOpen: (open: boolean) => void;
  setScenarioSelectorOpen: (open: boolean) => void;
  requestFlyTo: (lon: number, lat: number, zoom?: number) => void;
}

export const useMeghaVyuhaStore = create<MeghaVyuhaState>()((set) => ({
  activePage: "overview",
  model: "adaptive",
  viewMode: "amount",
  hourOffset: 6,                        // start at +6h
  leadDay: 1,
  probabilityThreshold: "very-heavy",
  differenceBaseline: "raw",
  selectedDistrictId: "uttarakhand-dehradun",
  basemap: "satellite",
  mapLayers: { ...DEFAULT_LAYERS },
  compareMode: false,
  whyOpen: false,
  activeScenario: null,
  flyTo: null,
  searchOpen: false,
  scenarioSelectorOpen: false,

  setPage: (page) => set({ activePage: page }),
  setModel: (model) => set({ model }),
  setViewMode: (viewMode) => set({ viewMode }),
  setHourOffset: (updater) =>
    set((state) => {
      const nextH = typeof updater === "function" ? updater(state.hourOffset) : updater;
      const clamped = Math.max(0, Math.min(240, Math.round(nextH)));
      return { hourOffset: clamped, leadDay: hourOffsetToLeadDay(clamped) };
    }),
  setLeadDay: (updater) =>
    set((state) => {
      const nextD = typeof updater === "function" ? updater(state.leadDay) : updater;
      const clamped = Math.max(1, Math.min(10, Math.round(nextD)));
      return { leadDay: clamped, hourOffset: clamped * 24 };
    }),
  setProbabilityThreshold: (probabilityThreshold) => set({ probabilityThreshold }),
  setDifferenceBaseline: (differenceBaseline) => set({ differenceBaseline }),
  selectDistrict: (id) => set({ selectedDistrictId: id }),
  setBasemap: (basemap) => set({ basemap }),
  toggleMapLayer: (id) =>
    set((state) => ({
      mapLayers: { ...state.mapLayers, [id]: !state.mapLayers[id] },
    })),
  setCompareMode: (compareMode) => set({ compareMode }),
  setWhyOpen: (whyOpen) => set({ whyOpen }),
  setScenario: (scenario) => set({ activeScenario: scenario }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setScenarioSelectorOpen: (scenarioSelectorOpen) => set({ scenarioSelectorOpen }),
  requestFlyTo: (lon, lat, zoom = 8) =>
    set({ flyTo: { lon, lat, zoom, nonce: Date.now() } }),
}));

// Backward compatibility alias
export const useRaiseStore = useMeghaVyuhaStore;
