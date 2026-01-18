import { BrowserWindow } from "electron";
import type {
  BrowserWindowConstructorOptions,
  Rectangle,
  Size,
  Point,
  BrowserWindowInfo,
} from "@shared/browserWindow.types.js";
import { getWindow, hasWindow, addWindow, getAllWindows } from "./utils.js";
import { subscribeEventHandler, unsubscribeEventHandler, setupWindowCleanup } from "./events.js";
import type { RpcServer } from "electron-json-rpc/main";

let rpcInstance: RpcServer | null = null;

export function setRpcServer(rpc: RpcServer): void {
  rpcInstance = rpc;
}

export async function createHandler(...params: unknown[]): Promise<number> {
  const [options] = params as [BrowserWindowConstructorOptions];

  const windowOptions = { ...options };
  if (options.parent !== undefined) {
    const parentWindow = BrowserWindow.fromId(options.parent);
    if (parentWindow) {
      (windowOptions as any).parent = parentWindow;
    }
    delete (windowOptions as any).parent;
  }

  const window = new BrowserWindow(windowOptions as any);
  addWindow(window);
  setupWindowCleanup(window);

  return (window as any).id;
}

export async function closeHandler(...params: unknown[]): Promise<void> {
  const [id] = params as [number];
  getWindow(id).close();
}

export async function destroyHandler(...params: unknown[]): Promise<void> {
  const [id] = params as [number];
  getWindow(id).destroy();
}

export async function showHandler(...params: unknown[]): Promise<void> {
  const [id] = params as [number];
  getWindow(id).show();
}

export async function hideHandler(...params: unknown[]): Promise<void> {
  const [id] = params as [number];
  getWindow(id).hide();
}

export async function minimizeHandler(...params: unknown[]): Promise<void> {
  const [id] = params as [number];
  getWindow(id).minimize();
}

export async function maximizeHandler(...params: unknown[]): Promise<void> {
  const [id] = params as [number];
  getWindow(id).maximize();
}

export async function unmaximizeHandler(...params: unknown[]): Promise<void> {
  const [id] = params as [number];
  getWindow(id).unmaximize();
}

export async function restoreHandler(...params: unknown[]): Promise<void> {
  const [id] = params as [number];
  getWindow(id).restore();
}

export async function setFullScreenHandler(...params: unknown[]): Promise<void> {
  const [id, fullscreen] = params as [number, boolean];
  getWindow(id).setFullScreen(fullscreen);
}

export async function isFullScreenHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return getWindow(id).isFullScreen();
}

export async function focusHandler(...params: unknown[]): Promise<void> {
  const [id] = params as [number];
  getWindow(id).focus();
}

export async function blurHandler(...params: unknown[]): Promise<void> {
  const [id] = params as [number];
  getWindow(id).blur();
}

export async function setTitleHandler(...params: unknown[]): Promise<void> {
  const [id, title] = params as [number, string];
  getWindow(id).setTitle(title);
}

export async function getTitleHandler(...params: unknown[]): Promise<string> {
  const [id] = params as [number];
  return getWindow(id).getTitle();
}

export async function getBoundsHandler(...params: unknown[]): Promise<Rectangle> {
  const [id] = params as [number];
  return getWindow(id).getBounds();
}

export async function setBoundsHandler(...params: unknown[]): Promise<void> {
  const [id, bounds] = params as [number, Rectangle];
  getWindow(id).setBounds(bounds);
}

export async function getSizeHandler(...params: unknown[]): Promise<Size> {
  const [id] = params as [number];
  const [width, height] = getWindow(id).getSize();
  return { width: width || 0, height: height || 0 };
}

export async function setSizeHandler(...params: unknown[]): Promise<void> {
  const [id, size] = params as [number, Size];
  getWindow(id).setSize(size.width, size.height);
}

export async function getPositionHandler(...params: unknown[]): Promise<Point> {
  const [id] = params as [number];
  const [x, y] = getWindow(id).getPosition();
  return { x: x || 0, y: y || 0 };
}

