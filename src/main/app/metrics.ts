/**
 * Process metrics handlers
 */

import { app } from "electron";
import type { ProcessMetric } from "@shared/app.types.js";

export async function getAppMetricsHandler(): Promise<ProcessMetric[]> {
  return app.getAppMetrics() as unknown as ProcessMetric[];
}
