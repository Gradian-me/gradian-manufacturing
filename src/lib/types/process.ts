export type OperationKind = "operation" | "check" | "gateway" | "hold";

export interface OpcGroup {
  id: string;
  label: string;
  phase_order: number;
  color: string;
  collapsed_default: boolean;
}

export interface OpcNode {
  id: string;
  label: string;
  groupId: string;
  kind: OperationKind;
  duration_min: number;
  required_equipment_ids: string[];
  required_material_ids: string[];
  sop_ref: string;
  quality_gate: boolean;
}

export type OpcRelation = "NEXT" | "PARALLEL" | "REQUIRES" | "QA";

export interface OpcEdge {
  id: string;
  source: string;
  target: string;
  relation: OpcRelation;
  condition_label?: string;
  critical: boolean;
}

export interface OpcGraph {
  groups: OpcGroup[];
  nodes: OpcNode[];
  edges: OpcEdge[];
}

export interface OpcScenario {
  id: string;
  name: string;
  description: string;
  category?: string;
  primary_template_id?: string;
  graph: OpcGraph;
}

export interface OpcDataset {
  scenarios: OpcScenario[];
}

export interface TemplateBomLine {
  item_id: string;
  quantity: number;
  unit: string;
  usage_type: string;
}

export interface TemplateRoutingStep {
  id: string;
  name: string;
  sequence: number;
  work_center_id: string;
  labor_grade_id: string;
  duration_min: number;
  opc_node_id?: string;
}

export interface TemplateCosting {
  standard_material: number;
  standard_labor: number;
  standard_equipment: number;
  standard_overhead: number;
  currency: string;
}

export interface DeviceTemplate {
  id: string;
  name: string;
  version: string;
  status: "draft" | "released" | "engineering";
  customer_fit: string[];
  bom: TemplateBomLine[];
  routing: TemplateRoutingStep[];
  costing: TemplateCosting;
}

export interface RoutingDefinition {
  id: string;
  name: string;
  default_duration_min: number;
  work_center_id: string;
  labor_grade_id: string;
  description: string;
  resource_notes: string[];
}

