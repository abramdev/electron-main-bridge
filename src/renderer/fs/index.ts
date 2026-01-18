import type {
  FsReadFileOptions,
  FsReadFileResult,
  FsWriteInput,
  FsWriteOptions,
  FsAppendFileOptions,
  FsCopyFileOptions,
  FsStatsOutput,
  FsStatOptions,
  FsReaddirOptions,
  FsReaddirResult,
  FsMkdirOptions,
  FsRmOptions,
  FsRmdirOptions,
  FsCopyOptions,
  FsSymlinkType,
  FsTimeLike,
} from "@shared/types.js";

// ============================================================================
// Read Operations
// ============================================================================

/**
 * Read the entire contents of a file
 */
export async function readFile(
  path: string,
  options?: FsReadFileOptions,
): Promise<FsReadFileResult> {
  return (await window.rpc.call("fs.readFile", path, options)) as FsReadFileResult;
}

/**
 * Read the target of a symbolic link
 */
export async function readlink(path: string): Promise<string> {
  return (await window.rpc.call("fs.readlink", path)) as string;
}

/**
 * Resolve the actual path of a file/directory
 */
export async function realpath(path: string): Promise<string> {
  return (await window.rpc.call("fs.realpath", path)) as string;
}

// ============================================================================
// Write Operations
// ============================================================================

/**
 * Write data to a file
 */
export async function writeFile(
  path: string,
  data: FsWriteInput,
  options?: FsWriteOptions,
): Promise<void> {
  await window.rpc.call("fs.writeFile", path, data, options);
}

/**
 * Append data to a file
 */
export async function appendFile(
  path: string,
  data: FsWriteInput,
  options?: FsAppendFileOptions,
): Promise<void> {
  await window.rpc.call("fs.appendFile", path, data, options);
}

/**
 * Copy a file
 */
export async function copyFile(src: string, dest: string, mode?: FsCopyFileOptions): Promise<void> {
  await window.rpc.call("fs.copyFile", src, dest, mode);
}

// ============================================================================
// File Operations
// ============================================================================

/**
 * Remove a file
 */
export async function unlink(path: string): Promise<void> {
  await window.rpc.call("fs.unlink", path);
}

/**
 * Rename a file
 */
export async function rename(oldPath: string, newPath: string): Promise<void> {
  await window.rpc.call("fs.rename", oldPath, newPath);
}

/**
 * Truncate a file to a specified length
 */
export async function truncate(path: string, len?: number): Promise<void> {
  await window.rpc.call("fs.truncate", path, len);
}

/**
 * Get file status information
 */
export async function stat(path: string, options?: FsStatOptions): Promise<FsStatsOutput> {
  return (await window.rpc.call("fs.stat", path, options)) as FsStatsOutput;
}

/**
 * Get symbolic link status information
 */
export async function lstat(path: string, options?: FsStatOptions): Promise<FsStatsOutput> {
  return (await window.rpc.call("fs.lstat", path, options)) as FsStatsOutput;
}

/**
 * Check if a file exists
 */
export async function exists(path: string): Promise<boolean> {
  return (await window.rpc.call("fs.exists", path)) as boolean;
}

/**
 * Check if a file is accessible with the given mode
 */
export async function access(path: string, mode?: number): Promise<void> {
  await window.rpc.call("fs.access", path, mode);
}

/**
 * Change file permissions
 */
export async function chmod(path: string, mode: number): Promise<void> {
  await window.rpc.call("fs.chmod", path, mode);
}

/**
 * Change file owner
 */
export async function chown(path: string, uid: number, gid: number): Promise<void> {
  await window.rpc.call("fs.chown", path, uid, gid);
}

/**
 * Change file timestamps
 */
export async function utimes(path: string, atime: FsTimeLike, mtime: FsTimeLike): Promise<void> {
  await window.rpc.call("fs.utimes", path, atime, mtime);
}

// ============================================================================
// Directory Operations
// ============================================================================

/**
 * Create a directory
 */
export async function mkdir(path: string, options?: FsMkdirOptions): Promise<void | string> {
  return (await window.rpc.call("fs.mkdir", path, options)) as void | string;
}

/**
 * Read directory contents
 */
export async function readdir(path: string, options?: FsReaddirOptions): Promise<FsReaddirResult> {
  return (await window.rpc.call("fs.readdir", path, options)) as FsReaddirResult;
}

/**
 * Remove a directory
 */
export async function rmdir(path: string, options?: FsRmdirOptions): Promise<void> {
  await window.rpc.call("fs.rmdir", path, options);
}

/**
 * Remove a file or directory (recursively)
 */
export async function rm(path: string, options?: FsRmOptions): Promise<void> {
  await window.rpc.call("fs.rm", path, options);
}

/**
 * Copy a directory structure
 */
export async function cp(
  source: string,
  destination: string,
  options?: FsCopyOptions,
): Promise<void> {
  await window.rpc.call("fs.cp", source, destination, options);
}

// ============================================================================
// Link Operations
// ============================================================================

/**
 * Create a hard link
 */
export async function link(existingPath: string, newPath: string): Promise<void> {
  await window.rpc.call("fs.link", existingPath, newPath);
}

/**
 * Create a symbolic link
 */
export async function symlink(target: string, path: string, type?: FsSymlinkType): Promise<void> {
  await window.rpc.call("fs.symlink", target, path, type);
}
