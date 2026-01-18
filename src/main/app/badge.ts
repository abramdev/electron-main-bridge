/**
 * Badge notification handlers
 */

import { app } from "electron";

export async function setBadgeCountHandler(...params: unknown[]): Promise<void> {
  const [count] = params as [number?];
  app.setBadgeCount(count ?? 0);
}

export async function getBadgeCountHandler(): Promise<number> {
  return app.getBadgeCount();
}
