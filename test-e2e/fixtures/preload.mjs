/**
 * Preload script for E2E tests
 * Exposes RPC API to renderer process
 */

import { contextBridge, ipcRenderer } from "electron";
import { exposeRpcApi } from "electron-json-rpc/preload";

// Expose RPC API to renderer process
exposeRpcApi({ contextBridge, ipcRenderer });
