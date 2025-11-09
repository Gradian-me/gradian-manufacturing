import type { AnalyticsPayload, ChartConfig } from "@/lib/types/analytics";
import type { EChartsOption } from "echarts";

export function buildLineChartOption(config: ChartConfig) {
  if (!config.series) {
    throw new Error("Line chart requires series data");
  }

  const [firstSeries] = config.series;
  const option: EChartsOption = {
    title: { text: config.title, left: "left" },
    tooltip: { trigger: "axis" as const },
    legend: { bottom: 0 },
    grid: { left: 32, right: 12, top: 48, bottom: 48 },
    xAxis: {
      type: "category" as const,
      data: firstSeries.data.map((point) => Array.isArray(point) ? point[0] : point),
      boundaryGap: false,
    },
    yAxis: { type: "value" as const },
    series: config.series.map((serie) => ({
      name: serie.name,
      type: "line" as const,
      smooth: true,
      symbol: "circle",
      symbolSize: 8,
      data: serie.data,
    })),
  };
  return option;
}

export function buildBarChartOption(config: ChartConfig) {
  if (!config.series) {
    throw new Error("Bar chart requires series data");
  }

  const categories = config.series[0].data.map((point) =>
    Array.isArray(point) ? point[0] : point,
  );

  const option: EChartsOption = {
    title: { text: config.title, left: "left" },
    tooltip: {
      trigger: "axis" as const,
      axisPointer: { type: "shadow" as const },
    },
    legend: { bottom: 0 },
    grid: { left: 32, right: 12, top: 48, bottom: 48 },
    xAxis: { type: "category" as const, data: categories },
    yAxis: { type: "value" as const },
    series: config.series.map((serie) => ({
      name: serie.name,
      type: "bar" as const,
      data: serie.data.map((point) => (Array.isArray(point) ? point[1] : point)),
      barMaxWidth: 28,
    })),
  };
  return option;
}

export function buildRadarChartOption(config: ChartConfig) {
  if (!config.indicators || !config.series) {
    throw new Error("Radar chart requires indicators and series data");
  }

  const option: EChartsOption = {
    title: { text: config.title, left: "left" },
    tooltip: {},
    legend: { bottom: 0 },
    radar: { indicator: config.indicators },
    series: config.series.map((serie) => ({
      name: serie.name,
      type: "radar" as const,
      data: [
        {
          value: Array.isArray(serie.data) ? serie.data : [],
          name: serie.name,
        },
      ],
      areaStyle: { opacity: 0.1 },
    })),
  };
  return option;
}

export function buildChartOptions(payload: AnalyticsPayload) {
  const { charts } = payload;
  return {
    wipTrend:
      charts.wipTrend && charts.wipTrend.type === "line"
        ? buildLineChartOption(charts.wipTrend)
        : null,
    costVariance:
      charts.costVariance && charts.costVariance.type === "bar"
        ? buildBarChartOption(charts.costVariance)
        : null,
    resourceUtilization:
      charts.resourceUtilization && charts.resourceUtilization.type === "radar"
        ? buildRadarChartOption(charts.resourceUtilization)
        : null,
  };
}

