'use client';

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EChart } from "@/components/charts/echart";
import { useAnalytics } from "@/features/analytics/hooks/use-analytics";
import { AnalyticsKpiGrid } from "@/features/analytics/components/kpi-grid";
import { buildChartOptions } from "@/features/analytics/utils/chart-options";
import type { AnalyticsPayload } from "@/lib/types/analytics";

type SavedFilters = {
  dateRange: string;
  customer: string;
  template: string;
};

const STORAGE_KEY = "gradian-dashboard-filters";
const DEFAULT_FILTERS: SavedFilters = {
  dateRange: "30d",
  customer: "all",
  template: "all",
};

function applyFilters(
  payload: AnalyticsPayload | undefined,
  filters: SavedFilters,
) {
  if (!payload) return undefined;

  const clone: AnalyticsPayload = structuredClone(payload);

  if (filters.dateRange !== "all" && clone.charts.wipTrend?.series) {
    const cutoff =
      filters.dateRange === "7d"
        ? 1
        : filters.dateRange === "30d"
          ? 3
          : clone.charts.wipTrend.series[0].data.length;
    clone.charts.wipTrend.series = clone.charts.wipTrend.series.map((series) => ({
      ...series,
      data: series.data.slice(-cutoff),
    }));
  }

  if (
    filters.template !== "all" &&
    clone.charts.costVariance?.series
  ) {
    clone.charts.costVariance.series = clone.charts.costVariance.series.map(
      (series) => ({
        ...series,
        data: series.data.filter((entry) =>
          Array.isArray(entry) ? entry[0] === filters.template : entry,
        ),
      }),
    );
  }

  return clone;
}

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useAnalytics();
  const [filters, setFilters] = useState<SavedFilters>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_FILTERS;
    }
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return DEFAULT_FILTERS;
    }
    try {
      const parsed = JSON.parse(saved) as SavedFilters;
      return { ...DEFAULT_FILTERS, ...parsed };
    } catch {
      return DEFAULT_FILTERS;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const filteredData = useMemo(
    () => applyFilters(data, filters),
    [data, filters],
  );

  const chartOptions = useMemo(() => {
    if (!filteredData) return null;
    return buildChartOptions(filteredData);
  }, [filteredData]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        title="Operations Dashboard"
        description="Track throughput, resource utilisation, and cost performance across custom manufacturing orders."
        actions={
          <>
            <Select
              value={filters.dateRange}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, dateRange: value }))
              }
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="qtd">Quarter to date</SelectItem>
                <SelectItem value="all">All data</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.customer}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, customer: value }))
              }
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Customer" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="all">All customers</SelectItem>
                {data?.filters.customers.map((customer) => (
                  <SelectItem key={customer} value={customer}>
                    {customer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.template}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, template: value }))
              }
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Template" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="all">All templates</SelectItem>
                {data?.filters.templates.map((template) => (
                  <SelectItem key={template} value={template}>
                    {template}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <Card className="border border-destructive/40 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">
              Unable to load analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-destructive">
            {(error as Error).message}
          </CardContent>
        </Card>
      ) : filteredData ? (
        <>
          <AnalyticsKpiGrid items={filteredData.cards} />
          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>{filteredData.charts.wipTrend?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {chartOptions?.wipTrend ? (
                  <EChart option={chartOptions.wipTrend} />
                ) : (
                  <Skeleton className="h-80 w-full rounded-lg" />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  {filteredData.charts.resourceUtilization?.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chartOptions?.resourceUtilization ? (
                  <EChart option={chartOptions.resourceUtilization} />
                ) : (
                  <Skeleton className="h-80 w-full rounded-lg" />
                )}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>
                {filteredData.charts.costVariance?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartOptions?.costVariance ? (
                <EChart option={chartOptions.costVariance} className="h-96" />
              ) : (
                <Skeleton className="h-96 w-full rounded-lg" />
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}

