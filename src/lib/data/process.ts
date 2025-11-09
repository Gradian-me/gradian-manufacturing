import { readJsonCached } from "./fs";
import type {
  DeviceTemplate,
  OpcDataset,
  RoutingDefinition,
} from "@/lib/types/process";

export const getOpcDataset = () =>
  readJsonCached<OpcDataset>("process/opc.json");

export const getDeviceTemplates = () =>
  readJsonCached<DeviceTemplate[]>("process/templates.json");

export const getRoutingDefinitions = () =>
  readJsonCached<RoutingDefinition[]>("process/routing.json");

