import { readJsonCached } from "./fs";
import type {
  ManufacturingOrder,
  OperationLog,
} from "@/lib/types/manufacturing";

export const getManufacturingOrders = () =>
  readJsonCached<ManufacturingOrder[]>("manufacturing/mos.json");

export const getOperationLogs = () =>
  readJsonCached<OperationLog[]>("manufacturing/operations.json");

