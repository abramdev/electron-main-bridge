/**
 * Core autoUpdater handlers
 */

import { autoUpdater } from "electron";

export async function checkForUpdatesHandler(): Promise<void> {
  await autoUpdater.checkForUpdates();
}

export function quitAndInstallHandler(): void {
  autoUpdater.quitAndInstall();
}
