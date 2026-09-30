"use client";

// MEGHAVYUHA — Overview Page
// India-wide meteorological control interface with full map, controls, and Forecast State card.
// Reuses the existing map stack (MeghaVyuhaMapCanvas, ForecastControlPanel, LocationForecastPanel, etc.)

import React from "react";
import LiveMapView from "./LiveMapView";

export default function OverviewPage() {
  return <LiveMapView />;
}
