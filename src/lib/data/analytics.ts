import { readJsonCached } from "./fs";
import type { AnalyticsPayload } from "@/lib/types/analytics";

export const getAnalyticsPayload = () =>
  readJsonCached<AnalyticsPayload>("analytics/kpis.json");

