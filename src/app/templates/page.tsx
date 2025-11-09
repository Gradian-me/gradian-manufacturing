'use client';

import { useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TemplateCard } from "@/features/process-design/components/template-card";
import { useTemplateData } from "@/features/process-design/hooks/use-templates";

export default function TemplatesPage() {
  const { data, isLoading, isError, error } = useTemplateData();

  const itemsById = useMemo(() => {
    if (!data) return new Map<string, (typeof data.items)[number]>();
    return new Map(data.items.map((item) => [item.id, item]));
  }, [data]);

  const laborById = useMemo(() => {
    if (!data) return new Map<string, (typeof data.labor)[number]>();
    return new Map(data.labor.map((grade) => [grade.id, grade]));
  }, [data]);

  const routingById = useMemo(() => {
    if (!data) return new Map<string, (typeof data.routing)[number]>();
    return new Map(data.routing.map((routing) => [routing.id, routing]));
  }, [data]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        title="Device Templates"
        description="Manage configurable device templates with version-controlled BOM, routing, and costing snapshots."
      />

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-[420px] w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <Card className="border border-destructive/40 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">
              Unable to load templates
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-destructive">
            {(error as Error).message}
          </CardContent>
        </Card>
      ) : data ? (
        <div className="grid gap-6">
          {data.templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              itemsById={itemsById}
              laborById={laborById}
              routingById={routingById}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

