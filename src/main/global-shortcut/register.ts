import { globalShortcut } from "electron";
import type { RpcServer } from "electron-json-rpc/main";

let rpcInstance: RpcServer | null = null;

export function setRpcServer(rpc: RpcServer): void {
  rpcInstance = rpc;
}

const registeredShortcuts = new Map<string, () => void>();

/**
 * Register a single global shortcut
 */
export async function registerHandler(...params: unknown[]): Promise<boolean> {
  const [accelerator] = params as [string];
  const callback = () => {
    if (rpcInstance) {
      rpcInstance.publish("globalShortcut.accelerator", { accelerator });
    }
  };
  const ret = globalShortcut.register(accelerator, callback);
  if (ret) {
    registeredShortcuts.set(accelerator, callback);
  }
  return ret;
}

/**
 * Register multiple global shortcuts
 */
export async function registerAllHandler(...params: unknown[]): Promise<boolean[]> {
  const [accelerators] = params as [string[]];
  const results: boolean[] = [];

  for (const accelerator of accelerators) {
    const callback = () => {
      if (rpcInstance) {
        rpcInstance.publish("globalShortcut.accelerator", { accelerator });
      }
    };
    const ret = globalShortcut.register(accelerator, callback);
    if (ret) {
      registeredShortcuts.set(accelerator, callback);
    }
    results.push(ret);
  }

  return results;
}

/**
 * Check if a shortcut is registered
 */
export async function isRegisteredHandler(...params: unknown[]): Promise<boolean> {
  const [accelerator] = params as [string];
  return globalShortcut.isRegistered(accelerator);
}

/**
 * Unregister a specific shortcut
 */
export async function unregisterHandler(...params: unknown[]): Promise<void> {
  const [accelerator] = params as [string];
  registeredShortcuts.delete(accelerator);
  globalShortcut.unregister(accelerator);
}

/**
 * Unregister all shortcuts
 */
export async function unregisterAllHandler(): Promise<void> {
  registeredShortcuts.clear();
  globalShortcut.unregisterAll();
}
