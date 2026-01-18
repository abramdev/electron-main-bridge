/**
 * Main process handlers for systemPreferences module
 * Includes RPC method registration and event forwarding to renderer
 */

import { systemPreferences } from "electron";
import type { RpcServer } from "electron-json-rpc/main";
import type {
  AnimationSettings,
  MacOsColor,
  MacOsSystemColor,
  MediaAccessType,
  UserDefaultType,
  UserDefaultTypes,
  WindowsColor,
} from "@shared/system-preferences.types.js";

const RPC_METHOD_PREFIX = "systemPreferences";

// Callback type for macOS notifications
type NotificationCallback = (
  event: string,
  userInfo: Record<string, unknown>,
  object: string,
) => void;

// Subscription management for macOS notifications
// Maps subscription ID to the Electron subscription ID
const notificationSubscriptions = new Map<number, number>();
const localNotificationSubscriptions = new Map<number, number>();
const workspaceNotificationSubscriptions = new Map<number, number>();
let nextSubscriptionId = 1;

// ============================================================================
// Swipe Tracking (macOS)
// ============================================================================

export async function isSwipeTrackingFromScrollEventsEnabledHandler(): Promise<boolean> {
  return systemPreferences.isSwipeTrackingFromScrollEventsEnabled();
}

// ============================================================================
// Notification Posting (macOS)
// ============================================================================

export async function postNotificationHandler(...params: unknown[]): Promise<void> {
  const [event, userInfo, deliverImmediately] = params as [
    string,
    Record<string, unknown>?,
    boolean?,
  ];
  systemPreferences.postNotification(event, userInfo as any, deliverImmediately);
}

export async function postLocalNotificationHandler(...params: unknown[]): Promise<void> {
  const [event, userInfo] = params as [string, Record<string, unknown>?];
  systemPreferences.postLocalNotification(event, userInfo as any);
}

export async function postWorkspaceNotificationHandler(...params: unknown[]): Promise<void> {
  const [event, userInfo] = params as [string, Record<string, unknown>?];
  systemPreferences.postWorkspaceNotification(event, userInfo as any);
}

// ============================================================================
// Notification Subscription (macOS)
// ============================================================================

export async function subscribeNotificationHandler(...params: unknown[]): Promise<number> {
  const [event] = params as [string | null];
  const id = nextSubscriptionId++;
  const callback: NotificationCallback = (ev, userInfo) => {
    rpcInstance?.publish("systemPreferences.notification", { event: ev, userInfo });
  };
  const electronId = systemPreferences.subscribeNotification(event as any, callback);
  notificationSubscriptions.set(id, electronId);
  return id;
}

export async function subscribeLocalNotificationHandler(...params: unknown[]): Promise<number> {
  const [event] = params as [string | null];
  const id = nextSubscriptionId++;
  const callback: NotificationCallback = (ev, userInfo) => {
    rpcInstance?.publish("systemPreferences.local-notification", { event: ev, userInfo });
  };
  const electronId = systemPreferences.subscribeLocalNotification(event as any, callback);
  localNotificationSubscriptions.set(id, electronId);
  return id;
}

export async function subscribeWorkspaceNotificationHandler(...params: unknown[]): Promise<number> {
  const [event] = params as [string | null];
  const id = nextSubscriptionId++;
  const callback: NotificationCallback = (ev, userInfo) => {
    rpcInstance?.publish("systemPreferences.workspace-notification", { event: ev, userInfo });
  };
  const electronId = systemPreferences.subscribeWorkspaceNotification(event as any, callback);
  workspaceNotificationSubscriptions.set(id, electronId);
  return id;
}

export async function unsubscribeNotificationHandler(...params: unknown[]): Promise<void> {
  const [id] = params as [number];
  const electronId = notificationSubscriptions.get(id);
  if (electronId !== undefined) {
    systemPreferences.unsubscribeNotification(electronId);
    notificationSubscriptions.delete(id);
  }
}

export async function unsubscribeLocalNotificationHandler(...params: unknown[]): Promise<void> {
  const [id] = params as [number];
  const electronId = localNotificationSubscriptions.get(id);
  if (electronId !== undefined) {
    systemPreferences.unsubscribeLocalNotification(electronId);
    localNotificationSubscriptions.delete(id);
  }
}

export async function unsubscribeWorkspaceNotificationHandler(...params: unknown[]): Promise<void> {
  const [id] = params as [number];
  const electronId = workspaceNotificationSubscriptions.get(id);
  if (electronId !== undefined) {
    systemPreferences.unsubscribeWorkspaceNotification(electronId);
    workspaceNotificationSubscriptions.delete(id);
  }
}

// ============================================================================
// NSUserDefaults (macOS)
// ============================================================================

export async function registerDefaultsHandler(...params: unknown[]): Promise<void> {
  const [defaults] = params as [
    Record<string, string | boolean | number | Record<string, unknown>>,
  ];
  systemPreferences.registerDefaults(defaults as any);
}

export async function getUserDefaultHandler<T extends UserDefaultType>(
  ...params: unknown[]
): Promise<UserDefaultTypes[T]> {
  const [key, type] = params as [string, T];
  return systemPreferences.getUserDefault(key, type) as UserDefaultTypes[T];
}

export async function setUserDefaultHandler<T extends UserDefaultType>(
  ...params: unknown[]
): Promise<void> {
  const [key, type, value] = params as [string, T, UserDefaultTypes[T]];
  systemPreferences.setUserDefault(key, type, value as any);
}

