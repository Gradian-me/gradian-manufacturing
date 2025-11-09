export type CatalogItemType = "material" | "component";

export interface CatalogItem {
  id: string;
  sku: string;
  name: string;
  type: CatalogItemType;
  unit: string;
  standard_cost: number;
}

export interface Equipment {
  id: string;
  code: string;
  name: string;
  hourly_rate: number;
  capacity_liters?: number;
  capacity_units_per_hour?: number;
  work_center_id: string;
}

export interface LaborGrade {
  id: string;
  grade: string;
  hourly_rate: number;
}

export interface WorkCenter {
  id: string;
  code: string;
  name: string;
}

