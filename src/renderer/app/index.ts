/**
 * Renderer process API for app module
 * Usage in renderer process:
 *
 * import * as app from 'electron-main-bridge/renderer/app';
 * const version = await app.getVersion();
 */

import type {
  AboutPanelOptions,
  AppPathName,
  FocusOptions,
  GetFileIconOptions,
  GPUFeatureStatus,
  LoginItemSettings,
  LoginItemSettingsOptions,
  ProcessMetric,
  SerializedNativeImage,
  SetLoginItemSettingsOptions,
} from "@shared/app.types.js";

// ============================================================================
// App Information
// ============================================================================

export async function getName(): Promise<string> {
  return (await window.rpc.call("app.getName")) as string;
}

export async function setName(name: string): Promise<void> {
  await window.rpc.call("app.setName", name);
}

export async function getVersion(): Promise<string> {
  return (await window.rpc.call("app.getVersion")) as string;
}

export async function getAppPath(): Promise<string> {
  return (await window.rpc.call("app.getAppPath")) as string;
}

export async function getLocale(): Promise<string> {
  return (await window.rpc.call("app.getLocale")) as string;
}

export async function getSystemLocale(): Promise<string> {
  return (await window.rpc.call("app.getSystemLocale")) as string;
}

export async function getPreferredSystemLanguages(): Promise<string[]> {
  return (await window.rpc.call("app.getPreferredSystemLanguages")) as string[];
}

export async function getLocaleCountryCode(): Promise<string> {
  return (await window.rpc.call("app.getLocaleCountryCode")) as string;
}

export async function isReady(): Promise<boolean> {
  return (await window.rpc.call("app.isReady")) as boolean;
}

// ============================================================================
// Path Management
// ============================================================================

export async function getPath(name: AppPathName): Promise<string> {
  return (await window.rpc.call("app.getPath", name)) as string;
}

export async function setPath(name: AppPathName, path: string): Promise<void> {
  await window.rpc.call("app.setPath", name, path);
}

export async function setAppLogsPath(path?: string): Promise<void> {
  await window.rpc.call("app.setAppLogsPath", path);
}

// ============================================================================
// App Control
// ============================================================================

export async function quit(): Promise<void> {
  await window.rpc.call("app.quit");
}

export async function exit(exitCode?: number): Promise<void> {
  await window.rpc.call("app.exit", exitCode);
}

export async function relaunch(
  options?: import("@shared/app.types.js").RelaunchOptions,
): Promise<void> {
  await window.rpc.call("app.relaunch", options);
}

export async function focus(options?: FocusOptions): Promise<void> {
  await window.rpc.call("app.focus", options);
}

export async function hide(): Promise<void> {
  await window.rpc.call("app.hide");
}

export async function show(): Promise<void> {
  await window.rpc.call("app.show");
}

// ============================================================================
// Recent Documents
// ============================================================================

export async function addRecentDocument(path: string): Promise<void> {
  await window.rpc.call("app.addRecentDocument", path);
}

export async function clearRecentDocuments(): Promise<void> {
  await window.rpc.call("app.clearRecentDocuments");
}

export async function getRecentDocuments(): Promise<string[]> {
  return (await window.rpc.call("app.getRecentDocuments")) as string[];
}

// ============================================================================
// Protocol Handling
// ============================================================================

export async function setAsDefaultProtocolClient(
  protocol: string,
  path?: string,
  args?: string[],
): Promise<boolean> {
  return (await window.rpc.call("app.setAsDefaultProtocolClient", protocol, path, args)) as boolean;
}

export async function removeAsDefaultProtocolClient(
  protocol: string,
  path?: string,
  args?: string[],
): Promise<boolean> {
  return (await window.rpc.call(
    "app.removeAsDefaultProtocolClient",
    protocol,
    path,
    args,
  )) as boolean;
}

export async function isDefaultProtocolClient(
  protocol: string,
  path?: string,
  args?: string[],
): Promise<boolean> {
  return (await window.rpc.call("app.isDefaultProtocolClient", protocol, path, args)) as boolean;
}

// ============================================================================
// Single Instance Lock
// ============================================================================

export async function requestSingleInstanceLock(additionalData?: unknown): Promise<boolean> {
  return (await window.rpc.call("app.requestSingleInstanceLock", additionalData)) as boolean;
}

export async function hasSingleInstanceLock(): Promise<boolean> {
  return (await window.rpc.call("app.hasSingleInstanceLock")) as boolean;
}

export async function releaseSingleInstanceLock(): Promise<void> {
  await window.rpc.call("app.releaseSingleInstanceLock");
}

