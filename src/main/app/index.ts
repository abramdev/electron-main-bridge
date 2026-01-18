/**
 * Main process handlers for app module
 * Includes RPC method registration and event forwarding to renderer
 */

import { app, BrowserWindow } from "electron";
import type { RpcServer } from "electron-json-rpc/main";

import * as info from "./info.js";
import * as path from "./path.js";
import * as control from "./control.js";
import * as document from "./document.js";
import * as protocol from "./protocol.js";
import * as single from "./single.js";
import * as badge from "./badge.js";
import * as login from "./login.js";
import * as a11y from "./a11y.js";
import * as panel from "./panel.js";
import * as gpu from "./gpu.js";
import * as metrics from "./metrics.js";
import * as emoji from "./emoji.js";
import * as fileIcon from "./fileIcon.js";

const RPC_METHOD_PREFIX = "app";

/**
 * Register all app module RPC handlers and set up event forwarding
 */
export function registerAppModule(rpc: RpcServer): void {
  // ============================================================================
  // Register RPC Methods
  // ============================================================================

  // App information (9 methods)
  rpc.register(`${RPC_METHOD_PREFIX}.getName`, info.getNameHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setName`, info.setNameHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getVersion`, info.getVersionHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getAppPath`, info.getAppPathHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getLocale`, info.getLocaleHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getSystemLocale`, info.getSystemLocaleHandler);
  rpc.register(
    `${RPC_METHOD_PREFIX}.getPreferredSystemLanguages`,
    info.getPreferredSystemLanguagesHandler,
  );
  rpc.register(`${RPC_METHOD_PREFIX}.getLocaleCountryCode`, info.getLocaleCountryCodeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isReady`, info.isReadyHandler);

  // Path management (3 methods)
  rpc.register(`${RPC_METHOD_PREFIX}.getPath`, path.getPathHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setPath`, path.setPathHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setAppLogsPath`, path.setAppLogsPathHandler);

  // App control (6 methods)
  rpc.register(`${RPC_METHOD_PREFIX}.quit`, control.quitHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.exit`, control.exitHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.relaunch`, control.relaunchHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.focus`, control.focusHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.hide`, control.hideHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.show`, control.showHandler);

  // Recent documents (3 methods)
  rpc.register(`${RPC_METHOD_PREFIX}.addRecentDocument`, document.addRecentDocumentHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.clearRecentDocuments`, document.clearRecentDocumentsHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getRecentDocuments`, document.getRecentDocumentsHandler);

  // Protocol handling (3 methods)
  rpc.register(
    `${RPC_METHOD_PREFIX}.setAsDefaultProtocolClient`,
    protocol.setAsDefaultProtocolClientHandler,
  );
  rpc.register(
    `${RPC_METHOD_PREFIX}.removeAsDefaultProtocolClient`,
    protocol.removeAsDefaultProtocolClientHandler,
  );
  rpc.register(
    `${RPC_METHOD_PREFIX}.isDefaultProtocolClient`,
    protocol.isDefaultProtocolClientHandler,
  );

  // Single instance lock (3 methods)
  rpc.register(
    `${RPC_METHOD_PREFIX}.requestSingleInstanceLock`,
    single.requestSingleInstanceLockHandler,
  );
  rpc.register(`${RPC_METHOD_PREFIX}.hasSingleInstanceLock`, single.hasSingleInstanceLockHandler);
  rpc.register(
    `${RPC_METHOD_PREFIX}.releaseSingleInstanceLock`,
    single.releaseSingleInstanceLockHandler,
  );

  // Badge notification (2 methods)
  rpc.register(`${RPC_METHOD_PREFIX}.setBadgeCount`, badge.setBadgeCountHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getBadgeCount`, badge.getBadgeCountHandler);

  // Login item (2 methods)
  rpc.register(`${RPC_METHOD_PREFIX}.getLoginItemSettings`, login.getLoginItemSettingsHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setLoginItemSettings`, login.setLoginItemSettingsHandler);

  // Accessibility (2 methods)
  rpc.register(
    `${RPC_METHOD_PREFIX}.isAccessibilitySupportEnabled`,
    a11y.isAccessibilitySupportEnabledHandler,
  );
  rpc.register(
    `${RPC_METHOD_PREFIX}.setAccessibilitySupportEnabled`,
    a11y.setAccessibilitySupportEnabledHandler,
  );

  // About panel (2 methods)
  rpc.register(`${RPC_METHOD_PREFIX}.showAboutPanel`, panel.showAboutPanelHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setAboutPanelOptions`, panel.setAboutPanelOptionsHandler);

  // GPU (2 methods)
  rpc.register(`${RPC_METHOD_PREFIX}.getGPUFeatureStatus`, gpu.getGPUFeatureStatusHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getGPUInfo`, gpu.getGPUInfoHandler);

  // Process metrics (1 method)
  rpc.register(`${RPC_METHOD_PREFIX}.getAppMetrics`, metrics.getAppMetricsHandler);

  // Emoji panel (2 methods)
  rpc.register(`${RPC_METHOD_PREFIX}.isEmojiPanelSupported`, emoji.isEmojiPanelSupportedHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.showEmojiPanel`, emoji.showEmojiPanelHandler);

  // File icon (1 method)
  rpc.register(`${RPC_METHOD_PREFIX}.getFileIcon`, fileIcon.getFileIconHandler);

  // ============================================================================
  // Event Forwarding
  // ============================================================================

  // Helper: Get safe window info
  const getWindowInfo = (window: BrowserWindow) => ({
    id: window.id,
    title: window.getTitle(),
  });

  // Lifecycle events
  app.on("window-all-closed", () => {
    rpc.publish("app.window-all-closed");
  });

  app.on("quit", (_, exitCode: number) => {
    rpc.publish("app.quit", { exitCode });
  });

  // Window events (only forward ID and title, not the actual BrowserWindow object)
  app.on("browser-window-created", (_, window: BrowserWindow) => {
    rpc.publish("app.browser-window-created", getWindowInfo(window));
  });

  app.on("browser-window-focus", (_, window: BrowserWindow) => {
    rpc.publish("app.browser-window-focus", getWindowInfo(window));
  });

  app.on("browser-window-blur", (_, window: BrowserWindow) => {
    rpc.publish("app.browser-window-blur", getWindowInfo(window));
  });

  // Web contents events (only forward ID)
  app.on("web-contents-created", (_, contents) => {
    rpc.publish("app.web-contents-created", { id: (contents as { id: number }).id });
  });

  // File/URL events
  app.on("open-file", (_, path: string) => {
    rpc.publish("app.open-file", { path });
  });

  app.on("open-url", (_, url: string) => {
    rpc.publish("app.open-url", { url });
  });

  app.on("second-instance", (_, argv: string[], workingDirectory: string) => {
    rpc.publish("app.second-instance", { argv, workingDirectory });
  });

  // Accessibility events
  app.on("accessibility-support-changed", (_, enabled: boolean) => {
    rpc.publish("app.accessibility-support-changed", { enabled });
  });

  // Note: "ready" and "will-finish-launching" events are NOT forwarded because:
  // 1. They fire only once, usually before registerAppModule is called
  // 2. Use app.isReady() method instead to check the current state
}
