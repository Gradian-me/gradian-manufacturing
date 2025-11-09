import type { AnalyticsPayload, ChartConfig } from "@/lib/types/analytics";

export function buildLineChartOption(config: ChartConfig) {
  if (!config.series) {
    throw new Error("Line chart requires series data");
  }

  const [firstSeries] = config.series;
  return {
    title: { text: config.title, left: "left" },
    tooltip: { trigger: "axis" },
    legend: { bottom: 0 },
    grid: { left: 32, right: 12, top: 48, bottom: 48 },
    xAxis: {
      type: "category",
      data: firstSeries.data.map((point) => Array.isArray(point) ? point[0] : point),
      boundaryGap: false,
    },
    yAxis: { type: "value" },
    series: config.series.map((serie) => ({
      name: serie.name,
      type: "line",
      smooth: true,
      symbol: "circle",
      symbolSize: 8,
      data: serie.data,
    })),
  };
}

export function buildBarChartOption(config: ChartConfig) {
  if (!config.series) {
    throw new Error("Bar chart requires series data");
  }

  const categories = config.series[0].data.map((point) =>
    Array.isArray(point) ? point[0] : point,
  );

  return {
    title: { text: config.title, left: "left" },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: { bottom: 0 },
    grid: { left: 32, right: 12, top: 48, bottom: 48 },
    xAxis: { type: "category", data: categories },
    yAxis: { type: "value" },
    series: config.series.map((serie) => ({
      name: serie.name,
      type: "bar",
      data: serie.data.map((point) => (Array.isArray(point) ? point[1] : point)),
      barMaxWidth: 28,
    })),
  };
}

export function buildRadarChartOption(config: ChartConfig) {
  if (!config.indicators || !config.series) {
    throw new Error("Radar chart requires indicators and series data");
  }

  return {
    title: { text: config.title, left: "left" },
    tooltip: {},
    legend: { bottom: 0 },
    radar: { indicator: config.indicators },
    series: config.series.map((serie) => ({
      name: serie.name,
      type: "radar",
      data: [
        {
          value: Array.isArray(serie.data) ? serie.data : [],
          name: serie.name,
        },
      ],
      areaStyle: { opacity: 0.1 },
    })),
  };
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

