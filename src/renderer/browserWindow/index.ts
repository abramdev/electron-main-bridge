import type {
  BrowserWindowConstructorOptions,
  Rectangle,
  Size,
  Point,
  BrowserWindowInfo,
  BrowserWindowEventCallbacks,
} from "@shared/browserWindow.types.js";

export async function create(options: BrowserWindowConstructorOptions): Promise<number> {
  return (await window.rpc.call("browserWindow.create", options)) as number;
}

export async function close(id: number): Promise<void> {
  await window.rpc.call("browserWindow.close", id);
}

export async function destroy(id: number): Promise<void> {
  await window.rpc.call("browserWindow.destroy", id);
}

export async function show(id: number): Promise<void> {
  await window.rpc.call("browserWindow.show", id);
}

export async function hide(id: number): Promise<void> {
  await window.rpc.call("browserWindow.hide", id);
}

export async function minimize(id: number): Promise<void> {
  await window.rpc.call("browserWindow.minimize", id);
}

export async function maximize(id: number): Promise<void> {
  await window.rpc.call("browserWindow.maximize", id);
}

export async function unmaximize(id: number): Promise<void> {
  await window.rpc.call("browserWindow.unmaximize", id);
}

export async function restore(id: number): Promise<void> {
  await window.rpc.call("browserWindow.restore", id);
}

export async function setFullScreen(id: number, fullscreen: boolean): Promise<void> {
  await window.rpc.call("browserWindow.setFullScreen", id, fullscreen);
}

export async function isFullScreen(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.isFullScreen", id)) as boolean;
}

export async function focus(id: number): Promise<void> {
  await window.rpc.call("browserWindow.focus", id);
}

export async function blur(id: number): Promise<void> {
  await window.rpc.call("browserWindow.blur", id);
}

export async function setTitle(id: number, title: string): Promise<void> {
  await window.rpc.call("browserWindow.setTitle", id, title);
}

export async function getTitle(id: number): Promise<string> {
  return (await window.rpc.call("browserWindow.getTitle", id)) as string;
}

export async function getBounds(id: number): Promise<Rectangle> {
  return (await window.rpc.call("browserWindow.getBounds", id)) as Rectangle;
}

export async function setBounds(id: number, bounds: Rectangle): Promise<void> {
  await window.rpc.call("browserWindow.setBounds", id, bounds);
}

export async function getSize(id: number): Promise<Size> {
  return (await window.rpc.call("browserWindow.getSize", id)) as Size;
}

export async function setSize(id: number, size: Size): Promise<void> {
  await window.rpc.call("browserWindow.setSize", id, size);
}

export async function getPosition(id: number): Promise<Point> {
  return (await window.rpc.call("browserWindow.getPosition", id)) as Point;
}

export async function setPosition(id: number, position: Point): Promise<void> {
  await window.rpc.call("browserWindow.setPosition", id, position);
}

export async function center(id: number): Promise<void> {
  await window.rpc.call("browserWindow.center", id);
}

export async function getMinimumSize(id: number): Promise<Size> {
  return (await window.rpc.call("browserWindow.getMinimumSize", id)) as Size;
}

export async function setMinimumSize(id: number, size: Size): Promise<void> {
  await window.rpc.call("browserWindow.setMinimumSize", id, size);
}

export async function getMaximumSize(id: number): Promise<Size> {
  return (await window.rpc.call("browserWindow.getMaximumSize", id)) as Size;
}

export async function setMaximumSize(id: number, size: Size): Promise<void> {
  await window.rpc.call("browserWindow.setMaximumSize", id, size);
}

export async function setResizable(id: number, resizable: boolean): Promise<void> {
  await window.rpc.call("browserWindow.setResizable", id, resizable);
}

export async function isResizable(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.isResizable", id)) as boolean;
}

export async function setMovable(id: number, movable: boolean): Promise<void> {
  await window.rpc.call("browserWindow.setMovable", id, movable);
}

export async function isMovable(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.isMovable", id)) as boolean;
}

export async function setMinimizable(id: number, minimizable: boolean): Promise<void> {
  await window.rpc.call("browserWindow.setMinimizable", id, minimizable);
}

export async function isMinimizable(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.isMinimizable", id)) as boolean;
}

export async function setMaximizable(id: number, maximizable: boolean): Promise<void> {
  await window.rpc.call("browserWindow.setMaximizable", id, maximizable);
}

export async function isMaximizable(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.isMaximizable", id)) as boolean;
}

export async function setClosable(id: number, closable: boolean): Promise<void> {
  await window.rpc.call("browserWindow.setClosable", id, closable);
}

export async function isClosable(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.isClosable", id)) as boolean;
}

export async function setFocusable(id: number, focusable: boolean): Promise<void> {
  await window.rpc.call("browserWindow.setFocusable", id, focusable);
}

export async function isFocusable(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.isFocusable", id)) as boolean;
}

export async function setAlwaysOnTop(
  id: number,
  alwaysOnTop: boolean,
  level?: string,
  relativeLevel?: number,
): Promise<void> {
  await window.rpc.call("browserWindow.setAlwaysOnTop", id, alwaysOnTop, level, relativeLevel);
}

export async function isAlwaysOnTop(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.isAlwaysOnTop", id)) as boolean;
}

export async function setMenuBarVisibility(id: number, visible: boolean): Promise<void> {
  await window.rpc.call("browserWindow.setMenuBarVisibility", id, visible);
}

