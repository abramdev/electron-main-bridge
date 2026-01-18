import { promises as fs } from "node:fs";
import type { FsReadFileOptions, FsReadFileResult } from "@shared/types.js";

/**
 * Read the entire contents of a file
 */
export async function readFileHandler(...params: unknown[]): Promise<FsReadFileResult> {
  const [path, options] = params as [string, FsReadFileOptions?];
  // fs.readFile accepts BufferEncoding | { encoding?: BufferEncoding | null } | { flag?: string } as options
  return await fs.readFile(
    path,
    options as BufferEncoding | { encoding?: BufferEncoding | null; flag?: string } | undefined,
  );
}

/**
 * Read the target of a symbolic link
 */
export async function readlinkHandler(...params: unknown[]): Promise<string> {
  const [path, options] = params as [string, { encoding?: BufferEncoding }?];
  return await fs.readlink(path, options);
}

/**
 * Resolve the actual path of a file/directory
 */
export async function realpathHandler(...params: unknown[]): Promise<string> {
  const [path, options] = params as [string, { encoding?: BufferEncoding }?];
  return await fs.realpath(path, options);
}
