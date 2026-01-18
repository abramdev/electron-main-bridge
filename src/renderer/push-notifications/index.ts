/**
 * Renderer process API for pushNotifications module (macOS only)
 * Usage in renderer process:
 *
 * import * as pushNotifications from 'electron-main-bridge/renderer/pushNotifications';
 * const token = await pushNotifications.registerForAPNSNotifications();
 * pushNotifications.on('received-apns-notification', (userInfo) => {
 *   console.log('Received notification:', userInfo);
 * });
 */

import type {
  ApnsUserInfo,
  PushNotificationsEventCallbacks,
} from "@shared/push-notifications.types.js";

/**
 * Register for Apple Push Notification service (APNS) notifications
 * @returns The APNS device token
 */
export async function registerForAPNSNotifications(): Promise<string> {
  return (await window.rpc.call("pushNotifications.registerForAPNSNotifications")) as string;
}

/**
 * Unregister from APNS notifications
 */
export async function unregisterForAPNSNotifications(): Promise<void> {
  await window.rpc.call("pushNotifications.unregisterForAPNSNotifications");
}

/**
 * Event callbacks for pushNotifications module
 */
export interface PushNotificationsEventCallbacksExtended extends PushNotificationsEventCallbacks {
  "received-apns-notification": (userInfo: ApnsUserInfo) => void;
}

/**
 * Register a callback for a pushNotifications event
 * @returns A function that removes the listener
 */
export function on<K extends keyof PushNotificationsEventCallbacksExtended>(
  event: K,
  callback: PushNotificationsEventCallbacksExtended[K],
): () => void {
  return window.rpc.on(`pushNotifications.${event}`, callback as (...args: unknown[]) => void);
}

/**
 * Register a one-time callback for a pushNotifications event
 */
export function once<K extends keyof PushNotificationsEventCallbacksExtended>(
  event: K,
  callback: PushNotificationsEventCallbacksExtended[K],
): void {
  window.rpc.once(`pushNotifications.${event}`, callback as (...args: unknown[]) => void);
}

/**
 * Remove a callback for a pushNotifications event
 */
export function off<K extends keyof PushNotificationsEventCallbacksExtended>(
  event: K,
  callback?: PushNotificationsEventCallbacksExtended[K],
): void {
  window.rpc.off(
    `pushNotifications.${event}`,
    callback as ((...args: unknown[]) => void) | undefined,
  );
}
