/**
 * Renderer process API
 * Usage in renderer process:
 *
 * import { fs } from 'electron-main-bridge/renderer/fs';
 * await fs.writeFile('/path/to/file', 'content');
 *
 * import { app, autoUpdater } from 'electron-main-bridge/renderer';
 * const version = await app.getVersion();
 */

export * from "./fs/index.js";
export * from "./path/index.js";

// app, autoUpdater, dialog, globalShortcut, menu use namespace exports
export * as app from "./app/index.js";
export * as autoUpdater from "./auto-updater/index.js";
export * as dialog from "./dialog/index.js";
export * as globalShortcut from "./global-shortcut/index.js";
export * as menu from "./menu/index.js";
export * as powerSaveBlocker from "./power-save-blocker/index.js";
export * as pushNotifications from "./push-notifications/index.js";
export * as safeStorage from "./safe-storage/index.js";
export * as session from "./session/index.js";
export * as screen from "./screen/index.js";
export * as shareMenu from "./share-menu/index.js";
export * as shell from "./shell/index.js";
export * as tray from "./tray/index.js";
export * as notification from "./notification/index.js";
