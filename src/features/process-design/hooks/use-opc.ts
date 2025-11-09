'use client';

import { useQuery } from "@tanstack/react-query";
import type { OpcDataset } from "@/lib/types/process";

async function fetchOpcDataset(): Promise<OpcDataset> {
  const response = await fetch("/api/process/opc", {
    next: { revalidate: 120 },
  });
  if (!response.ok) {
    throw new Error("Failed to load OPC dataset");
  }
  const payload = (await response.json()) as { data: OpcDataset };
  return payload.data;
}

export function useOpcDataset() {
  return useQuery({
    queryKey: ["process", "opc"],
    queryFn: fetchOpcDataset,
  });
}

