'use client';

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OpcViewer } from "@/features/process-design/components/opc-viewer";
import { useOpcDataset } from "@/features/process-design/hooks/use-opc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function OpcPage() {
  const { data, isLoading, isError, error } = useOpcDataset();
  const scenarios = useMemo(() => data?.scenarios ?? [], [data]);
  const [scenarioId, setScenarioId] = useState<string>();
  const defaultScenarioId = scenarios[0]?.id;
  const activeScenarioId = scenarioId ?? defaultScenarioId;
  const activeScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === activeScenarioId),
    [activeScenarioId, scenarios],
  );

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        title="Operation Process Chart"
        description="Browse manufacturing process flows with collapsible phases, critical path highlights, and node-level metadata."
        actions={
          scenarios.length && activeScenario ? (
            <Select
              value={activeScenario.id}
              onValueChange={setScenarioId}
            >
              <SelectTrigger className="w-[260px]">
                <SelectValue placeholder="Select scenario" />
              </SelectTrigger>
              <SelectContent align="end">
                {scenarios.map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null
        }
      />
      {isLoading ? (
        <Skeleton className="h-[640px] w-full rounded-xl" />
      ) : isError ? (
        <Card className="border border-destructive/40 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">
              Unable to load OPC graph
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-destructive">
            {(error as Error).message}
          </CardContent>
        </Card>
      ) : activeScenario ? (
        <>
          <Card className="border border-border/60">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>{activeScenario.name}</CardTitle>
                {activeScenario.category ? (
                  <Badge variant="outline">{activeScenario.category}</Badge>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{activeScenario.description}</p>
            </CardContent>
          </Card>
          <OpcViewer key={activeScenario.id} graph={activeScenario.graph} />
        </>
      ) : null}
    </div>
  );
}

