/**
 * Main process handlers for screen module
 * Provides information about screen size, displays, and cursor position
 */

import { BrowserWindow, screen } from "electron";
import type { RpcServer } from "electron-json-rpc/main";
import type { Display, Point, Rectangle } from "@shared/screen.types.js";

const RPC_METHOD_PREFIX = "screen";

/**
 * Get the current absolute position of the mouse pointer
 */
export async function getCursorScreenPointHandler(): Promise<Point> {
  return screen.getCursorScreenPoint();
}

/**
 * Get the primary display
 */
export async function getPrimaryDisplayHandler(): Promise<Display> {
  return screen.getPrimaryDisplay() as Display;
}

/**
 * Get an array of displays that are currently available
 */
export async function getAllDisplaysHandler(): Promise<Display[]> {
  return screen.getAllDisplays() as Display[];
}

/**
 * Get the display nearest to the specified point
 */
export async function getDisplayNearestPointHandler(...params: unknown[]): Promise<Display> {
  const [point] = params as [Point];
  return screen.getDisplayNearestPoint(point) as Display;
}

/**
 * Get the display that most closely intersects the provided bounds
 */
export async function getDisplayMatchingHandler(...params: unknown[]): Promise<Display> {
  const [rect] = params as [Rectangle];
  return screen.getDisplayMatching(rect) as Display;
}

/**
 * Convert a screen physical point to a screen DIP point (Windows/Linux)
 * Not currently supported on Wayland
 */
export async function screenToDipPointHandler(...params: unknown[]): Promise<Point> {
  const [point] = params as [Point];
  return screen.screenToDipPoint(point);
}

/**
 * Convert a screen DIP point to a screen physical point (Windows/Linux)
 * Not currently supported on Wayland
 */
export async function dipToScreenPointHandler(...params: unknown[]): Promise<Point> {
  const [point] = params as [Point];
  return screen.dipToScreenPoint(point);
}

/**
 * Convert a screen physical rect to a screen DIP rect (Windows)
 * @param windowId - The BrowserWindow id (or null for nearest display to rect)
 * @param rect - The physical rect to convert
 */
export async function screenToDipRectHandler(...params: unknown[]): Promise<Rectangle> {
  const [windowId, rect] = params as [number | null, Rectangle];
  const window = windowId === null ? null : (BrowserWindow.fromId(windowId ?? -1) ?? null);
  return screen.screenToDipRect(window, rect);
}

/**
 * Convert a screen DIP rect to a screen physical rect (Windows)
 * @param windowId - The BrowserWindow id (or null for nearest display to rect)
 * @param rect - The DIP rect to convert
 */
export async function dipToScreenRectHandler(...params: unknown[]): Promise<Rectangle> {
  const [windowId, rect] = params as [number | null, Rectangle];
  const window = windowId === null ? null : (BrowserWindow.fromId(windowId ?? -1) ?? null);
  return screen.dipToScreenRect(window, rect);
}

/**
 * Register all screen module RPC handlers and set up event forwarding
 */
export function registerScreenModule(rpc: RpcServer): void {
  rpc.register(`${RPC_METHOD_PREFIX}.getCursorScreenPoint`, getCursorScreenPointHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getPrimaryDisplay`, getPrimaryDisplayHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getAllDisplays`, getAllDisplaysHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getDisplayNearestPoint`, getDisplayNearestPointHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getDisplayMatching`, getDisplayMatchingHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.screenToDipPoint`, screenToDipPointHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.dipToScreenPoint`, dipToScreenPointHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.screenToDipRect`, screenToDipRectHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.dipToScreenRect`, dipToScreenRectHandler);

  // Forward display events to renderer
  screen.on("display-added", (_event, newDisplay) => {
    rpc.publish("screen.display-added", newDisplay);
  });

  screen.on("display-removed", (_event, oldDisplay) => {
    rpc.publish("screen.display-removed", oldDisplay);
  });

  screen.on("display-metrics-changed", (_event, display, changedMetrics) => {
    rpc.publish("screen.display-metrics-changed", {
      display,
      changedMetrics,
    });
  });
}
