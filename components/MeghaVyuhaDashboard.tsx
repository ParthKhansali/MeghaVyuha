"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useRaiseStore } from "@/store/useRaiseStore";
import { TopNav } from "@/components/layout/TopNav";
import { SearchModal } from "@/components/forecast/SearchModal";
import { ScenarioModal } from "@/components/forecast/ScenarioModal";

// Lazy-load all page views (heavy map/chart dependencies)
const OverviewPage = dynamic(() => import("@/components/pages/OverviewPage"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12,
        color: "var(--text-faint)",
        fontSize: 11,
        fontFamily: "var(--font-mono)",
      }}
    >
      <div style={{ fontSize: 13, color: "var(--text-dim)", letterSpacing: "0.06em" }}>
        MEGHAVYUHA
      </div>
      Initialising forecast intelligence engine…
    </div>
  ),
});

const DistrictIntelligencePage = dynamic(() => import("@/components/pages/DistrictIntelligencePage"), { ssr: false });
const ErrorAtlasPage = dynamic(() => import("@/components/pages/ErrorAtlasPage"), { ssr: false });
const CorrectionEnginePage = dynamic(() => import("@/components/pages/CorrectionEnginePage"), { ssr: false });
const ValidationPage = dynamic(() => import("@/components/pages/ValidationPage"), { ssr: false });
const CaseReplayPage = dynamic(() => import("@/components/pages/CaseReplayPage"), { ssr: false });
const DataProvenancePage = dynamic(() => import("@/components/pages/DataProvenancePage"), { ssr: false });

export default function MeghaVyuhaDashboard() {
  const { activePage } = useRaiseStore();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Top navigation */}
      <TopNav />

      {/* Main content area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", flexDirection: "column" }}>
        {activePage === "overview" && <OverviewPage />}
        {activePage === "district-intelligence" && (
          <div style={{ flex: 1, overflow: "hidden" }}>
            <DistrictIntelligencePage />
          </div>
        )}
        {activePage === "error-atlas" && (
          <div style={{ flex: 1, overflow: "hidden" }}>
            <ErrorAtlasPage />
          </div>
        )}
        {activePage === "correction-engine" && (
          <div style={{ flex: 1, overflow: "hidden" }}>
            <CorrectionEnginePage />
          </div>
        )}
        {activePage === "validation" && (
          <div style={{ flex: 1, overflow: "hidden" }}>
            <ValidationPage />
          </div>
        )}
        {activePage === "case-replay" && (
          <div style={{ flex: 1, overflow: "hidden" }}>
            <CaseReplayPage />
          </div>
        )}
        {activePage === "data-provenance" && (
          <div style={{ flex: 1, overflow: "hidden" }}>
            <DataProvenancePage />
          </div>
        )}
      </div>

      {/* Global Modals */}
      <SearchModal />
      <ScenarioModal />
    </div>
  );
}
