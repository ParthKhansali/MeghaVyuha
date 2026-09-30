"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Layer as DeckLayer, PickingInfo } from "@deck.gl/core";
import { BitmapLayer, ScatterplotLayer, PathLayer, PolygonLayer } from "@deck.gl/layers";
import { DeckOverlay } from "@/components/map/DeckOverlay";
import { useRaiseStore, type BasemapMode, INDIA_VIEW } from "@/store/useRaiseStore";
import {
  generateBitmap,
  bitmapToDataURL,
  SIM_BOUNDS,
  BITMAP_W,
  BITMAP_H,
  getScenarioSystems,
  rainfallToRGBA,
} from "@/lib/simulation/weatherEngine";
import { DEMO_DISTRICTS } from "@/lib/mock/districtForecasts";
import {
  MAJOR_CITIES,
  WEATHER_STATIONS,
  MAJOR_RIVERS,
  STATE_OUTLINES,
  PHYSIOGRAPHIC_REGIONS,
} from "@/lib/geo/indiaGeoData";

// ─── Basemap styles ──────────────────────────────────────────────────────────
// We use MapLibre-compatible style JSON objects or public style URLs.

// ESRI World Imagery (free, no API key, correct tile scheme)
const SATELLITE_STYLE = {
  version: 8 as const,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    satellite: {
      type: "raster" as const,
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "© Esri, Maxar, GeoEye, Earthstar Geographics",
      maxzoom: 19,
    },
    // Labels overlay on top of satellite
    labels: {
      type: "raster" as const,
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "© Esri",
      maxzoom: 19,
    },
  },
  layers: [
    { id: "satellite-layer", type: "raster" as const, source: "satellite" },
    { id: "labels-layer", type: "raster" as const, source: "labels", paint: { "raster-opacity": 0.7 } },
  ],
};

// ESRI World Topo Map — terrain/topographic with shaded relief (free, no API key, CORS open)
const TERRAIN_STYLE = {
  version: 8 as const,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    topo: {
      type: "raster" as const,
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "© Esri, USGS, NOAA — World Topographic Map",
      maxzoom: 19,
    },
  },
  layers: [{ id: "topo-layer", type: "raster" as const, source: "topo" }],
};

