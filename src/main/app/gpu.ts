/**
 * GPU handlers
 */

import { app } from "electron";
import type { GPUFeatureStatus } from "@shared/app.types.js";

export async function getGPUFeatureStatusHandler(): Promise<GPUFeatureStatus> {
  return app.getGPUFeatureStatus() as GPUFeatureStatus;
}

export async function getGPUInfoHandler(...params: unknown[]): Promise<unknown> {
  const [infoType] = params as ["complete" | "basic"];
  return app.getGPUInfo(infoType);
}
