/**
 * Renderer process API for autoUpdater module
 * Usage in renderer process:
 *
 * import * as autoUpdater from 'electron-main-bridge/renderer/autoUpdater';
 * await autoUpdater.checkForUpdates();
 */

import type {
  AutoUpdaterFeedURLOptions,
  UpdateError,
  UpdateInfo,
} from "@shared/auto-updater.types.js";

// ============================================================================
// Core Methods
// ============================================================================

export async function checkForUpdates(): Promise<void> {
  await window.rpc.call("autoUpdater.checkForUpdates");
}

export async function quitAndInstall(): Promise<void> {
  await window.rpc.call("autoUpdater.quitAndInstall");
}

// ============================================================================
// Configuration Methods
// ============================================================================

export async function setFeedURL(options: AutoUpdaterFeedURLOptions): Promise<void> {
  await window.rpc.call("autoUpdater.setFeedURL", options);
}

export async function getFeedURL(): Promise<string> {
  return (await window.rpc.call("autoUpdater.getFeedURL")) as string;
}

// ============================================================================
// Event Subscription
// ============================================================================

export interface AutoUpdaterEventCallbacks {
  "checking-for-update": () => void;
  "update-available": () => void;
  "update-not-available": () => void;
  "update-downloaded": (info: UpdateInfo) => void;
  error: (error: UpdateError) => void;
  "before-quit-for-update": () => void;
}

/**
 * Subscribe to autoUpdater events
 * @param event - The event name to subscribe to
 * @param callback - The callback function when the event fires
 * @returns A function to unsubscribe
 */
export function on<K extends keyof AutoUpdaterEventCallbacks>(
  event: K,
  callback: AutoUpdaterEventCallbacks[K],
): () => void {
  return window.rpc.on(`autoUpdater.${event}`, callback as (...args: unknown[]) => void);
}

/**
 * Subscribe to autoUpdater event once (auto-unsubscribe after first event)
 * @param event - The event name to subscribe to
 * @param callback - The callback function when the event fires
 */
export function once<K extends keyof AutoUpdaterEventCallbacks>(
  event: K,
  callback: AutoUpdaterEventCallbacks[K],
): void {
  window.rpc.once(`autoUpdater.${event}`, callback as (...args: unknown[]) => void);
}

/**
 * Unsubscribe from autoUpdater events
 * @param event - The event name to unsubscribe from
 * @param callback - Optional callback to remove (removes all if not provided)
 */
export function off<K extends keyof AutoUpdaterEventCallbacks>(
  event: K,
  callback?: AutoUpdaterEventCallbacks[K],
): void {
  window.rpc.off(`autoUpdater.${event}`, callback as ((...args: unknown[]) => void) | undefined);
}