// ============================================================================
// Badge Notification
// ============================================================================

export async function setBadgeCount(count: number): Promise<void> {
  await window.rpc.call("app.setBadgeCount", count);
}

export async function getBadgeCount(): Promise<number> {
  return (await window.rpc.call("app.getBadgeCount")) as number;
}

// ============================================================================
// Login Item
// ============================================================================

export async function getLoginItemSettings(
  options?: LoginItemSettingsOptions,
): Promise<LoginItemSettings> {
  return (await window.rpc.call("app.getLoginItemSettings", options)) as LoginItemSettings;
}

export async function setLoginItemSettings(settings: SetLoginItemSettingsOptions): Promise<void> {
  await window.rpc.call("app.setLoginItemSettings", settings);
}

// ============================================================================
// Accessibility
// ============================================================================

export async function isAccessibilitySupportEnabled(): Promise<boolean> {
  return (await window.rpc.call("app.isAccessibilitySupportEnabled")) as boolean;
}

export async function setAccessibilitySupportEnabled(enabled: boolean): Promise<void> {
  await window.rpc.call("app.setAccessibilitySupportEnabled", enabled);
}

// ============================================================================
// About Panel
// ============================================================================

export async function showAboutPanel(): Promise<void> {
  await window.rpc.call("app.showAboutPanel");
}

export async function setAboutPanelOptions(options: AboutPanelOptions): Promise<void> {
  await window.rpc.call("app.setAboutPanelOptions", options);
}

// ============================================================================
// GPU
// ============================================================================

export async function getGPUFeatureStatus(): Promise<GPUFeatureStatus> {
  return (await window.rpc.call("app.getGPUFeatureStatus")) as GPUFeatureStatus;
}

export async function getGPUInfo(infoType: "complete" | "basic"): Promise<unknown> {
  return await window.rpc.call("app.getGPUInfo", infoType);
}

// ============================================================================
// Process Metrics
// ============================================================================

export async function getAppMetrics(): Promise<ProcessMetric[]> {
  return (await window.rpc.call("app.getAppMetrics")) as ProcessMetric[];
}

// ============================================================================
// Emoji Panel
// ============================================================================

export async function isEmojiPanelSupported(): Promise<boolean> {
  return (await window.rpc.call("app.isEmojiPanelSupported")) as boolean;
}

export async function showEmojiPanel(): Promise<void> {
  await window.rpc.call("app.showEmojiPanel");
}

// ============================================================================
// File Icon
// ============================================================================

export async function getFileIcon(
  path: string,
  options?: GetFileIconOptions,
): Promise<SerializedNativeImage> {
  return (await window.rpc.call("app.getFileIcon", path, options)) as SerializedNativeImage;
}

// ============================================================================
// Event Subscription
// ============================================================================

export interface AppEventCallbacks {
  "window-all-closed": () => void;
  quit: (data: { exitCode: number }) => void;
  "browser-window-created": (data: { id: number; title: string }) => void;
  "browser-window-focus": (data: { id: number; title: string }) => void;
  "browser-window-blur": (data: { id: number; title: string }) => void;
  "web-contents-created": (data: { id: number }) => void;
  "open-file": (data: { path: string }) => void;
  "open-url": (data: { url: string }) => void;
  "second-instance": (data: { argv: string[]; workingDirectory: string }) => void;
  "accessibility-support-changed": (data: { enabled: boolean }) => void;
}

/**
 * Subscribe to app events
 * @param event - The event name to subscribe to
 * @param callback - The callback function when the event fires
 * @returns A function to unsubscribe
 */
export function on<K extends keyof AppEventCallbacks>(
  event: K,
  callback: AppEventCallbacks[K],
): () => void {
  return window.rpc.on(`app.${event}`, callback as (...args: unknown[]) => void);
}

/**
 * Subscribe to app event once (auto-unsubscribe after first event)
 * @param event - The event name to subscribe to
 * @param callback - The callback function when the event fires
 */
export function once<K extends keyof AppEventCallbacks>(
  event: K,
  callback: AppEventCallbacks[K],
): void {
  window.rpc.once(`app.${event}`, callback as (...args: unknown[]) => void);
}

/**
 * Unsubscribe from app events
 * @param event - The event name to unsubscribe from
 * @param callback - Optional callback to remove (removes all if not provided)
 */
export function off<K extends keyof AppEventCallbacks>(
  event: K,
  callback?: AppEventCallbacks[K],
): void {
  window.rpc.off(`app.${event}`, callback as ((...args: unknown[]) => void) | undefined);
}
