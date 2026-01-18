/**
 * Path parsing and formatting handlers
 */

import path from "node:path";
import type { ParsedPath } from "@shared/path.types.js";

/**
 * Parse a path into components
 */
export async function parseHandler(...params: unknown[]): Promise<ParsedPath> {
  const [p] = params as [string];
  return path.parse(p);
}

/**
 * Format a path object into a string
 */
export async function formatHandler(...params: unknown[]): Promise<string> {
  const [pathObject] = params as [ParsedPath];
  return path.format(pathObject);
}
