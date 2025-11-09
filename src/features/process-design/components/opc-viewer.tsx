'use client';

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape, { type Core, type ElementDefinition } from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";
import { Play, Search, ZoomIn, ZoomOut, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OpcEdge, OpcGraph, OpcNode } from "@/lib/types/process";

cytoscape.use(coseBilkent);

const OPC_STYLESHEET: cytoscape.StylesheetStyle[] = [
  {
    selector: "node",
    style: {
      label: "data(label)",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": "12px",
      "text-wrap": "wrap",
      "text-max-width": "120px",
      color: "#1f2937",
      "background-color": "#ede9fe",
      width: "label",
      height: "label",
      padding: "12px",
      shape: "round-rectangle",
      "border-width": 2,
      "border-color": "#8b5cf6",
    } as unknown as cytoscape.Css.Node,
  },
  {
    selector: "node.kind-check",
    style: {
      "background-color": "#dcfce7",
      "border-color": "#16a34a",
    } as unknown as cytoscape.Css.Node,
  },
  {
    selector: "node.kind-hold",
    style: {
      "background-color": "#fee2e2",
      "border-color": "#ef4444",
    } as unknown as cytoscape.Css.Node,
  },
  {
    selector: "node.quality-gate",
    style: {
      "border-style": "double",
      "border-width": 4,
    } as unknown as cytoscape.Css.Node,
  },
  {
    selector: "node.highlight",
    style: {
      "border-color": "#0ea5e9",
      "border-width": 6,
      "border-style": "solid",
      "box-shadow": "0px 0px 12px rgba(14,165,233,0.6)",
    } as unknown as cytoscape.Css.Node,
  },
  {
    selector: "node.phase-group",
    style: {
      "background-color": "data(color)",
      "border-color": "#a855f7",
      "font-weight": "bold",
      "text-valign": "top",
      "padding": "24px",
      "text-margin-y": "-16px",
      "font-size": "13px",
    } as unknown as cytoscape.Css.Node,
  },
  {
    selector: "edge",
    style: {
      width: 2,
      "line-color": "#c4b5fd",
      "target-arrow-color": "#8b5cf6",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
      label: "data(label)",
      "font-size": "11px",
      color: "#4b5563",
      "text-background-opacity": 1,
      "text-background-color": "#ffffff",
      "text-background-padding": "2px",
    } as unknown as cytoscape.Css.Edge,
  },
  {
    selector: "edge.critical",
    style: {
      width: 3,
      "line-color": "#f97316",
      "target-arrow-color": "#f97316",
    } as unknown as cytoscape.Css.Edge,
  },
];

interface OpcViewerProps {
  graph: OpcGraph;
}

interface SelectedNodeState {
  node: OpcNode | null;
  edge?: OpcEdge | null;
}

