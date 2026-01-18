/**
 * Main process handlers for autoUpdater module
 * Includes RPC method registration and event forwarding to renderer
 */

import { autoUpdater } from "electron";
import type { RpcServer } from "electron-json-rpc/main";

import * as core from "./core.js";
import * as config from "./config.js";

const RPC_METHOD_PREFIX = "autoUpdater";

// Flag to prevent duplicate event listener registration
let listenersRegistered = false;

/**
 * Register all autoUpdater module RPC handlers and set up event forwarding
 */
export function registerAutoUpdaterModule(rpc: RpcServer): void {
  // Prevent duplicate registration
  if (listenersRegistered) {
    console.warn("autoUpdater listeners already registered");
    // Still register methods in case they weren't registered before
  }

  // ============================================================================
  // Register RPC Methods
  // ============================================================================

  // Core methods (2 methods)
  rpc.register(`${RPC_METHOD_PREFIX}.checkForUpdates`, core.checkForUpdatesHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.quitAndInstall`, core.quitAndInstallHandler);

  // Configuration methods (2 methods)
  rpc.register(`${RPC_METHOD_PREFIX}.setFeedURL`, config.setFeedURLHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getFeedURL`, config.getFeedURLHandler);

  // ============================================================================
  // Event Forwarding (only register once)
  // ============================================================================

  if (listenersRegistered) {
    return;
  }
  listenersRegistered = true;

  // Status events
  autoUpdater.on("checking-for-update", () => {
    rpc.publish("autoUpdater.checking-for-update");
  });

  autoUpdater.on("update-available", () => {
    rpc.publish("autoUpdater.update-available");
  });

  autoUpdater.on("update-not-available", () => {
    rpc.publish("autoUpdater.update-not-available");
  });

  // Update downloaded event - note: multiple parameters
  autoUpdater.on(
    "update-downloaded",
    (_event, releaseNotes, releaseName, releaseDate, updateURL) => {
      rpc.publish("autoUpdater.update-downloaded", {
        releaseNotes,
        releaseName,
        releaseDate: releaseDate.toISOString(),
        updateURL,
      });
    },
  );

  // Error event
  autoUpdater.on("error", (error) => {
    rpc.publish("autoUpdater.error", {
      message: error.message,
      stack: error.stack,
    });
  });

  // Before quit for update
  autoUpdater.on("before-quit-for-update", () => {
    rpc.publish("autoUpdater.before-quit-for-update");
  });
}
