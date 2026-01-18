/**
 * Shared types for session module
 */

// ============================================================================
// Download Item
// ============================================================================

export type DownloadItemState =
  | "progressing"
  | "paused"
  | "completed"
  | "cancelled"
  | "interrupted";

export interface DownloadItem {
  id: string;
  url: string;
  filename: string;
  totalBytes: number;
  receivedBytes: number;
  savePath: string;
  state: DownloadItemState;
}

export interface SessionWillDownloadEventData {
  item: DownloadItem;
  sessionHash?: string;
}

export interface SessionDownloadProgressData {
  id: string;
  receivedBytes: number;
  totalBytes: number;
  state: "progressing" | "paused";
  sessionHash?: string;
}

export interface SessionDownloadDoneData {
  id: string;
  state: "completed" | "cancelled" | "interrupted";
  path: string;
  sessionHash?: string;
}

// ============================================================================
// Storage Data
// ============================================================================

export interface SessionClearStorageDataOptions {
  origin?: string;
  storages?: Array<
    | "cookies"
    | "filesystem"
    | "indexdb"
    | "localstorage"
    | "shadercache"
    | "websql"
    | "serviceworkers"
    | "cachestorage"
  >;
  quotas?: Array<"temporary" | "syncable">;
}

export interface SessionClearDataOptions {
  dataTypes?: Array<
    | "backgroundFetch"
    | "cache"
    | "cookies"
    | "downloads"
    | "fileSystems"
    | "indexedDB"
    | "localStorage"
    | "serviceWorkers"
    | "webSQL"
  >;
  origins?: string[];
  excludeOrigins?: string[];
  avoidClosingConnections?: boolean;
  originMatchingMode?: "third-parties-included" | "origin-in-all-contexts";
}

// ============================================================================
// User Agent
// ============================================================================

export interface SessionSetUserAgentOptions {
  userAgent: string;
  acceptLanguages?: string;
}
