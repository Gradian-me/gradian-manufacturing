'use client';

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCatalogData } from "@/features/catalog/hooks/use-catalog";

export default function AdminPage() {
  const { data, isLoading, isError, error } = useCatalogData();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        title="Master Data"
        description="Manage catalog references for materials, equipment, labor grades, and work centers."
      />

      {isLoading ? (
        <Skeleton className="h-[420px] w-full rounded-xl" />
      ) : isError ? (
        <Card className="border border-destructive/40 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">
              Unable to load catalog data
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-destructive">
            {(error as Error).message}
          </CardContent>
        </Card>
      ) : data ? (
        <Card>
          <CardHeader>
            <CardTitle>Reference Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="items">
              <TabsList>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                <TabsTrigger value="labor">Labor Grades</TabsTrigger>
                <TabsTrigger value="workcenters">Work Centers</TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Std Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell className="capitalize">{item.type}</TableCell>
                        <TableCell className="text-right">
                          ${item.standard_cost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="equipment" className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Work Center</TableHead>
                      <TableHead className="text-right">Hourly Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.equipment.map((equipment) => (
                      <TableRow key={equipment.id}>
                        <TableCell>{equipment.id}</TableCell>
                        <TableCell>{equipment.name}</TableCell>
                        <TableCell>{equipment.code}</TableCell>
                        <TableCell>{equipment.work_center_id}</TableCell>
                        <TableCell className="text-right">
                          ${equipment.hourly_rate.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="labor" className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead className="text-right">Hourly Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.labor.map((labor) => (
                      <TableRow key={labor.id}>
                        <TableCell>{labor.id}</TableCell>
                        <TableCell>{labor.grade}</TableCell>
                        <TableCell className="text-right">
                          ${labor.hourly_rate.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="workcenters" className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.workcenters.map((wc) => (
                      <TableRow key={wc.id}>
                        <TableCell>{wc.id}</TableCell>
                        <TableCell>{wc.code}</TableCell>
                        <TableCell>{wc.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

