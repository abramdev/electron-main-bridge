/**
 * 测试用的 Electron 应用
 * 用于 E2E 测试 electron-main-bridge 库
 *
 * 使用 mock 模式：不实际执行文件操作，只记录调用参数
 */

const path = require("node:path");
const { app, BrowserWindow, Notification, Menu, Tray, nativeImage, session } = require("electron");

let mainWindow;
let testNotification;
let testMenu;
let testTray;
let testSession;

// Spy 记录所有 RPC 调用
const spyCalls = [];

// Mock 响应数据
const mockResponses = {
  "fs.readFile": "mock file content",
  "fs.writeFile": undefined,
  "fs.unlink": undefined,
  "fs.exists": true,
  "fs.stat": {
    dev: 1,
    ino: 2,
    mode: 33188,
    nlink: 1,
    uid: 0,
    gid: 0,
    rdev: 0,
    size: 100,
    blksize: 4096,
    blocks: 8,
    atimeMs: Date.now(),
    mtimeMs: Date.now(),
    ctimeMs: Date.now(),
    birthtimeMs: Date.now(),
    atime: new Date(),
    mtime: new Date(),
    ctime: new Date(),
    birthtime: new Date(),
  },
  "fs.mkdir": undefined,
  "fs.rmdir": undefined,
  "fs.readdir": ["file1.txt", "file2.txt"],
  "fs.appendFile": undefined,
  "fs.copyFile": undefined,
  "path.join": "/mock/joined/path",
  "path.resolve": "/mock/resolved/path",
  "path.dirname": "/mock/dir",
  "path.basename": "mock.txt",
  "path.extname": ".txt",
  "path.parse": { root: "/", dir: "/mock", base: "mock.txt", name: "mock", ext: ".txt" },
  "path.format": "/mock/path/mock.txt",
  "path.normalize": "/mock/normalized/path",
  "path.relative": "../relative",
  "path.isAbsolute": true,
  "path.sep": "/",
  "path.delimiter": ":",
  "path.cwd": "/mock/cwd",
  "app.getName": "TestApp",
  "app.getVersion": "1.0.0",
  "app.getAppPath": "/mock/app/path",
  "app.getLocale": "en-US",
  "app.isPackaged": false,
  "app.getPath": "/mock/user/data/path",
  "app.setPath": undefined,
  "app.getBadgeCount": 0,
  "app.setBadgeCount": true,
  "dialog.showOpenDialog": { canceled: true, filePaths: [], bookmarks: [] },
  "dialog.showSaveDialog": { canceled: true, filePath: "" },
  "dialog.showMessageBox": { response: 0, checkboxChecked: false },
  "shell.beep": undefined,
  "shell.openPath": undefined,
  "shell.showItemInFolder": undefined,
  "shell.openExternal": undefined,
  "screen.getCursorScreenPoint": { x: 100, y: 100 },
  "screen.getPrimaryDisplay": {
    id: "primary",
    bounds: { x: 0, y: 0, width: 1920, height: 1080 },
    workArea: { x: 0, y: 0, width: 1920, height: 1040 },
    scaleFactor: 1,
  },
  "screen.getAllDisplays": [
    {
      id: "primary",
      bounds: { x: 0, y: 0, width: 1920, height: 1080 },
      workArea: { x: 0, y: 0, width: 1920, height: 1040 },
      scaleFactor: 1,
    },
  ],
  "browserWindow.getAllWindows": [{ id: 1, title: "Test Window" }],
  "browserWindow.getFocusedWindow": 1,
  "browserWindow.create": 2,
  "browserWindow.exists": true,
  "browserWindow.getTitle": "Test Window",
  "browserWindow.setTitle": undefined,
  "browserWindow.getBounds": { x: 0, y: 0, width: 800, height: 600 },
  "browserWindow.setBounds": undefined,
  "browserWindow.getSize": { width: 800, height: 600 },
  "browserWindow.setSize": undefined,
  "browserWindow.getPosition": { x: 0, y: 0 },
  "browserWindow.setPosition": undefined,
  "browserWindow.isMaximized": false,
  "browserWindow.isMinimized": false,
  "browserWindow.isVisible": true,
  "browserWindow.isFocused": true,
  "browserWindow.getOpacity": 1,
  "session.getCacheSize": 0,
  "session.getSessionHash": "mock-session-hash",
  "session.getStoragePath": "/mock/storage",
  "session.isPersistent": true,
  "session.getUserAgent": "MockAgent/1.0",
  "session.setUserAgent": undefined,
  "session.clearCache": undefined,
  "session.clearStorageData": undefined,
  "session.clearData": undefined,
  "session.setDownloadPath": undefined,
  "tray.setToolTip": undefined,
  "tray.getBounds": { x: 0, y: 0, width: 16, height: 16 },
  "tray.isDestroyed": false,
  "tray.getGUID": "mock-guid",
  "tray.getTitle": "",
  "tray.setTitle": undefined,
  "tray.getIgnoreDoubleClickEvents": false,
  "tray.setIgnoreDoubleClickEvents": undefined,
  "tray.setContextMenu": undefined,
  "safeStorage.encryptString": Buffer.from("encrypted").toString("hex"),
  "safeStorage.decryptString": "decrypted",
  "safeStorage.encryptBuffer": Buffer.from("encrypted"),
  "safeStorage.decryptBuffer": Buffer.from("decrypted"),
  "safeStorage.isEncryptionAvailable": true,
  "autoUpdater.checkForUpdates": { version: "2.0.0", files: [] },
  "autoUpdater.checkForUpdatesAndNotify": { version: "2.0.0", files: [] },
  "autoUpdater.quitAndInstall": undefined,
  "autoUpdater.setFeedURL": undefined,
  "autoUpdater.getAutoUpdater": {},
  "globalShortcut.register": true,
  "globalShortcut.unregister": undefined,
  "globalShortcut.unregisterAll": undefined,
  "globalShortcut.isRegistered": true,
  "powerMonitor.onBattery": undefined,
  "powerMonitor.offBattery": undefined,
  "powerMonitor.onSuspend": undefined,
  "powerMonitor.onResume": undefined,
  "powerMonitor.onLockScreen": undefined,
  "powerMonitor.onUnlockScreen": undefined,
  "powerMonitor.getSystemIdleState": "active",
  "powerMonitor.getSystemIdleTime": 0,
  "powerMonitor.isOnBatteryPower": false,
  "powerSaveBlocker.start": 123,
  "powerSaveBlocker.stop": undefined,
  "powerSaveBlocker.isStarted": true,
  "pushNotifications.registerForPushNotifications": true,
  "pushNotifications.unregisterForPushNotifications": undefined,
  "pushNotifications.isRegistered": true,
  "pushNotifications.subscribe": 1,
  "pushNotifications.unsubscribe": undefined,
  "shareMenu.showShareMenu": undefined,
  "systemPreferences.isSwipeTrackingFromScrollEventsEnabled": true,
  "systemPreferences.postNotification": undefined,
  "systemPreferences.postLocalNotification": undefined,
  "systemPreferences.postWorkspaceNotification": undefined,
  "systemPreferences.subscribeNotification": 1,
  "systemPreferences.subscribeLocalNotification": 1,
  "systemPreferences.subscribeWorkspaceNotification": 1,
  "systemPreferences.unsubscribeNotification": undefined,
  "systemPreferences.unsubscribeLocalNotification": undefined,
  "systemPreferences.unsubscribeWorkspaceNotification": undefined,
  "systemPreferences.registerDefaults": undefined,
  "systemPreferences.getUserDefault": "test-value",
  "systemPreferences.setUserDefault": undefined,
  "systemPreferences.removeUserDefault": undefined,
  "systemPreferences.getAccentColor": "#FF0000",
  "systemPreferences.getColor": "#00FF00",
  "systemPreferences.getSystemColor": "#0000FF",
  "systemPreferences.getEffectiveAppearance": "dark",
  "systemPreferences.canPromptTouchID": true,
  "systemPreferences.promptTouchID": undefined,
  "systemPreferences.isTrustedAccessibilityClient": true,
  "systemPreferences.getMediaAccessStatus": "granted",
  "systemPreferences.askForMediaAccess": true,
  "systemPreferences.getAnimationSettings": {
    scrollDuration: 0.25,
    menuFadeDuration: 0.25,
    windowResizeDuration: 0.2,
    shouldReduceMotion: false,
  },
};

