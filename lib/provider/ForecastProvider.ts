// MEGHAVYUHA Forecast Provider Interface
// This abstraction isolates the UI layer from the forecasting backend.
// In the current prototype, SimulationForecastProvider implements this interface.
// When the operational ML/NWP pipeline is ready, MeghavyuhaForecastProvider will implement
// this same interface without requiring changes to the user interface.

import type {
  ForecastModel,
  ViewMode,
  DistrictForecast,
  RouterDecision,
  ForecastDay,
  GridCell,
  ModelMetrics,
  Alert,
  DemoScenario,
  DataSourceStatus,
} from "@/types/forecast";
import {
  generateRainfallGrid,
  generateProbabilityGrid,
  generateUncertaintyGrid,
  generateDifferenceGrid,
} from "@/lib/mock/rainfallFields";
import {
  DEMO_DISTRICTS,
  DISTRICT_MAP,
  ROUTER_DECISIONS,
} from "@/lib/mock/districtForecasts";
import {
  MODEL_METRICS,
  DEMO_SCENARIOS,
  DATA_SOURCES,
  getForecastEvolution,
} from "@/lib/mock/validation";
import { DEMO_ALERTS } from "@/lib/mock/alerts";

export interface IForecastProvider {
  readonly isSimulation: boolean;
  getRainfallGrid(
    model: ForecastModel,
    leadDay: number,
    viewMode: ViewMode,
    thresholdMm?: number,
    baseline?: ForecastModel
  ): GridCell[];
  getDistrict(districtId: string): DistrictForecast | undefined;
  getAllDistricts(): DistrictForecast[];
  getRouterDecision(districtId: string): RouterDecision | undefined;
  getForecastEvolution(districtId: string, baseRainfall?: number): ForecastDay[];
  getAlerts(leadDay?: number): Alert[];
  getModelMetrics(): ModelMetrics[];
  getScenarios(): DemoScenario[];
  getDataSources(): DataSourceStatus[];
}

export class SimulationForecastProvider implements IForecastProvider {
  readonly isSimulation = true;

  getRainfallGrid(
    model: ForecastModel,
    leadDay: number,
    viewMode: ViewMode,
    thresholdMm = 64.5,
    baseline: ForecastModel = "raw"
  ): GridCell[] {
    if (viewMode === "amount") {
      return generateRainfallGrid(model, leadDay, "amount");
    }
    if (viewMode === "probability") {
      return generateProbabilityGrid(model, leadDay, thresholdMm);
    }
    if (viewMode === "uncertainty") {
      return generateUncertaintyGrid(model, leadDay);
    }
    if (viewMode === "difference") {
      return generateDifferenceGrid(model, baseline, leadDay);
    }
    return [];
  }

  getDistrict(districtId: string): DistrictForecast | undefined {
    return DISTRICT_MAP[districtId] ?? DEMO_DISTRICTS.find((d) => d.districtId === districtId);
  }

  getAllDistricts(): DistrictForecast[] {
    return DEMO_DISTRICTS;
  }

  getRouterDecision(districtId: string): RouterDecision | undefined {
    return ROUTER_DECISIONS[districtId];
  }

  getForecastEvolution(districtId: string, baseRainfall = 50): ForecastDay[] {
    const d = this.getDistrict(districtId);
    return getForecastEvolution(districtId, d?.expectedRainfallMm ?? baseRainfall);
  }

  getAlerts(_leadDay = 1): Alert[] {
    return DEMO_ALERTS;
  }

  getModelMetrics(): ModelMetrics[] {
    return MODEL_METRICS;
  }

  getScenarios(): DemoScenario[] {
    return DEMO_SCENARIOS;
  }

  getDataSources(): DataSourceStatus[] {
    return DATA_SOURCES;
  }
}

// Global singleton instance — default to Simulation provider
export const forecastProvider: IForecastProvider = new SimulationForecastProvider();