export function OpcViewer({ graph }: OpcViewerProps) {
  const cyRef = useRef<Core | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() =>
    graph.groups.reduce<Record<string, boolean>>((acc, group) => {
      acc[group.id] = group.collapsed_default;
      return acc;
    }, {}),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<SelectedNodeState>({ node: null });
  const [isMobile, setIsMobile] = useState(false);

  const elements = useMemo<ElementDefinition[]>(() => {
    const groupNodes: ElementDefinition[] = graph.groups.map((group) => ({
      data: {
        id: group.id,
        label: group.label,
        color: group.color,
        collapsed: group.collapsed_default,
      },
      classes: "phase-group",
    }));

    const processNodes: ElementDefinition[] = graph.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.label,
        parent: node.groupId,
        duration_min: node.duration_min,
        required_equipment_ids: node.required_equipment_ids,
        required_material_ids: node.required_material_ids,
        sop_ref: node.sop_ref,
        quality_gate: node.quality_gate,
        kind: node.kind,
      },
      classes: cn("opc-node", `kind-${node.kind}`, node.quality_gate && "quality-gate"),
    }));

    const edges: ElementDefinition[] = graph.edges.map((edge) => ({
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        relation: edge.relation,
        label: edge.condition_label ?? "",
      },
      classes: cn(
        "opc-edge",
        `relation-${edge.relation.toLowerCase()}`,
        edge.critical && "critical",
      ),
    }));

    return [...groupNodes, ...processNodes, ...edges];
  }, [graph]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    const updateLabels = () => {
      cy.style()
        .selector("node")
        .style("label", showLabels ? "data(label)" : "")
        .update();
    };
    updateLabels();
  }, [showLabels]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.elements().removeClass("highlight");

    Object.entries(collapsedGroups).forEach(([groupId, isCollapsed]) => {
      const children = cy.nodes(`[parent="${groupId}"]`);
      if (isCollapsed) {
        children.style("display", "none");
        children.connectedEdges().style("display", "none");
      } else {
        children.style("display", "element");
        children.connectedEdges().style("display", "element");
      }
    });
  }, [collapsedGroups]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    const handleTap = (event: cytoscape.EventObject) => {
      const node = event.target;
      if (node.group() === "nodes" && !node.hasClass("phase-group")) {
        const nodeData = graph.nodes.find((n) => n.id === node.id());
        if (nodeData) {
          setSelected({ node: nodeData });
        }
      }
    };

    cy.on("tap", "node", handleTap);
    return () => {
      cy.off("tap", "node", handleTap);
    };
  }, [graph.nodes]);

  const handleFit = () => {
    cyRef.current?.fit(undefined, 40);
  };

  const handleZoom = (delta: number) => {
    const cy = cyRef.current;
    if (!cy) return;
    const currentZoom = cy.zoom();
    cy.zoom({
      level: currentZoom * delta,
      renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
    });
  };

  const handleCollapseAll = () => {
    setCollapsedGroups(
      graph.groups.reduce<Record<string, boolean>>((acc, group) => {
        acc[group.id] = true;
        return acc;
      }, {}),
    );
  };

  const handleExpandAll = () => {
    setCollapsedGroups(
      graph.groups.reduce<Record<string, boolean>>((acc, group) => {
        acc[group.id] = false;
        return acc;
      }, {}),
    );
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cy = cyRef.current;
    if (!cy) return;
    cy.nodes().removeClass("highlight");

    if (!searchTerm) {
      return;
    }

    const match = cy
      .nodes()
      .filter(
        (node) =>
          node.group() === "nodes" &&
          node.data("label").toLowerCase().includes(searchTerm.toLowerCase()),
      );
    if (match.length > 0) {
      const first = match[0];
      first.addClass("highlight");
      cy.animate({
        center: { eles: first },
        zoom: 1.2,
        duration: 500,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 xl:flex-row">
      <Card className="flex-1">
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleFit}>
                <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                Fit
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleZoom(1.2)}
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleZoom(0.8)}
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleExpandAll}>
                <Maximize2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Expand all
              </Button>
              <Button variant="outline" size="sm" onClick={handleCollapseAll}>
                <Minimize2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Collapse all
              </Button>
              <Toggle
                size="sm"
                pressed={showLabels}
                onPressedChange={setShowLabels}
                aria-label="Toggle node labels"
              >
                Labels
              </Toggle>
            </div>
            <form
              className="flex w-full items-center gap-2 lg:w-auto"
              onSubmit={handleSearch}
            >
              <Input
                placeholder="Search node label"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <Button type="submit" variant="secondary">
                <Search className="mr-2 h-4 w-4" aria-hidden="true" />
                Search
              </Button>
            </form>
          </div>

          <div className="h-[520px] w-full rounded-lg border border-border/60 bg-muted/30">
            <CytoscapeComponent
              elements={elements}
              layout={{
                name: "cose-bilkent",
                animate: false,
                nodeDimensionsIncludeLabels: true,
                fit: true,
                padding: 40,
              }}
              stylesheet={OPC_STYLESHEET}
              style={{ width: "100%", height: "100%" }}
              cy={(cy) => {
                cyRef.current = cy;
              }}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            {graph.groups.map((group) => (
              <div key={group.id} className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: group.color }}
                  aria-hidden="true"
                />
                <span className="text-xs text-muted-foreground">
                  {group.label}
                </span>
              </div>
            ))}
            <Separator orientation="vertical" className="hidden h-4 lg:inline" />
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full border-4 border-emerald-500" />
              <span className="text-xs text-muted-foreground">QA Gate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-6 rounded-full bg-orange-400" />
              <span className="text-xs text-muted-foreground">Critical Path</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hidden w-full max-w-sm lg:sticky lg:top-24 lg:h-fit lg:block">
        <CardContent className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Node details
          </h2>
          {selected.node ? (
            <ScrollArea className="mt-4 h-[480px]">
              <div className="space-y-4 pr-2">
                <div>
                  <h3 className="text-xl font-semibold">{selected.node.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    SOP: {selected.node.sop_ref}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Metadata
                  </h4>
                  <dl className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Phase</dt>
                      <dd>
                        {
                          graph.groups.find((group) => group.id === selected.node?.groupId)
                            ?.label
                        }
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Kind</dt>
                      <dd className="capitalize">{selected.node.kind}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Duration</dt>
                      <dd>{selected.node.duration_min} min</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Quality gate</dt>
                      <dd>{selected.node.quality_gate ? "Yes" : "No"}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Equipment
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.node.required_equipment_ids.length ? (
                      selected.node.required_equipment_ids.map((equipment) => (
                        <Badge key={equipment} variant="outline">
                          {equipment}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No equipment required</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Materials
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.node.required_material_ids.length ? (
                      selected.node.required_material_ids.map((material) => (
                        <Badge key={material} variant="secondary">
                          {material}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No materials consumed
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Select a node in the process chart to view its details.
            </p>
          )}
        </CardContent>
      </Card>

      <Sheet
        open={isMobile && !!selected.node}
        onOpenChange={(open) => {
          if (!open) {
            setSelected({ node: null });
          }
        }}
      >
        <SheetContent
          side="right"
          className="w-full max-w-md border-l border-border/60 p-6 lg:hidden"
        >
          <SheetHeader>
            <SheetTitle>{selected.node?.label ?? "Node Details"}</SheetTitle>
          </SheetHeader>
          <ScrollArea className="mt-4 h-full">
            {selected.node ? (
              <div className="space-y-4 pr-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Phase</span>
                  <span>
                    {
                      graph.groups.find((group) => group.id === selected.node?.groupId)
                        ?.label
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Kind</span>
                  <span className="capitalize">{selected.node.kind}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Duration</span>
                  <span>{selected.node.duration_min} min</span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Equipment
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.node.required_equipment_ids.length ? (
                      selected.node.required_equipment_ids.map((equipment) => (
                        <Badge key={equipment} variant="outline">
                          {equipment}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No equipment required</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Materials
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.node.required_material_ids.length ? (
                      selected.node.required_material_ids.map((material) => (
                        <Badge key={material} variant="secondary">
                          {material}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No materials consumed
                      </p>
                    )}
                  </div>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  SOP Reference: {selected.node.sop_ref}
                </p>
              </div>
            ) : null}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}

