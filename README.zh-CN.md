# electron-main-bridge

![npm version](https://badge.fury.io/js/electron-main-bridge.svg)
[![downloads](https://img.shields.io/npm/dm/electron-main-bridge)](https://www.npmjs.com/package/electron-main-bridge)
[![license](https://img.shields.io/npm/l/electron-main-bridge)](./LICENSE)
[![typescript](https://img.shields.io/npm/types/electron-main-bridge)](https://www.typescriptlang.org/)
[![electron](https://img.shields.io/npm/dependency-version/electron-main-bridge/peer/electron)](https://www.electronjs.org/)

🌐 [English](./README.md) | [中文](./README.zh-CN.md)

> [!WARNING]
> 本项目处于 **alpha** 阶段，API 可能会发生重大变更。

Electron 主进程桥接库 - 通过 JSON-RPC 将主进程功能暴露给渲染进程。

## 项目简介

**electron-main-bridge** 是一个安全地将 Electron 主进程 API 暴露给渲染进程的库，同时保持完整的类型安全。在 Electron 中，出于安全原因，渲染进程对 Node.js API 和主进程模块的访问受到限制。本库使用 [electron-json-rpc](https://github.com/paralog-infinity/electron-json-rpc) 提供了一座桥梁，让您可以在渲染代码中像调用本地函数一样调用主进程函数。

### 为什么使用它？

- **告别繁琐的预加载脚本** - 不再需要重复编写 IPC 处理器和预加载脚本
- **类型安全的 IPC 调用** - 获得完整的 TypeScript 自动补全和跨进程调用类型检查
- **安全优先** - 默认启用 `contextIsolation` 构建
- **模块化架构** - 仅打包您实际使用的 API

### 工作原理

```
┌─────────────────┐     IPC/JSON-RPC      ┌─────────────────┐
│   渲染进程       │ ─────────────────────> │    主进程        │
│                 │                        │                 │
│  fs.readFile()  │                        │  原生 fs API    │
│  app.getVersion()│                       │  原生 app API   │
└─────────────────┘                        └─────────────────┘
```

1. **主进程**：为您想暴露的 Electron API 注册 RPC 处理器
2. **预加载脚本**：通过 `contextBridge` 暴露类型化的 RPC 客户端
3. **渲染进程**：以完整的 TypeScript 支持调用主进程函数

### 覆盖了哪些 API？

| 模块                | 描述                               |
| ------------------- | ---------------------------------- |
| `fs`                | 文件系统操作（读写、状态、目录等） |
| `path`              | 路径处理（拼接、解析、dirname 等） |
| `app`               | 应用生命周期和元数据               |
| `autoUpdater`       | 应用自动更新（macOS/Windows）      |
| `dialog`            | 原生文件/文件夹对话框              |
| `globalShortcut`    | 全局键盘快捷键                     |
| `session`           | 会话管理（Cookie、缓存、下载）     |
| `menu`              | 应用菜单和上下文菜单               |
| `notification`      | 桌面通知                           |
| `screen`            | 显示器和屏幕信息                   |
| `shell`             | 文件关联和外部 URL 打开            |
| `tray`              | 系统托盘图标                       |
| `browserWindow`     | 窗口管理                           |
| `powerMonitor`      | 系统电源状态监控                   |
| `powerSaveBlocker`  | 防止系统休眠                       |
| `safeStorage`       | 安全凭据存储                       |
| `systemPreferences` | 系统级首选项                       |
| `pushNotifications` | APNS 推送通知（macOS）             |
| `shareMenu`         | 原生分享菜单（macOS）              |

## 特性

- 📦 **模块化架构** - 仅导入需要的模块，保持包体积最小
- 🔒 **类型安全的 API** - 完整的 TypeScript 支持，提供自动补全和类型检查
- 🚀 **IPC 兼容类型** - 处理 `Stats`、`Dirent`、`Date` 等复杂类型的序列化
- ⚡ **零样板代码** - 不再需要重复编写 IPC 处理器和预加载脚本
- 🔌 **易于集成** - 即插即用，快速集成到 Electron 应用中

## 打包体积

| 格式                     | 压缩后  | Gzip    |
| ------------------------ | ------- | ------- |
| Main (fs)                | 0.90 kB | 0.31 kB |
| Main (browserWindow)     | 8.88 kB | 1.46 kB |
| Renderer (fs)            | 3.30 kB | 0.81 kB |
| Renderer (browserWindow) | 8.88 kB | 1.46 kB |

## 安装

```bash
bun add electron-main-bridge
```

## 使用

### 主进程

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

### 预加载脚本

```typescript
import { contextBridge, ipcRenderer } from "electron";
import { exposeRpcApi } from "electron-json-rpc/preload";

exposeRpcApi({ contextBridge, ipcRenderer });
```

### 渲染进程

```typescript
import * as fs from "electron-main-bridge/renderer/fs";
import * as path from "electron-main-bridge/renderer/path";
import * as app from "electron-main-bridge/renderer/app";
import * as autoUpdater from "electron-main-bridge/renderer/auto-updater";
import { dialog } from "electron-main-bridge/renderer/dialog";
import * as globalShortcut from "electron-main-bridge/renderer/globalShortcut";

// 文件操作
await fs.writeFile("/path/to/file", "Hello, World!");
const content = await fs.readFile("/path/to/file", "utf-8");

// 路径操作
const fullPath = await path.join("/home", "user", "docs");
const userData = await app.getPath("userData");

// 应用信息
const version = await app.getVersion();
const isReady = await app.isReady();

// 对话框操作
const { filePaths } = await dialog.showOpenDialog({
  properties: ["openFile"],
  filters: [{ name: "Text Files", extensions: ["txt"] }],
});

// 事件监听
app.on("window-all-closed", () => {
  console.log("所有窗口已关闭");
});

const unsubscribe = app.on("browser-window-created", ({ id, title }) => {
  console.log(`窗口已创建: ${id} - ${title}`);
});

// 全局快捷键
await globalShortcut.register("CommandOrControl+X");
await globalShortcut.register("CommandOrControl+C", "CommandOrControl+V");

// 监听快捷键事件
globalShortcut.onAccelerator((accelerator) => {
  console.log(`快捷键按下: ${accelerator}`);
});
```

## 可用 API

### fs 模块

| 函数                               | 返回类型                          |
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

### path 模块

| 函数                   | 返回类型              |
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

### app 模块

#### 应用信息

| 函数                            | 返回类型            |
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

#### 路径管理

| 函数                     | 返回类型          |
| ------------------------ | ----------------- |
| `getPath(name)`          | `Promise<string>` |
| `setPath(name, path)`    | `Promise<void>`   |
| `setAppLogsPath([path])` | `Promise<void>`   |

#### 应用控制

| 函数                  | 返回类型        |
| --------------------- | --------------- |
| `quit()`              | `Promise<void>` |
| `exit([exitCode])`    | `Promise<void>` |
| `relaunch([options])` | `Promise<void>` |
| `focus([options])`    | `Promise<void>` |
| `hide()`              | `Promise<void>` |
| `show()`              | `Promise<void>` |

#### 其他函数

| 函数                                      | 返回类型                         |
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

#### 事件

| 事件                            | 数据类型                                       |
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
// 订阅事件
app.on("window-all-closed", () => {});
app.once("quit", ({ exitCode }) => {});
app.off("browser-window-created");
```

### autoUpdater 模块

> [!NOTE]
> `autoUpdater` 模块仅支持 macOS 和 Windows，不支持 Linux。

| 函数                  | 返回类型          |
| --------------------- | ----------------- |
| `checkForUpdates()`   | `Promise<void>`   |
| `quitAndInstall()`    | `Promise<void>`   |
| `setFeedURL(options)` | `Promise<void>`   |
| `getFeedURL()`        | `Promise<string>` |

#### 事件

| 事件                     | 数据类型      |
| ------------------------ | ------------- |
| `checking-for-update`    | `void`        |
| `update-available`       | `void`        |
| `update-not-available`   | `void`        |
| `update-downloaded`      | `UpdateInfo`  |
| `error`                  | `UpdateError` |
| `before-quit-for-update` | `void`        |

```typescript
import { autoUpdater } from "electron-main-bridge/renderer/auto-updater";

// 设置更新源 URL（必须在 checkForUpdates 之前调用）
await autoUpdater.setFeedURL({
  url: "https://example.com/updates",
  headers: { Authorization: "Bearer token" },
});

// 检查更新
await autoUpdater.checkForUpdates();

// 订阅事件
autoUpdater.on("update-available", () => {
  console.log("发现新版本!");
});

autoUpdater.on("update-downloaded", ({ releaseNotes, releaseName }) => {
  console.log(`更新已下载: ${releaseName}`);
  // 通知用户并询问是否重启
});

autoUpdater.on("error", ({ message }) => {
  console.error("更新错误:", message);
});

// 退出并安装更新
await autoUpdater.quitAndInstall();
```

### dialog 模块

| 函数                           | 返回类型                         |
| ------------------------------ | -------------------------------- |
| `showOpenDialog([options])`    | `Promise<OpenDialogReturnValue>` |
| `showSaveDialog([options])`    | `Promise<SaveDialogReturnValue>` |
| `showMessageBox(options)`      | `Promise<MessageBoxReturnValue>` |
| `showErrorBox(title, content)` | `Promise<void>`                  |

```typescript
import { dialog } from "electron-main-bridge/renderer/dialog";

// 打开文件对话框
const { filePaths, canceled } = await dialog.showOpenDialog({
  properties: ["openFile", "multiSelections"],
  filters: [
    { name: "Images", extensions: ["jpg", "png", "gif"] },
    { name: "All Files", extensions: ["*"] },
  ],
});

if (!canceled && filePaths.length > 0) {
  console.log("选择的文件:", filePaths);
}

// 保存文件对话框
const { filePath } = await dialog.showSaveDialog({
  defaultPath: "untitled.txt",
  filters: [{ name: "Text Files", extensions: ["txt"] }],
});

if (filePath) {
  console.log("保存路径:", filePath);
}

// 显示消息框
const { response, checkboxChecked } = await dialog.showMessageBox({
  type: "question",
  title: "确认",
  message: "确定吗?",
  buttons: ["是", "否"],
  checkboxLabel: "记住我的选择",
});

console.log("选择的按钮:", response);
console.log("复选框已选中:", checkboxChecked);

// 显示错误框
await dialog.showErrorBox("错误", "出错了!");
```

### globalShortcut 模块

> [!NOTE]
> 全局快捷键即使在没有焦点时也可以注册。

| 函数                        | 返回类型             |
| --------------------------- | -------------------- |
| `register(accelerator)`     | `Promise<boolean>`   |
| `registerAll(accelerators)` | `Promise<boolean[]>` |
| `isRegistered(accelerator)` | `Promise<boolean>`   |
| `unregister(accelerator)`   | `Promise<void>`      |
| `unregisterAll()`           | `Promise<void>`      |
| `onAccelerator(callback)`   | `() => void`         |

```typescript
import * as globalShortcut from "electron-main-bridge/renderer/globalShortcut";

// 注册单个快捷键
const success = await globalShortcut.register("CommandOrControl+X");
if (!success) {
  console.log("快捷键注册失败");
}

// 注册多个快捷键
const results = await globalShortcut.registerAll([
  "CommandOrControl+C",
  "CommandOrControl+V",
  "CommandOrControl+A",
]);
console.log("注册结果:", results);

// 检查快捷键是否已注册
const isRegistered = await globalShortcut.isRegistered("CommandOrControl+X");
console.log("快捷键已注册:", isRegistered);

// 监听快捷键事件
const unsubscribe = globalShortcut.onAccelerator((accelerator) => {
  console.log(`快捷键按下: ${accelerator}`);
  // 处理不同的快捷键
  switch (accelerator) {
    case "CommandOrControl+X":
      // 剪切操作
      break;
    case "CommandOrControl+C":
      // 复制操作
      break;
    case "CommandOrControl+V":
      // 粘贴操作
      break;
  }
});

// 注销特定快捷键
await globalShortcut.unregister("CommandOrControl+X");

// 注销所有快捷键（例如退出时）
await globalShortcut.unregisterAll();

// 停止监听事件
unsubscribe();
```

### session 模块

> [!NOTE]
> `session` 模块需要传入 `Session` 实例（如 `win.webContents.session`）进行注册。

| 函数                          | 返回类型                  |
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

#### 下载项操作

| 函数                         | 返回类型        |
| ---------------------------- | --------------- |
| `item.pause(id)`             | `Promise<void>` |
| `item.resume(id)`            | `Promise<void>` |
| `item.cancel(id)`            | `Promise<void>` |
| `item.setSavePath(id, path)` | `Promise<void>` |

#### 事件

| 事件                | 数据类型                                          |
| ------------------- | ------------------------------------------------- |
| `will-download`     | `{ item: DownloadItem, sessionHash? }`            |
| `download-progress` | `{ id, receivedBytes, totalBytes, sessionHash? }` |
| `download-done`     | `{ id, state, path, sessionHash? }`               |

```typescript
import { session } from "electron-main-bridge/renderer/session";

// 设置下载目录
await session.setDownloadPath("/path/to/downloads");

// 开始下载
const url = await session.downloadURL("https://example.com/file.zip");

// 监听下载事件
session.onWillDownload(({ item }) => {
  console.log("下载开始:", item.filename);
});

session.onDownloadProgress(({ id, receivedBytes, totalBytes }) => {
  const percent = ((receivedBytes / totalBytes) * 100).toFixed(2);
  console.log(`进度: ${percent}%`);
});

session.onDownloadDone(({ id, state, path }) => {
  console.log(`下载 ${state}:`, path);
});

// 如果使用多个会话，使用会话哈希来限定事件范围
const sessionHash = await session.getSessionHash();
session.onWillDownload(({ item }) => {
  console.log("限定范围的下载:", item.filename);
}, sessionHash);

// 控制下载
await session.item.pause(itemId);
await session.item.resume(itemId);
await session.item.cancel(itemId);

// 清除缓存
await session.clearCache();
const size = await session.getCacheSize();
console.log("缓存大小:", size, "字节");

// 用户代理
const ua = await session.getUserAgent();
await session.setUserAgent({
  userAgent: "MyApp/1.0",
  acceptLanguages: "en-US,fr,de",
});
```

#### 主进程注册

```typescript
import { BrowserWindow } from "electron";
import { registerSessionModule } from "electron-main-bridge/main/session";

const win = new BrowserWindow();
// 传入窗口的 session 实例
registerSessionModule(rpc, win.webContents.session);
```

### menu 模块

| 函数                                   | 返回类型                        |
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

#### 事件

| 事件              | 数据类型                |
| ----------------- | ----------------------- |
| `menu-will-show`  | `{ windowId?: number }` |
| `menu-will-close` | `{ windowId?: number }` |

```typescript
import * as menu from "electron-main-bridge/renderer/menu";

// 设置应用菜单
await menu.setApplicationMenu([
  {
    label: "文件",
    submenu: [
      { label: "新建", role: "new" },
      { label: "打开", role: "open" },
      { type: "separator" },
      { label: "退出", role: "quit" },
    ],
  },
  {
    label: "编辑",
    submenu: [
      { label: "撤销", role: "undo" },
      { label: "重做", role: "redo" },
      { type: "separator" },
      { label: "剪切", role: "cut" },
      { label: "复制", role: "copy" },
      { label: "粘贴", role: "paste" },
    ],
  },
]);

// 清除应用菜单
await menu.setApplicationMenu(null);

// 获取当前菜单
const currentMenu = await menu.getApplicationMenu();

// 显示上下文菜单
await menu.popup({
  windowId: 1,
  x: 100,
  y: 100,
  menuItems: [
    { label: "选项 1", id: "opt1" },
    { label: "选项 2", id: "opt2" },
  ],
});

// 监听菜单事件
menu.on("menu-will-show", ({ windowId }) => {
  console.log("菜单将显示于窗口:", windowId);
});

menu.once("menu-will-close", () => {
  console.log("菜单将关闭");
});
```

### power-monitor 模块

| 函数                                | 返回类型           |
| ----------------------------------- | ------------------ |
| `getSystemIdleState(idleThreshold)` | `Promise<string>`  |
| `getSystemIdleTime()`               | `Promise<number>`  |
| `getCurrentThermalState()`          | `Promise<string>`  |
| `isOnBatteryPower()`                | `Promise<boolean>` |

#### 事件

| 事件                     | 数据类型                   |
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

// 获取系统空闲状态
const idleState = await powerMonitor.getSystemIdleState(60); // 阈值（秒）
console.log("空闲状态:", idleState); // 'active', 'idle', 'locked', 'unknown'

// 获取系统空闲时间
const idleTime = await powerMonitor.getSystemIdleTime();
console.log("空闲时间:", idleTime, "秒");

// 检查是否使用电池
const isOnBattery = await powerMonitor.isOnBatteryPower();
console.log("使用电池:", isOnBattery);

// 获取散热状态
const thermalState = await powerMonitor.getCurrentThermalState();
console.log("散热状态:", thermalState); // 'unknown', 'nominal', 'fair', 'serious', 'critical'

// 监听电源事件
powerMonitor.on("on-battery", () => {
  console.log("切换到电池供电");
  // 启用省电模式
});

powerMonitor.on("on-ac", () => {
  console.log("切换到交流电源");
  // 禁用省电模式
});

powerMonitor.on("suspend", () => {
  console.log("系统即将挂起");
  // 保存工作
});

powerMonitor.on("resume", () => {
  console.log("系统已恢复");
  // 刷新数据
});

powerMonitor.on("thermal-state-change", ({ thermalState }) => {
  console.log("散热状态已改变:", thermalState);
  if (thermalState === "critical") {
    // 降低工作负载
  }
});
```

### power-save-blocker 模块

| 函数            | 返回类型           |
| --------------- | ------------------ |
| `start(type)`   | `Promise<number>`  |
| `stop(id)`      | `Promise<void>`    |
| `isStarted(id)` | `Promise<boolean>` |

#### 类型

| 类型                   | 值                                                      |
| ---------------------- | ------------------------------------------------------- |
| `PowerSaveBlockerType` | `'prevent-display-sleep'` \| `'prevent-app-suspension'` |

```typescript
import * as powerSaveBlocker from "electron-main-bridge/renderer/power-save-blocker";

// 防止显示器休眠
const displayBlockerId = await powerSaveBlocker.start("prevent-display-sleep");
console.log("显示器阻止器 ID:", displayBlockerId);

// 防止应用被挂起
const appBlockerId = await powerSaveBlocker.start("prevent-app-suspension");
console.log("应用阻止器 ID:", appBlockerId);

// 检查阻止器是否激活
const isActive = await powerSaveBlocker.isStarted(displayBlockerId);
console.log("阻止器激活:", isActive);

// 完成后停止阻止器
await powerSaveBlocker.stop(displayBlockerId);
await powerSaveBlocker.stop(appBlockerId);

// 示例: 下载期间阻止休眠
async function downloadWithBlocker() {
  const blockerId = await powerSaveBlocker.start("prevent-display-sleep");
  try {
    await startDownload();
  } finally {
    await powerSaveBlocker.stop(blockerId);
  }
}
```

### push-notifications 模块

> [!NOTE]
> 此模块 **仅限 macOS**。

| 函数                               | 返回类型           |
| ---------------------------------- | ------------------ |
| `registerForAPNSNotifications()`   | `Promise<boolean>` |
| `unregisterForAPNSNotifications()` | `Promise<void>`    |

#### 事件

| 事件                         | 数据类型        |
| ---------------------------- | --------------- |
| `received-apns-notification` | `string` (消息) |

```typescript
import * as pushNotifications from "electron-main-bridge/renderer/push-notifications";

// 注册 APNS 通知
const success = await pushNotifications.registerForAPNSNotifications();
if (success) {
  console.log("APNS 注册成功");
} else {
  console.log("APNS 注册失败");
}

// 监听传入的通知
pushNotifications.on("received-apns-notification", (message) => {
  console.log("收到通知:", message);
  // 处理通知
});

// 完成后注销
await pushNotifications.unregisterForAPNSNotifications();
```

### safe-storage 模块

| 函数                                      | 返回类型                  |
| ----------------------------------------- | ------------------------- |
| `isEncryptionAvailable()`                 | `Promise<boolean>`        |
| `encryptString(plaintext)`                | `Promise<Uint8Array>`     |
| `decryptString(ciphertext)`               | `Promise<string>`         |
| `setUsePlainTextEncryption(usePlainText)` | `Promise<void>` (Linux)   |
| `getSelectedStorageBackend()`             | `Promise<string>` (Linux) |

```typescript
import * as safeStorage from "electron-main-bridge/renderer/safe-storage";

// 检查加密是否可用
const isAvailable = await safeStorage.isEncryptionAvailable();
if (!isAvailable) {
  console.log("安全存储不可用");
}

// 加密敏感数据
const plaintext = "my-secret-password";
const encrypted = await safeStorage.encryptString(plaintext);
console.log("已加密:", encrypted);

// 解密数据
const decrypted = await safeStorage.decryptString(encrypted);
console.log("已解密:", decrypted); // "my-secret-password"

// Linux 特定: 设置加密方法
if (process.platform === "linux") {
  await safeStorage.setUsePlainTextEncryption(true);
  const backend = await safeStorage.getSelectedStorageBackend();
  console.log("使用后端:", backend); // 'basic_text', 'gnome_libsecret', 'kwallet'
}

// 示例: 安全存储 API 令牌
async function storeApiToken(token: string) {
  if (!(await safeStorage.isEncryptionAvailable())) {
    throw new Error("安全存储不可用");
  }
  const encrypted = await safeStorage.encryptString(token);
  // 将加密令牌存储到配置文件
  localStorage.setItem("api-token", JSON.stringify(Array.from(encrypted)));
}

async function getApiToken(): Promise<string> {
  const stored = localStorage.getItem("api-token");
  if (!stored) return "";
  const encrypted = new Uint8Array(JSON.parse(stored));
  return await safeStorage.decryptString(encrypted);
}
```

### screen 模块

| 函数                            | 返回类型             |
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

#### 事件

| 事件                      | 数据类型  |
| ------------------------- | --------- |
| `display-added`           | `Display` |
| `display-removed`         | `Display` |
| `display-metrics-changed` | `Display` |

```typescript
import * as screen from "electron-main-bridge/renderer/screen";

// 获取光标位置
const cursor = await screen.getCursorScreenPoint();
console.log("光标:", cursor.x, cursor.y);

// 获取主显示器
const primary = await screen.getPrimaryDisplay();
console.log("主显示器:", primary.size.width, "x", primary.size.height);

// 获取所有显示器
const displays = await screen.getAllDisplays();
console.log("显示器数量:", displays.length);

// 查找离光标最近的显示器
const nearest = await screen.getDisplayNearestPoint(cursor);
console.log("最近的显示器:", nearest.id);

// 监听显示器变化
screen.on("display-added", (display) => {
  console.log("显示器已添加:", display.id);
});

screen.on("display-removed", (display) => {
  console.log("显示器已移除:", display.id);
});

screen.on("display-metrics-changed", (display) => {
  console.log("显示器度量已更改:", display.id);
  // 如需要，重新计算窗口位置
});

// 屏幕像素与 DIP 点之间转换（Windows/Linux）
const dipPoint = await screen.screenToDipPoint({ x: 1920, y: 1080 });
const screenPoint = await screen.dipToScreenPoint(dipPoint);
```

### share-menu 模块

> [!NOTE]
> 此模块 **仅限 macOS**。

| 函数                          | 返回类型        |
| ----------------------------- | --------------- |
| `popup(sharingItem, options)` | `Promise<void>` |
| `closePopup(windowId)`        | `Promise<void>` |

```typescript
import * as shareMenu from "electron-main-bridge/renderer/share-menu";

// 显示分享菜单
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

// 分享 URL
await shareMenu.popup({
  type: "url",
  url: "https://example.com",
});

// 分享文本
await shareMenu.popup({
  type: "string",
  string: "快看这个!",
});

// 关闭分享菜单
await shareMenu.closePopup(1);
```

### shell 模块

| 函数                                                  | 返回类型                             |
| ----------------------------------------------------- | ------------------------------------ |
| `openExternal(url, options)`                          | `Promise<void>`                      |
| `openPath(path)`                                      | `Promise<string>` (应用)             |
| `showItemInFolder(path)`                              | `Promise<void>`                      |
| `beep()`                                              | `Promise<void>`                      |
| `trashItem(path)`                                     | `Promise<void>`                      |
| `writeShortcutLink(shortcutPath, operation, options)` | `Promise<void>` (Windows)            |
| `readShortcutLink(shortcutPath)`                      | `Promise<ShortcutDetails>` (Windows) |

```typescript
import * as shell from "electron-main-bridge/renderer/shell";

// 在默认浏览器中打开 URL
await shell.openExternal("https://example.com");

// 在默认应用中打开文件
const app = await shell.openPath("/path/to/document.pdf");
console.log("使用以下应用打开:", app);

// 在文件资源管理器中显示文件
await shell.showItemInFolder("/path/to/file.txt");

// 播放系统提示音
await shell.beep();

// 将文件移至回收站
await shell.trashItem("/path/to/unwanted-file.txt");

// Windows 特定: 创建快捷方式
if (process.platform === "win32") {
  await shell.writeShortcutLink("C:\\Users\\User\\Desktop\\MyApp.lnk", "create", {
    target: "C:\\Program Files\\MyApp\\app.exe",
    description: "My Application",
    icon: "C:\\Program Files\\MyApp\\icon.ico",
    iconIndex: 0,
  });

  // 读取快捷方式详细信息
  const details = await shell.readShortcutLink("C:\\Users\\User\\Desktop\\MyApp.lnk");
  console.log("快捷方式目标:", details.target);
}
```

### tray 模块

| 函数                                 | 返回类型                          |
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

#### 事件

| 事件             | 数据类型              |
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

// 设置托盘图标
await tray.setImage("/path/to/icon.png");

// 设置工具提示
await tray.setToolTip("My Application");

// macOS 特定: 设置标题和忽略双击
if (process.platform === "darwin") {
  await tray.setTitle("1");
  await tray.setIgnoreDoubleClickEvents(true);
  const title = await tray.getTitle();
  console.log("托盘标题:", title);
}

// 设置上下文菜单
await tray.setContextMenu([
  { label: "显示应用", id: "show" },
  { label: "设置", id: "settings" },
  { type: "separator" },
  { label: "退出", role: "quit" },
]);

// Windows 特定: 显示气球通知
if (process.platform === "win32") {
  await tray.displayBalloon({
    iconType: "info",
    title: "通知",
    content: "您有一条新消息!",
  });
  await tray.focus();
}

// 监听托盘事件
tray.on("click", () => {
  console.log("托盘被点击");
  // 显示/隐藏窗口
});

tray.on("right-click", () => {
  console.log("右键点击托盘图标");
});

tray.on("drop-files", ({ files }) => {
  console.log("拖放的文件:", files);
  // 处理拖放的文件
});

// 获取托盘边界
const bounds = await tray.getBounds();
console.log("托盘边界:", bounds);

// 清理
await tray.destroy();
```

### notification 模块

| 函数                    | 返回类型                                |
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

#### 事件

| 事件     | 数据类型                          |
| -------- | --------------------------------- |
| `show`   | `void`                            |
| `click`  | `void`                            |
| `close`  | `void`                            |
| `reply`  | `{ reply: string }` (macOS)       |
| `action` | `{ actionIndex: number }` (macOS) |
| `failed` | `void` (Linux/Windows)            |

```typescript
import * as notification from "electron-main-bridge/renderer/notification";

// 显示通知
const instance = await notification.show({
  title: "新消息",
  body: "您收到了一条新消息",
  icon: "/path/to/icon.png",
  silent: false,
});

// macOS 特定: 交互式通知
if (process.platform === "darwin") {
  const macNotification = await notification.show({
    title: "消息",
    body: "想要回复吗?",
    hasReply: true,
    replyPlaceholder: "输入回复...",
    actions: [
      { type: "button", text: "回复" },
      { type: "button", text: "忽略" },
    ],
    closeButtonText: "关闭",
  });

  notification.on("reply", ({ reply }) => {
    console.log("用户回复:", reply);
  });

  notification.on("action", ({ actionIndex }) => {
    console.log("操作按钮点击:", actionIndex);
  });
}

// Linux 特定: 紧急程度
if (process.platform === "linux") {
  const urgency = await notification.getUrgency();
  console.log("紧急程度:", urgency); // 'normal', 'critical', 'low'
}

// 监听通知事件
notification.on("show", () => {
  console.log("通知已显示");
});

notification.on("click", () => {
  console.log("通知被点击");
  // 聚焦窗口或执行操作
});

notification.on("close", () => {
  console.log("通知已关闭");
});

// Windows 特定: Toast XML
if (process.platform === "win32") {
  const xml = await notification.getToastXml();
  console.log("Toast XML:", xml);
}

// 关闭通知
await notification.close();
```

### system-preferences 模块

#### macOS 特定

| 函数                                              | 返回类型           |
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

#### Windows/macOS 特定

| 函数                    | 返回类型                          |
| ----------------------- | --------------------------------- |
| `getAccentColor()`      | `Promise<Uint8Array>` (Windows)   |
| `getColor(color)`       | `Promise<string>` (Windows/macOS) |
| `getSystemColor(color)` | `Promise<string>` (macOS)         |

#### 跨平台

| 函数                     | 返回类型                     |
| ------------------------ | ---------------------------- |
| `getAnimationSettings()` | `Promise<AnimationSettings>` |

#### 事件 (macOS)

| 事件                     | 数据类型                               |
| ------------------------ | -------------------------------------- |
| `notification`           | `{ event: string; userInfo: unknown }` |
| `local-notification`     | `{ event: string; userInfo: unknown }` |
| `workspace-notification` | `{ event: string; userInfo: unknown }` |

```typescript
import * as systemPreferences from "electron-main-bridge/renderer/system-preferences";

// macOS: 订阅通知
if (process.platform === "darwin") {
  systemPreferences.subscribeNotification("NSWindowDidMoveNotification", ({ event, userInfo }) => {
    console.log("窗口已移动:", userInfo);
  });

  systemPreferences.on("notification", ({ event, userInfo }) => {
    console.log("通知:", event, userInfo);
  });

  // 发送通知
  await systemPreferences.postLocalNotification("MyCustomNotification", {
    message: "自定义事件数据",
  });

  // 用户默认值
  await systemPreferences.registerDefaults({ mySetting: "default-value" });
  const setting = await systemPreferences.getUserDefault("mySetting", "string");
  await systemPreferences.setUserDefault("mySetting", "new-value");
  await systemPreferences.removeUserDefault("mySetting");

  // 外观
  const appearance = await systemPreferences.getEffectiveAppearance();
  console.log("外观:", appearance); // 'dark', 'light', 'unknown'

  // Touch ID
  const canPromptTouchID = await systemPreferences.canPromptTouchID();
  if (canPromptTouchID) {
    const verified = await systemPreferences.promptTouchID("验证以访问敏感数据");
    if (verified) {
      // 用户已验证
    }
  }

  // 辅助功能
  const trusted = await systemPreferences.isTrustedAccessibilityClient(false);
  console.log("受信任的辅助功能客户端:", trusted);

  // 媒体访问（摄像头/麦克风）
  const cameraStatus = await systemPreferences.getMediaAccessStatus("video");
  if (cameraStatus !== "granted") {
    const newStatus = await systemPreferences.askForMediaAccess("video");
    console.log("摄像头访问:", newStatus);
  }
}

// Windows/macOS: 颜色
if (process.platform === "win32") {
  const accentColor = await systemPreferences.getAccentColor();
  console.log("强调色:", accentColor);
  const windowColor = await systemPreferences.getColor("window");
  console.log("窗口颜色:", windowColor);
}

if (process.platform === "darwin") {
  const systemColor = await systemPreferences.getSystemColor("windowBackgroundColor");
  console.log("系统颜色:", systemColor);
}

// 动画设置（跨平台）
const animSettings = await systemPreferences.getAnimationSettings();
console.log("动画设置:", animSettings);
```

### browserWindow 模块

#### 窗口生命周期

| 函数                | 返回类型                     |
| ------------------- | ---------------------------- |
| `create(options)`   | `Promise<number>` (windowId) |
| `close(windowId)`   | `Promise<void>`              |
| `destroy(windowId)` | `Promise<void>`              |

#### 显示控制

| 函数                                  | 返回类型                   |
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

#### 焦点和可见性

| 函数                  | 返回类型           |
| --------------------- | ------------------ |
| `focus(windowId)`     | `Promise<void>`    |
| `blur(windowId)`      | `Promise<void>`    |
| `isVisible(windowId)` | `Promise<boolean>` |
| `isFocused(windowId)` | `Promise<boolean>` |

#### 窗口属性

| 函数                                     | 返回类型          |
| ---------------------------------------- | ----------------- |
| `setTitle(windowId, title)`              | `Promise<void>`   |
| `getTitle(windowId)`                     | `Promise<string>` |
| `setOpacity(windowId, opacity)`          | `Promise<void>`   |
| `getOpacity(windowId)`                   | `Promise<number>` |
| `setBackgroundColor(windowId, color)`    | `Promise<void>`   |
| `setSkipTaskbar(windowId, skip)`         | `Promise<void>`   |
| `setContentProtection(windowId, enable)` | `Promise<void>`   |

#### 窗口边界

| 函数                              | 返回类型                                     |
| --------------------------------- | -------------------------------------------- |
| `getBounds(windowId)`             | `Promise<Rectangle>`                         |
| `setBounds(windowId, bounds)`     | `Promise<void>`                              |
| `getSize(windowId)`               | `Promise<{ width: number; height: number }>` |
| `setSize(windowId, size)`         | `Promise<void>`                              |
| `getPosition(windowId)`           | `Promise<{ x: number; y: number }>`          |
| `setPosition(windowId, position)` | `Promise<void>`                              |
| `center(windowId)`                | `Promise<void>`                              |

#### 尺寸约束

| 函数                             | 返回类型                                     |
| -------------------------------- | -------------------------------------------- |
| `setMinimumSize(windowId, size)` | `Promise<void>`                              |
| `getMinimumSize(windowId)`       | `Promise<{ width: number; height: number }>` |
| `setMaximumSize(windowId, size)` | `Promise<void>`                              |
| `getMaximumSize(windowId)`       | `Promise<{ width: number; height: number }>` |

#### 窗口特性

| 函数                                    | 返回类型           |
| --------------------------------------- | ------------------ |
| `setResizable(windowId, resizable)`     | `Promise<void`     |
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

#### 菜单栏

| 函数                                      | 返回类型           |
| ----------------------------------------- | ------------------ |
| `setMenuBarVisibility(windowId, visible)` | `Promise<void>`    |
| `isMenuBarVisible(windowId)`              | `Promise<boolean>` |
| `setAutoHideMenuBar(windowId, hide)`      | `Promise<void>`    |
| `isMenuBarAutoHide(windowId)`             | `Promise<boolean>` |

#### 进度和闪烁

| 函数                                       | 返回类型        |
| ------------------------------------------ | --------------- |
| `setProgressBar(windowId, progress, mode)` | `Promise<void>` |
| `flashFrame(windowId, flag)`               | `Promise<void>` |

#### 内容控制

| 函数                                | 返回类型           |
| ----------------------------------- | ------------------ |
| `loadURL(windowId, url, options)`   | `Promise<void>`    |
| `loadFile(windowId, path, options)` | `Promise<void>`    |
| `reload(windowId)`                  | `Promise<void>`    |
| `executeJavaScript(windowId, code)` | `Promise<unknown>` |
| `openDevTools(windowId, options)`   | `Promise<void>`    |
| `closeDevTools(windowId)`           | `Promise<void>`    |
| `isDevToolsOpened(windowId)`        | `Promise<boolean>` |

#### 窗口状态查询

| 函数                    | 返回类型           |
| ----------------------- | ------------------ |
| `isMaximized(windowId)` | `Promise<boolean>` |
| `isMinimized(windowId)` | `Promise<boolean>` |
| `isDestroyed(windowId)` | `Promise<boolean>` |
| `exists(windowId)`      | `Promise<boolean>` |

#### 静态方法

| 函数                 | 返回类型                  |
| -------------------- | ------------------------- |
| `getAllWindows()`    | `Promise<number[]>`       |
| `getFocusedWindow()` | `Promise<number \| null>` |

#### 事件

| 事件                 | 数据类型                                                            |
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

// 创建新窗口
const windowId = await browserWindow.create({
  width: 1200,
  height: 800,
  title: "My Window",
  show: false, // 准备好之前不显示
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
  },
});

// 准备好后显示窗口
browserWindow.on(windowId, "ready-to-show", () => {
  browserWindow.show(windowId);
});

// 加载内容
await browserWindow.loadURL(windowId, "https://example.com");
// 或加载本地文件
// await browserWindow.loadFile(windowId, "/path/to/index.html");

// 控制窗口
await browserWindow.setTitle(windowId, "新标题");
await browserWindow.maximize(windowId);
await browserWindow.center(windowId);

// 检查窗口状态
const isMaximized = await browserWindow.isMaximized(windowId);
const isFocused = await browserWindow.isFocused(windowId);
const title = await browserWindow.getTitle(windowId);

// 窗口边界
const bounds = await browserWindow.getBounds(windowId);
console.log("边界:", bounds);

await browserWindow.setSize(windowId, { width: 1000, height: 700 });
await browserWindow.setPosition(windowId, { x: 100, y: 100 });

// 设置最小/最大尺寸
await browserWindow.setMinimumSize(windowId, { width: 600, height: 400 });
await browserWindow.setMaximumSize(windowId, { width: 1920, height: 1080 });

// 窗口特性
await browserWindow.setResizable(windowId, false);
await browserWindow.setAlwaysOnTop(windowId, true);
await browserWindow.setProgressBar(windowId, 0.5); // 50%

// 执行 JavaScript
const result = await browserWindow.executeJavaScript(windowId, "document.title");
console.log("页面标题:", result);

// 监听窗口事件
browserWindow.on(windowId, "closed", () => {
  console.log("窗口已关闭");
});

browserWindow.on(windowId, "resize", () => {
  console.log("窗口大小已改变");
});

browserWindow.on(windowId, "page-title-updated", ({ title }) => {
  console.log("页面标题已更改为:", title);
});

browserWindow.on(windowId, "did-fail-load", ({ errorCode, errorDescription }) => {
  console.error("加载失败:", errorCode, errorDescription);
});

// 获取所有窗口
const allWindows = await browserWindow.getAllWindows();
console.log("打开的窗口:", allWindows);

// 获取聚焦窗口
const focused = await browserWindow.getFocusedWindow();
console.log("聚焦窗口:", focused);

// 关闭窗口
await browserWindow.close(windowId);

// 销毁窗口
await browserWindow.destroy(windowId);
```

## 重要说明

### AutoUpdater 模块

Electron `autoUpdater` 模块具有特定平台的要求和限制：

1. **平台支持**
   - **macOS**: 基于 Squirrel.Mac。应用**必须签名**才能使自动更新正常工作。
   - **Windows**: 基于 Squirrel.Windows。应用必须**已安装**（而非从便携式可执行文件运行）才能使更新正常工作。使用 `electron-winstaller` 或 `electron-forge` 等工具创建安装程序。
   - **Linux**: **不支持**。请使用发行版的软件包管理器。

2. **setFeedURL 时机**
   - 必须在 `checkForUpdates()` **之前**调用
   - 应在应用初始化期间设置

3. **自动下载**
   - 当 `checkForUpdates()` 发现更新时，会**自动下载**
   - 多次调用 `checkForUpdates()` 会多次下载更新

4. **事件序列**
   - `checking-for-update` → `update-available` / `update-not-available`
   - 如果有可用更新 → `update-downloaded`（下载完成后）
   - 调用 `quitAndInstall()` → `before-quit-for-update` → 应用重启

5. **更新安装**
   - 调用 `quitAndInstall()` 是**可选的** - 下载的更新将在下次应用启动时自动应用
   - 仅在收到 `update-downloaded` 事件后才调用它

### App 模块事件

某些 Electron 应用事件通过 IPC 使用时具有特殊行为：

1. **`ready` / `will-finish-launching`** - 这些事件仅触发一次，通常在调用 `registerAppModule` 之前。使用 `app.isReady()` 检查当前状态。

2. **`before-quit` / `will-quit`** - 这些事件在 Electron 中支持 `event.preventDefault()`，但无法直接通过 IPC 执行此操作。如需要阻止退出，请实现自定义 RPC 方法。

3. **窗口事件** - `BrowserWindow` 和 `WebContents` 对象无法序列化。仅转发窗口 ID 和标题。

4. **平台特定事件** - macOS 特定事件（如 `activate`）会被转发，但仅会在 macOS 上触发。

### 渲染进程 API 与主进程的差异

某些面向渲染进程的 API 与 Electron 主进程类型有 intentional 差异，以确保 IPC 安全：

1. **Menu 模块**
   - `MenuItemConstructorOptions` 是可序列化的子集。不支持 `click` 回调。
   - `PopupOptions` 使用 `windowId` 而不是 `BrowserWindow` 实例，并且不接受 `callback`。
   - `setApplicationMenu(template | null)` 接受模板数组（或 `null` 以清除），而不是 `Menu` 实例。
   - `buildFromTemplate(template)` 返回序列化的 `MenuData`（而不是 `Menu` 实例）。

2. **Session 模块**
   - 事件同时为 `session.<hash>.*` 和 `session.*` 发布。
   - 事件负载包含可选的 `sessionHash`，以便您可以区分多个会话。
   - 当注册多个会话时，使用 `getSessionHash()` 来限定事件监听器范围。

3. **Tray 模块**
   - `right-click`、`double-click` 和 `middle-click` 事件在 Electron 中不包含 `position`。`position` 字段在此桥接中是可选的。
   - `setContextMenu(template | null)` 接受菜单模板数组（或 `null` 以清除），而不是 `Menu` 实例。
   - 托盘菜单模板共享相同的 `MenuItemConstructorOptions` 限制（无 `click` 回调）。

### GlobalShortcut 模块

Electron `globalShortcut` 模块有重要的使用注意事项：

1. **快捷键冲突**
   - 当加速键已被其他应用占用时，`register()` 将返回 `false`
   - 操作系统防止应用争夺全局快捷键
   - 检查返回值并在注册失败时通知用户

2. **macOS 辅助功能**
   - 在 macOS 10.14 Mojave+ 上，媒体键快捷键（"Media Play/Pause"、"Media Next Track" 等）需要**辅助功能授权**
   - 注册这些快捷键之前请求辅助功能授权
   - 使用 `systemPreferences.isAccessibilityEnabled()` 和相关 API 检查状态

3. **退出时清理**
   - 在 `app.on('will-quit')` 中调用 `unregisterAll()` 以清理快捷键
   - 这确保快捷键在应用退出时被释放
   - 未能执行此操作可能导致快捷键在应用关闭后仍保持注册状态

4. **Linux 上的 Wayland**
   - 对于 Wayland 会话，在应用启动之前添加以下开关：
     ```typescript
     app.commandLine.appendSwitch("enable-features", "GlobalShortcutsPortal");
     ```

5. **快捷键格式**
   - 加速键字符串遵循格式：`Modifier+Key`
   - 修饰键：`Command`、`CommandOrControl`、`Control`、`Alt`、`Option`、`Shift`、`Super`
   - 按键：`A`-`Z`、`0`-`9`、`F1`-`F24`，以及 plus、minus、space、tab 等
   - 平台特定：`Command` 仅限 macOS，`Control` 适用于 Linux/Windows，`CommandOrControl` 适用于所有平台
   - 示例：`"CommandOrControl+X"`、`"Alt+F4"`、`"CommandOrControl+Shift+Z"`

6. **事件处理**
   - 使用 `onAccelerator()` 在渲染进程中接收快捷键触发事件
   - 回调接收按下的加速键字符串
   - 记得在组件卸载或不再需要监听时调用返回的清理函数

## 许可证

MIT
