/**
 * Main process handlers for powerSaveBlocker module
 * Includes RPC method registration
 */

import { powerSaveBlocker } from "electron";
import type { RpcServer } from "electron-json-rpc/main";

const RPC_METHOD_PREFIX = "powerSaveBlocker";

export async function startHandler(...params: unknown[]): Promise<number> {
  const [type] = params as [import("@shared/power-save-blocker.types.js").PowerSaveBlockerType];
  return powerSaveBlocker.start(type);
}

export async function stopHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return powerSaveBlocker.stop(id);
}

export async function isStartedHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return powerSaveBlocker.isStarted(id);
}

/**
 * Register all powerSaveBlocker module RPC handlers
 */
export function registerPowerSaveBlockerModule(rpc: RpcServer): void {
  rpc.register(`${RPC_METHOD_PREFIX}.start`, startHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.stop`, stopHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isStarted`, isStartedHandler);
}
