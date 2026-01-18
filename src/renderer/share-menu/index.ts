/**
 * Renderer process API for shareMenu module (macOS only)
 * Usage in renderer process:
 *
 * import * as shareMenu from 'electron-main-bridge/renderer/shareMenu';
 *
 * // Pop up the share sheet
 * await shareMenu.popup({
 *   urls: ['https://example.com']
 * });
 *
 * // Or with options
 * await shareMenu.popup(
 *   { texts: ['Hello, world!'] },
 *   { x: 100, y: 100 }
 * );
 */

import type { PopupOptions, SharingItem } from "@shared/share-menu.types.js";

/**
 * Create a ShareMenu instance and pop it up
 * @param sharingItem The item to share
 * @param options Optional popup configuration
 */
export async function popup(sharingItem: SharingItem, options?: PopupOptions): Promise<void> {
  await window.rpc.call("shareMenu.popup", sharingItem, options);
}

/**
 * Close the share menu popup
 * @param windowId Optional BrowserWindow id. If not provided, closes all active menus
 */
export async function closePopup(windowId?: number): Promise<void> {
  await window.rpc.call("shareMenu.closePopup", windowId);
}
