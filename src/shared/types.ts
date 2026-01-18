/**
 * Shared types for electron-main-bridge
 */

import type {
  WriteFileOptions,
  CopyOptions,
  RmOptions,
  RmDirOptions,
  MakeDirectoryOptions,
  ObjectEncodingOptions,
  StatOptions,
  OpenMode,
} from "node:fs";
import type { IpcSerializable } from "electron-json-rpc";

// Re-export for convenience
export type { IpcSerializable };

// ============================================================================
// fs module types
// ============================================================================

// ============================================================================
// Common Types
// ============================================================================

export type FsPathLike = string;

export type FsBufferEncoding =
  | "utf-8"
  | "utf16le"
  | "latin1"
  | "base64"
  | "base64url"
  | "hex"
  | null;

export type FsTimeLike = number | string | Date;

// ============================================================================
// Write Operations
// ============================================================================

export type FsWriteOptions = Omit<WriteFileOptions, "signal">;

export type FsWriteInput =
  | string
  | Buffer
  | DataView
  | Uint8Array
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array
  | Uint8ClampedArray
  | BigUint64Array
  | BigInt64Array;

export type FsAppendFileOptions = Omit<WriteFileOptions, "signal">;

// ============================================================================
// Read Operations
// ============================================================================

export type FsReadFileOptions = Omit<ObjectEncodingOptions & { flag?: OpenMode }, "signal">;

export type FsReadFileResult = string | Uint8Array;

// ============================================================================
// Copy Operations
// ============================================================================

export type FsCopyFileOptions =
  | number
  | {
      /**
       * when `true`, exists check is skipped
       * @default false
       */
      force?: boolean;
    };

export type FsCopyOptions = CopyOptions;

// ============================================================================
// File Metadata Operations
// ============================================================================

export type FsStatOptions = Omit<StatOptions, "signal">;

/**
 * Stats object for file information
 * Based on Node.js fs.Stats but only including IPC-serializable properties
 */
export interface FsStats {
  dev: number;
  ino: number;
  mode: number;
  nlink: number;
  uid: number;
  gid: number;
  rdev: number;
  size: number;
  blksize: number;
  blocks: number;
  atimeMs: number;
  mtimeMs: number;
  ctimeMs: number;
  birthtimeMs: number;
  atime: Date;
  mtime: Date;
  ctime: Date;
  birthtime: Date;
}

/**
 * BigInt stats object for file information (when bigint: true is used)
 */
export interface FsBigIntStats {
  dev: bigint;
  ino: bigint;
  mode: bigint;
  nlink: bigint;
  uid: bigint;
  gid: bigint;
  rdev: bigint;
  size: bigint;
  blksize: bigint;
  blocks: bigint;
  atimeMs: bigint;
  mtimeMs: bigint;
  ctimeMs: bigint;
  birthtimeMs: bigint;
  atimeNs: bigint;
  mtimeNs: bigint;
  ctimeNs: bigint;
  birthtimeNs: bigint;
  atime: Date;
  mtime: Date;
  ctime: Date;
  birthtime: Date;
}

export type FsStatsOutput = FsStats | FsBigIntStats;

/**
 * Dirent object for directory entry information
 * Methods are serialized to plain boolean results for IPC
 */
export interface FsDirent {
  name: string;
  isFile: boolean;
  isDirectory: boolean;
  isBlockDevice: boolean;
  isCharacterDevice: boolean;
  isSymbolicLink: boolean;
  isFIFO: boolean;
  isSocket: boolean;
}

// ============================================================================
// Directory Operations
// ============================================================================

export type FsMkdirOptions = MakeDirectoryOptions;

export type FsReaddirOptions = Omit<
  ObjectEncodingOptions & {
    recursive?: boolean;
    withFileTypes?: boolean;
  },
  "signal"
>;

export type FsReaddirResult = string[] | FsDirent[];

export type FsRmdirOptions = RmDirOptions;

export type FsRmOptions = RmOptions;

// ============================================================================
// Link Operations
// ============================================================================

export type FsSymlinkType = "file" | "dir" | "junction" | null;

// ============================================================================
// Access Operations
// ============================================================================

export type FsMode = number;

// ============================================================================
// Ownership Operations
// ============================================================================

// ============================================================================
// Time Operations
// ============================================================================

// ============================================================================
// Truncate Operations
// ============================================================================

export type FsTruncateOptions = { length?: number };
