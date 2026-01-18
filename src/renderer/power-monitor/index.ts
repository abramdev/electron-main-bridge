/**
 * Renderer process API for powerMonitor module
 * Usage in renderer process:
 *
 * import * as powerMonitor from 'electron-main-bridge/renderer/powerMonitor';
 * const idleTime = await powerMonitor.getSystemIdleTime();
 */

import type { SystemIdleState, ThermalState } from "@shared/power-monitor.types.js";

export async function getSystemIdleState(idleThreshold: number): Promise<SystemIdleState> {
  return (await window.rpc.call(
    "powerMonitor.getSystemIdleState",
    idleThreshold,
  )) as SystemIdleState;
}

export async function getSystemIdleTime(): Promise<number> {
  return (await window.rpc.call("powerMonitor.getSystemIdleTime")) as number;
}

export async function getCurrentThermalState(): Promise<ThermalState> {
  return (await window.rpc.call("powerMonitor.getCurrentThermalState")) as ThermalState;
}

export async function isOnBatteryPower(): Promise<boolean> {
  return (await window.rpc.call("powerMonitor.isOnBatteryPower")) as boolean;
}

export interface PowerMonitorEventCallbacks {
  suspend: () => void;
  resume: () => void;
  "on-ac": () => void;
  "on-battery": () => void;
  "thermal-state-change": (data: { state: ThermalState }) => void;
  "speed-limit-change": (data: { limit: number }) => void;
  shutdown: () => void;
  "lock-screen": () => void;
  "unlock-screen": () => void;
  "user-did-become-active": () => void;
  "user-did-resign-active": () => void;
}

export function on<K extends keyof PowerMonitorEventCallbacks>(
  event: K,
  callback: PowerMonitorEventCallbacks[K],
): () => void {
  return window.rpc.on(`powerMonitor.${event}`, callback as (...args: unknown[]) => void);
}

export function once<K extends keyof PowerMonitorEventCallbacks>(
  event: K,
  callback: PowerMonitorEventCallbacks[K],
): void {
  window.rpc.once(`powerMonitor.${event}`, callback as (...args: unknown[]) => void);
}

export function off<K extends keyof PowerMonitorEventCallbacks>(
  event: K,
  callback?: PowerMonitorEventCallbacks[K],
): void {
  window.rpc.off(`powerMonitor.${event}`, callback as ((...args: unknown[]) => void) | undefined);
}
