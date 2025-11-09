'use client';

import { useQuery } from "@tanstack/react-query";
import type { DeviceTemplate, RoutingDefinition } from "@/lib/types/process";
import type { CatalogItem, LaborGrade } from "@/lib/types/catalog";

interface TemplateQueryResult {
  templates: DeviceTemplate[];
  routing: RoutingDefinition[];
  items: CatalogItem[];
  labor: LaborGrade[];
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { next: { revalidate: 120 } });
  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }
  const payload = (await response.json()) as { data: T };
  return payload.data;
}

async function fetchTemplateBundle(): Promise<TemplateQueryResult> {
  const [templates, routing, items, labor] = await Promise.all([
    fetchJson<DeviceTemplate[]>("/api/process/templates"),
    fetchJson<RoutingDefinition[]>("/api/process/routing"),
    fetchJson<CatalogItem[]>("/api/catalog/items"),
    fetchJson<LaborGrade[]>("/api/catalog/labor"),
  ]);

  return { templates, routing, items, labor };
}

export function useTemplateData() {
  return useQuery({
    queryKey: ["process", "templates"],
    queryFn: fetchTemplateBundle,
  });
}

