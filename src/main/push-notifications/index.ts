/**
 * Main process handlers for pushNotifications module (macOS only)
 * Includes RPC method registration and event forwarding to renderer
 */

import { pushNotifications } from "electron";
import type { RpcServer } from "electron-json-rpc/main";

const RPC_METHOD_PREFIX = "pushNotifications";

/**
 * Register for Apple Push Notification service (APNS) notifications
 * Returns the APNS device token on successful registration
 */
export async function registerForAPNSNotificationsHandler(): Promise<string> {
  return pushNotifications.registerForAPNSNotifications();
}

/**
 * Unregister from APNS notifications
 */
export async function unregisterForAPNSNotificationsHandler(): Promise<void> {
  return pushNotifications.unregisterForAPNSNotifications();
}

/**
 * Register all pushNotifications module RPC handlers and set up event forwarding
 */
export function registerPushNotificationsModule(rpc: RpcServer): void {
  rpc.register(
    `${RPC_METHOD_PREFIX}.registerForAPNSNotifications`,
    registerForAPNSNotificationsHandler,
  );
  rpc.register(
    `${RPC_METHOD_PREFIX}.unregisterForAPNSNotifications`,
    unregisterForAPNSNotificationsHandler,
  );

  // Forward APNS notifications to renderer
  pushNotifications.on("received-apns-notification", (_event, userInfo) => {
    rpc.publish("pushNotifications.received-apns-notification", userInfo);
  });
}
