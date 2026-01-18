/**
 * Path property handlers
 */

import path from "node:path";

/**
 * Get the relative path from one path to another
 */
export async function relativeHandler(...params: unknown[]): Promise<string> {
  const [from, to] = params as [string, string];
  return path.relative(from, to);
}

/**
 * Check if path is absolute
 */
export async function isAbsoluteHandler(...params: unknown[]): Promise<boolean> {
  const [p] = params as [string];
  return path.isAbsolute(p);
}

/**
 * Get the platform-specific path separator
 */
export async function sepHandler(): Promise<string> {
  return path.sep;
}

/**
 * Get the platform-specific path delimiter
 */
export async function delimiterHandler(): Promise<string> {
  return path.delimiter;
}

/**
 * Get the current working directory as a path string
 */
export async function cwdHandler(): Promise<string> {
  return process.cwd();
}
