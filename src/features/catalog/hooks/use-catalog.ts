'use client';

import { useQuery } from "@tanstack/react-query";
import type {
  CatalogItem,
  Equipment,
  LaborGrade,
  WorkCenter,
} from "@/lib/types/catalog";

interface CatalogQueryResult {
  items: CatalogItem[];
  equipment: Equipment[];
  labor: LaborGrade[];
  workcenters: WorkCenter[];
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }
  const payload = (await response.json()) as { data: T };
  return payload.data;
}

async function fetchCatalog(): Promise<CatalogQueryResult> {
  const [items, equipment, labor, workcenters] = await Promise.all([
    fetchJson<CatalogItem[]>("/api/catalog/items"),
    fetchJson<Equipment[]>("/api/catalog/equipment"),
    fetchJson<LaborGrade[]>("/api/catalog/labor"),
    fetchJson<WorkCenter[]>("/api/catalog/workcenters"),
  ]);

  return { items, equipment, labor, workcenters };
}

export function useCatalogData() {
  return useQuery({
    queryKey: ["catalog", "master-data"],
    queryFn: fetchCatalog,
  });
}

