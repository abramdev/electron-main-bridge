/**
 * Main process handlers for powerMonitor module
 * Includes RPC method registration and event forwarding to renderer
 */

import { powerMonitor } from "electron";
import type { RpcServer } from "electron-json-rpc/main";

const RPC_METHOD_PREFIX = "powerMonitor";

export async function getSystemIdleStateHandler(
  ...params: unknown[]
): Promise<import("@shared/power-monitor.types.js").SystemIdleState> {
  const [idleThreshold] = params as [number];
  return powerMonitor.getSystemIdleState(idleThreshold);
}

export async function getSystemIdleTimeHandler(): Promise<number> {
  return powerMonitor.getSystemIdleTime();
}

export async function getCurrentThermalStateHandler(): Promise<
  import("@shared/power-monitor.types.js").ThermalState
> {
  return powerMonitor.getCurrentThermalState();
}

export async function isOnBatteryPowerHandler(): Promise<boolean> {
  return powerMonitor.isOnBatteryPower();
}

/**
 * Register all powerMonitor module RPC handlers and set up event forwarding
 */
export function registerPowerMonitorModule(rpc: RpcServer): void {
  rpc.register(`${RPC_METHOD_PREFIX}.getSystemIdleState`, getSystemIdleStateHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getSystemIdleTime`, getSystemIdleTimeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getCurrentThermalState`, getCurrentThermalStateHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isOnBatteryPower`, isOnBatteryPowerHandler);

  powerMonitor.on("suspend", () => {
    rpc.publish("powerMonitor.suspend");
  });

  powerMonitor.on("resume", () => {
    rpc.publish("powerMonitor.resume");
  });

  powerMonitor.on("on-ac", () => {
    rpc.publish("powerMonitor.on-ac");
  });

  powerMonitor.on("on-battery", () => {
    rpc.publish("powerMonitor.on-battery");
  });

  (powerMonitor as any).on("thermal-state-change", (_event: unknown, state: string) => {
    rpc.publish("powerMonitor.thermal-state-change", { state });
  });

  (powerMonitor as any).on("speed-limit-change", (_event: unknown, limit: number) => {
    rpc.publish("powerMonitor.speed-limit-change", { limit });
  });

  powerMonitor.on("shutdown", () => {
    rpc.publish("powerMonitor.shutdown");
  });

  powerMonitor.on("lock-screen", () => {
    rpc.publish("powerMonitor.lock-screen");
  });

  powerMonitor.on("unlock-screen", () => {
    rpc.publish("powerMonitor.unlock-screen");
  });

  powerMonitor.on("user-did-become-active", () => {
    rpc.publish("powerMonitor.user-did-become-active");
  });

  powerMonitor.on("user-did-resign-active", () => {
    rpc.publish("powerMonitor.user-did-resign-active");
  });
}
