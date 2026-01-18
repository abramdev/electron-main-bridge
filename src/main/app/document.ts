/**
 * Recent documents handlers
 */

import { app } from "electron";

export async function addRecentDocumentHandler(...params: unknown[]): Promise<void> {
  const [path] = params as [string];
  app.addRecentDocument(path);
}

export async function clearRecentDocumentsHandler(): Promise<void> {
  app.clearRecentDocuments();
}

export async function getRecentDocumentsHandler(): Promise<string[]> {
  // Electron doesn't have a getRecentDocuments method, but we can track internally
  // For now, return empty array - users should track this themselves
  return [];
}
