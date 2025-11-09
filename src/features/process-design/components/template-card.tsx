'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type {
  CatalogItem,
  LaborGrade,
} from "@/lib/types/catalog";
import type {
  DeviceTemplate,
  RoutingDefinition,
} from "@/lib/types/process";

interface TemplateCardProps {
  template: DeviceTemplate;
  itemsById: Map<string, CatalogItem>;
  laborById: Map<string, LaborGrade>;
  routingById: Map<string, RoutingDefinition>;
}

export function TemplateCard({
  template,
  itemsById,
  laborById,
  routingById,
}: TemplateCardProps) {
  const totalDuration = template.routing.reduce(
    (total, step) => total + step.duration_min,
    0,
  );

  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-xl font-semibold">{template.name}</CardTitle>
          <Badge variant={template.status === "released" ? "default" : "secondary"}>
            {template.status}
          </Badge>
          <Badge variant="outline">v{template.version}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Customers: {template.customer_fit.join(", ")}
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="bom">BOM</TabsTrigger>
            <TabsTrigger value="routing">Routing</TabsTrigger>
            <TabsTrigger value="costing">Costing</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="pt-4">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Total Steps
                </dt>
                <dd className="text-lg font-semibold">{template.routing.length}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Total Duration
                </dt>
                <dd className="text-lg font-semibold">{totalDuration} minutes</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Primary Equipment
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {[...new Set(template.routing.map((step) => {
                    const routing = routingById.get(step.id);
                    return routing?.work_center_id;
                  }))].map((workCenterId) =>
                    workCenterId ? (
                      <Badge key={workCenterId} variant="outline">
                        {workCenterId}
                      </Badge>
                    ) : null,
                  )}
                </dd>
              </div>
            </dl>
          </TabsContent>

          <TabsContent value="bom" className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {template.bom.map((line) => {
                  const item = itemsById.get(line.item_id);
                  return (
                    <TableRow key={`${template.id}-${line.item_id}`}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {item?.name ?? line.item_id}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {line.item_id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{line.usage_type}</TableCell>
                      <TableCell className="text-right">
                        {line.quantity} {line.unit}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="routing" className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Step</TableHead>
                  <TableHead>Work Center</TableHead>
                  <TableHead>Labor</TableHead>
                  <TableHead className="text-right">Duration (min)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {template.routing.map((step) => {
                  const routing = routingById.get(step.id);
                  const labor = laborById.get(step.labor_grade_id);

                  return (
                    <TableRow key={`${template.id}-${step.id}`}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {step.sequence}. {step.name}
                          </span>
                          {routing?.description ? (
                            <span className="text-xs text-muted-foreground">
                              {routing.description}
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>{routing?.work_center_id ?? "—"}</TableCell>
                      <TableCell>{labor?.grade ?? step.labor_grade_id}</TableCell>
                      <TableCell className="text-right">{step.duration_min}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="costing" className="pt-4">
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Material Std Cost
                </dt>
                <dd className="text-lg font-semibold">
                  {template.costing.currency} {template.costing.standard_material.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Labor Std Cost
                </dt>
                <dd className="text-lg font-semibold">
                  {template.costing.currency} {template.costing.standard_labor.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Equipment Std Cost
                </dt>
                <dd className="text-lg font-semibold">
                  {template.costing.currency} {template.costing.standard_equipment.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Overhead Std Cost
                </dt>
                <dd className="text-lg font-semibold">
                  {template.costing.currency} {template.costing.standard_overhead.toLocaleString()}
                </dd>
              </div>
            </dl>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

