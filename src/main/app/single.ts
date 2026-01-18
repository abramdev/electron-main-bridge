/**
 * Single instance lock handlers
 */

import { app } from "electron";

export async function requestSingleInstanceLockHandler(...params: unknown[]): Promise<boolean> {
  const [additionalData] = params as [Record<string, unknown>?];
  return app.requestSingleInstanceLock(additionalData);
}

export async function hasSingleInstanceLockHandler(): Promise<boolean> {
  return app.hasSingleInstanceLock();
}

export async function releaseSingleInstanceLockHandler(): Promise<void> {
  app.releaseSingleInstanceLock();
}
