'use client';

import { useQuery } from "@tanstack/react-query";
import type { AnalyticsPayload } from "@/lib/types/analytics";

async function fetchAnalytics(): Promise<AnalyticsPayload> {
  const response = await fetch("/api/analytics/kpis", {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }

  const payload = (await response.json()) as { data: AnalyticsPayload };
  return payload.data;
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics", "kpis"],
    queryFn: fetchAnalytics,
  });
}

