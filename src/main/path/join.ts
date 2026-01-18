/**
 * Path joining and resolving handlers
 */

import path from "node:path";

/**
 * Join path segments
 */
export async function joinHandler(...params: unknown[]): Promise<string> {
  return path.join(...(params as string[]));
}

/**
 * Resolve path segments to an absolute path
 */
export async function resolveHandler(...params: unknown[]): Promise<string> {
  return path.resolve(...(params as string[]));
}

/**
 * Normalize a path
 */
export async function normalizeHandler(...params: unknown[]): Promise<string> {
  const [p] = params as [string];
  return path.normalize(p);
}
