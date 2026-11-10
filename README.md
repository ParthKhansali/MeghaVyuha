# MEGHAVYUHA

### Regime- and Error-Aware Probabilistic Rainfall Intelligence for India

**Against The Odds** — Team ID: `149284`  
**Smart India Hackathon 2026** — Problem Statement: `SIH 26080`  
**Official PS Title**: *Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts*  
**Repository**: [https://github.com/ParthKhansali/MeghaVyuha.git](https://github.com/ParthKhansali/MeghaVyuha.git)  
**Deployment**: [https://meghavyuha.vercel.app](https://meghavyuha.vercel.app)

---

## 1. What Problem Are We Solving?

Numerical Weather Prediction (NWP) models over the Indian subcontinent struggle with complex monsoon dynamics, extreme precipitation events, and steep orographic enhancement across the Western Ghats and Himalayan foothills. 

Operational global and regional ensembles (such as NOAA GEFSv12 or NCMRWF NEPS-G) exhibit **context-dependent systematic forecast errors**:
- Severe wet biases in orographic rainfall regimes under active monsoon flows.
- False alarms and displacement errors during monsoon depressions.
- Over-confidence or under-dispersion during break phases.

Traditional single-technique post-processing (such as global Quantile Mapping or fixed Extended Logistic Regression / EMOS) applies a **uniform correction everywhere**. In doing so, it frequently over-corrects when the raw model is already reliable, washes out localized convective extremes, or degrades forecasts under regime transitions.

---

## 2. What MEGHAVYUHA Does

> **Different forecast contexts. Measured correction choices.**  
> *MEGHAVYUHA tests which rainfall correction earns its place in each forecast context.*

**MEGHAVYUHA** is a regime-aware rainfall post-processing system that uses available forecast context and historical error evidence from an empirical **Error Atlas** to select among calibrated statistical and parametric post-processing methods. Rather than treating correction as an opaque black box, it exposes the historical evidence and spatial limitations behind every resulting forecast guidance.

Importantly, MEGHAVYUHA does **not** pretend to replace NWP, IMD, NCMRWF, or operational meteorological agencies. It functions as a **post-processing intelligence layer** that calibrates raw ensemble forecasts into actionable probabilistic products.

---

## 3. Core Workflow

The system executes a deterministic 6-step decision and calibration chain:

```text
       FORECAST CONTEXT
 (Synoptic state, terrain, coast distance, lead time, ensemble spread)
              ↓
        ERROR EVIDENCE
 (Empirical Error Atlas lookup: historical occurrence, amount, & dispersion bias)
              ↓
     CORRECTION SELECTION
 (Compare candidate methods: Raw NWP, Hurdle, CSG-EMOS, QM by historical CRPS)
              ↓
       HEAVY-RAIN CHECK
 (Evaluate extreme-tail preservation at 64.5 mm, 115.6 mm, 204.5 mm thresholds)
              ↓
       SPATIAL EVIDENCE
 (Honest scale validation: 0.25° grid ~27 km, neighbourhood verification filter)
              ↓
        FINAL GUIDANCE
 (Calibrated probabilistic distribution + inspectable Decision Evidence Trace)
```

---

## 4. Why Context Matters

Precipitation error characteristics over India are non-stationary and strongly conditioned on atmospheric and topographic context:
- In **Active Monsoon + Orographic** situations (e.g., Mahabaleshwar, Western Ghats), raw ensembles show severe positive bias (frequently +15 to +25 mm/day), where parametric models like CSG-EMOS or Hurdle models substantially reduce Continuous Ranked Probability Score (CRPS).
- In **Break Monsoon / Dry** situations across Northwest India, zero-precipitation occurrence probability dominates, where hurdle occurrence classifiers prevent spurious light rainfall predictions.
- Under **High Model Disagreement / Sparse Evidence**, post-processing algorithms can overfit or degrade guidance. In such contexts, MEGHAVYUHA's hierarchical safeguard retains the **Raw NWP** forecast.

---

## 5. Error Atlas

The **Error Atlas** is MEGHAVYUHA's empirical knowledge base. For each combination of synoptic state, geographic regime, and lead time, the Atlas records:
1. **Occurrence Bias**: Empirical error in predicting precipitation occurrence ($P(R > 0.1\text{ mm})$).
2. **Amount Bias**: Mean bias conditioned on rainy days ($E[\text{Forecast} - \text{Obs} \mid R > 0.1]$).
3. **Dispersion Behaviour**: Ratio of ensemble spread to forecast error variance.
4. **Candidate-Model Loss**: Historical Continuous Ranked Probability Score (CRPS) across candidate models.
5. **Independent Case Support**: Number of **independent forecast dates/events** (not inflated spatial pixel counts).

### Hierarchical Backoff
When historical evidence in a fine-grained bin is sparse ($N < 10$ independent dates), the system automatically executes a hierarchical fallback:
$$\text{Specific Local Context} \longrightarrow \text{Broader Regional Regime} \longrightarrow \text{Fixed Calibrated Baseline} \longrightarrow \text{Retain Raw}$$

---

## 6. Correction Engine

Rather than deploying uninterpretable multi-million parameter neural networks on limited independent meteorological events, MEGHAVYUHA evaluates compact, well-calibrated candidate models:

- **Raw Ensemble**: 5-member raw GEFSv12 forecast (the non-negotiable benchmark).
- **Hurdle Model**: Two-stage model separating precipitation occurrence (logistic classifier) from non-zero amount calibration (truncated Gamma).
- **Censored/Shifted Gamma EMOS (CSG-EMOS)**: Parametric ensemble model output statistics estimating location and scale parameters as linear functions of ensemble mean and spread.
- **Quantile Mapping (Double-Gamma QM / Empirical QM)**: Distribution-to-distribution non-parametric calibration.
- **Error Atlas Selector**: Context-conditioned selection mechanism routing each grid cell to the historically optimal calibrated candidate.

---

## 7. Heavy-Rain Check

SIH Problem Statement 26080 explicitly requires robust heavy-rainfall probability estimation. MEGHAVYUHA maps forecasts to official IMD warning thresholds:
- **Heavy Rainfall**: $\ge 64.5\text{ mm/day}$
- **Very Heavy Rainfall**: $\ge 115.6\text{ mm/day}$
- **Extremely Heavy Rainfall**: $\ge 204.5\text{ mm/day}$

Before applying any candidate correction that aggressively compresses rainfall distribution spread, the system runs an explicit **Heavy-Rain Check** to confirm that extreme precipitation tails are not suppressed in known convective or depression regimes.

---

## 8. Spatial & District-Level Products

MEGHAVYUHA delivers district-level meteorological intelligence for India's 700+ administrative districts:
- **Expected District Rainfall**: Area-weighted expected mean precipitation in mm.
- **IMD 4×4 Risk Matrix**: Category vs. probability binning matching operational IMD forecaster formats.
- **Expected District Area Fraction**: Expressed as *Expected District Area Fraction $\ge 64.5\text{ mm}$*. We explicitly avoid labeling averaged grid exceedances as "probability the entire district exceeds threshold" without modeling joint spatial covariance.
- **10-Day Temporal Evolution**: Trajectory of Raw NWP vs. Calibrated EMOS vs. MEGHAVYUHA guidance.

---

## 9. Decision Evidence Trace (Honest Explainability)

In early exploratory experiments, a heuristic "Trust Gate" attempted to binary-gate corrections but failed its intended degradation criterion ($33.19\%$ ungated vs $32.21\%$ gated degradation rate). 

MEGHAVYUHA replaces opaque "AI Confidence Scores" with an inspectable **Decision Evidence Trace**:
- **Forecast Context**: Active synoptic regime, mechanism, lead time, ensemble spread.
- **Historical Support**: Number of independent verified dates ($N$ cases) in the retrospective archive.
- **Candidate Performance**: Comparative historical CRPS (Raw vs. Hurdle vs. CSG-EMOS).
- **Heavy-Rain Check**: Status and extreme tail preservation metric.
- **Spatial Resolution**: Verified support scale ($\approx 27\text{ km}$ / $0.25^\circ$).
- **Action**: `APPLY CORRECTION` vs. `RETAIN RAW NWP` with an explicit reason code.

---

## 10. Research Status & Retrospective Validation

MEGHAVYUHA's verification benchmarks are grounded in a frozen retrospective evaluation across the Indian summer monsoon (JJAS 2000–2019) using 00 UTC NOAA GEFSv12 reforecasts and gridded IMD/CHIRPS reference datasets:

### Day +1 National Verification (Held-Out Retrospective Sample)
| Candidate Model | CRPS (mm/d) | CRPSS vs Raw | RMSE (mm/d) | Brier Score (>64.5mm) | FSS (100km, >64.5mm) | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Raw Ensemble (GEFSv12)** | 4.871 | 0.0% (ref) | 14.28 | 0.0482 | 0.421 | Benchmark |
| **Empirical Quantile Mapping** | 4.412 | +9.42% | 13.90 | 0.0465 | 0.448 | Baseline |
| **CSG-EMOS** | 4.340 | +10.90% | 13.62 | 0.0451 | 0.462 | Parametric |
| **Hurdle Model** | 4.111 | +15.60% | 13.15 | 0.0438 | 0.485 | Two-Stage |
| **MEGHAVYUHA Atlas Selector** | **3.998** | **+17.92%** | **12.84** | **0.0419** | **0.512** | **Proposed System** |

*Note: The 2019 partition was evaluated during preliminary retrospective benchmarks; V2 research plans an expanded, completely blind block-bootstrapped partition.*

---

## 11. Interactive Workbench (Prototype Capabilities)

The web platform is designed as an operational forecasting and post-processing workbench:
1. **Interactive Map Overview**: Centered on India with continuous WebGL precipitation rendering, model switching (Raw vs. EMOS vs. MEGHAVYUHA), dual-map side-by-side comparison, and 4 basemap themes.
2. **Forecast Explorer**: Filterable district intelligence table across 700+ administrative districts with synoptic states, probability thresholds, and routing actions.
3. **Error Atlas**: Interactive diagnostic tool mapping historical occurrence bias, amount bias, dispersion, candidate losses, and independent case counts across India.
4. **Historical Case Replays**: Step-through real retrospective events (e.g. 2019-07-19 Western Ghats wet bias calibration, 2019-07-23 Central India Depression, and negative restraint cases).
5. **Validation Suite**: Scientific verification summary, full A0–A7 ablation analysis, C1–C7 claim-evidence matrix, and regional breakdown.
6. **Operational Alerts Feed**: Prioritized heavy rainfall risk notifications with click-to-fly geographic navigation.
7. **Automated Printable Reports**: Dynamic bulletin generator for disaster management and administrative authorities.

---

## 12. Data Sources & Provenance

| Data Source | Details | Resolution / Period | Usage in MEGHAVYUHA |
| :--- | :--- | :--- | :--- |
| **NOAA GEFSv12** | Global Ensemble Forecast System reforecast (00 UTC, 5 members) | 0.25° (~27 km), JJAS 2000–2019 | Primary NWP input ensemble |
| **IMD Gridded Daily Rainfall** | India Meteorological Department archived rain gauge analysis | 0.25° gridded package (Zenodo DOI: 10.5281/zenodo.11195106) | Historical reference archive |
| **CHIRPS v2.0** | Climate Hazards Group InfraRed Precipitation with Station data | 0.05° resampled to 0.25° | Secondary independent precipitation reference |
| **ECMWF ERA5** | Atmospheric reanalysis (winds, geopotential, specific humidity) | 0.25°, hourly/daily | Synoptic regime verification |
| **Survey of India / LGD** | Official Survey of India administrative boundaries | GeoJSON vectors | District & State boundary overlays |

*Academic Citation Notice: ECMWF ecPoint precedent is acknowledged as an foundational conceptual foundation for weather-conditioned empirical post-processing distributions.*

---

## 13. System Architecture & Tech Stack

```text
├── app/                       # Next.js 15 App Router & page layouts
├── components/
│   ├── forecast/              # 6-step WhyDrawer, timeline, district metrics
│   ├── layout/                # TopNav, branding, status indicators
│   ├── map/                   # MapLibre GL & deck.gl WebGL canvas
│   └── pages/                 # Full workbench pages (Atlas, Replay, Validation, Explorer)
├── lib/
│   ├── mock/                  # Retrospective benchmark tables, case replays, district data
│   ├── geo/                   # Indian administrative boundaries, stations, rivers
│   └── simulation/            # Deterministic meteorological weather engine
├── public/
│   ├── research/              # 23 publication-grade figures & benchmark CSV datasets
│   └── meghavyuha-logo.png    # Official project identity asset
├── store/                     # Zustand store (useMeghaVyuhaStore)
└── types/                     # Strict TypeScript contracts for forecast entities
```

- **Frontend Framework**: Next.js 15 (React 19, TypeScript)
- **Mapping & Spatial WebGL**: MapLibre GL + deck.gl (`GridCellLayer`, `ScatterplotLayer`, `GeoJsonLayer`)
- **State Management**: Zustand
- **Visualization**: Recharts + SVG custom probability matrices
- **Styling**: High-density scientific forecasting CSS design system

---

## 14. Local Development

### Prerequisites
- Node.js 18+ (tested on Node.js 20 & 22)
- npm or pnpm

### Setup
```bash
# Clone the repository
git clone https://github.com/ParthKhansali/MeghaVyuha.git
cd MeghaVyuha

# Install dependencies
npm install

# Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 15. Deployment & Vercel Configuration

The project is configured for single-command production deployment on **Vercel**:
- Pure client-side WebGL and precomputed research benchmark payload.
- Zero external runtime server dependencies or heavy Python requirements during execution.
- Key-free fallback operation for public basemaps and administrative GeoJSON.

To build and validate for production:
```bash
npm run build
npm run start
```

---

## 16. Current Limitations

1. **Retrospective Date Sample**: The current benchmark evaluated representative JJAS monsoon dates; an expanded multi-year evaluation is required before operational certification.
2. **Spatial Dependence**: District area exceedance is computed as an expected area fraction; joint multi-point spatial covariance requires full spatial copula or generative modeling.
3. **Regime Classifier Proxy**: Current regime identification combines synoptic zonal wind indices and geographic forcing proxies; full 850 hPa / 500 hPa spatial circulation pattern recognition is planned for V2.
4. **Held-Out Sample Integrity**: 2019 was inspected during exploratory V1 development and is categorized as a retrospective evaluation benchmark rather than a strictly untouched double-blind operational trial.

---

## 17. Future Work & Operational Roadmap

- **Near-Term (Next 3–6 Months)**:
  - Integration of NCMRWF NEPS-G 12 km 23-member Indian regional ensemble.
  - Spatial Copula post-processing for spatially coherent precipitation fields.
  - Expansion to Day +3, Day +5, and Day +7 lead times across all 700+ districts.
- **Long-Term Operational Deployment**:
  - Direct pipeline integration with IMD / NCMRWF operational workflows.
  - Downstream coupling to National Disaster Management Authority (NDMA) flood early warning systems.

---

## 18. Team

**Against The Odds**  
*Smart India Hackathon 2026 — Team ID: 149284*

- **Parth Khansali** ([@ParthKhansali](https://github.com/ParthKhansali) · [Case Study](https://www.parthkhansali.tech/projects/meghavyuha/)) — Lead Engineer & System Architect
- **Team Against The Odds** — Algorithmic Development, Geospatial Engineering & Validation

---
*License: MIT License. See [LICENSE](./LICENSE) and [ATTRIBUTION.md](./ATTRIBUTION.md) for complete third-party dataset and map notices.*
