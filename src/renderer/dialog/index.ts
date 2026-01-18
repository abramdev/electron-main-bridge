/**
 * Renderer process API for dialog module
 * Usage in renderer process:
 *
 * import { dialog } from 'electron-main-bridge/renderer/dialog';
 * const { filePaths } = await dialog.showOpenDialog();
 */

import type {
  OpenDialogOptions,
  OpenDialogReturnValue,
  SaveDialogOptions,
  SaveDialogReturnValue,
  MessageBoxOptions,
  MessageBoxReturnValue,
} from "@shared/dialog.types.js";

/**
 * Show open file dialog
 */
export async function showOpenDialog(options?: OpenDialogOptions): Promise<OpenDialogReturnValue> {
  return (await window.rpc.call("dialog.showOpenDialog", options)) as OpenDialogReturnValue;
}

/**
 * Show save dialog
 */
export async function showSaveDialog(options?: SaveDialogOptions): Promise<SaveDialogReturnValue> {
  return (await window.rpc.call("dialog.showSaveDialog", options)) as SaveDialogReturnValue;
}

/**
 * Show message box
 */
export async function showMessageBox(options: MessageBoxOptions): Promise<MessageBoxReturnValue> {
  return (await window.rpc.call("dialog.showMessageBox", options)) as MessageBoxReturnValue;
}

/**
 * Show error box
 */
export async function showErrorBox(title: string, content: string): Promise<void> {
  await window.rpc.call("dialog.showErrorBox", title, content);
}
