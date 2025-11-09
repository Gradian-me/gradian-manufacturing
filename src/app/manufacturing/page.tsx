'use client';

import { useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { OrderBoard } from "@/features/manufacturing/components/order-board";
import { useManufacturingData } from "@/features/manufacturing/hooks/use-manufacturing";

export default function ManufacturingPage() {
  const { data, isLoading, isError, error } = useManufacturingData();

  const statusSummary = useMemo(() => {
    if (!data) return [];
    const counts = data.orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.status] = (acc[order.status] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
    }));
  }, [data]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        title="Manufacturing Orders"
        description="Track order status, execution progress, and captured logs across the manufacturing floor."
      />

      {isLoading ? (
        <div className="grid gap-6">
          <Skeleton className="h-16 w-full rounded-xl" />
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-[420px] w-full rounded-xl" />
            <Skeleton className="h-[420px] w-full rounded-xl" />
          </div>
        </div>
      ) : isError ? (
        <Card className="border border-destructive/40 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">
              Unable to load manufacturing data
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-destructive">
            {(error as Error).message}
          </CardContent>
        </Card>
      ) : data ? (
        <>
          <Card className="border border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              {statusSummary.map(({ status, count }) => (
                <div key={status} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="capitalize">
                    {status.replace("_", " ")}
                  </Badge>
                  <span className="text-base font-semibold text-foreground">{count}</span>
                  <span>orders</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <OrderBoard
            orders={data.orders}
            operations={data.operations}
            templates={data.templates}
          />
        </>
      ) : null}
    </div>
  );
}

