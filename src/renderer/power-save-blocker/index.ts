/**
 * Renderer process API for powerSaveBlocker module
 * Usage in renderer process:
 *
 * import * as powerSaveBlocker from 'electron-main-bridge/renderer/powerSaveBlocker';
 * const id = await powerSaveBlocker.start('prevent-display-sleep');
 * const isStarted = await powerSaveBlocker.isStarted(id);
 * await powerSaveBlocker.stop(id);
 */

import type { PowerSaveBlockerType } from "@shared/power-save-blocker.types.js";

export async function start(type: PowerSaveBlockerType): Promise<number> {
  return (await window.rpc.call("powerSaveBlocker.start", type)) as number;
}

export async function stop(id: number): Promise<boolean> {
  return (await window.rpc.call("powerSaveBlocker.stop", id)) as boolean;
}

export async function isStarted(id: number): Promise<boolean> {
  return (await window.rpc.call("powerSaveBlocker.isStarted", id)) as boolean;
}
