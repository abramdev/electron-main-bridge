/**
 * Main process handlers for dialog module
 */

import { dialog } from "electron";
import type { RpcServer } from "electron-json-rpc/main";
import type {
  OpenDialogOptions,
  OpenDialogReturnValue,
  SaveDialogOptions,
  SaveDialogReturnValue,
  MessageBoxOptions,
  MessageBoxReturnValue,
} from "@shared/dialog.types.js";

const RPC_METHOD_PREFIX = "dialog";

/**
 * Show open file dialog
 */
async function showOpenDialogHandler(...params: unknown[]): Promise<OpenDialogReturnValue> {
  const [options] = params as [OpenDialogOptions?];
  return (await dialog.showOpenDialog(options as any)) as OpenDialogReturnValue;
}

/**
 * Show save dialog
 */
async function showSaveDialogHandler(...params: unknown[]): Promise<SaveDialogReturnValue> {
  const [options] = params as [SaveDialogOptions?];
  return (await dialog.showSaveDialog(options as any)) as SaveDialogReturnValue;
}

/**
 * Show message box
 */
async function showMessageBoxHandler(...params: unknown[]): Promise<MessageBoxReturnValue> {
  const [options] = params as [MessageBoxOptions?];
  return (await dialog.showMessageBox(options as any)) as MessageBoxReturnValue;
}

/**
 * Show error box (sync method wrapped in async)
 */
async function showErrorBoxHandler(...params: unknown[]): Promise<void> {
  const [title, content] = params as [string, string];
  dialog.showErrorBox(title, content);
  return Promise.resolve();
}

/**
 * Register all dialog module RPC handlers
 */
export function registerDialogModule(rpc: RpcServer): void {
  rpc.register(`${RPC_METHOD_PREFIX}.showOpenDialog`, showOpenDialogHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.showSaveDialog`, showSaveDialogHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.showMessageBox`, showMessageBoxHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.showErrorBox`, showErrorBoxHandler);
}

// Re-export handlers for testing
export { showOpenDialogHandler, showSaveDialogHandler, showMessageBoxHandler, showErrorBoxHandler };
