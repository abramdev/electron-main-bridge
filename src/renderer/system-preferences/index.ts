/**
 * Renderer process API for systemPreferences module
 * Usage in renderer process:
 *
 * import * as systemPreferences from 'electron-main-bridge/renderer/system-preferences';
 * const accentColor = await systemPreferences.getAccentColor();
 */

import type {
  AnimationSettings,
  EffectiveAppearance,
  MacOsColor,
  MacOsSystemColor,
  MediaAccessType,
  MediaAccessStatus,
  NotificationEventData,
  SystemPreferencesEventCallbacks,
  UserDefaultType,
  UserDefaultTypes,
  WindowsColor,
} from "@shared/system-preferences.types.js";

// ============================================================================
// Swipe Tracking (macOS)
// ============================================================================

/**
 * Whether swipe tracking is enabled from scroll events (macOS)
 */
export async function isSwipeTrackingFromScrollEventsEnabled(): Promise<boolean> {
  return (await window.rpc.call(
    "systemPreferences.isSwipeTrackingFromScrollEventsEnabled",
  )) as boolean;
}

// ============================================================================
// Notification Posting (macOS)
// ============================================================================

/**
 * Post a macOS notification with `NSUserNotificationCenter` (macOS)
 */
export async function postNotification(
  event: string,
  userInfo?: Record<string, unknown>,
  deliverImmediately?: boolean,
): Promise<void> {
  await window.rpc.call("systemPreferences.postNotification", event, userInfo, deliverImmediately);
}

/**
 * Post a macOS local notification with `NSUserNotificationCenter` (macOS)
 */
export async function postLocalNotification(
  event: string,
  userInfo?: Record<string, unknown>,
): Promise<void> {
  await window.rpc.call("systemPreferences.postLocalNotification", event, userInfo);
}

/**
 * Post a macOS workspace notification with `NSDistributedNotificationCenter` (macOS)
 */
export async function postWorkspaceNotification(
  event: string,
  userInfo?: Record<string, unknown>,
): Promise<void> {
  await window.rpc.call("systemPreferences.postWorkspaceNotification", event, userInfo);
}

// ============================================================================
// Notification Subscription (macOS)
// ============================================================================

/**
 * Subscribe to macOS notifications with `NSUserNotificationCenter` (macOS)
 * Returns a subscription ID that can be used to unsubscribe
 */
export async function subscribeNotification(event: string | null): Promise<number> {
  return (await window.rpc.call("systemPreferences.subscribeNotification", event)) as number;
}

/**
 * Subscribe to macOS local notifications with `NSUserNotificationCenter` (macOS)
 */
export async function subscribeLocalNotification(event: string | null): Promise<number> {
  return (await window.rpc.call("systemPreferences.subscribeLocalNotification", event)) as number;
}

/**
 * Subscribe to macOS workspace notifications with `NSDistributedNotificationCenter` (macOS)
 */
export async function subscribeWorkspaceNotification(event: string | null): Promise<number> {
  return (await window.rpc.call(
    "systemPreferences.subscribeWorkspaceNotification",
    event,
  )) as number;
}

/**
 * Unsubscribe from a macOS notification (macOS)
 */
export async function unsubscribeNotification(id: number): Promise<void> {
  await window.rpc.call("systemPreferences.unsubscribeNotification", id);
}

/**
 * Unsubscribe from a macOS local notification (macOS)
 */
export async function unsubscribeLocalNotification(id: number): Promise<void> {
  await window.rpc.call("systemPreferences.unsubscribeLocalNotification", id);
}

/**
 * Unsubscribe from a macOS workspace notification (macOS)
 */
export async function unsubscribeWorkspaceNotification(id: number): Promise<void> {
  await window.rpc.call("systemPreferences.unsubscribeWorkspaceNotification", id);
}

// ============================================================================
// NSUserDefaults (macOS)
// ============================================================================

/**
 * Register default values for macOS user defaults (macOS)
 */
export async function registerDefaults(
  defaults: Record<string, string | boolean | number | Record<string, unknown>>,
): Promise<void> {
  await window.rpc.call("systemPreferences.registerDefaults", defaults);
}

/**
 * Get a value from macOS user defaults (macOS)
 */
export async function getUserDefault<T extends UserDefaultType>(
  key: string,
  type: T,
): Promise<UserDefaultTypes[T]> {
  return (await window.rpc.call(
    "systemPreferences.getUserDefault",
    key,
    type,
  )) as UserDefaultTypes[T];
}

/**
 * Set a value in macOS user defaults (macOS)
 */
export async function setUserDefault<T extends UserDefaultType>(
  key: string,
  type: T,
  value: UserDefaultTypes[T],
): Promise<void> {
  await window.rpc.call("systemPreferences.setUserDefault", key, type, value);
}

/**
 * Remove a value from macOS user defaults (macOS)
 */
