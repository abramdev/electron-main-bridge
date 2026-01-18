/**
 * Protocol handlers
 */

import { app } from "electron";

export async function setAsDefaultProtocolClientHandler(...params: unknown[]): Promise<boolean> {
  const [protocol, path, args] = params as [string, string?, string[]?];
  return app.setAsDefaultProtocolClient(protocol, path, args);
}

export async function removeAsDefaultProtocolClientHandler(...params: unknown[]): Promise<boolean> {
  const [protocol, path, args] = params as [string, string?, string[]?];
  return app.removeAsDefaultProtocolClient(protocol, path, args);
}

export async function isDefaultProtocolClientHandler(...params: unknown[]): Promise<boolean> {
  const [protocol, path, args] = params as [string, string?, string[]?];
  return app.isDefaultProtocolClient(protocol, path, args);
}
