/**
 * Renderer process API for session module
 */

import type {
  SessionClearStorageDataOptions,
  SessionClearDataOptions,
  SessionSetUserAgentOptions,
  SessionWillDownloadEventData,
  SessionDownloadProgressData,
  SessionDownloadDoneData,
} from "@shared/session.types.js";

// ============================================================================
// Download Management
// ============================================================================

/**
 * Set the download saving directory
 */
export async function setDownloadPath(path: string): Promise<void> {
  await window.rpc.call("session.setDownloadPath", path);
}

/**
 * Initiate a download of the resource at url
 * @returns The URL being downloaded
 */
export async function downloadURL(url: string): Promise<string> {
  return (await window.rpc.call("session.downloadURL", url)) as string;
}

/**
 * Download item operations
 */
export const item = {
  /**
   * Pause the download
   */
  pause: (id: string): Promise<void> => window.rpc.call("session.item.pause", id) as Promise<void>,

  /**
   * Resume the download
   */
  resume: (id: string): Promise<void> =>
    window.rpc.call("session.item.resume", id) as Promise<void>,

  /**
   * Cancel the download
   */
  cancel: (id: string): Promise<void> =>
    window.rpc.call("session.item.cancel", id) as Promise<void>,

  /**
   * Set the save path for the download
   */
  setSavePath: (id: string, path: string): Promise<void> =>
    window.rpc.call("session.item.setSavePath", id, path) as Promise<void>,
};

/**
 * Listen for download start events
 * Note: Event name includes session hash for multi-instance support
 */
export function onWillDownload(
  callback: (data: SessionWillDownloadEventData) => void,
  sessionHash?: string,
): () => void {
  const event = sessionHash ? `session.${sessionHash}.will-download` : "session.will-download";
  return window.rpc.on(event, (...args: unknown[]) => {
    const [data] = args as [SessionWillDownloadEventData];
    callback(data);
  });
}

/**
 * Listen for download progress events
 */
export function onDownloadProgress(
  callback: (data: SessionDownloadProgressData) => void,
  sessionHash?: string,
): () => void {
  const event = sessionHash
    ? `session.${sessionHash}.download-progress`
    : "session.download-progress";
  return window.rpc.on(event, (...args: unknown[]) => {
    const [data] = args as [SessionDownloadProgressData];
    callback(data);
  });
}

/**
 * Listen for download completion events
 */
export function onDownloadDone(
  callback: (data: SessionDownloadDoneData) => void,
  sessionHash?: string,
): () => void {
  const event = sessionHash ? `session.${sessionHash}.download-done` : "session.download-done";
  return window.rpc.on(event, (...args: unknown[]) => {
    const [data] = args as [SessionDownloadDoneData];
    callback(data);
  });
}

// ============================================================================
// Cache Management
// ============================================================================

/**
 * Get the session's current cache size in bytes
 */
export async function getCacheSize(): Promise<number> {
  return (await window.rpc.call("session.getCacheSize")) as number;
}

/**
 * Clear the session's HTTP cache
 */
export async function clearCache(): Promise<void> {
  await window.rpc.call("session.clearCache");
}

// ============================================================================
// Storage Management
// ============================================================================

/**
 * Clears storage data for the session
 */
export async function clearStorageData(options?: SessionClearStorageDataOptions): Promise<void> {
  await window.rpc.call("session.clearStorageData", options);
}

/**
 * Clears various different types of data
 */
export async function clearData(options?: SessionClearDataOptions): Promise<void> {
  await window.rpc.call("session.clearData", options);
}

/**
 * Get the file system path where session data is persisted
 */
export async function getStoragePath(): Promise<string | null> {
  return (await window.rpc.call("session.getStoragePath")) as string | null;
}

/**
 * Check if the session is persistent
 */
export async function isPersistent(): Promise<boolean> {
  return (await window.rpc.call("session.isPersistent")) as boolean;
}

// ============================================================================
// User Agent
// ============================================================================

/**
 * Get the user agent for this session
 */
export async function getUserAgent(): Promise<string> {
  return (await window.rpc.call("session.getUserAgent")) as string;
}

/**
 * Override the user agent for this session
 */
export async function setUserAgent(options: SessionSetUserAgentOptions): Promise<void> {
  await window.rpc.call("session.setUserAgent", options);
}

// ============================================================================
// Session Identification
// ============================================================================

/**
 * Get the session hash used for event names
 */
export async function getSessionHash(): Promise<string> {
  return (await window.rpc.call("session.getSessionHash")) as string;
}
