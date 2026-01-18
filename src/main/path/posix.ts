/**
 * POSIX-specific path handlers
 */

import path from "node:path";
import type { ParsedPath } from "@shared/path.types.js";

export async function posixBasenameHandler(...params: unknown[]): Promise<string> {
  const [p, ext] = params as [string, string?];
  return path.posix.basename(p, ext);
}

export async function posixDirnameHandler(...params: unknown[]): Promise<string> {
  const [p] = params as [string];
  return path.posix.dirname(p);
}

export async function posixExtnameHandler(...params: unknown[]): Promise<string> {
  const [p] = params as [string];
  return path.posix.extname(p);
}

export async function posixJoinHandler(...params: unknown[]): Promise<string> {
  return path.posix.join(...(params as string[]));
}

export async function posixNormalizeHandler(...params: unknown[]): Promise<string> {
  const [p] = params as [string];
  return path.posix.normalize(p);
}

export async function posixParseHandler(...params: unknown[]): Promise<ParsedPath> {
  const [p] = params as [string];
  return path.posix.parse(p);
}

export async function posixFormatHandler(...params: unknown[]): Promise<string> {
  const [pathObject] = params as [ParsedPath];
  return path.posix.format(pathObject);
}

export async function posixIsAbsoluteHandler(...params: unknown[]): Promise<boolean> {
  const [p] = params as [string];
  return path.posix.isAbsolute(p);
}

export async function posixRelativeHandler(...params: unknown[]): Promise<string> {
  const [from, to] = params as [string, string];
  return path.posix.relative(from, to);
}

export async function posixResolveHandler(...params: unknown[]): Promise<string> {
  return path.posix.resolve(...(params as string[]));
}
