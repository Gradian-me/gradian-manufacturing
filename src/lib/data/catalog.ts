import { readJsonCached } from "./fs";
import type {
  CatalogItem,
  Equipment,
  LaborGrade,
  WorkCenter,
} from "@/lib/types/catalog";

export const getCatalogItems = () =>
  readJsonCached<CatalogItem[]>("catalog/items.json");

export const getEquipment = () =>
  readJsonCached<Equipment[]>("catalog/equipment.json");

export const getLaborGrades = () =>
  readJsonCached<LaborGrade[]>("catalog/labor.json");

export const getWorkCenters = () =>
  readJsonCached<WorkCenter[]>("catalog/workcenters.json");