export async function setPositionHandler(...params: unknown[]): Promise<void> {
  const [id, position] = params as [number, Point];
  getWindow(id).setPosition(position.x, position.y);
}

export async function centerHandler(...params: unknown[]): Promise<void> {
  const [id] = params as [number];
  getWindow(id).center();
}

export async function getMinimumSizeHandler(...params: unknown[]): Promise<Size> {
  const [id] = params as [number];
  const [width, height] = getWindow(id).getMinimumSize();
  return { width: width || 0, height: height || 0 };
}

export async function setMinimumSizeHandler(...params: unknown[]): Promise<void> {
  const [id, size] = params as [number, Size];
  getWindow(id).setMinimumSize(size.width, size.height);
}

export async function getMaximumSizeHandler(...params: unknown[]): Promise<Size> {
  const [id] = params as [number];
  const [width, height] = getWindow(id).getMaximumSize();
  return { width: width || 0, height: height || 0 };
}

export async function setMaximumSizeHandler(...params: unknown[]): Promise<void> {
  const [id, size] = params as [number, Size];
  getWindow(id).setMaximumSize(size.width, size.height);
}

export async function setResizableHandler(...params: unknown[]): Promise<void> {
  const [id, resizable] = params as [number, boolean];
  getWindow(id).setResizable(resizable);
}

export async function isResizableHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return getWindow(id).isResizable();
}

export async function setMovableHandler(...params: unknown[]): Promise<void> {
  const [id, movable] = params as [number, boolean];
  getWindow(id).setMovable(movable);
}

export async function isMovableHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return getWindow(id).isMovable();
}

export async function setMinimizableHandler(...params: unknown[]): Promise<void> {
  const [id, minimizable] = params as [number, boolean];
  getWindow(id).setMinimizable(minimizable);
}

export async function isMinimizableHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return getWindow(id).isMinimizable();
}

export async function setMaximizableHandler(...params: unknown[]): Promise<void> {
  const [id, maximizable] = params as [number, boolean];
  getWindow(id).setMaximizable(maximizable);
}

export async function isMaximizableHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return getWindow(id).isMaximizable();
}

export async function setClosableHandler(...params: unknown[]): Promise<void> {
  const [id, closable] = params as [number, boolean];
  getWindow(id).setClosable(closable);
}

export async function isClosableHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return getWindow(id).isClosable();
}

export async function setFocusableHandler(...params: unknown[]): Promise<void> {
  const [id, focusable] = params as [number, boolean];
  getWindow(id).setFocusable(focusable);
}

export async function isFocusableHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return getWindow(id).isFocusable();
}

export async function setAlwaysOnTopHandler(...params: unknown[]): Promise<void> {
  const [id, alwaysOnTop, level, relativeLevel] = params as [number, boolean, string?, number?];
  if (level !== undefined) {
    getWindow(id).setAlwaysOnTop(alwaysOnTop, level as any, relativeLevel);
  } else {
    getWindow(id).setAlwaysOnTop(alwaysOnTop);
  }
}

export async function isAlwaysOnTopHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return getWindow(id).isAlwaysOnTop();
}

export async function setMenuBarVisibilityHandler(...params: unknown[]): Promise<void> {
  const [id, visible] = params as [number, boolean];
  getWindow(id).setMenuBarVisibility(visible);
}

export async function isMenuBarVisibleHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return getWindow(id).isMenuBarVisible();
}

export async function setAutoHideMenuBarHandler(...params: unknown[]): Promise<void> {
  const [id, autoHide] = params as [number, boolean];
  getWindow(id).setAutoHideMenuBar(autoHide);
}

export async function isMenuBarAutoHideHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return getWindow(id).isMenuBarAutoHide();
}

export async function loadURLHandler(...params: unknown[]): Promise<void> {
  const [id, url, options] = params as [
    number,
    string,
    {
      httpReferrer?: string;
      userAgent?: string;
      extraHeaders?: string;
    }?,
  ];
  getWindow(id).webContents.loadURL(url, options);
}

export async function loadFileHandler(...params: unknown[]): Promise<void> {
  const [id, path, options] = params as [
    number,
    string,
    {
      query?: Record<string, string>;
      search?: string;
      hash?: string;
    }?,
  ];
  getWindow(id).webContents.loadFile(path, options);
}

