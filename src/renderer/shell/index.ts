/**
 * Renderer process API for shell module
 * Usage in renderer process:
 *
 * import * as shell from 'electron-main-bridge/renderer/shell';
 * await shell.openExternal('https://github.com');
 */

import type {
  OpenExternalOptions,
  ShortcutDetails,
  ShortcutLinkOperation,
} from "@shared/shell.types.js";

/**
 * Open external URL in default browser
 */
export async function openExternal(url: string, options?: OpenExternalOptions): Promise<void> {
  await window.rpc.call("shell.openExternal", url, options);
}

/**
 * Open path with default application
 * Returns empty string on success, or error message on failure
 */
export async function openPath(path: string): Promise<string> {
  return (await window.rpc.call("shell.openPath", path)) as string;
}

/**
 * Show item in folder
 */
export async function showItemInFolder(path: string): Promise<void> {
  await window.rpc.call("shell.showItemInFolder", path);
}

/**
 * Play system beep
 */
export async function beep(): Promise<void> {
  await window.rpc.call("shell.beep");
}

/**
 * Move item to trash
 */
export async function trashItem(path: string): Promise<void> {
  await window.rpc.call("shell.trashItem", path);
}

/**
 * Create or update shortcut link (Windows)
 */
export async function writeShortcutLink(
  shortcutPath: string,
  operation?: ShortcutLinkOperation,
  options?: ShortcutDetails,
): Promise<boolean> {
  return (await window.rpc.call(
    "shell.writeShortcutLink",
    shortcutPath,
    operation,
    options,
  )) as boolean;
}

/**
 * Read shortcut link (Windows)
 */
export async function readShortcutLink(shortcutPath: string): Promise<ShortcutDetails> {
  return (await window.rpc.call("shell.readShortcutLink", shortcutPath)) as ShortcutDetails;
}
