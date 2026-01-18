/**
 * Renderer process API for screen module
 * Usage in renderer process:
 *
 * import * as screen from 'electron-main-bridge/renderer/screen';
 *
 * const primaryDisplay = await screen.getPrimaryDisplay();
 * const { width, height } = primaryDisplay.workAreaSize;
 * const cursorPos = await screen.getCursorScreenPoint();
 */

import type {
  Display,
  DisplayMetric,
  Point,
  Rectangle,
  ScreenEventCallbacks,
} from "@shared/screen.types.js";

/**
 * Get the current absolute position of the mouse pointer
 */
export async function getCursorScreenPoint(): Promise<Point> {
  return (await window.rpc.call("screen.getCursorScreenPoint")) as Point;
}

/**
 * Get the primary display
 */
export async function getPrimaryDisplay(): Promise<Display> {
  return (await window.rpc.call("screen.getPrimaryDisplay")) as Display;
}

/**
 * Get an array of displays that are currently available
 */
export async function getAllDisplays(): Promise<Display[]> {
  return (await window.rpc.call("screen.getAllDisplays")) as Display[];
}

/**
 * Get the display nearest to the specified point
 */
export async function getDisplayNearestPoint(point: Point): Promise<Display> {
  return (await window.rpc.call("screen.getDisplayNearestPoint", point)) as Display;
}

/**
 * Get the display that most closely intersects the provided bounds
 */
export async function getDisplayMatching(rect: Rectangle): Promise<Display> {
  return (await window.rpc.call("screen.getDisplayMatching", rect)) as Display;
}

/**
 * Convert a screen physical point to a screen DIP point (Windows/Linux)
 * Not currently supported on Wayland - returns the point passed in with no changes
 */
export async function screenToDipPoint(point: Point): Promise<Point> {
  return (await window.rpc.call("screen.screenToDipPoint", point)) as Point;
}

/**
 * Convert a screen DIP point to a screen physical point (Windows/Linux)
 * Not currently supported on Wayland
 */
export async function dipToScreenPoint(point: Point): Promise<Point> {
  return (await window.rpc.call("screen.dipToScreenPoint", point)) as Point;
}

/**
 * Convert a screen physical rect to a screen DIP rect (Windows)
 * @param windowId - The BrowserWindow id (or null for nearest display to rect)
 * @param rect - The physical rect to convert
 */
export async function screenToDipRect(
  windowId: number | null,
  rect: Rectangle,
): Promise<Rectangle> {
  return (await window.rpc.call("screen.screenToDipRect", windowId, rect)) as Rectangle;
}

/**
 * Convert a screen DIP rect to a screen physical rect (Windows)
 * @param windowId - The BrowserWindow id (or null for nearest display to rect)
 * @param rect - The DIP rect to convert
 */
export async function dipToScreenRect(
  windowId: number | null,
  rect: Rectangle,
): Promise<Rectangle> {
  return (await window.rpc.call("screen.dipToScreenRect", windowId, rect)) as Rectangle;
}

/**
 * Event callbacks for screen module
 */
export interface ScreenEventCallbacksExtended extends ScreenEventCallbacks {
  "display-added": (display: Display) => void;
  "display-removed": (display: Display) => void;
  "display-metrics-changed": (data: { display: Display; changedMetrics: DisplayMetric[] }) => void;
}

/**
 * Register a callback for a screen event
 * @returns A function that removes the listener
 */
export function on<K extends keyof ScreenEventCallbacksExtended>(
  event: K,
  callback: ScreenEventCallbacksExtended[K],
): () => void {
  return window.rpc.on(`screen.${event}`, callback as (...args: unknown[]) => void);
}

/**
 * Register a one-time callback for a screen event
 */
export function once<K extends keyof ScreenEventCallbacksExtended>(
  event: K,
  callback: ScreenEventCallbacksExtended[K],
): void {
  window.rpc.once(`screen.${event}`, callback as (...args: unknown[]) => void);
}

/**
 * Remove a callback for a screen event
 */
export function off<K extends keyof ScreenEventCallbacksExtended>(
  event: K,
  callback?: ScreenEventCallbacksExtended[K],
): void {
  window.rpc.off(`screen.${event}`, callback as ((...args: unknown[]) => void) | undefined);
}
