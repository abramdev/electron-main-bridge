import { promises as fs } from "node:fs";
import type {
  FsWriteInput,
  FsWriteOptions,
  FsAppendFileOptions,
  FsCopyFileOptions,
} from "@shared/types.js";
import { isBufferLike } from "../internal/guards.js";

/**
 * Write data to a file
 */
export async function writeFileHandler(...params: unknown[]): Promise<void> {
  const [path, data, options] = params as [string, FsWriteInput, FsWriteOptions?];
  // Ensure data is a valid type for fs.writeFile
  const writeData: string | Buffer =
    typeof data === "string"
      ? data
      : isBufferLike(data)
        ? Buffer.from(data)
        : Buffer.from(data as unknown as Uint8Array);
  await fs.writeFile(path, writeData, options);
}

/**
 * Append data to a file
 */
export async function appendFileHandler(...params: unknown[]): Promise<void> {
  const [path, data, options] = params as [string, FsWriteInput, FsAppendFileOptions?];
  // Ensure data is a valid type for fs.appendFile
  const writeData: string | Buffer =
    typeof data === "string"
      ? data
      : isBufferLike(data)
        ? Buffer.from(data)
        : Buffer.from(data as unknown as Uint8Array);
  await fs.appendFile(path, writeData, options);
}

/**
 * Copy a file
 */
export async function copyFileHandler(...params: unknown[]): Promise<void> {
  const [src, dest, mode] = params as [string, string, FsCopyFileOptions?];
  await fs.copyFile(src, dest, mode as number);
}
