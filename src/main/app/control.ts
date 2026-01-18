/**
 * App control handlers
 */

import { app } from "electron";
import type { FocusOptions, RelaunchOptions } from "@shared/app.types.js";

export async function quitHandler(): Promise<void> {
  app.quit();
}

export async function exitHandler(...params: unknown[]): Promise<void> {
  const [exitCode] = params as [number?];
  app.exit(exitCode);
}

export async function relaunchHandler(...params: unknown[]): Promise<void> {
  const [options] = params as [RelaunchOptions?];
  app.relaunch(options);
}

export async function focusHandler(...params: unknown[]): Promise<void> {
  const [options] = params as [FocusOptions?];
  app.focus(options as any);
}

export async function hideHandler(): Promise<void> {
  app.hide();
}

export async function showHandler(): Promise<void> {
  app.show();
}
