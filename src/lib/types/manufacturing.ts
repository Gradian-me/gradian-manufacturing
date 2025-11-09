import { TemplateCosting } from "./process";

export type ManufacturingStatus = "planning" | "in_progress" | "completed" | "closed" | "cancelled";
export type ManufacturingPriority = "low" | "medium" | "high";

export interface ManufacturingOrderSnapshotBomLine {
  item_id: string;
  quantity: number;
  unit: string;
}

export interface ManufacturingOrderSnapshotRoutingStep {
  operation_id: string;
  routing_id: string;
  sequence: number;
}

export interface ManufacturingOrderSnapshot {
  bom: ManufacturingOrderSnapshotBomLine[];
  routing: ManufacturingOrderSnapshotRoutingStep[];
  costing: TemplateCosting;
}

export interface ManufacturingOrder {
  id: string;
  template_id: string;
  device_code: string;
  customer: string;
  status: ManufacturingStatus;
  priority: ManufacturingPriority;
  start_date: string;
  due_date: string;
  snapshot: ManufacturingOrderSnapshot;
}

export interface LaborLog {
  id: string;
  labor_grade_id: string;
  person: string;
  hours: number;
}

export interface EquipmentLog {
  id: string;
  equipment_id: string;
  hours: number;
}

export interface MaterialIssue {
  id: string;
  item_id: string;
  quantity: number;
  unit: string;
}

export interface HoldRecord {
  id: string;
  reason: string;
  released: boolean;
}

export interface QaCheck {
  id: string;
  passed: boolean;
  notes?: string;
}

export interface OperationLog {
  operation_id: string;
  mo_id: string;
  routing_id: string;
  status: "pending" | "in_progress" | "complete" | "blocked";
  started_at?: string;
  completed_at?: string;
  labor_logs: LaborLog[];
  equipment_logs: EquipmentLog[];
  material_issues: MaterialIssue[];
  holds: HoldRecord[];
  qa_checks: QaCheck[];
}