const BASEMAP_STYLES: Record<BasemapMode, unknown> = {
  satellite: SATELLITE_STYLE,
  terrain: TERRAIN_STYLE,
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

// BitmapLayer bounds: [west, south, east, north]
const BITMAP_BOUNDS: [number, number, number, number] = [
  SIM_BOUNDS.west, SIM_BOUNDS.south, SIM_BOUNDS.east, SIM_BOUNDS.north,
];

const THRESHOLD_MM: Record<string, number> = {
  any: 0, heavy: 64.5, "very-heavy": 115.6, extreme: 204.5,
};

interface MapCanvasProps {
  onDistrictClick: (districtId: string) => void;
}

export default function MeghaVyuhaMapCanvas({ onDistrictClick }: MapCanvasProps) {
  const mapRef = useRef<MapRef | null>(null);
  const {
    basemap, flyTo, model, viewMode, hourOffset,
    probabilityThreshold, selectedDistrictId, differenceBaseline, mapLayers,
    activeScenario,
  } = useRaiseStore();

  const [rainfallImage, setRainfallImage] = useState<ImageData | string>("");

  // ── Generate weather systems for current scenario ─────────────────────────
  const systems = useMemo(() => getScenarioSystems(activeScenario), [activeScenario]);

  // ── Generate rainfall bitmap synchronously without async decoding flicker ──
  useEffect(() => {
    const threshold = THRESHOLD_MM[probabilityThreshold] ?? 64.5;
    const rgba = generateBitmap(
      systems, hourOffset, model, viewMode, threshold, differenceBaseline
    );
    if (typeof ImageData !== "undefined") {
      try {
        setRainfallImage(new ImageData(rgba as any, BITMAP_W, BITMAP_H));
        return;
      } catch {
        // fallback to data URL if ImageData constructor is constrained
      }
    }
    const url = bitmapToDataURL(rgba);
    setRainfallImage(url);
  }, [systems, hourOffset, model, viewMode, probabilityThreshold, differenceBaseline]);

  // ── Fly-to camera response ────────────────────────────────────────────────
  useEffect(() => {
    if (flyTo && mapRef.current) {
      mapRef.current.flyTo({
        center: [flyTo.lon, flyTo.lat],
        zoom: flyTo.zoom ?? 7,
        duration: 1400,
        essential: true,
      });
    }
  }, [flyTo]);

  // ── District points data ──────────────────────────────────────────────────
  const districtPoints = useMemo(
    () =>
      DEMO_DISTRICTS.map((d) => ({
        id: d.districtId,
        name: d.districtName,
        state: d.state,
        lon: d.lon,
        lat: d.lat,
        rainfall: d.expectedRainfallMm,
        selected: d.districtId === selectedDistrictId,
      })),
    [selectedDistrictId]
  );

  const handleLoad = useCallback((e: { target: { resize: () => void } }) => {
    e.target.resize();
  }, []);

  const handleDeckClick = useCallback(
    (info: PickingInfo) => {
      if (
        info.object &&
        (info.layer?.id === "district-points" || info.layer?.id === "district-labels")
      ) {
        const pt = info.object as { id: string };
        onDistrictClick(pt.id);
      }
    },
    [onDistrictClick]
  );

  // ── Build Deck.gl layer pipeline ──────────────────────────────────────────
  const deckLayers = useMemo<DeckLayer[]>(() => {
    const layers: DeckLayer[] = [];

    // 1. Physiographic Regions (optional)
    if (mapLayers.physiographic) {
      layers.push(
        new PolygonLayer({
          id: "physiographic-regions",
          data: PHYSIOGRAPHIC_REGIONS,
          getPolygon: (d) => d.polygon,
          getFillColor: (d) => d.color,
          getLineColor: [0, 212, 255, 40],
          lineWidthMinPixels: 0,
          pickable: false,
          opacity: 0.25,
        })
      );
    }

    // 2. Smooth Rainfall BitmapLayer
    if (rainfallImage) {
      layers.push(
        new BitmapLayer({
          id: "rainfall-bitmap",
          bounds: BITMAP_BOUNDS,
          image: rainfallImage,
          opacity: 0.78,
          pickable: false,
          parameters: { blend: true },
        })
      );
    }

    // 3. Rivers
    if (mapLayers.rivers) {
      layers.push(
        new PathLayer({
          id: "rivers-layer",
          data: MAJOR_RIVERS,
          getPath: (d) => d.path,
          getColor: [70, 160, 245, 130],
          getWidth: 1.5,
          widthMinPixels: 1,
          pickable: false,
        })
      );
    }

    // 4. State Outlines
    if (mapLayers.stateBoundaries) {
      layers.push(
        new PathLayer({
          id: "state-outlines-layer",
          data: STATE_OUTLINES,
          getPath: (d) => d.path,
          getColor: [0, 212, 255, 100],
          getWidth: 1.5,
          widthMinPixels: 1,
          pickable: false,
        })
      );
    }

    // 5. Weather Stations (subtle)
    if (mapLayers.stations) {
      layers.push(
        new ScatterplotLayer({
          id: "stations-layer",
          data: WEATHER_STATIONS,
          getPosition: (d) => [d.lon, d.lat],
          getRadius: 4,
          radiusUnits: "pixels",
          filled: true,
          getFillColor: [255, 180, 0, 200],
          getLineColor: [255, 255, 255, 180],
          stroked: true,
          lineWidthMinPixels: 1,
          pickable: false,
        })
      );
    }

    // 6. Major Cities
    if (mapLayers.cities) {
      layers.push(
        new ScatterplotLayer({
          id: "cities-points",
          data: MAJOR_CITIES,
          getPosition: (d) => [d.lon, d.lat],
          getRadius: (d) => (d.type === "capital" ? 5 : 3),
          radiusUnits: "pixels",
          filled: true,
          getFillColor: (d) =>
            d.type === "capital" ? [255, 59, 78, 230] : [210, 230, 255, 160],
          pickable: false,
        })
      );
    }

    // 7. District monitoring targets (clickable)
    layers.push(
      new ScatterplotLayer({
        id: "district-points",
        data: districtPoints,
        getPosition: (d) => [d.lon, d.lat],
        getRadius: (d) => (d.selected ? 13 : 7),
        radiusUnits: "pixels",
        radiusMinPixels: 5,
        radiusMaxPixels: 16,
        stroked: true,
        filled: true,
        lineWidthMinPixels: 2,
        getFillColor: (d) => (d.selected ? [0, 212, 255, 50] : [0, 112, 204, 20]),
        getLineColor: (d) =>
          d.selected ? [0, 212, 255, 255] : [0, 212, 255, 140],
        pickable: true,
        updateTriggers: {
          getRadius: selectedDistrictId,
          getFillColor: selectedDistrictId,
          getLineColor: selectedDistrictId,
        },
      })
    );

    return layers;
  }, [
    rainfallImage,
    districtPoints,
    selectedDistrictId,
    mapLayers,
  ]);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: INDIA_VIEW.longitude,
        latitude: INDIA_VIEW.latitude,
        zoom: INDIA_VIEW.zoom,
      }}
      mapStyle={BASEMAP_STYLES[basemap] as any}
      onLoad={handleLoad}
      maxPitch={0}
      dragRotate={false}
      style={{ width: "100%", height: "100%" }}
      attributionControl={{ compact: true }}
      minZoom={3}
      maxZoom={14}
    >
      <DeckOverlay
        interleaved={false}
        layers={deckLayers}
        onClick={handleDeckClick}
        getCursor={({ isHovering, isDragging }) =>
          isDragging ? "grabbing" : isHovering ? "pointer" : "grab"
        }
      />

      {/* Major City Labels (HTML Markers - Crisp & avoids WebGL font atlas corruption) */}
      {mapLayers.cities &&
        MAJOR_CITIES.map((city) => (
          <Marker
            key={city.name}
            longitude={city.lon}
            latitude={city.lat}
            anchor="left"
            style={{ pointerEvents: "none" }}
          >
            <div
              style={{
                marginLeft: 7,
                padding: "1px 5px",
                background: "rgba(6, 10, 20, 0.78)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 3,
                fontSize: 9.5,
                fontWeight: 600,
                color: "rgba(240, 248, 255, 0.9)",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-ui)",
                lineHeight: 1.2,
                userSelect: "none",
              }}
            >
              {city.name}
            </div>
          </Marker>
        ))}

      {/* District Target Markers */}
      {districtPoints.map((district) => (
        <Marker
          key={district.id}
          longitude={district.lon}
          latitude={district.lat}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            onDistrictClick(district.id);
          }}
        >
          <div
            style={{
              marginBottom: 10,
              padding: district.selected ? "3px 8px" : "2px 6px",
              background: district.selected
                ? "rgba(0, 30, 60, 0.92)"
                : "rgba(6, 10, 20, 0.82)",
              border: district.selected
                ? "1px solid #00d4ff"
                : "1px solid rgba(80, 140, 255, 0.3)",
              borderRadius: 4,
              fontSize: district.selected ? 11 : 9.5,
              fontWeight: district.selected ? 700 : 600,
              color: district.selected ? "#00d4ff" : "#e6f0ff",
              whiteSpace: "nowrap",
              fontFamily: "var(--font-ui)",
              cursor: "pointer",
              userSelect: "none",
              boxShadow: district.selected
                ? "0 0 12px rgba(0, 212, 255, 0.5)"
                : "0 2px 6px rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>{district.name}</span>
            {district.selected && (
              <span
                style={{
                  fontSize: 8.5,
                  padding: "1px 4px",
                  borderRadius: 2,
                  background: "rgba(0, 212, 255, 0.2)",
                  color: "#00d4ff",
                  fontFamily: "var(--font-mono)",
                }}
              >
                TARGET
              </span>
            )}
          </div>
        </Marker>
      ))}
    </Map>
  );
}

