"use client";

import React, { useCallback } from "react";
import dynamic from "next/dynamic";
import { useRaiseStore } from "@/store/useRaiseStore";
import { DEMO_DISTRICTS } from "@/lib/mock/districtForecasts";
import { ForecastControlPanel } from "@/components/forecast/ForecastControlPanel";
import { LocationForecastPanel } from "@/components/forecast/LocationForecastPanel";
import { WhyDrawer } from "@/components/forecast/WhyDrawer";
import { MapFloatingControls } from "@/components/map/MapFloatingControls";
import { BasemapSwitcher } from "@/components/map/BasemapSwitcher";
import { MapLegend } from "@/components/map/MapLegend";
import { FloatingTimeline } from "@/components/map/FloatingTimeline";
import { BottomOperationalCards } from "@/components/forecast/BottomOperationalCards";

// Dynamic import to prevent SSR issues with MapLibre
const MeghaVyuhaMapCanvas = dynamic(() => import("@/components/map/MeghaVyuhaMapCanvas"), { ssr: false });
const CompareModeLayout = dynamic(
  () => import("@/components/map/MeghaVyuhaMapCanvas").then((m) => ({ default: m.CompareModeLayout })),
  { ssr: false }
);

export default function LiveMapView() {
  const { compareMode, selectDistrict, requestFlyTo } = useRaiseStore();

  const handleDistrictClick = useCallback(
    (districtId: string) => {
      const d = DEMO_DISTRICTS.find((x) => x.districtId === districtId);
      selectDistrict(districtId);
      if (d) requestFlyTo(d.lon, d.lat, 8);
    },
    [selectDistrict, requestFlyTo]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", position: "relative" }}>
      {/* ── Main Workspace: Left Controls + Center Map + Right District Panel ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        {/* Left: Forecast Controls Panel */}
        <ForecastControlPanel />

        {/* Center: Map Area with Floating HUD Controls */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {/* Map canvas */}
          <div style={{ position: "absolute", inset: 0 }}>
            {compareMode ? (
              <CompareModeLayout onDistrictClick={handleDistrictClick} />
            ) : (
              <MeghaVyuhaMapCanvas onDistrictClick={handleDistrictClick} />
            )}
          </div>

          {/* Floating Model & View Mode Pills + Vertical Toolstrip */}
          <MapFloatingControls />

          {/* Floating Basemap Thumbnails Switcher */}
          <BasemapSwitcher />

          {/* Floating Scale Bar + Continuous Rainbow Gradient Legend */}
          {!compareMode && <MapLegend />}

          {/* Floating Timeline Player */}
          <FloatingTimeline />

          {/* WHY drawer */}
          <WhyDrawer />
        </div>

        {/* Right: District Forecast Panel */}
        <LocationForecastPanel />
      </div>

      {/* ── Bottom Operational HUD: 4 Cards Across Width ── */}
      <BottomOperationalCards />
    </div>
  );
}