function getMockResponse(method) {
  if (method in mockResponses) {
    return mockResponses[method];
  }
  // 动态生成 mock 响应
  if (method.startsWith("browserWindow.") || method.startsWith("tray.")) {
    return undefined;
  }
  return undefined;
}

function serializeParams(params) {
  return params.map((p) => {
    if (p === null) return null;
    if (p === undefined) return undefined;
    if (typeof p === "function") return "[Function]";
    if (typeof p === "object") {
      if (p instanceof ArrayBuffer || p instanceof Uint8Array) {
        return `[${p.constructor.name} length=${p.byteLength || p.length}]`;
      }
      try {
        return JSON.parse(
          JSON.stringify(p, (key, value) => {
            if (typeof value === "function") return "[Function]";
            if (value instanceof ArrayBuffer) return "[ArrayBuffer]";
            if (value instanceof Uint8Array) return `[Uint8Array length=${value.length}]`;
            return value;
          }),
        );
      } catch {
        return "[Object]";
      }
    }
    return p;
  });
}

app.whenReady().then(async () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      sandbox: false,
      nodeIntegration: false,
    },
    width: 800,
    height: 600,
    show: false,
  });

  // 动态导入 ESM 模块
  const { RpcServer } = await import("electron-json-rpc/main");
  const rpc = new RpcServer();

  // 保存原始 register 方法
  const originalRegister = rpc.register.bind(rpc);

  // 包装 register 方法，记录所有调用
  rpc.register = (name, _handler) => {
    const wrappedHandler = async (...params) => {
      // 记录调用
      spyCalls.push({
        method: name,
        params: serializeParams(params),
      });
      // 返回 mock 数据，不实际执行
      return getMockResponse(name);
    };
    return originalRegister(name, wrappedHandler);
  };

  // 导入并注册所有模块
  const { registerFsModule } = await import("../../dist/main/fs.mjs");
  const { registerPathModule } = await import("../../dist/main/path.mjs");
  const { registerAppModule } = await import("../../dist/main/app.mjs");
  const { registerDialogModule } = await import("../../dist/main/dialog.mjs");
  const { registerShellModule } = await import("../../dist/main/shell.mjs");
  const { registerNotificationModule } = await import("../../dist/main/notification.mjs");
  const { registerScreenModule } = await import("../../dist/main/screen.mjs");
  const { registerMenuModule } = await import("../../dist/main/menu.mjs");
  const { registerTrayModule } = await import("../../dist/main/tray.mjs");
  const { registerSessionModule } = await import("../../dist/main/session.mjs");
  const { registerBrowserWindowModule } = await import("../../dist/main/browserWindow.mjs");
  const { registerSafeStorageModule } = await import("../../dist/main/safe-storage.mjs");
  const { registerAutoUpdaterModule } = await import("../../dist/main/auto-updater.mjs");
  const { registerGlobalShortcutModule } = await import("../../dist/main/global-shortcut.mjs");
  const { registerPowerMonitorModule } = await import("../../dist/main/power-monitor.mjs");
  const { registerPowerSaveBlockerModule } = await import("../../dist/main/power-save-blocker.mjs");
  const { registerPushNotificationsModule } =
    await import("../../dist/main/push-notifications.mjs");
  const { registerShareMenuModule } = await import("../../dist/main/share-menu.mjs");
  const { registerSystemPreferencesModule } =
    await import("../../dist/main/system-preferences.mjs");

  // 注册所有模块
  registerFsModule(rpc);
  registerPathModule(rpc);
  registerAppModule(rpc);
  registerDialogModule(rpc);
  registerShellModule(rpc);
  registerScreenModule(rpc);
  registerBrowserWindowModule(rpc);
  registerSafeStorageModule(rpc);
  registerAutoUpdaterModule(rpc);
  registerGlobalShortcutModule(rpc);
  registerPowerMonitorModule(rpc);
  registerPowerSaveBlockerModule(rpc);
  registerPushNotificationsModule(rpc);
  registerShareMenuModule(rpc);
  registerSystemPreferencesModule(rpc);

  // Create a test notification instance
  testNotification = new Notification({
    title: "Test Notification",
    body: "This is a test notification for E2E testing",
    silent: true,
  });
  registerNotificationModule(rpc, testNotification);

  // Create a test menu instance
  testMenu = Menu.buildFromTemplate([
    { label: "Test Item 1", click: () => {} },
    { label: "Test Item 2", type: "separator" },
    { label: "Test Item 3", enabled: false },
  ]);
  registerMenuModule(rpc, testMenu);

  // Create a test tray instance (using empty icon for testing)
  const emptyIcon = nativeImage.createEmpty();
  testTray = new Tray(emptyIcon);
  registerTrayModule(rpc, testTray);

  // Get the default session for testing
  testSession = session ? session.defaultSession : mainWindow.webContents.session;
  if (testSession) {
    registerSessionModule(rpc, testSession);
  }

  // 添加 spy RPC handler（不使用包装版本，使用原始 register）
  originalRegister("test.getSpyLog", () => {
    const log = [...spyCalls];
    spyCalls.length = 0; // 清空记录
    return log;
  });

  originalRegister("test.clearSpyLog", () => {
    spyCalls.length = 0;
    return true;
  });

  rpc.listen();

  await mainWindow.loadFile(path.join(__dirname, "renderer.html"));
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
