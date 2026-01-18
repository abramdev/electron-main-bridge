import { promises as fs } from "node:fs";
import type { FsSymlinkType } from "@shared/types.js";

/**
 * Create a hard link
 */
export async function linkHandler(...params: unknown[]): Promise<void> {
  const [existingPath, newPath] = params as [string, string];
  await fs.link(existingPath, newPath);
}

/**
 * Create a symbolic link
 */
export async function symlinkHandler(...params: unknown[]): Promise<void> {
  const [target, path, type] = params as [string, string, FsSymlinkType?];
  await fs.symlink(target, path, type as string | null);
}
