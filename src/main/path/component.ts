/**
 * Path component handlers
 */

import path from "node:path";

/**
 * Get the directory name of a path
 */
export async function dirnameHandler(...params: unknown[]): Promise<string> {
  const [p] = params as [string];
  return path.dirname(p);
}

/**
 * Get the basename of a path
 */
export async function basenameHandler(...params: unknown[]): Promise<string> {
  const [p, ext] = params as [string, string?];
  return path.basename(p, ext);
}

/**
 * Get the extension of a path
 */
export async function extnameHandler(...params: unknown[]): Promise<string> {
  const [p] = params as [string];
  return path.extname(p);
}
