/**
 * Main process handlers for shareMenu module (macOS only)
 * Provides access to the system share sheet for sharing content
 */

import { ShareMenu, BrowserWindow } from "electron";
import type { RpcServer } from "electron-json-rpc/main";
import type { PopupOptions, SharingItem } from "@shared/share-menu.types.js";

const RPC_METHOD_PREFIX = "shareMenu";

// Store active ShareMenu instances for each window
const activeMenus = new Map<number, ShareMenu>();

/**
 * Create a ShareMenu instance and pop it up
 */
export async function popupHandler(...params: unknown[]): Promise<void> {
  const [sharingItem, options] = params as [SharingItem, PopupOptions?];

  // Get the target browser window
  let browserWindow: BrowserWindow | undefined;
  if (options?.browserWindow) {
    const windows = BrowserWindow.getAllWindows();
    browserWindow = windows.find((w) => w.id === options.browserWindow);
  } else {
    browserWindow = BrowserWindow.getFocusedWindow() ?? undefined;
  }

  // Create the ShareMenu
  const shareMenu = new ShareMenu(sharingItem);

  // Build popup options
  const popupOptions: Record<string, unknown> = {};
  if (browserWindow) {
    popupOptions["window"] = browserWindow;
  }
  if (options?.x !== undefined && options?.y !== undefined) {
    popupOptions["x"] = options.x;
    popupOptions["y"] = options.y;
  }
  if (options?.positioningItem !== undefined) {
    popupOptions["positioningItem"] = options.positioningItem;
  }

  // Store the menu instance for later closePopup calls
  if (browserWindow) {
    activeMenus.set(browserWindow.id, shareMenu);
  }

  // Pop up the menu
  shareMenu.popup(popupOptions);
}

/**
 * Close the share menu popup for a window
 */
export async function closePopupHandler(...params: unknown[]): Promise<void> {
  const [windowId] = params as [number?];

  if (windowId !== undefined) {
    const windows = BrowserWindow.getAllWindows();
    const browserWindow = windows.find((w) => w.id === windowId);
    if (browserWindow) {
      const menu = activeMenus.get(browserWindow.id);
      if (menu) {
        menu.closePopup(browserWindow);
        activeMenus.delete(browserWindow.id);
      }
    }
  } else {
    // Close all active menus
    for (const [id, menu] of activeMenus) {
      const windows = BrowserWindow.getAllWindows();
      const browserWindow = windows.find((w) => w.id === id);
      if (browserWindow) {
        menu.closePopup(browserWindow);
      }
    }
    activeMenus.clear();
  }
}

/**
 * Register all shareMenu module RPC handlers
 */
export function registerShareMenuModule(rpc: RpcServer): void {
  rpc.register(`${RPC_METHOD_PREFIX}.popup`, popupHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.closePopup`, closePopupHandler);
}
