/**
 * Accessibility handlers
 */

import { app } from "electron";

export async function isAccessibilitySupportEnabledHandler(): Promise<boolean> {
  return app.isAccessibilitySupportEnabled();
}

export async function setAccessibilitySupportEnabledHandler(...params: unknown[]): Promise<void> {
  const [enabled] = params as [boolean];
  app.setAccessibilitySupportEnabled(enabled);
}
