/**
 * Main process RPC registration
 * Usage in Electron main process:
 *
 * import { RpcServer } from 'electron-json-rpc/main';
 * import { registerFsModule } from 'electron-main-bridge/main';
 *
 * const rpc = new RpcServer();
 * registerFsModule(rpc);
 * rpc.listen();
 */

export { registerFsModule } from "./fs/index.js";
export { registerPathModule } from "./path/index.js";
export { registerAppModule } from "./app/index.js";
export { registerAutoUpdaterModule } from "./auto-updater/index.js";
export { registerDialogModule } from "./dialog/index.js";
export { registerGlobalShortcutModule } from "./global-shortcut/index.js";
export { registerMenuModule } from "./menu/index.js";
export { registerPowerMonitorModule } from "./power-monitor/index.js";
export { registerPowerSaveBlockerModule } from "./power-save-blocker/index.js";
export { registerPushNotificationsModule } from "./push-notifications/index.js";
export { registerSafeStorageModule } from "./safe-storage/index.js";
export { registerSessionModule } from "./session/index.js";
export { registerScreenModule } from "./screen/index.js";
export { registerShareMenuModule } from "./share-menu/index.js";
export { registerShellModule } from "./shell/index.js";
export { registerTrayModule } from "./tray/index.js";
export { registerNotificationModule } from "./notification/index.js";
export { registerBrowserWindowModule } from "./browserWindow/index.js";
