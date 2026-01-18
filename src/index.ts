/**
 * electron-main-bridge
 *
 * Preload script entry point
 *
 * Usage in Electron preload.ts:
 *
 * import { exposeRpcApi } from 'electron-main-bridge';
 * import { contextBridge, ipcRenderer } from 'electron';
 *
 * exposeRpcApi({ contextBridge, ipcRenderer });
 */

export { exposeRpcApi } from "electron-json-rpc/preload";