// ─── Compare Mode: Dual Synchronized Maps ────────────────────────────────────
export function CompareModeLayout({
  onDistrictClick,
}: {
  onDistrictClick: (id: string) => void;
}) {
  const { hourOffset, basemap, selectedDistrictId, activeScenario } = useRaiseStore();
  const mapRefLeft = useRef<MapRef | null>(null);
  const mapRefRight = useRef<MapRef | null>(null);
  const syncing = useRef(false);

  const systems = useMemo(() => getScenarioSystems(activeScenario), [activeScenario]);

  const [rawImage, setRawImage] = useState<ImageData | string>("");
  const [adaptiveImage, setAdaptiveImage] = useState<ImageData | string>("");

  useEffect(() => {
    const rawRgba = generateBitmap(systems, hourOffset, "raw", "amount");
    const adaptRgba = generateBitmap(systems, hourOffset, "adaptive", "amount");
    if (typeof ImageData !== "undefined") {
      try {
        setRawImage(new ImageData(rawRgba as any, BITMAP_W, BITMAP_H));
        setAdaptiveImage(new ImageData(adaptRgba as any, BITMAP_W, BITMAP_H));
        return;
      } catch {}
    }
    setRawImage(bitmapToDataURL(rawRgba));
    setAdaptiveImage(bitmapToDataURL(adaptRgba));
  }, [systems, hourOffset]);

  const makeLayers = useCallback(
    (image: ImageData | string, id: string): DeckLayer[] => {
      const layers: DeckLayer[] = [];
      if (image) {
        layers.push(
          new BitmapLayer({
            id: `${id}-bitmap`,
            bounds: BITMAP_BOUNDS,
            image,
            opacity: 0.80,
            pickable: false,
            parameters: { blend: true },
          })
        );
      }
      layers.push(
        new ScatterplotLayer({
          id: `${id}-districts`,
          data: DEMO_DISTRICTS,
          getPosition: (d) => [d.lon, d.lat],
          getRadius: (d) => (d.districtId === selectedDistrictId ? 12 : 6),
          radiusUnits: "pixels",
          stroked: true,
          filled: true,
          getFillColor: [0, 212, 255, 30],
          getLineColor: [0, 212, 255, 200],
          pickable: true,
        })
      );
      return layers;
    },
    [selectedDistrictId]
  );

  const leftLayers = useMemo(
    () => makeLayers(rawImage, "raw"),
    [makeLayers, rawImage]
  );
  const rightLayers = useMemo(
    () => makeLayers(adaptiveImage, "adaptive"),
    [makeLayers, adaptiveImage]
  );

  const syncMaps = useCallback((source: "left" | "right") => {
    if (syncing.current) return;
    syncing.current = true;
    const src = source === "left" ? mapRefLeft.current : mapRefRight.current;
    const dst = source === "left" ? mapRefRight.current : mapRefLeft.current;
    if (src && dst) {
      dst.jumpTo({
        center: [src.getCenter().lng, src.getCenter().lat],
        zoom: src.getZoom(),
      });
    }
    setTimeout(() => { syncing.current = false; }, 50);
  }, []);

  const labelStyle: React.CSSProperties = {
    position: "absolute", top: 10, left: 14, zIndex: 20,
    padding: "4px 10px",
    background: "rgba(6, 10, 20, 0.92)",
    border: "1px solid var(--hairline)",
    borderRadius: 5, fontSize: 11, fontWeight: 700,
    letterSpacing: "0.08em", pointerEvents: "none",
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <div style={{ flex: 1, position: "relative", borderRight: "2px solid var(--hairline-accent)" }}>
        <div style={{ ...labelStyle, color: "var(--text-dim)" }}>RAW NWP (NCMRWF)</div>
        <Map
          ref={mapRefLeft}
          initialViewState={{ longitude: INDIA_VIEW.longitude, latitude: INDIA_VIEW.latitude, zoom: INDIA_VIEW.zoom }}
          mapStyle={BASEMAP_STYLES[basemap] as any}
          onMove={() => syncMaps("left")}
          maxPitch={0} dragRotate={false}
          style={{ width: "100%", height: "100%" }}
          attributionControl={{ compact: true }}
          minZoom={3}
        >
          <DeckOverlay interleaved={false} layers={leftLayers}
            onClick={(info) => {
              const pt = info.object as { districtId?: string };
              if (pt?.districtId) onDistrictClick(pt.districtId);
            }}
          />
        </Map>
      </div>
      <div style={{ flex: 1, position: "relative" }}>
        <div style={{ ...labelStyle, color: "var(--cyan)", border: "1px solid var(--cyan)" }}>
          MEGHAVYUHA ADAPTIVE
        </div>
        <Map
          ref={mapRefRight}
          initialViewState={{ longitude: INDIA_VIEW.longitude, latitude: INDIA_VIEW.latitude, zoom: INDIA_VIEW.zoom }}
          mapStyle={BASEMAP_STYLES[basemap] as any}
          onMove={() => syncMaps("right")}
          maxPitch={0} dragRotate={false}
          style={{ width: "100%", height: "100%" }}
          attributionControl={{ compact: true }}
          minZoom={3}
        >
          <DeckOverlay interleaved={false} layers={rightLayers}
            onClick={(info) => {
              const pt = info.object as { districtId?: string };
              if (pt?.districtId) onDistrictClick(pt.districtId);
            }}
          />
        </Map>
      </div>
    </div>
  );
}
