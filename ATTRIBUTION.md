# MEGHAVYUHA — Data Sources, Methodological Precedents & Attribution

**MEGHAVYUHA** (*Regime- and Error-Aware Probabilistic Rainfall Intelligence for India*) is developed by **Against The Odds** (Team ID: **149284**) for **Smart India Hackathon 2026**, Problem Statement **SIH 26080**: *Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts*.

---

## 1. Scientific & Meteorological Data Sources

| Domain | Source / Dataset | Characteristics & Access | Role in MEGHAVYUHA |
|---|---|---|---|
| **Reforecast Ensemble** | NOAA GEFSv12 Reforecast Archive | 2000–2019 JJAS, 00 UTC, ~0.25° horizontal resolution, 5 reforecast members, public open access (AWS Open Data / NOAA NOMADS) | Primary numerical weather prediction (NWP) raw ensemble foundation for Error Atlas conditioning |
| **Observational Rainfall Reference** | IMD 0.25° Daily Gridded Rainfall Package | Public research archive, Zenodo DOI: [10.5281/zenodo.11195106](https://doi.org/10.5281/zenodo.11195106), 0.25° grid over India domain | Gridded observational reference for retrospective calibration and Error Atlas error statistics |
| **Independent Precipitation Reference** | CHIRPS v2 (Climate Hazards Center, UCSB) | 0.05° resolution resampled to 0.25°, 1981–present, quasi-global satellite-gauge blended precipitation analysis | Cross-reference validation dataset (explicitly treated as an independent observational analysis, *not* absolute ground truth) |
| **Atmospheric Diagnostics** | ECMWF ERA5 Reanalysis | ~31 km, 6-hourly, pressure levels, single levels, Copernicus Climate Data Store (CDS) | Synoptic circulation diagnostics, moisture flux convergence, and shear proxies for regime conditioning |
| **Satellite Imagery** | ISRO MOSDAC / INSAT-3D/3DR | 4 km TIR1 / Hydro-Estimator / IMSRA products | Near-real-time convective storm structure reference |
| **Administrative Boundaries** | Local Government Directory (LGD 2021) / Survey of India | Administrative Level 2 (Districts) | District-level spatial aggregation and area exceedance computation |

---

## 2. Methodological Precedents & Prior Art

MEGHAVYUHA acknowledges and builds upon foundational published scientific work in statistical and weather-conditioned post-processing:

- **ECMWF ecPoint Precedent**: The concept of conditioning forecast-error distributions on forecast-available weather types and sub-grid grid-point characteristics builds upon the pioneering work of ECMWF ecPoint (*Pt. 1: Global rainfall post-processing*, Tsonevsky & Richardson, 2017). MEGHAVYUHA adapts this philosophy specifically for the Indian monsoon trough, orographic Western Ghats enhancement, and synoptic depressions.
- **Ensemble Model Output Statistics (EMOS)**: Censored and Shifted Gamma EMOS (CSG-EMOS) implementations derive from the probabilistic post-processing foundations established by Gneiting et al. (2005) and Scheuerer et al. (2014).
- **Hurdle Models**: Two-stage precipitation models (occurrence probability via logistic regression + amount given occurrence via truncated Gamma distribution).
- **Quantile Mapping (QM)**: Double-Gamma parametric quantile matching and empirical quantile mapping comparators.

---

## 3. Geospatial & Software Infrastructure

| Component | Library / Service | License / Terms |
|---|---|---|
| **Map Rendering Engine** | [MapLibre GL](https://maplibre.org) | BSD-3-Clause License |
| **High-Performance Geospatial WebGL** | [deck.gl](https://deck.gl) (Linux Foundation) | MIT License |
| **Vector Basemap Tiles** | [CARTO](https://carto.com) / OpenFreeMap | CC-BY / Open Database License (ODbL) |
| **Satellite Basemap Tiles** | ESRI World Imagery / USGS | Open public GIS reference tiles |
| **Chart Visualizations** | [Recharts](https://recharts.org) | MIT License |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) | MIT License |
| **Frontend Framework** | [Next.js](https://nextjs.org) & [React](https://react.dev) | MIT License |

---

## 4. Academic Integrity & Project Provenance

- Foundational dashboard layout and WebGL canvas mounting patterns adapted from open geospatial components.
- All meteorological decision logic, Error Atlas structures, 6-step Decision Evidence trace, candidate selection engines, district-level probabilistic aggregators, and scientific evaluation reporting were authored specifically for **MEGHAVYUHA** by **Against The Odds** (Team ID: 149284).
- All demonstration datasets and replay scenarios are explicitly labeled as illustrative prototype and retrospective research replay fixtures, maintaining strict scientific integrity.
