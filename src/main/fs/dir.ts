import { promises as fs } from "node:fs";
import type {
  FsMkdirOptions,
  FsReaddirOptions,
  FsReaddirResult,
  FsDirent,
  FsRmOptions,
  FsRmdirOptions,
  FsCopyOptions,
} from "@shared/types.js";

/**
 * Create a directory
 */
export async function mkdirHandler(...params: unknown[]): Promise<void | string> {
  const [path, options] = params as [string, FsMkdirOptions?];
  return await fs.mkdir(path, options);
}

/**
 * Read directory contents
 */
export async function readdirHandler(...params: unknown[]): Promise<FsReaddirResult> {
  const [path, options] = params as [string, FsReaddirOptions?];
  if (options?.withFileTypes) {
    const result = await fs.readdir(path, { ...options, withFileTypes: true } as {
      encoding?: BufferEncoding | null;
      withFileTypes: true;
      recursive?: boolean;
    });
    // Convert Dirent objects to plain objects for IPC serialization
    return result.map((d: import("fs").Dirent) => direntToPlain(d));
  }
  const result = await fs.readdir(
    path,
    options as {
      encoding?: BufferEncoding | null;
      withFileTypes?: false;
      recursive?: boolean;
    },
  );
  return result as FsReaddirResult;
}

/**
 * Remove a directory
 */
export async function rmdirHandler(...params: unknown[]): Promise<void> {
  const [path, options] = params as [string, FsRmdirOptions?];
  await fs.rmdir(path, options);
}

/**
 * Remove a file or directory (recursively)
 */
export async function rmHandler(...params: unknown[]): Promise<void> {
  const [path, options] = params as [string, FsRmOptions?];
  await fs.rm(path, options);
}

/**
 * Copy a directory structure
 */
export async function cpHandler(...params: unknown[]): Promise<void> {
  const [source, destination, options] = params as [string, string, FsCopyOptions?];
  await fs.cp(source, destination, options);
}

/**
 * Convert fs.Dirent to plain object for IPC serialization
 */
function direntToPlain(dirent: import("fs").Dirent): FsDirent {
  return {
    name: dirent.name,
    isFile: dirent.isFile(),
    isDirectory: dirent.isDirectory(),
    isBlockDevice: dirent.isBlockDevice(),
    isCharacterDevice: dirent.isCharacterDevice(),
    isSymbolicLink: dirent.isSymbolicLink(),
    isFIFO: dirent.isFIFO(),
    isSocket: dirent.isSocket(),
  };
}
