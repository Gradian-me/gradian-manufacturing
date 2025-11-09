'use client';

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { EChartsOption } from "echarts";
import * as echarts from "echarts/core";
import {
  LineChart,
  BarChart,
  RadarChart,
} from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DatasetComponent,
  VisualMapComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  LineChart,
  BarChart,
  RadarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DatasetComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

interface EChartProps {
  option: EChartsOption;
  className?: string;
}

export function EChart({ option, className }: EChartProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "canvas",
      useDirtyRect: true,
    });
    chart.setOption(option);

    const observer = new ResizeObserver(() => {
      chart.resize();
    });

    observer.observe(chartRef.current);

    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, [option]);

  return <div ref={chartRef} className={cn("h-80 w-full", className)} />;
}

