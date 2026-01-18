import { promises as fs } from "node:fs";
import type { FsStatOptions, FsMode, FsTimeLike } from "@shared/types.js";

/**
 * Remove a file
 */
export async function unlinkHandler(...params: unknown[]): Promise<void> {
  const [path] = params as [string];
  await fs.unlink(path);
}

/**
 * Rename a file
 */
export async function renameHandler(...params: unknown[]): Promise<void> {
  const [oldPath, newPath] = params as [string, string];
  await fs.rename(oldPath, newPath);
}

/**
 * Truncate a file to a specified length
 */
export async function truncateHandler(...params: unknown[]): Promise<void> {
  const [path, len] = params as [string, number | undefined];
  await fs.truncate(path, len);
}

/**
 * Get file status information
 */
export async function statHandler(...params: unknown[]): Promise<unknown> {
  const [path, options] = params as [string, FsStatOptions?];
  const stats = await fs.stat(path, options);
  // Convert Stats to plain object for IPC serialization
  return statsToPlain(stats);
}

/**
 * Get symbolic link status information
 */
export async function lstatHandler(...params: unknown[]): Promise<unknown> {
  const [path, options] = params as [string, FsStatOptions?];
  const stats = await fs.lstat(path, options);
  return statsToPlain(stats);
}

/**
 * Check if a file exists
 */
export async function existsHandler(...params: unknown[]): Promise<boolean> {
  const [path] = params as [string];
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a file is accessible with the given mode
 */
export async function accessHandler(...params: unknown[]): Promise<void> {
  const [path, mode] = params as [string, number?];
  await fs.access(path, mode);
}

/**
 * Change file permissions
 */
export async function chmodHandler(...params: unknown[]): Promise<void> {
  const [path, mode] = params as [string, FsMode];
  await fs.chmod(path, mode);
}

/**
 * Change file owner
 */
export async function chownHandler(...params: unknown[]): Promise<void> {
  const [path, uid, gid] = params as [string, number, number];
  await fs.chown(path, uid, gid);
}

/**
 * Change file timestamps
 */
export async function utimesHandler(...params: unknown[]): Promise<void> {
  const [path, atime, mtime] = params as [string, FsTimeLike, FsTimeLike];
  await fs.utimes(path, atime, mtime);
}

/**
 * Convert fs.Stats or fs.BigIntStats to plain object for IPC serialization
 */
function statsToPlain(
  stats: import("fs").Stats | import("fs").BigIntStats,
): Record<string, unknown> {
  // Helper to safely convert bigint or number to number
  const toNumber = (val: number | bigint): number => {
    return typeof val === "bigint" ? Number(val) : val;
  };

  return {
    dev: toNumber((stats as { dev: number | bigint }).dev),
    ino: toNumber((stats as { ino: number | bigint }).ino),
    mode: stats.mode,
    nlink: stats.nlink,
    uid: stats.uid,
    gid: stats.gid,
    rdev: stats.rdev,
    size: stats.size,
    blksize: stats.blksize,
    blocks: stats.blocks,
    atimeMs: stats.atimeMs,
    mtimeMs: stats.mtimeMs,
    ctimeMs: stats.ctimeMs,
    birthtimeMs: stats.birthtimeMs,
    atime: stats.atime,
    mtime: stats.mtime,
    ctime: stats.ctime,
    birthtime: stats.birthtime,
  };
}
