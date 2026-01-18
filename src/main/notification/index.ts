/**
 * Main process handlers for notification module
 * Usage in Electron main process:
 *
 * import { Notification } from 'electron';
 * import { RpcServer } from 'electron-json-rpc/main';
 * import { registerNotificationModule } from 'electron-main-bridge/main';
 *
 * const rpc = new RpcServer();
 * const notification = new Notification({ title: 'Hello', body: 'World' });
 * registerNotificationModule(rpc, notification);
 * rpc.listen();
 */

import type { Notification } from "electron";
import type { RpcServer } from "electron-json-rpc/main";

let notificationInstance: Notification | null = null;
let rpcInstance: RpcServer | null = null;

const RPC_METHOD_PREFIX = "notification";

function setupNotificationEvents(notification: Notification): void {
  notification.on("show", () => {
    rpcInstance?.publish("notification.show");
  });
  notification.on("click", () => {
    rpcInstance?.publish("notification.click");
  });
  notification.on("close", () => {
    rpcInstance?.publish("notification.close");
  });
  notification.on("reply", (_event, reply) => {
    rpcInstance?.publish("notification.reply", reply);
  });
  notification.on("action", (_event, index) => {
    rpcInstance?.publish("notification.action", index);
  });
  notification.on("failed", (_event, error) => {
    rpcInstance?.publish("notification.failed", error);
  });
}

// Handler functions
async function showHandler(): Promise<void> {
  if (!notificationInstance) throw new Error("Notification instance not provided");
  notificationInstance.show();
}

async function closeHandler(): Promise<void> {
  if (!notificationInstance) throw new Error("Notification instance not provided");
  notificationInstance.close();
}

async function getTitleHandler(): Promise<string | undefined> {
  if (!notificationInstance) throw new Error("Notification instance not provided");
  return notificationInstance.title;
}

async function getSubtitleHandler(): Promise<string | undefined> {
  if (!notificationInstance) throw new Error("Notification instance not provided");
  return notificationInstance.subtitle;
}

async function getBodyHandler(): Promise<string | undefined> {
  if (!notificationInstance) throw new Error("Notification instance not provided");
  return notificationInstance.body;
}

async function getSilentHandler(): Promise<boolean | undefined> {
  if (!notificationInstance) throw new Error("Notification instance not provided");
  return notificationInstance.silent;
}

async function getReplyPlaceholderHandler(): Promise<string | undefined> {
  if (!notificationInstance) throw new Error("Notification instance not provided");
  return notificationInstance.replyPlaceholder;
}

async function getSoundHandler(): Promise<string | undefined> {
  if (!notificationInstance) throw new Error("Notification instance not provided");
  return notificationInstance.sound;
}

async function getCloseButtonTextHandler(): Promise<string | undefined> {
  if (!notificationInstance) throw new Error("Notification instance not provided");
  return notificationInstance.closeButtonText;
}

async function getHasReplyHandler(): Promise<boolean | undefined> {
  if (!notificationInstance) throw new Error("Notification instance not provided");
  return notificationInstance.hasReply;
}

async function getUrgencyHandler(): Promise<string | undefined> {
  if (!notificationInstance) throw new Error("Notification instance not provided");
  return (notificationInstance as any).urgency;
}

async function getTimeoutTypeHandler(): Promise<string | undefined> {
  if (!notificationInstance) throw new Error("Notification instance not provided");
  return (notificationInstance as any).timeoutType;
}

async function getActionsHandler() {
  if (!notificationInstance) throw new Error("Notification instance not provided");
  return (notificationInstance as any).actions;
}

async function getToastXmlHandler(): Promise<string | undefined> {
  if (!notificationInstance) throw new Error("Notification instance not provided");
  return (notificationInstance as any).toastXml;
}

/**
 * Register notification module RPC handlers
 * @param rpc - RPC server instance
 * @param notification - Notification instance to manage
 */
export function registerNotificationModule(rpc: RpcServer, notification: Notification): void {
  rpcInstance = rpc;
  notificationInstance = notification;
  setupNotificationEvents(notification);

  rpc.register(`${RPC_METHOD_PREFIX}.show`, showHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.close`, closeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getTitle`, getTitleHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getSubtitle`, getSubtitleHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getBody`, getBodyHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getSilent`, getSilentHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getReplyPlaceholder`, getReplyPlaceholderHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getSound`, getSoundHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getCloseButtonText`, getCloseButtonTextHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getHasReply`, getHasReplyHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getUrgency`, getUrgencyHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getTimeoutType`, getTimeoutTypeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getActions`, getActionsHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getToastXml`, getToastXmlHandler);
}

// Re-export handlers for testing
export {
  showHandler,
  closeHandler,
  getTitleHandler,
  getSubtitleHandler,
  getBodyHandler,
  getSilentHandler,
  getReplyPlaceholderHandler,
  getSoundHandler,
  getCloseButtonTextHandler,
  getHasReplyHandler,
  getUrgencyHandler,
  getTimeoutTypeHandler,
  getActionsHandler,
  getToastXmlHandler,
};
