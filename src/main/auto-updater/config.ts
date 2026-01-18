/**
 * Configuration autoUpdater handlers
 */

import { autoUpdater } from "electron";
import type { AutoUpdaterFeedURLOptions } from "@shared/auto-updater.types.js";

export async function setFeedURLHandler(...params: unknown[]): Promise<void> {
  const [options] = params as [AutoUpdaterFeedURLOptions];
  autoUpdater.setFeedURL(options);
}

export async function getFeedURLHandler(): Promise<string> {
  return autoUpdater.getFeedURL();
}
