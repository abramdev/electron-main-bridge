/**
 * Main process handlers for session module
 */

import type { Session } from "electron";
import type { RpcServer } from "electron-json-rpc/main";
import type {
  SessionClearStorageDataOptions,
  SessionClearDataOptions,
  SessionSetUserAgentOptions,
  DownloadItem,
  DownloadItemState,
} from "@shared/session.types.js";

const RPC_METHOD_PREFIX = "session";

/**
 * Register all session module RPC handlers
 * Each session instance gets independent handlers via closure
 */
export function registerSessionModule(rpc: RpcServer, session: Session): void {
  // Each session instance has independent download item management
  const downloadItems = new Map<string, Electron.DownloadItem>();
  let downloadIdCounter = 0;

  // Generate session unique identifier for event naming
  const sessionHash = (session as any).hash || Math.random().toString(36).slice(2);

  // ==========================================================================
  // Download Management
  // ==========================================================================

  async function setDownloadPathHandler(...params: unknown[]): Promise<void> {
    const [path] = params as [string];
    session.setDownloadPath(path);
  }

  async function downloadURLHandler(...params: unknown[]): Promise<string> {
    const [url] = params as [string];
    session.downloadURL(url);
    return url;
  }

  // Download item operations
  async function itemPauseHandler(...params: unknown[]): Promise<void> {
    const [id] = params as [string];
    const item = downloadItems.get(id);
    if (item) item.pause();
  }

  async function itemResumeHandler(...params: unknown[]): Promise<void> {
    const [id] = params as [string];
    const item = downloadItems.get(id);
    if (item) item.resume();
  }

  async function itemCancelHandler(...params: unknown[]): Promise<void> {
    const [id] = params as [string];
    const item = downloadItems.get(id);
    if (item) item.cancel();
  }

  async function itemSetSavePathHandler(...params: unknown[]): Promise<void> {
    const [id, path] = params as [string, string];
    const item = downloadItems.get(id);
    if (item) item.setSavePath(path);
  }

  // Serialize download item to IPC-safe format
  function serializeDownloadItem(item: Electron.DownloadItem, id: string): DownloadItem {
    return {
      id,
      url: item.getURL(),
      filename: item.getFilename(),
      totalBytes: item.getTotalBytes(),
      receivedBytes: item.getReceivedBytes(),
      savePath: item.getSavePath(),
      state: item.getState() as DownloadItemState,
    };
  }

  // ==========================================================================
  // Cache Management
  // ==========================================================================

  async function getCacheSizeHandler(): Promise<number> {
    return session.getCacheSize();
  }

  async function clearCacheHandler(): Promise<void> {
    await session.clearCache();
  }

  // ==========================================================================
  // Storage Management
  // ==========================================================================

  async function clearStorageDataHandler(...params: unknown[]): Promise<void> {
    const [options] = params as [SessionClearStorageDataOptions?];
    await session.clearStorageData(options as any);
  }

  async function clearDataHandler(...params: unknown[]): Promise<void> {
    const [options] = params as [SessionClearDataOptions?];
    await session.clearData(options as any);
  }

  async function getStoragePathHandler(): Promise<string | null> {
    return session.getStoragePath();
  }

  async function isPersistentHandler(): Promise<boolean> {
    return session.isPersistent();
  }

  // ==========================================================================
  // User Agent
  // ==========================================================================

  async function getUserAgentHandler(): Promise<string> {
    return session.getUserAgent();
  }

  async function setUserAgentHandler(...params: unknown[]): Promise<void> {
    const [options] = params as [SessionSetUserAgentOptions];
    session.setUserAgent(options.userAgent, options.acceptLanguages);
  }

  // ==========================================================================
  // Session Identification
  // ==========================================================================

  async function getSessionHashHandler(): Promise<string> {
    return sessionHash;
  }

  // ==========================================================================
  // Register RPC Methods
  // ==========================================================================

  // Download management
  rpc.register(`${RPC_METHOD_PREFIX}.setDownloadPath`, setDownloadPathHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.downloadURL`, downloadURLHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.item.pause`, itemPauseHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.item.resume`, itemResumeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.item.cancel`, itemCancelHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.item.setSavePath`, itemSetSavePathHandler);

  // Cache management
  rpc.register(`${RPC_METHOD_PREFIX}.getCacheSize`, getCacheSizeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.clearCache`, clearCacheHandler);

  // Storage management
  rpc.register(`${RPC_METHOD_PREFIX}.clearStorageData`, clearStorageDataHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.clearData`, clearDataHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getStoragePath`, getStoragePathHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isPersistent`, isPersistentHandler);

  // User Agent
  rpc.register(`${RPC_METHOD_PREFIX}.getUserAgent`, getUserAgentHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setUserAgent`, setUserAgentHandler);

  // Session Identification
  rpc.register(`${RPC_METHOD_PREFIX}.getSessionHash`, getSessionHashHandler);

  // ==========================================================================
  // Event Forwarding
  // ==========================================================================

  session.on("will-download", (_event, item) => {
    const id = String(++downloadIdCounter);
    downloadItems.set(id, item);

    const payload = {
      item: serializeDownloadItem(item, id),
      sessionHash,
    };
    rpc.publish(`session.${sessionHash}.will-download`, payload);
    rpc.publish("session.will-download", payload);

    // Listen for download progress updates
    item.on("updated", (_event, state) => {
      const payload = {
        id,
        receivedBytes: item.getReceivedBytes(),
        totalBytes: item.getTotalBytes(),
        state: state === "progressing" ? ("progressing" as const) : ("paused" as const),
        sessionHash,
      };
      rpc.publish(`session.${sessionHash}.download-progress`, payload);
      rpc.publish("session.download-progress", payload);
    });

    // Listen for download completion
    item.on("done", (_event, state) => {
      const payload = {
        id,
        state: state as "completed" | "cancelled" | "interrupted",
        path: item.getSavePath(),
        sessionHash,
      };
      rpc.publish(`session.${sessionHash}.download-done`, payload);
      rpc.publish("session.download-done", payload);
      // Cleanup
      downloadItems.delete(id);
    });
  });
}
