import { BrowserWindow } from "electron";
import type { BrowserWindowInfo } from "@shared/browserWindow.types.js";

const windows = new Map<number, BrowserWindow>();

export function getWindow(id: number): BrowserWindow {
  const window = BrowserWindow.fromId(id);
  if (!window) {
    throw new Error(`Window ${id} not found`);
  }
  return window;
}

export function hasWindow(id: number): boolean {
  return BrowserWindow.fromId(id) !== null;
}

export function addWindow(window: BrowserWindow): void {
  windows.set(window.id, window);
}

export function removeWindow(id: number): void {
  windows.delete(id);
}

export function getAllWindows(): BrowserWindowInfo[] {
  return BrowserWindow.getAllWindows().map((w) => ({
    id: w.id,
    title: w.getTitle(),
    url: w.webContents.getURL(),
    bounds: w.getBounds(),
    isMaximized: w.isMaximized(),
    isMinimized: w.isMinimized(),
    isFullscreen: w.isFullScreen(),
    isResizable: w.isResizable(),
    isMovable: w.isMovable(),
    isClosable: w.isClosable(),
    isFocused: w.isFocused(),
    isVisible: w.isVisible(),
  }));
}
