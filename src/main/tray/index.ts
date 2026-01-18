/**
 * Main process handlers for tray module
 * Usage in Electron main process:
 *
 * import { app, Tray } from 'electron';
 * import { RpcServer } from 'electron-json-rpc/main';
 * import { registerTrayModule } from 'electron-main-bridge/main';
 *
 * const rpc = new RpcServer();
 * app.whenReady().then(() => {
 *   const tray = new Tray('/path/to/icon.png');
 *   registerTrayModule(rpc, tray);
 *   rpc.listen();
 * });
 */

import { Menu } from "electron";
import type { Tray } from "electron";
import type { RpcServer } from "electron-json-rpc/main";
import type { DisplayBalloonOptions, SetTitleOptions } from "@shared/tray.types.js";
import type { MenuItemConstructorOptions } from "@shared/menu.types.js";

let trayInstance: Tray | null = null;
let rpcInstance: RpcServer | null = null;

const RPC_METHOD_PREFIX = "tray";

function setupTrayEvents(tray: Tray): void {
  tray.on("click", (_event, bounds, position) => {
    rpcInstance?.publish("tray.click", { bounds, position });
  });
  tray.on("right-click", (_event, bounds) => {
    rpcInstance?.publish("tray.right-click", { bounds });
  });
  tray.on("double-click", (_event, bounds) => {
    rpcInstance?.publish("tray.double-click", { bounds });
  });
  tray.on("middle-click", (_event, bounds) => {
    rpcInstance?.publish("tray.middle-click", { bounds });
  });
  tray.on("mouse-up", (_event, position) => {
    rpcInstance?.publish("tray.mouse-up", { position });
  });
  tray.on("mouse-down", (_event, position) => {
    rpcInstance?.publish("tray.mouse-down", { position });
  });
  tray.on("mouse-enter", (_event, position) => {
    rpcInstance?.publish("tray.mouse-enter", { position });
  });
  tray.on("mouse-leave", (_event, position) => {
    rpcInstance?.publish("tray.mouse-leave", { position });
  });
  tray.on("mouse-move", (_event, position) => {
    rpcInstance?.publish("tray.mouse-move", { position });
  });
  tray.on("balloon-show", () => {
    rpcInstance?.publish("tray.balloon-show");
  });
  tray.on("balloon-click", () => {
    rpcInstance?.publish("tray.balloon-click");
  });
  tray.on("balloon-closed", () => {
    rpcInstance?.publish("tray.balloon-closed");
  });
}

// Handler functions
async function destroyHandler(): Promise<void> {
  if (!trayInstance) throw new Error("Tray instance not provided");
  trayInstance.destroy();
}

async function setImageHandler(...params: unknown[]): Promise<void> {
  const [image] = params as [string];
  if (!trayInstance) throw new Error("Tray instance not provided");
  trayInstance.setImage(image);
}

async function setPressedImageHandler(...params: unknown[]): Promise<void> {
  const [image] = params as [string];
  if (!trayInstance) throw new Error("Tray instance not provided");
  trayInstance.setPressedImage(image);
}

async function setToolTipHandler(...params: unknown[]): Promise<void> {
  const [toolTip] = params as [string];
  if (!trayInstance) throw new Error("Tray instance not provided");
  trayInstance.setToolTip(toolTip);
}

async function setTitleHandler(...params: unknown[]): Promise<void> {
  const [title, options] = params as [string, SetTitleOptions?];
  if (!trayInstance) throw new Error("Tray instance not provided");
  trayInstance.setTitle(title, options as any);
}

async function getTitleHandler(): Promise<string> {
  if (!trayInstance) throw new Error("Tray instance not provided");
  return trayInstance.getTitle();
}

async function setIgnoreDoubleClickEventsHandler(...params: unknown[]): Promise<void> {
  const [ignore] = params as [boolean];
  if (!trayInstance) throw new Error("Tray instance not provided");
  trayInstance.setIgnoreDoubleClickEvents(ignore);
}

async function getIgnoreDoubleClickEventsHandler(): Promise<boolean> {
  if (!trayInstance) throw new Error("Tray instance not provided");
  return trayInstance.getIgnoreDoubleClickEvents();
}

async function setContextMenuHandler(...params: unknown[]): Promise<void> {
  const [template] = params as [MenuItemConstructorOptions[] | null];
  if (!trayInstance) throw new Error("Tray instance not provided");
  if (!template) {
    trayInstance.setContextMenu(null);
    return;
  }
  const menu = Menu.buildFromTemplate(template as Electron.MenuItemConstructorOptions[]);
  trayInstance.setContextMenu(menu);
}

async function displayBalloonHandler(...params: unknown[]): Promise<void> {
  const [options] = params as [DisplayBalloonOptions];
  if (!trayInstance) throw new Error("Tray instance not provided");
  trayInstance.displayBalloon(options as any);
}

async function removeBalloonHandler(): Promise<void> {
  if (!trayInstance) throw new Error("Tray instance not provided");
  trayInstance.removeBalloon();
}

async function focusHandler(): Promise<void> {
  if (!trayInstance) throw new Error("Tray instance not provided");
  trayInstance.focus();
}

async function getBoundsHandler() {
  if (!trayInstance) throw new Error("Tray instance not provided");
  return trayInstance.getBounds();
}

async function getGUIDHandler(): Promise<string | null> {
  if (!trayInstance) throw new Error("Tray instance not provided");
  return (trayInstance as any).getGUID();
}

async function isDestroyedHandler(): Promise<boolean> {
  if (!trayInstance) throw new Error("Tray instance not provided");
  return trayInstance.isDestroyed();
}

/**
 * Register tray module RPC handlers
 * @param rpc - RPC server instance
 * @param tray - Tray instance to manage
 */
export function registerTrayModule(rpc: RpcServer, tray: Tray): void {
  rpcInstance = rpc;
  trayInstance = tray;
  setupTrayEvents(tray);

  rpc.register(`${RPC_METHOD_PREFIX}.destroy`, destroyHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setImage`, setImageHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setPressedImage`, setPressedImageHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setToolTip`, setToolTipHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setTitle`, setTitleHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getTitle`, getTitleHandler);
  rpc.register(
    `${RPC_METHOD_PREFIX}.setIgnoreDoubleClickEvents`,
    setIgnoreDoubleClickEventsHandler,
  );
  rpc.register(
    `${RPC_METHOD_PREFIX}.getIgnoreDoubleClickEvents`,
    getIgnoreDoubleClickEventsHandler,
  );
  rpc.register(`${RPC_METHOD_PREFIX}.setContextMenu`, setContextMenuHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.displayBalloon`, displayBalloonHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.removeBalloon`, removeBalloonHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.focus`, focusHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getBounds`, getBoundsHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getGUID`, getGUIDHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isDestroyed`, isDestroyedHandler);
}

// Re-export handlers for testing
export {
  destroyHandler,
  setImageHandler,
  setPressedImageHandler,
  setToolTipHandler,
  setTitleHandler,
  getTitleHandler,
  setIgnoreDoubleClickEventsHandler,
  getIgnoreDoubleClickEventsHandler,
  setContextMenuHandler,
  displayBalloonHandler,
  removeBalloonHandler,
  focusHandler,
  getBoundsHandler,
  getGUIDHandler,
  isDestroyedHandler,
};