export async function isMenuBarVisible(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.isMenuBarVisible", id)) as boolean;
}

export async function setAutoHideMenuBar(id: number, autoHide: boolean): Promise<void> {
  await window.rpc.call("browserWindow.setAutoHideMenuBar", id, autoHide);
}

export async function isMenuBarAutoHide(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.isMenuBarAutoHide", id)) as boolean;
}

export async function loadURL(
  id: number,
  url: string,
  options?: {
    httpReferrer?: string;
    userAgent?: string;
    extraHeaders?: string;
  },
): Promise<void> {
  await window.rpc.call("browserWindow.loadURL", id, url, options);
}

export async function loadFile(
  id: number,
  path: string,
  options?: {
    query?: Record<string, string>;
    search?: string;
    hash?: string;
  },
): Promise<void> {
  await window.rpc.call("browserWindow.loadFile", id, path, options);
}

export async function reload(id: number): Promise<void> {
  await window.rpc.call("browserWindow.reload", id);
}

export async function openDevTools(
  id: number,
  options?: {
    mode?: "right" | "bottom" | "undocked" | "detach";
  },
): Promise<void> {
  await window.rpc.call("browserWindow.openDevTools", id, options);
}

export async function closeDevTools(id: number): Promise<void> {
  await window.rpc.call("browserWindow.closeDevTools", id);
}

export async function isDevToolsOpened(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.isDevToolsOpened", id)) as boolean;
}

export async function executeJavaScript(
  id: number,
  code: string,
  userGesture?: boolean,
): Promise<unknown> {
  return await window.rpc.call("browserWindow.executeJavaScript", id, code, userGesture);
}

export async function getAllWindows(): Promise<BrowserWindowInfo[]> {
  return (await window.rpc.call("browserWindow.getAllWindows")) as BrowserWindowInfo[];
}

export async function getFocusedWindow(): Promise<number | null> {
  return (await window.rpc.call("browserWindow.getFocusedWindow")) as number | null;
}

export async function exists(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.exists", id)) as boolean;
}

export async function isMaximized(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.isMaximized", id)) as boolean;
}

export async function isMinimized(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.isMinimized", id)) as boolean;
}

export async function isVisible(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.isVisible", id)) as boolean;
}

export async function isFocused(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.isFocused", id)) as boolean;
}

export async function setProgressBar(
  id: number,
  progress: number,
  options?: {
    mode?: "none" | "normal" | "indeterminate" | "error" | "paused";
  },
): Promise<void> {
  await window.rpc.call("browserWindow.setProgressBar", id, progress, options);
}

export async function flashFrame(id: number, flash: boolean): Promise<void> {
  await window.rpc.call("browserWindow.flashFrame", id, flash);
}

export async function setBackgroundColor(id: number, backgroundColor: string): Promise<void> {
  await window.rpc.call("browserWindow.setBackgroundColor", id, backgroundColor);
}

export async function setOpacity(id: number, opacity: number): Promise<void> {
  await window.rpc.call("browserWindow.setOpacity", id, opacity);
}

export async function getOpacity(id: number): Promise<number> {
  return (await window.rpc.call("browserWindow.getOpacity", id)) as number;
}

export async function setKiosk(id: number, kiosk: boolean): Promise<void> {
  await window.rpc.call("browserWindow.setKiosk", id, kiosk);
}

export async function isKiosk(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.isKiosk", id)) as boolean;
}

export async function setSimpleFullScreen(id: number, simple: boolean): Promise<void> {
  await window.rpc.call("browserWindow.setSimpleFullScreen", id, simple);
}

export async function isSimpleFullScreen(id: number): Promise<boolean> {
  return (await window.rpc.call("browserWindow.isSimpleFullScreen", id)) as boolean;
}

export async function setSkipTaskbar(id: number, skip: boolean): Promise<void> {
  await window.rpc.call("browserWindow.setSkipTaskbar", id, skip);
}

export async function setContentProtection(id: number, enable: boolean): Promise<void> {
  await window.rpc.call("browserWindow.setContentProtection", id, enable);
}

export function on<E extends keyof BrowserWindowEventCallbacks>(
  windowId: number,
  event: E,
  callback: BrowserWindowEventCallbacks[E],
): () => void {
  window.rpc.call("browserWindow.subscribeEvent", windowId, event);
  window.rpc.on(`window.${windowId}.${event}`, callback as (...args: unknown[]) => void);

  return () => {
    window.rpc.off(`window.${windowId}.${event}`, callback as (...args: unknown[]) => void);
    window.rpc.call("browserWindow.unsubscribeEvent", windowId, event);
  };
}

export function once<E extends keyof BrowserWindowEventCallbacks>(
  windowId: number,
  event: E,
  callback: BrowserWindowEventCallbacks[E],
): void {
  window.rpc.call("browserWindow.subscribeEvent", windowId, event);
  window.rpc.once(`window.${windowId}.${event}`, callback as (...args: unknown[]) => void);
}

export function off<E extends keyof BrowserWindowEventCallbacks>(
  windowId: number,
  event: E,
  callback?: BrowserWindowEventCallbacks[E],
): void {
  window.rpc.off(
    `window.${windowId}.${event}`,
    callback as ((...args: unknown[]) => void) | undefined,
  );
  window.rpc.call("browserWindow.unsubscribeEvent", windowId, event);
}
