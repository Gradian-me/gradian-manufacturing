export interface KpiCard {
  id: string;
  label: string;
  value: number;
  unit: string;
  delta: number;
  direction: "up" | "down" | "flat";
  description?: string;
}

export interface SeriesPointTuple extends Array<string | number> {
  0: string;
  1: number;
}

export interface ChartSeries {
  name: string;
  data: SeriesPointTuple[] | number[];
}

export interface RadarIndicator {
  name: string;
  max: number;
}

export interface ChartConfig {
  title: string;
  type: "line" | "bar" | "radar";
  series?: ChartSeries[];
  indicators?: RadarIndicator[];
}

export interface AnalyticsPayload {
  cards: KpiCard[];
  charts: Record<string, ChartConfig>;
  filters: {
    dateRanges: { label: string; value: string }[];
    customers: string[];
    templates: string[];
  };
}