export async function removeUserDefault(key: string): Promise<void> {
  await window.rpc.call("systemPreferences.removeUserDefault", key);
}

// ============================================================================
// Color Methods
// ============================================================================

/**
 * Get the system accent color as RGBA hex string
 */
export async function getAccentColor(): Promise<string> {
  return (await window.rpc.call("systemPreferences.getAccentColor")) as string;
}

/**
 * Get a system color value (Windows, macOS)
 */
export async function getColor(color: WindowsColor | MacOsColor): Promise<string> {
  return (await window.rpc.call("systemPreferences.getColor", color)) as string;
}

/**
 * Get a macOS system color value (macOS)
 */
export async function getSystemColor(color: MacOsSystemColor): Promise<string> {
  return (await window.rpc.call("systemPreferences.getSystemColor", color)) as string;
}

/**
 * Get the effective appearance (dark/light/unknown) (macOS)
 */
export async function getEffectiveAppearance(): Promise<EffectiveAppearance> {
  return (await window.rpc.call("systemPreferences.getEffectiveAppearance")) as EffectiveAppearance;
}

// ============================================================================
// Touch ID (macOS)
// ============================================================================

/**
 * Check if Touch ID authentication is available (macOS)
 */
export async function canPromptTouchID(): Promise<boolean> {
  return (await window.rpc.call("systemPreferences.canPromptTouchID")) as boolean;
}

/**
 * Prompt for Touch ID authentication (macOS)
 */
export async function promptTouchID(reason: string): Promise<void> {
  await window.rpc.call("systemPreferences.promptTouchID", reason);
}

// ============================================================================
// Accessibility (macOS)
// ============================================================================

/**
 * Check if the app is a trusted accessibility client (macOS)
 */
export async function isTrustedAccessibilityClient(prompt = false): Promise<boolean> {
  return (await window.rpc.call(
    "systemPreferences.isTrustedAccessibilityClient",
    prompt,
  )) as boolean;
}

// ============================================================================
// Media Access (Windows, macOS)
// ============================================================================

/**
 * Get the current media access status (Windows, macOS)
 */
export async function getMediaAccessStatus(mediaType: MediaAccessType): Promise<MediaAccessStatus> {
  return (await window.rpc.call(
    "systemPreferences.getMediaAccessStatus",
    mediaType,
  )) as MediaAccessStatus;
}

/**
 * Ask for media access permission (macOS)
 */
export async function askForMediaAccess(
  mediaType: Exclude<MediaAccessType, "screen">,
): Promise<boolean> {
  return (await window.rpc.call("systemPreferences.askForMediaAccess", mediaType)) as boolean;
}

// ============================================================================
// Animation Settings
// ============================================================================

/**
 * Get the current animation settings
 */
export async function getAnimationSettings(): Promise<AnimationSettings> {
  return (await window.rpc.call("systemPreferences.getAnimationSettings")) as AnimationSettings;
}

// ============================================================================
// Event Listeners
// ============================================================================

/**
 * Listen for systemPreferences events
 */
export function on<K extends keyof SystemPreferencesEventCallbacks>(
  event: K,
  callback: SystemPreferencesEventCallbacks[K],
): () => void {
  return window.rpc.on(`systemPreferences.${event}`, callback as (...args: unknown[]) => void);
}

/**
 * Listen for a systemPreferences event once
 */
export function once<K extends keyof SystemPreferencesEventCallbacks>(
  event: K,
  callback: SystemPreferencesEventCallbacks[K],
): void {
  window.rpc.once(`systemPreferences.${event}`, callback as (...args: unknown[]) => void);
}

/**
 * Remove a systemPreferences event listener
 */
export function off<K extends keyof SystemPreferencesEventCallbacks>(
  event: K,
  callback?: SystemPreferencesEventCallbacks[K],
): void {
  window.rpc.off(
    `systemPreferences.${event}`,
    callback as ((...args: unknown[]) => void) | undefined,
  );
}

// ============================================================================
// macOS Notification Events (dynamic)
// ============================================================================

/**
 * Listen for macOS notification events (macOS)
 */
export function onNotification(callback: (data: NotificationEventData) => void): () => void {
  return window.rpc.on("systemPreferences.notification", callback as (...args: unknown[]) => void);
}

/**
 * Listen for macOS local notification events (macOS)
 */
export function onLocalNotification(callback: (data: NotificationEventData) => void): () => void {
  return window.rpc.on(
    "systemPreferences.local-notification",
    callback as (...args: unknown[]) => void,
  );
}

/**
 * Listen for macOS workspace notification events (macOS)
 */
export function onWorkspaceNotification(
  callback: (data: NotificationEventData) => void,
): () => void {
  return window.rpc.on(
    "systemPreferences.workspace-notification",
    callback as (...args: unknown[]) => void,
  );
}