export async function removeUserDefaultHandler(...params: unknown[]): Promise<void> {
  const [key] = params as [string];
  systemPreferences.removeUserDefault(key);
}

// ============================================================================
// Color Methods
// ============================================================================

export async function getAccentColorHandler(): Promise<string> {
  return systemPreferences.getAccentColor();
}

export async function getColorHandler(...params: unknown[]): Promise<string> {
  const [color] = params as [WindowsColor | MacOsColor];
  return systemPreferences.getColor(color as any);
}

export async function getSystemColorHandler(...params: unknown[]): Promise<string> {
  const [color] = params as [MacOsSystemColor];
  return systemPreferences.getSystemColor(color as any);
}

export async function getEffectiveAppearanceHandler(): Promise<string> {
  return systemPreferences.getEffectiveAppearance();
}

// ============================================================================
// Touch ID (macOS)
// ============================================================================

export async function canPromptTouchIDHandler(): Promise<boolean> {
  return systemPreferences.canPromptTouchID();
}

export async function promptTouchIDHandler(...params: unknown[]): Promise<void> {
  const [reason] = params as [string];
  await systemPreferences.promptTouchID(reason);
}

// ============================================================================
// Accessibility (macOS)
// ============================================================================

export async function isTrustedAccessibilityClientHandler(...params: unknown[]): Promise<boolean> {
  const [prompt] = params as [boolean?];
  return systemPreferences.isTrustedAccessibilityClient(prompt ?? false);
}

// ============================================================================
// Media Access (Windows, macOS)
// ============================================================================

export async function getMediaAccessStatusHandler(...params: unknown[]): Promise<string> {
  const [mediaType] = params as [MediaAccessType];
  return systemPreferences.getMediaAccessStatus(mediaType);
}

export async function askForMediaAccessHandler(...params: unknown[]): Promise<boolean> {
  const [mediaType] = params as [Exclude<MediaAccessType, "screen">];
  return systemPreferences.askForMediaAccess(mediaType);
}

// ============================================================================
// Animation Settings
// ============================================================================

export async function getAnimationSettingsHandler(): Promise<AnimationSettings> {
  return systemPreferences.getAnimationSettings() as AnimationSettings;
}

// ============================================================================
// RPC Instance for event publishing
// ============================================================================

let rpcInstance: RpcServer | null = null;

/**
 * Register all systemPreferences module RPC handlers and set up event forwarding
 */
export function registerSystemPreferencesModule(rpc: RpcServer): void {
  rpcInstance = rpc;

  // Swipe Tracking
  rpc.register(
    `${RPC_METHOD_PREFIX}.isSwipeTrackingFromScrollEventsEnabled`,
    isSwipeTrackingFromScrollEventsEnabledHandler,
  );

  // Notification Posting
  rpc.register(`${RPC_METHOD_PREFIX}.postNotification`, postNotificationHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.postLocalNotification`, postLocalNotificationHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.postWorkspaceNotification`, postWorkspaceNotificationHandler);

  // Notification Subscription
  rpc.register(`${RPC_METHOD_PREFIX}.subscribeNotification`, subscribeNotificationHandler);
  rpc.register(
    `${RPC_METHOD_PREFIX}.subscribeLocalNotification`,
    subscribeLocalNotificationHandler,
  );
  rpc.register(
    `${RPC_METHOD_PREFIX}.subscribeWorkspaceNotification`,
    subscribeWorkspaceNotificationHandler,
  );
  rpc.register(`${RPC_METHOD_PREFIX}.unsubscribeNotification`, unsubscribeNotificationHandler);
  rpc.register(
    `${RPC_METHOD_PREFIX}.unsubscribeLocalNotification`,
    unsubscribeLocalNotificationHandler,
  );
  rpc.register(
    `${RPC_METHOD_PREFIX}.unsubscribeWorkspaceNotification`,
    unsubscribeWorkspaceNotificationHandler,
  );

  // NSUserDefaults
  rpc.register(`${RPC_METHOD_PREFIX}.registerDefaults`, registerDefaultsHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getUserDefault`, getUserDefaultHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setUserDefault`, setUserDefaultHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.removeUserDefault`, removeUserDefaultHandler);

  // Color Methods
  rpc.register(`${RPC_METHOD_PREFIX}.getAccentColor`, getAccentColorHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getColor`, getColorHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getSystemColor`, getSystemColorHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getEffectiveAppearance`, getEffectiveAppearanceHandler);

  // Touch ID
  rpc.register(`${RPC_METHOD_PREFIX}.canPromptTouchID`, canPromptTouchIDHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.promptTouchID`, promptTouchIDHandler);

  // Accessibility
  rpc.register(
    `${RPC_METHOD_PREFIX}.isTrustedAccessibilityClient`,
    isTrustedAccessibilityClientHandler,
  );

  // Media Access
  rpc.register(`${RPC_METHOD_PREFIX}.getMediaAccessStatus`, getMediaAccessStatusHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.askForMediaAccess`, askForMediaAccessHandler);

  // Animation Settings
  rpc.register(`${RPC_METHOD_PREFIX}.getAnimationSettings`, getAnimationSettingsHandler);

  // Event forwarding
  systemPreferences.on("accent-color-changed", (_event, newColor) => {
    rpc.publish("systemPreferences.accent-color-changed", newColor);
  });

  systemPreferences.on("color-changed", () => {
    rpc.publish("systemPreferences.color-changed");
  });
}
