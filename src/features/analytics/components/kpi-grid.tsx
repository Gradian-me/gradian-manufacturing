'use client';

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { KpiCard } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";

interface AnalyticsKpiGridProps {
  items: KpiCard[];
}

function DeltaIcon({ direction }: { direction: KpiCard["direction"] }) {
  if (direction === "up") {
    return <ArrowUpRight className="h-4 w-4 text-emerald-500" aria-hidden="true" />;
  }
  if (direction === "down") {
    return <ArrowDownRight className="h-4 w-4 text-red-500" aria-hidden="true" />;
  }
  return <Minus className="h-4 w-4 text-muted-foreground" aria-hidden="true" />;
}

export function AnalyticsKpiGrid({ items }: AnalyticsKpiGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.id} className="border border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-foreground">
                {item.value}
                <span className="ml-1 text-base font-medium text-muted-foreground">
                  {item.unit}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <DeltaIcon direction={item.direction} />
              <span
                className={cn(
                  "font-medium",
                  item.direction === "up" && "text-emerald-600",
                  item.direction === "down" && "text-red-600",
                )}
              >
                {item.delta > 0 ? "+" : ""}
                {item.delta}%
              </span>
              <span>{item.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

