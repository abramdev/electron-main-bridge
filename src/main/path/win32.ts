/**
 * Windows-specific path handlers
 */

import path from "node:path";
import type { ParsedPath } from "@shared/path.types.js";

export async function win32BasenameHandler(...params: unknown[]): Promise<string> {
  const [p, ext] = params as [string, string?];
  return path.win32.basename(p, ext);
}

export async function win32DirnameHandler(...params: unknown[]): Promise<string> {
  const [p] = params as [string];
  return path.win32.dirname(p);
}

export async function win32ExtnameHandler(...params: unknown[]): Promise<string> {
  const [p] = params as [string];
  return path.win32.extname(p);
}

export async function win32JoinHandler(...params: unknown[]): Promise<string> {
  return path.win32.join(...(params as string[]));
}

export async function win32NormalizeHandler(...params: unknown[]): Promise<string> {
  const [p] = params as [string];
  return path.win32.normalize(p);
}

export async function win32ParseHandler(...params: unknown[]): Promise<ParsedPath> {
  const [p] = params as [string];
  return path.win32.parse(p);
}

export async function win32FormatHandler(...params: unknown[]): Promise<string> {
  const [pathObject] = params as [ParsedPath];
  return path.win32.format(pathObject);
}

export async function win32IsAbsoluteHandler(...params: unknown[]): Promise<boolean> {
  const [p] = params as [string];
  return path.win32.isAbsolute(p);
}

export async function win32RelativeHandler(...params: unknown[]): Promise<string> {
  const [from, to] = params as [string, string];
  return path.win32.relative(from, to);
}

export async function win32ResolveHandler(...params: unknown[]): Promise<string> {
  return path.win32.resolve(...(params as string[]));
}
