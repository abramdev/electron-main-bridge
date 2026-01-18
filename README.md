# electron-main-bridge

![npm version](https://badge.fury.io/js/electron-main-bridge.svg)
[![downloads](https://img.shields.io/npm/dm/electron-main-bridge)](https://www.npmjs.com/package/electron-main-bridge)
[![license](https://img.shields.io/npm/l/electron-main-bridge)](./LICENSE)
[![typescript](https://img.shields.io/npm/types/electron-main-bridge)](https://www.typescriptlang.org/)
[![electron](https://img.shields.io/npm/dependency-version/electron-main-bridge/peer/electron)](https://www.electronjs.org/)

🌐 [English](./README.md) | [中文](./README.zh-CN.md)

> [!WARNING]
> This project is in **alpha** stage. API may change significantly.

Electron main process bridge - expose main process functions to renderer process via JSON-RPC.

## What is this?

**electron-main-bridge** is a library that securely exposes Electron's main process APIs to the renderer process while maintaining full type safety. In Electron, access to Node.js APIs and main-process modules is restricted in the renderer for security reasons. This library provides a bridge using [electron-json-rpc](https://github.com/paralog-infinity/electron-json-rpc) that lets you call main process functions from your renderer code as if they were local functions.

### Why use it?

- **No more preload boilerplate** - Stop writing repetitive IPC handlers and preload scripts
- **Type-safe IPC calls** - Get full TypeScript autocomplete and type checking for cross-process calls
- **Security-focused** - Built with `contextIsolation` enabled by default
- **Modular architecture** - Only bundle the APIs you actually use

### How it works

```
┌─────────────────┐     IPC/JSON-RPC      ┌─────────────────┐
│   Renderer      │ ─────────────────────> │   Main Process  │
│                 │                        │                 │
│  fs.readFile()  │                        │  Native fs API  │
│  app.getVersion()│                       │  Native app API │
└─────────────────┘                        └─────────────────┘
```

1. **Main Process**: Register RPC handlers for Electron APIs you want to expose
2. **Preload**: Expose a typed RPC client via `contextBridge`
3. **Renderer**: Call main process functions with full TypeScript support

### What APIs are covered?

| Module              | Description                                             |
| ------------------- | ------------------------------------------------------- |
| `fs`                | File system operations (read, write, stat, mkdir, etc.) |
| `path`              | Path manipulation (join, resolve, dirname, etc.)        |
| `app`               | Application lifecycle and metadata                      |
| `autoUpdater`       | Automatic application updates (macOS/Windows)           |
| `dialog`            | Native file/folder dialogs                              |
| `globalShortcut`    | Global keyboard shortcuts                               |
| `session`           | Session management (cookies, cache, downloads)          |
| `menu`              | Application and context menus                           |
| `notification`      | Desktop notifications                                   |
| `screen`            | Display and screen information                          |
| `shell`             | File association and external URL opening               |
| `tray`              | System tray icons                                       |
| `browserWindow`     | Window management                                       |
| `powerMonitor`      | System power state monitoring                           |
| `powerSaveBlocker`  | Prevent system sleep                                    |
| `safeStorage`       | Secure credential storage                               |
| `systemPreferences` | System-level preferences                                |
| `pushNotifications` | APNS push notifications (macOS)                         |
| `shareMenu`         | Native share sheet (macOS)                              |

## Features

- 📦 **Modular architecture** - import only the modules you need, keep bundle size minimal
- 🔒 **Type-safe API** - full TypeScript support with autocomplete and type checking
- 🚀 **IPC-compatible types** - handles serialization of complex types like `Stats`, `Dirent`, `Date`
- ⚡ **Zero boilerplate** - no more repetitive IPC handlers and preload scripts
- 🔌 **Easy integration** - plug and play with Electron apps

## Bundle Size

| Format                   | Minified | Gzipped |
| ------------------------ | -------- | ------- |
| Main (fs)                | 0.90 kB  | 0.31 kB |
| Main (browserWindow)     | 8.88 kB  | 1.46 kB |
| Renderer (fs)            | 3.30 kB  | 0.81 kB |
| Renderer (browserWindow) | 8.88 kB  | 1.46 kB |

## Installation

```bash
bun add electron-main-bridge
```

## Usage

### Main Process

```typescript
import { app } from "electron";
import { RpcServer } from "electron-json-rpc/main";
import { registerFsModule } from "electron-main-bridge/main/fs";
import { registerPathModule } from "electron-main-bridge/main/path";
import { registerAppModule } from "electron-main-bridge/main/app";
import { registerAutoUpdaterModule } from "electron-main-bridge/main/auto-updater";
import { registerDialogModule } from "electron-main-bridge/main/dialog";
import { registerGlobalShortcutModule } from "electron-main-bridge/main/globalShortcut";

const rpc = new RpcServer();
registerFsModule(rpc);
registerPathModule(rpc);
registerAppModule(rpc);
registerAutoUpdaterModule(rpc);
registerDialogModule(rpc);
registerGlobalShortcutModule(rpc);
rpc.listen();
```

### Preload Script

```typescript
import { contextBridge, ipcRenderer } from "electron";
import { exposeRpcApi } from "electron-json-rpc/preload";

exposeRpcApi({ contextBridge, ipcRenderer });
```

### Renderer Process

```typescript
import * as fs from "electron-main-bridge/renderer/fs";
import * as path from "electron-main-bridge/renderer/path";
import * as app from "electron-main-bridge/renderer/app";
import * as autoUpdater from "electron-main-bridge/renderer/auto-updater";
import { dialog } from "electron-main-bridge/renderer/dialog";
import * as globalShortcut from "electron-main-bridge/renderer/globalShortcut";

// File operations
await fs.writeFile("/path/to/file", "Hello, World!");
const content = await fs.readFile("/path/to/file", "utf-8");

// Path operations
const fullPath = await path.join("/home", "user", "docs");
const userData = await app.getPath("userData");

// App info
const version = await app.getVersion();
const isReady = await app.isReady();

// Dialog operations
const { filePaths } = await dialog.showOpenDialog({
  properties: ["openFile"],
  filters: [{ name: "Text Files", extensions: ["txt"] }],
});

// Events
app.on("window-all-closed", () => {
  console.log("All windows closed");
});

const unsubscribe = app.on("browser-window-created", ({ id, title }) => {
  console.log(`Window created: ${id} - ${title}`);
});

// Global shortcuts
await globalShortcut.register("CommandOrControl+X");
await globalShortcut.register("CommandOrControl+C", "CommandOrControl+V");

// Listen for shortcut events
globalShortcut.onAccelerator((accelerator) => {
  console.log(`Shortcut pressed: ${accelerator}`);
});
```

## Available API

### fs module

| Function                           | Return Type                       |
| ---------------------------------- | --------------------------------- |
| `readFile(path, options?)`         | `Promise<string \| Uint8Array>`   |
| `writeFile(path, data, options?)`  | `Promise<void>`                   |
| `appendFile(path, data, options?)` | `Promise<void>`                   |
| `copyFile(src, dest, mode?)`       | `Promise<void>`                   |
| `unlink(path)`                     | `Promise<void>`                   |
| `rename(oldPath, newPath)`         | `Promise<void>`                   |
| `truncate(path, len?)`             | `Promise<void>`                   |
| `stat(path, options?)`             | `Promise<FsStats>`                |
| `lstat(path, options?)`            | `Promise<FsStats>`                |
| `exists(path)`                     | `Promise<boolean>`                |
| `access(path, mode?)`              | `Promise<void>`                   |
| `chmod(path, mode)`                | `Promise<void>`                   |
| `chown(path, uid, gid)`            | `Promise<void>`                   |
| `utimes(path, atime, mtime)`       | `Promise<void>`                   |
| `mkdir(path, options?)`            | `Promise<void \| string>`         |
| `readdir(path, options?)`          | `Promise<string[] \| FsDirent[]>` |
| `rmdir(path, options?)`            | `Promise<void>`                   |
| `rm(path, options?)`               | `Promise<void>`                   |
| `cp(source, dest, options?)`       | `Promise<void>`                   |
| `link(existingPath, newPath)`      | `Promise<void>`                   |
| `symlink(target, path, type?)`     | `Promise<void>`                   |
| `readlink(path)`                   | `Promise<string>`                 |
| `realpath(path)`                   | `Promise<string>`                 |

### path module

| Function               | Return Type           |
| ---------------------- | --------------------- |
| `parse(p)`             | `Promise<ParsedPath>` |
| `format(pathObject)`   | `Promise<string>`     |
| `join(...segments)`    | `Promise<string>`     |
| `resolve(...segments)` | `Promise<string>`     |
| `normalize(p)`         | `Promise<string>`     |
| `dirname(p)`           | `Promise<string>`     |
| `basename(p, ext?)`    | `Promise<string>`     |
| `extname(p)`           | `Promise<string>`     |
| `relative(from, to)`   | `Promise<string>`     |
| `isAbsolute(p)`        | `Promise<boolean>`    |
| `sep()`                | `Promise<string>`     |
| `delimiter()`          | `Promise<string>`     |
| `cwd()`                | `Promise<string>`     |
| `win32.*`              | `Promise<*>`          |
| `posix.*`              | `Promise<*>`          |

### app module

#### App Information

| Function                        | Return Type         |
| ------------------------------- | ------------------- |
| `getName()`                     | `Promise<string>`   |
| `setName(name)`                 | `Promise<void>`     |
| `getVersion()`                  | `Promise<string>`   |
| `getAppPath()`                  | `Promise<string>`   |
| `getLocale()`                   | `Promise<string>`   |
| `getSystemLocale()`             | `Promise<string>`   |
| `getPreferredSystemLanguages()` | `Promise<string[]>` |
| `getLocaleCountryCode()`        | `Promise<string>`   |
| `isReady()`                     | `Promise<boolean>`  |

#### Path Management

| Function                 | Return Type       |
| ------------------------ | ----------------- |
| `getPath(name)`          | `Promise<string>` |
| `setPath(name, path)`    | `Promise<void>`   |
| `setAppLogsPath([path])` | `Promise<void>`   |

#### App Control

| Function              | Return Type     |
| --------------------- | --------------- |
| `quit()`              | `Promise<void>` |
| `exit([exitCode])`    | `Promise<void>` |
| `relaunch([options])` | `Promise<void>` |
| `focus([options])`    | `Promise<void>` |
| `hide()`              | `Promise<void>` |
| `show()`              | `Promise<void>` |

#### Other Functions

| Function                                  | Return Type                      |
| ----------------------------------------- | -------------------------------- |
| `addRecentDocument(path)`                 | `Promise<void>`                  |
| `clearRecentDocuments()`                  | `Promise<void>`                  |
| `setAsDefaultProtocolClient(protocol)`    | `Promise<boolean>`               |
| `requestSingleInstanceLock([data])`       | `Promise<boolean>`               |
| `setBadgeCount([count])`                  | `Promise<void>`                  |
| `getBadgeCount()`                         | `Promise<number>`                |
| `getLoginItemSettings([options])`         | `Promise<LoginItemSettings>`     |
| `setLoginItemSettings(settings)`          | `Promise<void>`                  |
| `isAccessibilitySupportEnabled()`         | `Promise<boolean>`               |
| `setAccessibilitySupportEnabled(enabled)` | `Promise<void>`                  |
| `showAboutPanel()`                        | `Promise<void>`                  |
| `setAboutPanelOptions(options)`           | `Promise<void>`                  |
| `getGPUFeatureStatus()`                   | `Promise<GPUFeatureStatus>`      |
| `getGPUInfo(infoType)`                    | `Promise<unknown>`               |
| `getAppMetrics()`                         | `Promise<ProcessMetric[]>`       |
| `isEmojiPanelSupported()`                 | `Promise<boolean>`               |
| `showEmojiPanel()`                        | `Promise<void>`                  |
| `getFileIcon(path, [options])`            | `Promise<SerializedNativeImage>` |

#### Events

| Event                           | Data Type                                      |
| ------------------------------- | ---------------------------------------------- |
| `window-all-closed`             | `void`                                         |
| `quit`                          | `{ exitCode: number }`                         |
| `browser-window-created`        | `{ id: number; title: string }`                |
| `browser-window-focus`          | `{ id: number; title: string }`                |
| `browser-window-blur`           | `{ id: number; title: string }`                |
| `web-contents-created`          | `{ id: number }`                               |
| `open-file`                     | `{ path: string }`                             |
| `open-url`                      | `{ url: string }`                              |
| `second-instance`               | `{ argv: string[]; workingDirectory: string }` |
| `accessibility-support-changed` | `{ enabled: boolean }`                         |

```typescript
// Subscribe to events
app.on("window-all-closed", () => {});
app.once("quit", ({ exitCode }) => {});
app.off("browser-window-created");
```

### autoUpdater module

> [!NOTE]
> The `autoUpdater` module only supports macOS and Windows. Linux is not supported.

| Function              | Return Type       |
| --------------------- | ----------------- |
| `checkForUpdates()`   | `Promise<void>`   |
| `quitAndInstall()`    | `Promise<void>`   |
| `setFeedURL(options)` | `Promise<void>`   |
| `getFeedURL()`        | `Promise<string>` |

#### Events

| Event                    | Data Type     |
| ------------------------ | ------------- |
| `checking-for-update`    | `void`        |
| `update-available`       | `void`        |
| `update-not-available`   | `void`        |
| `update-downloaded`      | `UpdateInfo`  |
| `error`                  | `UpdateError` |
| `before-quit-for-update` | `void`        |

```typescript
import { autoUpdater } from "electron-main-bridge/renderer/auto-updater";

// Set the update feed URL (must be called before checkForUpdates)
await autoUpdater.setFeedURL({
  url: "https://example.com/updates",
  headers: { Authorization: "Bearer token" },
});

// Check for updates
await autoUpdater.checkForUpdates();

// Subscribe to events
autoUpdater.on("update-available", () => {
  console.log("Update available!");
});

autoUpdater.on("update-downloaded", ({ releaseNotes, releaseName }) => {
  console.log(`Update downloaded: ${releaseName}`);
  // Notify user and ask if they want to restart
});

autoUpdater.on("error", ({ message }) => {
  console.error("Update error:", message);
});

// Quit and install the update
await autoUpdater.quitAndInstall();
```

### dialog module

| Function                       | Return Type                      |
| ------------------------------ | -------------------------------- |
| `showOpenDialog([options])`    | `Promise<OpenDialogReturnValue>` |
| `showSaveDialog([options])`    | `Promise<SaveDialogReturnValue>` |
| `showMessageBox(options)`      | `Promise<MessageBoxReturnValue>` |
| `showErrorBox(title, content)` | `Promise<void>`                  |

```typescript
import { dialog } from "electron-main-bridge/renderer/dialog";

// Open file dialog
const { filePaths, canceled } = await dialog.showOpenDialog({
  properties: ["openFile", "multiSelections"],
  filters: [
    { name: "Images", extensions: ["jpg", "png", "gif"] },
    { name: "All Files", extensions: ["*"] },
  ],
});

if (!canceled && filePaths.length > 0) {
  console.log("Selected files:", filePaths);
}

// Save file dialog
const { filePath } = await dialog.showSaveDialog({
  defaultPath: "untitled.txt",
  filters: [{ name: "Text Files", extensions: ["txt"] }],
});

if (filePath) {
  console.log("Save path:", filePath);
}

// Show message box
const { response, checkboxChecked } = await dialog.showMessageBox({
  type: "question",
  title: "Confirm",
  message: "Are you sure?",
  buttons: ["Yes", "No"],
  checkboxLabel: "Remember my choice",
});

console.log("Selected button:", response);
console.log("Checkbox checked:", checkboxChecked);

// Show error box
await dialog.showErrorBox("Error", "Something went wrong!");
```

### globalShortcut module

> [!NOTE]
> Global shortcuts can be registered even when the application does not have focus.

| Function                    | Return Type          |
| --------------------------- | -------------------- |
| `register(accelerator)`     | `Promise<boolean>`   |
| `registerAll(accelerators)` | `Promise<boolean[]>` |
| `isRegistered(accelerator)` | `Promise<boolean>`   |
| `unregister(accelerator)`   | `Promise<void>`      |
| `unregisterAll()`           | `Promise<void>`      |
| `onAccelerator(callback)`   | `() => void`         |

```typescript
import * as globalShortcut from "electron-main-bridge/renderer/globalShortcut";

// Register a single shortcut
const success = await globalShortcut.register("CommandOrControl+X");
if (!success) {
  console.log("Shortcut registration failed");
}

// Register multiple shortcuts
const results = await globalShortcut.registerAll([
  "CommandOrControl+C",
  "CommandOrControl+V",
  "CommandOrControl+A",
]);
console.log("Registration results:", results);

// Check if shortcut is registered
const isRegistered = await globalShortcut.isRegistered("CommandOrControl+X");
console.log("Shortcut registered:", isRegistered);

// Listen for shortcut events
const unsubscribe = globalShortcut.onAccelerator((accelerator) => {
  console.log(`Shortcut pressed: ${accelerator}`);
  // Handle different shortcuts
  switch (accelerator) {
    case "CommandOrControl+X":
      // Cut operation
      break;
    case "CommandOrControl+C":
      // Copy operation
      break;
    case "CommandOrControl+V":
      // Paste operation
      break;
  }
});

// Unregister a specific shortcut
await globalShortcut.unregister("CommandOrControl+X");

// Unregister all shortcuts (e.g., when quitting)
await globalShortcut.unregisterAll();

// Stop listening for events
unsubscribe();
```

### session module

> [!NOTE]
> The `session` module requires passing a `Session` instance (e.g., `win.webContents.session`) when registering.

| Function                      | Return Type               |
| ----------------------------- | ------------------------- |
| `setDownloadPath(path)`       | `Promise<void>`           |
| `downloadURL(url)`            | `Promise<string>`         |
| `getCacheSize()`              | `Promise<number>`         |
| `clearCache()`                | `Promise<void>`           |
| `clearStorageData([options])` | `Promise<void>`           |
| `clearData([options])`        | `Promise<void>`           |
| `getStoragePath()`            | `Promise<string \| null>` |
| `isPersistent()`              | `Promise<boolean>`        |
| `getUserAgent()`              | `Promise<string>`         |
| `setUserAgent(options)`       | `Promise<void>`           |
| `getSessionHash()`            | `Promise<string>`         |

#### Download Item Operations

| Function                     | Return Type     |
| ---------------------------- | --------------- |
| `item.pause(id)`             | `Promise<void>` |
| `item.resume(id)`            | `Promise<void>` |
| `item.cancel(id)`            | `Promise<void>` |
| `item.setSavePath(id, path)` | `Promise<void>` |

#### Events

| Event               | Data Type                                         |
| ------------------- | ------------------------------------------------- |
| `will-download`     | `{ item: DownloadItem, sessionHash? }`            |
| `download-progress` | `{ id, receivedBytes, totalBytes, sessionHash? }` |
| `download-done`     | `{ id, state, path, sessionHash? }`               |

```typescript
import { session } from "electron-main-bridge/renderer/session";

// Set download directory
await session.setDownloadPath("/path/to/downloads");

// Start a download
const url = await session.downloadURL("https://example.com/file.zip");

// Listen for download events
session.onWillDownload(({ item }) => {
  console.log("Download started:", item.filename);
});

session.onDownloadProgress(({ id, receivedBytes, totalBytes }) => {
  const percent = ((receivedBytes / totalBytes) * 100).toFixed(2);
  console.log(`Progress: ${percent}%`);
});

session.onDownloadDone(({ id, state, path }) => {
  console.log(`Download ${state}:`, path);
});

// If you use multiple sessions, use the session hash to scope events
const sessionHash = await session.getSessionHash();
session.onWillDownload(({ item }) => {
  console.log("Scoped download:", item.filename);
}, sessionHash);

// Control downloads
await session.item.pause(itemId);
await session.item.resume(itemId);
await session.item.cancel(itemId);

// Clear cache
await session.clearCache();
const size = await session.getCacheSize();
console.log("Cache size:", size, "bytes");

// User agent
const ua = await session.getUserAgent();
await session.setUserAgent({
  userAgent: "MyApp/1.0",
  acceptLanguages: "en-US,fr,de",
});
```

#### Main Process Registration

```typescript
import { BrowserWindow } from "electron";
import { registerSessionModule } from "electron-main-bridge/main/session";

const win = new BrowserWindow();
// Pass the window's session instance
registerSessionModule(rpc, win.webContents.session);
```

### menu module

| Function                               | Return Type                     |
| -------------------------------------- | ------------------------------- |
| `setApplicationMenu(template)`         | `Promise<void>`                 |
| `getApplicationMenu()`                 | `Promise<MenuData \| null>`     |
| `buildFromTemplate(template)`          | `Promise<MenuData>`             |
| `sendActionToFirstResponder(action)`   | `Promise<void>`                 |
| `popup(options)`                       | `Promise<void>`                 |
| `closePopup(windowId)`                 | `Promise<void>`                 |
| `append(menuItem, windowId)`           | `Promise<void>`                 |
| `getMenuItemById(id, windowId)`        | `Promise<MenuItemData \| null>` |
| `insert(menuItem, position, windowId)` | `Promise<void>`                 |
| `getItems(windowId)`                   | `Promise<MenuItemData[]>`       |

#### Events

| Event             | Data Type               |
| ----------------- | ----------------------- |
| `menu-will-show`  | `{ windowId?: number }` |
| `menu-will-close` | `{ windowId?: number }` |

```typescript
import * as menu from "electron-main-bridge/renderer/menu";

// Set application menu
await menu.setApplicationMenu([
  {
    label: "File",
    submenu: [
      { label: "New", role: "new" },
      { label: "Open", role: "open" },
      { type: "separator" },
      { label: "Quit", role: "quit" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { label: "Undo", role: "undo" },
      { label: "Redo", role: "redo" },
      { type: "separator" },
      { label: "Cut", role: "cut" },
      { label: "Copy", role: "copy" },
      { label: "Paste", role: "paste" },
    ],
  },
]);

// Clear application menu
await menu.setApplicationMenu(null);

// Get current menu
const currentMenu = await menu.getApplicationMenu();

// Show context menu
await menu.popup({
  windowId: 1,
  x: 100,
  y: 100,
  menuItems: [
    { label: "Option 1", id: "opt1" },
    { label: "Option 2", id: "opt2" },
  ],
});

// Listen for menu events
menu.on("menu-will-show", ({ windowId }) => {
  console.log("Menu will show for window:", windowId);
});

menu.once("menu-will-close", () => {
  console.log("Menu will close");
});
```

### power-monitor module

| Function                            | Return Type        |
| ----------------------------------- | ------------------ |
| `getSystemIdleState(idleThreshold)` | `Promise<string>`  |
| `getSystemIdleTime()`               | `Promise<number>`  |
| `getCurrentThermalState()`          | `Promise<string>`  |
| `isOnBatteryPower()`                | `Promise<boolean>` |

#### Events

| Event                    | Data Type                  |
| ------------------------ | -------------------------- |
| `suspend`                | `void`                     |
| `resume`                 | `void`                     |
| `on-ac`                  | `void`                     |
| `on-battery`             | `void`                     |
| `thermal-state-change`   | `{ thermalState: string }` |
| `speed-limit-change`     | `{ speedLimit: number }`   |
| `shutdown`               | `void`                     |
| `lock-screen`            | `void`                     |
| `unlock-screen`          | `void`                     |
| `user-did-become-active` | `void`                     |
| `user-did-resign-active` | `void`                     |

```typescript
import * as powerMonitor from "electron-main-bridge/renderer/power-monitor";

// Get system idle state
const idleState = await powerMonitor.getSystemIdleState(60); // threshold in seconds
console.log("Idle state:", idleState); // 'active', 'idle', 'locked', 'unknown'

// Get system idle time
const idleTime = await powerMonitor.getSystemIdleTime();
console.log("Idle time:", idleTime, "seconds");

// Check if on battery power
const isOnBattery = await powerMonitor.isOnBatteryPower();
console.log("On battery:", isOnBattery);

// Get thermal state
const thermalState = await powerMonitor.getCurrentThermalState();
console.log("Thermal state:", thermalState); // 'unknown', 'nominal', 'fair', 'serious', 'critical'

// Monitor power events
powerMonitor.on("on-battery", () => {
  console.log("Switched to battery power");
  // Enable power-saving mode
});

powerMonitor.on("on-ac", () => {
  console.log("Switched to AC power");
  // Disable power-saving mode
});

powerMonitor.on("suspend", () => {
  console.log("System is suspending");
  // Save work
});

powerMonitor.on("resume", () => {
  console.log("System resumed");
  // Refresh data
});

powerMonitor.on("thermal-state-change", ({ thermalState }) => {
  console.log("Thermal state changed:", thermalState);
  if (thermalState === "critical") {
    // Reduce workload
  }
});
```

### power-save-blocker module

| Function        | Return Type        |
| --------------- | ------------------ |
| `start(type)`   | `Promise<number>`  |
| `stop(id)`      | `Promise<void>`    |
| `isStarted(id)` | `Promise<boolean>` |

#### Types

| Type                   | Values                                                  |
| ---------------------- | ------------------------------------------------------- |
| `PowerSaveBlockerType` | `'prevent-display-sleep'` \| `'prevent-app-suspension'` |

```typescript
import * as powerSaveBlocker from "electron-main-bridge/renderer/power-save-blocker";

// Prevent display from sleeping
const displayBlockerId = await powerSaveBlocker.start("prevent-display-sleep");
console.log("Display blocker ID:", displayBlockerId);

// Prevent app from being suspended
const appBlockerId = await powerSaveBlocker.start("prevent-app-suspension");
console.log("App blocker ID:", appBlockerId);

// Check if blocker is active
const isActive = await powerSaveBlocker.isStarted(displayBlockerId);
console.log("Blocker active:", isActive);

// Stop blocker when done
await powerSaveBlocker.stop(displayBlockerId);
await powerSaveBlocker.stop(appBlockerId);

// Example: Prevent sleep during file download
async function downloadWithBlocker() {
  const blockerId = await powerSaveBlocker.start("prevent-display-sleep");
  try {
    await startDownload();
  } finally {
    await powerSaveBlocker.stop(blockerId);
  }
}
```

### push-notifications module

> [!NOTE]
> This module is **macOS only**.

| Function                           | Return Type        |
| ---------------------------------- | ------------------ |
| `registerForAPNSNotifications()`   | `Promise<boolean>` |
| `unregisterForAPNSNotifications()` | `Promise<void>`    |

#### Events

| Event                        | Data Type          |
| ---------------------------- | ------------------ |
| `received-apns-notification` | `string` (message) |

```typescript
import * as pushNotifications from "electron-main-bridge/renderer/push-notifications";

// Register for APNS notifications
const success = await pushNotifications.registerForAPNSNotifications();
if (success) {
  console.log("APNS registration successful");
} else {
  console.log("APNS registration failed");
}

// Listen for incoming notifications
pushNotifications.on("received-apns-notification", (message) => {
  console.log("Received notification:", message);
  // Handle the notification
});

// Unregister when done
await pushNotifications.unregisterForAPNSNotifications();
```

### safe-storage module

| Function                                  | Return Type               |
| ----------------------------------------- | ------------------------- |
| `isEncryptionAvailable()`                 | `Promise<boolean>`        |
| `encryptString(plaintext)`                | `Promise<Uint8Array>`     |
| `decryptString(ciphertext)`               | `Promise<string>`         |
| `setUsePlainTextEncryption(usePlainText)` | `Promise<void>` (Linux)   |
| `getSelectedStorageBackend()`             | `Promise<string>` (Linux) |

```typescript
import * as safeStorage from "electron-main-bridge/renderer/safe-storage";

// Check if encryption is available
const isAvailable = await safeStorage.isEncryptionAvailable();
if (!isAvailable) {
  console.log("Safe storage not available");
}

// Encrypt sensitive data
const plaintext = "my-secret-password";
const encrypted = await safeStorage.encryptString(plaintext);
console.log("Encrypted:", encrypted);

// Decrypt data
const decrypted = await safeStorage.decryptString(encrypted);
console.log("Decrypted:", decrypted); // "my-secret-password"

// Linux specific: set encryption method
if (process.platform === "linux") {
  await safeStorage.setUsePlainTextEncryption(true);
  const backend = await safeStorage.getSelectedStorageBackend();
  console.log("Using backend:", backend); // 'basic_text', 'gnome_libsecret', 'kwallet'
}

// Example: Store API token securely
async function storeApiToken(token: string) {
  if (!(await safeStorage.isEncryptionAvailable())) {
    throw new Error("Safe storage not available");
  }
  const encrypted = await safeStorage.encryptString(token);
  // Store encrypted token to config file
  localStorage.setItem("api-token", JSON.stringify(Array.from(encrypted)));
}

async function getApiToken(): Promise<string> {
  const stored = localStorage.getItem("api-token");
  if (!stored) return "";
  const encrypted = new Uint8Array(JSON.parse(stored));
  return await safeStorage.decryptString(encrypted);
}
```

### screen module

| Function                        | Return Type          |
| ------------------------------- | -------------------- |
| `getCursorScreenPoint()`        | `Promise<Point>`     |
| `getPrimaryDisplay()`           | `Promise<Display>`   |
| `getAllDisplays()`              | `Promise<Display[]>` |
| `getDisplayNearestPoint(point)` | `Promise<Display>`   |
| `getDisplayMatching(rect)`      | `Promise<Display>`   |
| `screenToDipPoint(point)`       | `Promise<Point>`     |
| `dipToScreenPoint(point)`       | `Promise<Point>`     |
| `screenToDipRect(rect)`         | `Promise<Rectangle>` |
| `dipToScreenRect(rect)`         | `Promise<Rectangle>` |

#### Events

| Event                     | Data Type |
| ------------------------- | --------- |
| `display-added`           | `Display` |
| `display-removed`         | `Display` |
| `display-metrics-changed` | `Display` |

```typescript
import * as screen from "electron-main-bridge/renderer/screen";

// Get cursor position
const cursor = await screen.getCursorScreenPoint();
console.log("Cursor:", cursor.x, cursor.y);

// Get primary display
const primary = await screen.getPrimaryDisplay();
console.log("Primary display:", primary.size.width, "x", primary.size.height);

// Get all displays
const displays = await screen.getAllDisplays();
console.log("Number of displays:", displays.length);

// Find display nearest to cursor
const nearest = await screen.getDisplayNearestPoint(cursor);
console.log("Nearest display:", nearest.id);

// Listen for display changes
screen.on("display-added", (display) => {
  console.log("Display added:", display.id);
});

screen.on("display-removed", (display) => {
  console.log("Display removed:", display.id);
});

screen.on("display-metrics-changed", (display) => {
  console.log("Display metrics changed:", display.id);
  // Recalculate window positions if needed
});

// Convert between screen pixels and DIP points (Windows/Linux)
const dipPoint = await screen.screenToDipPoint({ x: 1920, y: 1080 });
const screenPoint = await screen.dipToScreenPoint(dipPoint);
```

### share-menu module

> [!NOTE]
> This module is **macOS only**.

| Function                      | Return Type     |
| ----------------------------- | --------------- |
| `popup(sharingItem, options)` | `Promise<void>` |
| `closePopup(windowId)`        | `Promise<void>` |

```typescript
import * as shareMenu from "electron-main-bridge/renderer/share-menu";

// Show share menu
await shareMenu.popup(
  {
    type: "file",
    files: ["/path/to/file.pdf"],
  },
  {
    windowId: 1,
    x: 100,
    y: 100,
  },
);

// Share URL
await shareMenu.popup({
  type: "url",
  url: "https://example.com",
});

// Share text
await shareMenu.popup({
  type: "string",
  string: "Check this out!",
});

// Close the share menu
await shareMenu.closePopup(1);
```

### shell module

| Function                                              | Return Type                          |
| ----------------------------------------------------- | ------------------------------------ |
| `openExternal(url, options)`                          | `Promise<void>`                      |
| `openPath(path)`                                      | `Promise<string>` (app)              |
| `showItemInFolder(path)`                              | `Promise<void>`                      |
| `beep()`                                              | `Promise<void>`                      |
| `trashItem(path)`                                     | `Promise<void>`                      |
| `writeShortcutLink(shortcutPath, operation, options)` | `Promise<void>` (Windows)            |
| `readShortcutLink(shortcutPath)`                      | `Promise<ShortcutDetails>` (Windows) |

```typescript
import * as shell from "electron-main-bridge/renderer/shell";

// Open URL in default browser
await shell.openExternal("https://example.com");

// Open file in default application
const app = await shell.openPath("/path/to/document.pdf");
console.log("Opened with:", app);

// Show file in file explorer
await shell.showItemInFolder("/path/to/file.txt");

// Play system beep
await shell.beep();

// Move file to trash
await shell.trashItem("/path/to/unwanted-file.txt");

// Windows specific: create shortcut
if (process.platform === "win32") {
  await shell.writeShortcutLink("C:\\Users\\User\\Desktop\\MyApp.lnk", "create", {
    target: "C:\\Program Files\\MyApp\\app.exe",
    description: "My Application",
    icon: "C:\\Program Files\\MyApp\\icon.ico",
    iconIndex: 0,
  });

  // Read shortcut details
  const details = await shell.readShortcutLink("C:\\Users\\User\\Desktop\\MyApp.lnk");
  console.log("Shortcut target:", details.target);
}
```

### tray module

| Function                             | Return Type                       |
| ------------------------------------ | --------------------------------- |
| `destroy()`                          | `Promise<void>`                   |
| `setImage(image)`                    | `Promise<void>`                   |
| `setPressedImage(image)`             | `Promise<void>` (macOS)           |
| `setToolTip(toolTip)`                | `Promise<void>`                   |
| `setTitle(title)`                    | `Promise<void>` (macOS)           |
| `getTitle()`                         | `Promise<string>` (macOS)         |
| `setIgnoreDoubleClickEvents(ignore)` | `Promise<void>` (macOS)           |
| `getIgnoreDoubleClickEvents()`       | `Promise<boolean>` (macOS)        |
| `setContextMenu(menuTemplate)`       | `Promise<void>`                   |
| `displayBalloon(options)`            | `Promise<void>` (Windows)         |
| `removeBalloon()`                    | `Promise<void>` (Windows)         |
| `focus()`                            | `Promise<void>` (Windows)         |
| `getBounds()`                        | `Promise<Rectangle>`              |
| `getGUID()`                          | `Promise<string>` (macOS/Windows) |
| `isDestroyed()`                      | `Promise<boolean>`                |

#### Events

| Event            | Data Type             |
| ---------------- | --------------------- |
| `click`          | `void`                |
| `right-click`    | `void`                |
| `double-click`   | `void`                |
| `balloon-show`   | `void` (Windows)      |
| `balloon-click`  | `void` (Windows)      |
| `balloon-closed` | `void` (Windows)      |
| `drop-files`     | `{ files: string[] }` |

```typescript
import * as tray from "electron-main-bridge/renderer/tray";

// Set tray icon
await tray.setImage("/path/to/icon.png");

// Set tooltip
await tray.setToolTip("My Application");

// macOS specific: set title and ignore double-click
if (process.platform === "darwin") {
  await tray.setTitle("1");
  await tray.setIgnoreDoubleClickEvents(true);
  const title = await tray.getTitle();
  console.log("Tray title:", title);
}

// Set context menu
await tray.setContextMenu([
  { label: "Show App", id: "show" },
  { label: "Settings", id: "settings" },
  { type: "separator" },
  { label: "Quit", role: "quit" },
]);

// Windows specific: show balloon
if (process.platform === "win32") {
  await tray.displayBalloon({
    iconType: "info",
    title: "Notification",
    content: "You have a new message!",
  });
  await tray.focus();
}

// Listen for tray events
tray.on("click", () => {
  console.log("Tray clicked");
  // Show/hide window
});

tray.on("right-click", () => {
  console.log("Right-clicked tray icon");
});

tray.on("drop-files", ({ files }) => {
  console.log("Dropped files:", files);
  // Process dropped files
});

// Get tray bounds
const bounds = await tray.getBounds();
console.log("Tray bounds:", bounds);

// Clean up
await tray.destroy();
```

### notification module

| Function                | Return Type                             |
| ----------------------- | --------------------------------------- |
| `show(options)`         | `Promise<NotificationInstance>`         |
| `close()`               | `Promise<void>`                         |
| `getTitle()`            | `Promise<string>`                       |
| `getSubtitle()`         | `Promise<string>` (macOS)               |
| `getBody()`             | `Promise<string>`                       |
| `getSilent()`           | `Promise<boolean>`                      |
| `getReplyPlaceholder()` | `Promise<string>` (macOS)               |
| `getSound()`            | `Promise<string>` (macOS)               |
| `getCloseButtonText()`  | `Promise<string>` (macOS)               |
| `getHasReply()`         | `Promise<boolean>` (macOS)              |
| `getUrgency()`          | `Promise<string>` (Linux)               |
| `getTimeoutType()`      | `Promise<string>` (Linux/Windows)       |
| `getActions()`          | `Promise<NotificationAction[]>` (macOS) |
| `getToastXml()`         | `Promise<string>` (Windows)             |

#### Events

| Event    | Data Type                         |
| -------- | --------------------------------- |
| `show`   | `void`                            |
| `click`  | `void`                            |
| `close`  | `void`                            |
| `reply`  | `{ reply: string }` (macOS)       |
| `action` | `{ actionIndex: number }` (macOS) |
| `failed` | `void` (Linux/Windows)            |

```typescript
import * as notification from "electron-main-bridge/renderer/notification";

// Show a notification
const instance = await notification.show({
  title: "New Message",
  body: "You have received a new message",
  icon: "/path/to/icon.png",
  silent: false,
});

// macOS specific: interactive notification
if (process.platform === "darwin") {
  const macNotification = await notification.show({
    title: "Message",
    body: "Do you want to reply?",
    hasReply: true,
    replyPlaceholder: "Type your reply...",
    actions: [
      { type: "button", text: "Reply" },
      { type: "button", text: "Ignore" },
    ],
    closeButtonText: "Close",
  });

  notification.on("reply", ({ reply }) => {
    console.log("User replied:", reply);
  });

  notification.on("action", ({ actionIndex }) => {
    console.log("Action clicked:", actionIndex);
  });
}

// Linux specific: urgency level
if (process.platform === "linux") {
  const urgency = await notification.getUrgency();
  console.log("Urgency:", urgency); // 'normal', 'critical', 'low'
}

// Listen for notification events
notification.on("show", () => {
  console.log("Notification shown");
});

notification.on("click", () => {
  console.log("Notification clicked");
  // Focus window or perform action
});

notification.on("close", () => {
  console.log("Notification closed");
});

// Windows specific: Toast XML
if (process.platform === "win32") {
  const xml = await notification.getToastXml();
  console.log("Toast XML:", xml);
}

// Close notification
await notification.close();
```

### system-preferences module

#### macOS Specific

| Function                                          | Return Type        |
| ------------------------------------------------- | ------------------ |
| `isSwipeTrackingFromScrollEventsEnabled()`        | `Promise<boolean>` |
| `postNotification(event, userInfo)`               | `Promise<void>`    |
| `postLocalNotification(event, userInfo)`          | `Promise<void>`    |
| `postWorkspaceNotification(event, userInfo)`      | `Promise<void>`    |
| `subscribeNotification(event, callback)`          | `Promise<void>`    |
| `subscribeLocalNotification(event, callback)`     | `Promise<void>`    |
| `subscribeWorkspaceNotification(event, callback)` | `Promise<void>`    |
| `registerDefaults(defaults)`                      | `Promise<void>`    |
| `getUserDefault(key, type)`                       | `Promise<unknown>` |
| `setUserDefault(key, value)`                      | `Promise<void>`    |
| `removeUserDefault(key)`                          | `Promise<void>`    |
| `getEffectiveAppearance()`                        | `Promise<string>`  |
| `canPromptTouchID()`                              | `Promise<boolean>` |
| `promptTouchID(reason)`                           | `Promise<boolean>` |
| `isTrustedAccessibilityClient(prompt)`            | `Promise<boolean>` |
| `getMediaAccessStatus(mediaType)`                 | `Promise<string>`  |
| `askForMediaAccess(mediaType)`                    | `Promise<string>`  |

#### Windows/macOS Specific

| Function                | Return Type                       |
| ----------------------- | --------------------------------- |
| `getAccentColor()`      | `Promise<Uint8Array>` (Windows)   |
| `getColor(color)`       | `Promise<string>` (Windows/macOS) |
| `getSystemColor(color)` | `Promise<string>` (macOS)         |

#### Cross-platform

| Function                 | Return Type                  |
| ------------------------ | ---------------------------- |
| `getAnimationSettings()` | `Promise<AnimationSettings>` |

#### Events (macOS)

| Event                    | Data Type                              |
| ------------------------ | -------------------------------------- |
| `notification`           | `{ event: string; userInfo: unknown }` |
| `local-notification`     | `{ event: string; userInfo: unknown }` |
| `workspace-notification` | `{ event: string; userInfo: unknown }` |

```typescript
import * as systemPreferences from "electron-main-bridge/renderer/system-preferences";

// macOS: Subscribe to notifications
if (process.platform === "darwin") {
  systemPreferences.subscribeNotification("NSWindowDidMoveNotification", ({ event, userInfo }) => {
    console.log("Window moved:", userInfo);
  });

  systemPreferences.on("notification", ({ event, userInfo }) => {
    console.log("Notification:", event, userInfo);
  });

  // Post notifications
  await systemPreferences.postLocalNotification("MyCustomNotification", {
    message: "Custom event data",
  });

  // User defaults
  await systemPreferences.registerDefaults({ mySetting: "default-value" });
  const setting = await systemPreferences.getUserDefault("mySetting", "string");
  await systemPreferences.setUserDefault("mySetting", "new-value");
  await systemPreferences.removeUserDefault("mySetting");

  // Appearance
  const appearance = await systemPreferences.getEffectiveAppearance();
  console.log("Appearance:", appearance); // 'dark', 'light', 'unknown'

  // Touch ID
  const canPromptTouchID = await systemPreferences.canPromptTouchID();
  if (canPromptTouchID) {
    const verified = await systemPreferences.promptTouchID("Authenticate to access sensitive data");
    if (verified) {
      // User authenticated
    }
  }

  // Accessibility
  const trusted = await systemPreferences.isTrustedAccessibilityClient(false);
  console.log("Trusted accessibility client:", trusted);

  // Media access (camera/microphone)
  const cameraStatus = await systemPreferences.getMediaAccessStatus("video");
  if (cameraStatus !== "granted") {
    const newStatus = await systemPreferences.askForMediaAccess("video");
    console.log("Camera access:", newStatus);
  }
}

// Windows/macOS: Colors
if (process.platform === "win32") {
  const accentColor = await systemPreferences.getAccentColor();
  console.log("Accent color:", accentColor);
  const windowColor = await systemPreferences.getColor("window");
  console.log("Window color:", windowColor);
}

if (process.platform === "darwin") {
  const systemColor = await systemPreferences.getSystemColor("windowBackgroundColor");
  console.log("System color:", systemColor);
}

// Animation settings (cross-platform)
const animSettings = await systemPreferences.getAnimationSettings();
console.log("Animation settings:", animSettings);
```

### browserWindow module

#### Window Lifecycle

| Function            | Return Type                  |
| ------------------- | ---------------------------- |
| `create(options)`   | `Promise<number>` (windowId) |
| `close(windowId)`   | `Promise<void>`              |
| `destroy(windowId)` | `Promise<void>`              |

#### Display Control

| Function                              | Return Type                |
| ------------------------------------- | -------------------------- |
| `show(windowId)`                      | `Promise<void>`            |
| `hide(windowId)`                      | `Promise<void>`            |
| `minimize(windowId)`                  | `Promise<void>`            |
| `maximize(windowId)`                  | `Promise<void>`            |
| `unmaximize(windowId)`                | `Promise<void>`            |
| `restore(windowId)`                   | `Promise<void>`            |
| `setFullScreen(windowId, full)`       | `Promise<void>`            |
| `isFullScreen(windowId)`              | `Promise<boolean>`         |
| `setSimpleFullScreen(windowId, full)` | `Promise<void>` (macOS)    |
| `isSimpleFullScreen(windowId)`        | `Promise<boolean>` (macOS) |

#### Focus & Visibility

| Function              | Return Type        |
| --------------------- | ------------------ |
| `focus(windowId)`     | `Promise<void>`    |
| `blur(windowId)`      | `Promise<void>`    |
| `isVisible(windowId)` | `Promise<boolean>` |
| `isFocused(windowId)` | `Promise<boolean>` |

#### Window Properties

| Function                                 | Return Type       |
| ---------------------------------------- | ----------------- |
| `setTitle(windowId, title)`              | `Promise<void>`   |
| `getTitle(windowId)`                     | `Promise<string>` |
| `setOpacity(windowId, opacity)`          | `Promise<void>`   |
| `getOpacity(windowId)`                   | `Promise<number>` |
| `setBackgroundColor(windowId, color)`    | `Promise<void>`   |
| `setSkipTaskbar(windowId, skip)`         | `Promise<void>`   |
| `setContentProtection(windowId, enable)` | `Promise<void>`   |

#### Window Bounds

| Function                          | Return Type                                  |
| --------------------------------- | -------------------------------------------- |
| `getBounds(windowId)`             | `Promise<Rectangle>`                         |
| `setBounds(windowId, bounds)`     | `Promise<void>`                              |
| `getSize(windowId)`               | `Promise<{ width: number; height: number }>` |
| `setSize(windowId, size)`         | `Promise<void>`                              |
| `getPosition(windowId)`           | `Promise<{ x: number; y: number }>`          |
| `setPosition(windowId, position)` | `Promise<void>`                              |
| `center(windowId)`                | `Promise<void>`                              |

#### Size Constraints

| Function                         | Return Type                                  |
| -------------------------------- | -------------------------------------------- |
| `setMinimumSize(windowId, size)` | `Promise<void>`                              |
| `getMinimumSize(windowId)`       | `Promise<{ width: number; height: number }>` |
| `setMaximumSize(windowId, size)` | `Promise<void>`                              |
| `getMaximumSize(windowId)`       | `Promise<{ width: number; height: number }>` |

#### Window Features

| Function                                | Return Type        |
| --------------------------------------- | ------------------ |
| `setResizable(windowId, resizable)`     | `Promise<void>`    |
| `isResizable(windowId)`                 | `Promise<boolean>` |
| `setMovable(windowId, movable)`         | `Promise<void>`    |
| `isMovable(windowId)`                   | `Promise<boolean>` |
| `setMinimizable(windowId, minimizable)` | `Promise<void>`    |
| `isMinimizable(windowId)`               | `Promise<boolean>` |
| `setMaximizable(windowId, maximizable)` | `Promise<void>`    |
| `isMaximizable(windowId)`               | `Promise<boolean>` |
| `setClosable(windowId, closable)`       | `Promise<void>`    |
| `isClosable(windowId)`                  | `Promise<boolean>` |
| `setFocusable(windowId, focusable)`     | `Promise<void>`    |
| `isFocusable(windowId)`                 | `Promise<boolean>` |
| `setAlwaysOnTop(windowId, flag)`        | `Promise<void>`    |
| `isAlwaysOnTop(windowId)`               | `Promise<boolean>` |
| `setKiosk(windowId, flag)`              | `Promise<void>`    |
| `isKiosk(windowId)`                     | `Promise<boolean>` |

#### Menu Bar

| Function                                  | Return Type        |
| ----------------------------------------- | ------------------ |
| `setMenuBarVisibility(windowId, visible)` | `Promise<void>`    |
| `isMenuBarVisible(windowId)`              | `Promise<boolean>` |
| `setAutoHideMenuBar(windowId, hide)`      | `Promise<void>`    |
| `isMenuBarAutoHide(windowId)`             | `Promise<boolean>` |

#### Progress & Flash

| Function                                   | Return Type     |
| ------------------------------------------ | --------------- |
| `setProgressBar(windowId, progress, mode)` | `Promise<void>` |
| `flashFrame(windowId, flag)`               | `Promise<void>` |

#### Content Control

| Function                            | Return Type        |
| ----------------------------------- | ------------------ |
| `loadURL(windowId, url, options)`   | `Promise<void>`    |
| `loadFile(windowId, path, options)` | `Promise<void>`    |
| `reload(windowId)`                  | `Promise<void>`    |
| `executeJavaScript(windowId, code)` | `Promise<unknown>` |
| `openDevTools(windowId, options)`   | `Promise<void>`    |
| `closeDevTools(windowId)`           | `Promise<void>`    |
| `isDevToolsOpened(windowId)`        | `Promise<boolean>` |

#### Window State Queries

| Function                | Return Type        |
| ----------------------- | ------------------ |
| `isMaximized(windowId)` | `Promise<boolean>` |
| `isMinimized(windowId)` | `Promise<boolean>` |
| `isDestroyed(windowId)` | `Promise<boolean>` |
| `exists(windowId)`      | `Promise<boolean>` |

#### Static Methods

| Function             | Return Type               |
| -------------------- | ------------------------- |
| `getAllWindows()`    | `Promise<number[]>`       |
| `getFocusedWindow()` | `Promise<number \| null>` |

#### Events

| Event                | Data Type                                                           |
| -------------------- | ------------------------------------------------------------------- |
| `ready-to-show`      | `{ windowId: number }`                                              |
| `show`               | `{ windowId: number }`                                              |
| `hide`               | `{ windowId: number }`                                              |
| `focus`              | `{ windowId: number }`                                              |
| `blur`               | `{ windowId: number }`                                              |
| `maximize`           | `{ windowId: number }`                                              |
| `unmaximize`         | `{ windowId: number }`                                              |
| `minimize`           | `{ windowId: number }`                                              |
| `restore`            | `{ windowId: number }`                                              |
| `resize`             | `{ windowId: number }`                                              |
| `move`               | `{ windowId: number }`                                              |
| `closed`             | `{ windowId: number }`                                              |
| `page-title-updated` | `{ windowId: number; title: string }`                               |
| `did-finish-load`    | `{ windowId: number }`                                              |
| `did-fail-load`      | `{ windowId: number; errorCode: number; errorDescription: string }` |

```typescript
import * as browserWindow from "electron-main-bridge/renderer/browserWindow";

// Create a new window
const windowId = await browserWindow.create({
  width: 1200,
  height: 800,
  title: "My Window",
  show: false, // Don't show until ready
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
  },
});

// Show window when ready
browserWindow.on(windowId, "ready-to-show", () => {
  browserWindow.show(windowId);
});

// Load content
await browserWindow.loadURL(windowId, "https://example.com");
// Or load local file
// await browserWindow.loadFile(windowId, "/path/to/index.html");

// Control window
await browserWindow.setTitle(windowId, "New Title");
await browserWindow.maximize(windowId);
await browserWindow.center(windowId);

// Check window state
const isMaximized = await browserWindow.isMaximized(windowId);
const isFocused = await browserWindow.isFocused(windowId);
const title = await browserWindow.getTitle(windowId);

// Window bounds
const bounds = await browserWindow.getBounds(windowId);
console.log("Bounds:", bounds);

await browserWindow.setSize(windowId, { width: 1000, height: 700 });
await browserWindow.setPosition(windowId, { x: 100, y: 100 });

// Set minimum/maximum size
await browserWindow.setMinimumSize(windowId, { width: 600, height: 400 });
await browserWindow.setMaximumSize(windowId, { width: 1920, height: 1080 });

// Window features
await browserWindow.setResizable(windowId, false);
await browserWindow.setAlwaysOnTop(windowId, true);
await browserWindow.setProgressBar(windowId, 0.5); // 50%

// Execute JavaScript
const result = await browserWindow.executeJavaScript(windowId, "document.title");
console.log("Page title:", result);

// Listen for window events
browserWindow.on(windowId, "closed", () => {
  console.log("Window closed");
});

browserWindow.on(windowId, "resize", () => {
  console.log("Window resized");
});

browserWindow.on(windowId, "page-title-updated", ({ title }) => {
  console.log("Page title changed to:", title);
});

browserWindow.on(windowId, "did-fail-load", ({ errorCode, errorDescription }) => {
  console.error("Failed to load:", errorCode, errorDescription);
});

// Get all windows
const allWindows = await browserWindow.getAllWindows();
console.log("Open windows:", allWindows);

// Get focused window
const focused = await browserWindow.getFocusedWindow();
console.log("Focused window:", focused);

// Close window
await browserWindow.close(windowId);

// Destroy window
await browserWindow.destroy(windowId);
```

## Important Notes

### AutoUpdater Module

The Electron `autoUpdater` module has platform-specific requirements and limitations:

1. **Platform Support**
   - **macOS**: Built on Squirrel.Mac. Your application **must be signed** for automatic updates to work.
   - **Windows**: Built on Squirrel.Windows. The application must be **installed** (not run from a portable executable) for updates to work. Use tools like `electron-winstaller` or `electron-forge` to create installers.
   - **Linux**: **Not supported**. Use the distribution's package manager instead.

2. **setFeedURL Timing**
   - Must be called **before** `checkForUpdates()`
   - Should be set during app initialization

3. **Automatic Downloads**
   - When `checkForUpdates()` finds an update, it is **automatically downloaded**
   - Calling `checkForUpdates()` multiple times will download the update multiple times

4. **Event Sequence**
   - `checking-for-update` → `update-available` / `update-not-available`
   - If update available → `update-downloaded` (after download completes)
   - Call `quitAndInstall()` → `before-quit-for-update` → app restarts

5. **Update Installation**
   - Calling `quitAndInstall()` is **optional** - downloaded updates are automatically applied on next app start
   - Only call it after receiving the `update-downloaded` event

### App Module Events

Some Electron app events have special behavior when used via IPC:

1. **`ready` / `will-finish-launching`** - These events fire only once, usually before `registerAppModule` is called. Use `app.isReady()` to check the current state instead.

2. **`before-quit` / `will-quit`** - These support `event.preventDefault()` in Electron, but this cannot be done directly across IPC. If you need to prevent quit, implement a custom RPC method.

3. **Window events** - `BrowserWindow` and `WebContents` objects cannot be serialized. Only the window ID and title are forwarded.

4. **Platform-specific events** - macOS-specific events (like `activate`) are forwarded but will only fire on macOS.

### Renderer API Differences vs Main Process

Some renderer-facing APIs intentionally differ from Electron's main-process types to ensure IPC safety:

1. **Menu module**
   - `MenuItemConstructorOptions` is a serializable subset. `click` callbacks are not supported.
   - `PopupOptions` uses `windowId` instead of a `BrowserWindow` instance, and does not accept a `callback`.
   - `setApplicationMenu(template | null)` accepts a template array (or `null` to clear) instead of a `Menu` instance.
   - `buildFromTemplate(template)` returns serialized `MenuData` (not a `Menu` instance).

2. **Session module**
   - Events are published for both `session.<hash>.*` and `session.*`.
   - Event payloads include optional `sessionHash` so you can disambiguate multiple sessions.
   - Use `getSessionHash()` to scope event listeners when multiple sessions are registered.

3. **Tray module**
   - `right-click`, `double-click`, and `middle-click` events do not include a `position` in Electron. The `position` field is optional in this bridge.
   - `setContextMenu(template | null)` accepts a menu template array (or `null` to clear), not a `Menu` instance.
   - Tray menu templates share the same `MenuItemConstructorOptions` limitations (no `click` callbacks).

### GlobalShortcut Module

The Electron `globalShortcut` module has important usage considerations:

1. **Shortcut Conflicts**
   - When an accelerator is already taken by other applications, `register()` will return `false`
   - The OS prevents applications from fighting over global shortcuts
   - Check the return value and inform users if registration fails

2. **macOS Accessibility**
   - On macOS 10.14 Mojave+, media key shortcuts ("Media Play/Pause", "Media Next Track", etc.) require **accessibility authorization**
   - Request accessibility authorization before registering these shortcuts
   - Use `systemPreferences.isAccessibilityEnabled()` and related APIs to check status

3. **Cleanup on Quit**
   - Call `unregisterAll()` in `app.on('will-quit')` to clean up shortcuts
   - This ensures shortcuts are released when the app quits
   - Failure to do so may leave shortcuts registered even after the app closes

4. **Wayland on Linux**
   - For Wayland sessions, add the following switch before app starts:
     ```typescript
     app.commandLine.appendSwitch("enable-features", "GlobalShortcutsPortal");
     ```

5. **Shortcut Format**
   - Accelerator strings follow the format: `Modifier+Key`
   - Modifiers: `Command`, `CommandOrControl`, `Control`, `Alt`, `Option`, `Shift`, `Super`
   - Keys: `A`-`Z`, `0`-`9`, `F1`-`F24`, plus, minus, space, tab, etc.
   - Platform-specific: `Command` is macOS only, `Control` is Linux/Windows, `CommandOrControl` works on all platforms
   - Examples: `"CommandOrControl+X"`, `"Alt+F4"`, `"CommandOrControl+Shift+Z"`

6. **Event Handling**
   - Use `onAccelerator()` to receive shortcut trigger events in the renderer
   - The callback receives the accelerator string that was pressed
   - Remember to call the returned cleanup function when the component unmounts or you no longer need to listen

## License

MIT
