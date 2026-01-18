/**
 * Renderer process API for tray module
 * Usage in renderer process:
 *
 * import * as tray from 'electron-main-bridge/renderer/tray';
 * await tray.setToolTip('My Application');
 */

import type { DisplayBalloonOptions, SetTitleOptions, TrayBounds } from "@shared/tray.types.js";
import type { MenuItemConstructorOptions } from "@shared/menu.types.js";

/**
 * Destroy the tray icon
 */
export async function destroy(): Promise<void> {
  await window.rpc.call("tray.destroy");
}

/**
 * Set the tray icon image
 */
export async function setImage(image: string): Promise<void> {
  await window.rpc.call("tray.setImage", image);
}

/**
 * Set the pressed image (macOS)
 */
export async function setPressedImage(image: string): Promise<void> {
  await window.rpc.call("tray.setPressedImage", image);
}

/**
 * Set the hover tooltip
 */
export async function setToolTip(toolTip: string): Promise<void> {
  await window.rpc.call("tray.setToolTip", toolTip);
}

/**
 * Set the title (macOS)
 */
export async function setTitle(title: string, options?: SetTitleOptions): Promise<void> {
  await window.rpc.call("tray.setTitle", title, options);
}

/**
 * Get the title (macOS)
 */
export async function getTitle(): Promise<string> {
  return (await window.rpc.call("tray.getTitle")) as string;
}

/**
 * Set whether to ignore double click events (macOS)
 */
export async function setIgnoreDoubleClickEvents(ignore: boolean): Promise<void> {
  await window.rpc.call("tray.setIgnoreDoubleClickEvents", ignore);
}

/**
 * Get whether double click events are ignored (macOS)
 */
export async function getIgnoreDoubleClickEvents(): Promise<boolean> {
  return (await window.rpc.call("tray.getIgnoreDoubleClickEvents")) as boolean;
}

/**
 * Set the context menu
 */
export async function setContextMenu(template: MenuItemConstructorOptions[] | null): Promise<void> {
  await window.rpc.call("tray.setContextMenu", template);
}

/**
 * Display a balloon notification (Windows)
 */
export async function displayBalloon(options: DisplayBalloonOptions): Promise<void> {
  await window.rpc.call("tray.displayBalloon", options);
}

/**
 * Remove a balloon notification (Windows)
 */
export async function removeBalloon(): Promise<void> {
  await window.rpc.call("tray.removeBalloon");
}

/**
 * Focus the notification area (Windows)
 */
export async function focus(): Promise<void> {
  await window.rpc.call("tray.focus");
}

/**
 * Get the bounds of the tray icon (macOS, Windows)
 */
export async function getBounds(): Promise<TrayBounds> {
  return (await window.rpc.call("tray.getBounds")) as TrayBounds;
}

/**
 * Get the GUID (macOS, Windows)
 */
export async function getGUID(): Promise<string | null> {
  return (await window.rpc.call("tray.getGUID")) as string | null;
}

/**
 * Check if the tray icon is destroyed
 */
export async function isDestroyed(): Promise<boolean> {
  return (await window.rpc.call("tray.isDestroyed")) as boolean;
}
