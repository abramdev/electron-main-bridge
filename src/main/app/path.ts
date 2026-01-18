/**
 * Path management handlers
 */

import { app } from "electron";
import type { AppPathName } from "@shared/app.types.js";

export async function getPathHandler(...params: unknown[]): Promise<string> {
  const [name] = params as [AppPathName];
  return app.getPath(name);
}

export async function setPathHandler(...params: unknown[]): Promise<void> {
  const [name, path] = params as [AppPathName, string];
  app.setPath(name, path);
}

export async function setAppLogsPathHandler(...params: unknown[]): Promise<void> {
  const [path] = params as [string?];
  app.setAppLogsPath(path);
}
