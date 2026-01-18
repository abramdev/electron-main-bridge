/**
 * Main process handlers for shell module
 */

import { shell } from "electron";
import type { RpcServer } from "electron-json-rpc/main";
import type {
  OpenExternalOptions,
  ShortcutDetails,
  ShortcutLinkOperation,
} from "@shared/shell.types.js";

const RPC_METHOD_PREFIX = "shell";

/**
 * Open external URL in default browser
 */
async function openExternalHandler(...params: unknown[]): Promise<void> {
  const [url, options] = params as [string, OpenExternalOptions?];
  await shell.openExternal(url, options);
}

/**
 * Open path with default application
 */
async function openPathHandler(...params: unknown[]): Promise<string> {
  const [path] = params as [string];
  return await shell.openPath(path);
}

/**
 * Show item in folder
 */
async function showItemInFolderHandler(...params: unknown[]): Promise<void> {
  const [path] = params as [string];
  shell.showItemInFolder(path);
}

/**
 * Play system beep
 */
async function beepHandler(): Promise<void> {
  shell.beep();
}

/**
 * Move item to trash
 */
async function trashItemHandler(...params: unknown[]): Promise<void> {
  const [path] = params as [string];
  await shell.trashItem(path);
}

/**
 * Create or update shortcut link (Windows)
 */
async function writeShortcutLinkHandler(...params: unknown[]): Promise<boolean> {
  const [shortcutPath, operation, options] = params as [
    string,
    ShortcutLinkOperation?,
    ShortcutDetails?,
  ];
  return shell.writeShortcutLink(shortcutPath, operation ?? "create", options as any);
}

/**
 * Read shortcut link (Windows)
 */
async function readShortcutLinkHandler(...params: unknown[]): Promise<ShortcutDetails> {
  const [shortcutPath] = params as [string];
  return shell.readShortcutLink(shortcutPath) as ShortcutDetails;
}

/**
 * Register all shell module RPC handlers
 */
export function registerShellModule(rpc: RpcServer): void {
  rpc.register(`${RPC_METHOD_PREFIX}.openExternal`, openExternalHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.openPath`, openPathHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.showItemInFolder`, showItemInFolderHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.beep`, beepHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.trashItem`, trashItemHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.writeShortcutLink`, writeShortcutLinkHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.readShortcutLink`, readShortcutLinkHandler);
}

// Re-export handlers for testing
export {
  openExternalHandler,
  openPathHandler,
  showItemInFolderHandler,
  beepHandler,
  trashItemHandler,
  writeShortcutLinkHandler,
  readShortcutLinkHandler,
};
