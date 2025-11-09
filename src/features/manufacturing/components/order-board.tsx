'use client';

import { useMemo } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type {
  ManufacturingOrder,
  OperationLog,
} from "@/lib/types/manufacturing";
import type { DeviceTemplate } from "@/lib/types/process";

interface OrderBoardProps {
  orders: ManufacturingOrder[];
  operations: OperationLog[];
  templates: DeviceTemplate[];
}

const STATUS_COLORS: Record<
  ManufacturingOrder["status"],
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  planning: { label: "Planning", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "default" },
  completed: { label: "Completed", variant: "outline" },
  closed: { label: "Closed", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

const PRIORITY_COLORS: Record<ManufacturingOrder["priority"], string> = {
  high: "bg-red-500/90",
  medium: "bg-amber-500/90",
  low: "bg-emerald-500/80",
};

function getOrderProgress(order: ManufacturingOrder, operations: OperationLog[]) {
  const orderOperations = operations.filter((op) => op.mo_id === order.id);
  const totalOps = order.snapshot.routing.length;
  if (!totalOps) return 0;
  const completed = orderOperations.filter((op) => op.status === "complete").length;
  return Math.round((completed / totalOps) * 100);
}

function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString();
}

export function OrderBoard({ orders, operations, templates }: OrderBoardProps) {
  const templateById = useMemo(() => {
    return new Map(templates.map((template) => [template.id, template]));
  }, [templates]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {orders.map((order) => {
        const status = STATUS_COLORS[order.status];
        const progress = getOrderProgress(order, operations);
        const template = templateById.get(order.template_id);
        const orderOperations = operations
          .filter((op) => op.mo_id === order.id)
          .sort((a, b) => a.operation_id.localeCompare(b.operation_id));

        return (
          <Card
            key={order.id}
            className={cn(
              "flex h-full flex-col border border-border/70 shadow-sm transition hover:border-accent hover:shadow-md",
            )}
          >
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-xl font-semibold">{order.device_code}</CardTitle>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className={cn("inline-flex h-2.5 w-2.5 rounded-full", PRIORITY_COLORS[order.priority])} />
                <span className="font-medium uppercase tracking-wide">
                  {order.priority} priority
                </span>
                <span>• Start {formatDate(order.start_date)}</span>
                <span>• Due {formatDate(order.due_date)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Template: {template?.name ?? order.template_id} • Customer: {order.customer}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="operations">
                  <AccordionTrigger className="text-sm font-semibold">
                    Operation Logs ({orderOperations.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Operation</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden md:table-cell">Labor</TableHead>
                          <TableHead className="text-right">Logs</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderOperations.map((operation) => (
                          <TableRow key={operation.operation_id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{operation.operation_id}</span>
                                {operation.started_at ? (
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(operation.started_at)} →{" "}
                                    {operation.completed_at
                                      ? formatDate(operation.completed_at)
                                      : "open"}
                                  </span>
                                ) : null}
                              </div>
                            </TableCell>
                            <TableCell className="capitalize">{operation.status.replace("_", " ")}</TableCell>
                            <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                              {operation.labor_logs.map((log) => `${log.person} (${log.hours}h)`).join(", ") || "—"}
                            </TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground">
                              {operation.material_issues.length} materials •{" "}
                              {operation.equipment_logs.length} equipment
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 bg-muted/40">
              <div className="text-xs text-muted-foreground">
                Std Cost: {order.snapshot.costing.currency}{" "}
                {(
                  order.snapshot.costing.standard_material +
                  order.snapshot.costing.standard_labor +
                  order.snapshot.costing.standard_equipment +
                  order.snapshot.costing.standard_overhead
                ).toLocaleString()}
              </div>
              <Badge variant="outline">{order.id}</Badge>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