export async function reloadHandler(...params: unknown[]): Promise<void> {
  const [id] = params as [number];
  getWindow(id).webContents.reload();
}

export async function openDevToolsHandler(...params: unknown[]): Promise<void> {
  const [id, options] = params as [number, { mode?: "right" | "bottom" | "undocked" | "detach" }?];
  getWindow(id).webContents.openDevTools(options as any);
}

export async function closeDevToolsHandler(...params: unknown[]): Promise<void> {
  const [id] = params as [number];
  getWindow(id).webContents.closeDevTools();
}

export async function isDevToolsOpenedHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return getWindow(id).webContents.isDevToolsOpened();
}

export async function executeJavaScriptHandler(...params: unknown[]): Promise<unknown> {
  const [id, code, userGesture] = params as [number, string, boolean?];
  return getWindow(id).webContents.executeJavaScript(code, userGesture);
}

export async function getAllWindowsHandler(): Promise<BrowserWindowInfo[]> {
  return getAllWindows();
}

export async function getFocusedWindowHandler(): Promise<number | null> {
  const window = BrowserWindow.getFocusedWindow();
  return window ? window.id : null;
}

export async function isMaximizedHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return getWindow(id).isMaximized();
}

export async function isMinimizedHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return getWindow(id).isMinimized();
}

export async function isVisibleHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return getWindow(id).isVisible();
}

export async function isFocusedHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return getWindow(id).isFocused();
}

export async function setProgressBarHandler(...params: unknown[]): Promise<void> {
  const [id, progress, options] = params as [
    number,
    number,
    {
      mode?: "none" | "normal" | "indeterminate" | "error" | "paused";
    }?,
  ];
  getWindow(id).setProgressBar(progress, options as any);
}

export async function flashFrameHandler(...params: unknown[]): Promise<void> {
  const [id, flash] = params as [number, boolean];
  getWindow(id).flashFrame(flash);
}

export async function setBackgroundColorHandler(...params: unknown[]): Promise<void> {
  const [id, backgroundColor] = params as [number, string];
  getWindow(id).setBackgroundColor(backgroundColor);
}

export async function setOpacityHandler(...params: unknown[]): Promise<void> {
  const [id, opacity] = params as [number, number];
  getWindow(id).setOpacity(opacity);
}

export async function getOpacityHandler(...params: unknown[]): Promise<number> {
  const [id] = params as [number];
  return getWindow(id).getOpacity();
}

export async function setKioskHandler(...params: unknown[]): Promise<void> {
  const [id, kiosk] = params as [number, boolean];
  getWindow(id).setKiosk(kiosk);
}

export async function isKioskHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return getWindow(id).isKiosk();
}

export async function setSimpleFullScreenHandler(...params: unknown[]): Promise<void> {
  const [id, simple] = params as [number, boolean];
  getWindow(id).setSimpleFullScreen(simple);
}

export async function isSimpleFullScreenHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return getWindow(id).isSimpleFullScreen();
}

export async function setSkipTaskbarHandler(...params: unknown[]): Promise<void> {
  const [id, skip] = params as [number, boolean];
  getWindow(id).setSkipTaskbar(skip);
}

export async function setContentProtectionHandler(...params: unknown[]): Promise<void> {
  const [id, enable] = params as [number, boolean];
  getWindow(id).setContentProtection(enable);
}

export async function existsHandler(...params: unknown[]): Promise<boolean> {
  const [id] = params as [number];
  return hasWindow(id);
}

export async function subscribeEventHandlerRpc(...params: unknown[]): Promise<void> {
  if (!rpcInstance) {
    throw new Error("RPC server not initialized");
  }
  const [id, eventName] = params as [number, string];
  await subscribeEventHandler(rpcInstance, id, eventName);
}

export async function unsubscribeEventHandlerRpc(...params: unknown[]): Promise<void> {
  const [id, eventName] = params as [number, string];
  await unsubscribeEventHandler(id, eventName);
}
