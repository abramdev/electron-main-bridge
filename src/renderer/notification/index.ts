/**
 * Renderer process API for notification module
 * Usage in renderer process:
 *
 * import * as notification from 'electron-main-bridge/renderer/notification';
 * await notification.show();
 */

import type { NotificationAction } from "@shared/notification.types.js";

/**
 * Show the notification
 */
export async function show(): Promise<void> {
  await window.rpc.call("notification.show");
}

/**
 * Close the notification
 */
export async function close(): Promise<void> {
  await window.rpc.call("notification.close");
}

/**
 * Get the title
 */
export async function getTitle(): Promise<string | undefined> {
  return (await window.rpc.call("notification.getTitle")) as string | undefined;
}

/**
 * Get the subtitle (macOS)
 */
export async function getSubtitle(): Promise<string | undefined> {
  return (await window.rpc.call("notification.getSubtitle")) as string | undefined;
}

/**
 * Get the body
 */
export async function getBody(): Promise<string | undefined> {
  return (await window.rpc.call("notification.getBody")) as string | undefined;
}

/**
 * Get whether the notification is silent
 */
export async function getSilent(): Promise<boolean | undefined> {
  return (await window.rpc.call("notification.getSilent")) as boolean | undefined;
}

/**
 * Get the reply placeholder (macOS)
 */
export async function getReplyPlaceholder(): Promise<string | undefined> {
  return (await window.rpc.call("notification.getReplyPlaceholder")) as string | undefined;
}

/**
 * Get the sound (macOS)
 */
export async function getSound(): Promise<string | undefined> {
  return (await window.rpc.call("notification.getSound")) as string | undefined;
}

/**
 * Get the close button text (macOS)
 */
export async function getCloseButtonText(): Promise<string | undefined> {
  return (await window.rpc.call("notification.getCloseButtonText")) as string | undefined;
}

/**
 * Get whether the notification has reply (macOS)
 */
export async function getHasReply(): Promise<boolean | undefined> {
  return (await window.rpc.call("notification.getHasReply")) as boolean | undefined;
}

/**
 * Get the urgency level (Linux)
 */
export async function getUrgency(): Promise<string | undefined> {
  return (await window.rpc.call("notification.getUrgency")) as string | undefined;
}

/**
 * Get the timeout type (Linux, Windows)
 */
export async function getTimeoutType(): Promise<string | undefined> {
  return (await window.rpc.call("notification.getTimeoutType")) as string | undefined;
}

/**
 * Get the actions (macOS)
 */
export async function getActions(): Promise<NotificationAction[]> {
  return (await window.rpc.call("notification.getActions")) as NotificationAction[];
}

/**
 * Get the toast XML (Windows)
 */
export async function getToastXml(): Promise<string | undefined> {
  return (await window.rpc.call("notification.getToastXml")) as string | undefined;
}
