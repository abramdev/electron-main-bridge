/**
 * About panel handlers
 */

import { app } from "electron";
import type { AboutPanelOptions } from "@shared/app.types.js";

export async function showAboutPanelHandler(): Promise<void> {
  app.showAboutPanel();
}

export async function setAboutPanelOptionsHandler(...params: unknown[]): Promise<void> {
  const [options] = params as [AboutPanelOptions];
  app.setAboutPanelOptions(options);
}
