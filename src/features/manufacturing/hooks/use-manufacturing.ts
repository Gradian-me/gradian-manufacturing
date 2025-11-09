'use client';

import { useQuery } from "@tanstack/react-query";
import type {
  ManufacturingOrder,
  OperationLog,
} from "@/lib/types/manufacturing";
import type { DeviceTemplate } from "@/lib/types/process";

interface ManufacturingQueryResult {
  orders: ManufacturingOrder[];
  operations: OperationLog[];
  templates: DeviceTemplate[];
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { next: { revalidate: 60 } });
  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }
  const payload = (await response.json()) as { data: T };
  return payload.data;
}

async function fetchManufacturing(): Promise<ManufacturingQueryResult> {
  const [orders, operations, templates] = await Promise.all([
    fetchJson<ManufacturingOrder[]>("/api/manufacturing/mos"),
    fetchJson<OperationLog[]>("/api/manufacturing/operations"),
    fetchJson<DeviceTemplate[]>("/api/process/templates"),
  ]);
  return { orders, operations, templates };
}

export function useManufacturingData() {
  return useQuery({
    queryKey: ["manufacturing", "orders"],
    queryFn: fetchManufacturing,
  });
}

