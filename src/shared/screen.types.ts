/**
 * Shared types for screen module
 */

/**
 * A point with x and y coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * A rectangle with position and size
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Touch support type for a display
 */
export type TouchSupport = "unknown" | "no" | "available" | "availableWithHands";

/**
 * Information about a physical display
 */
export interface Display {
  /** The unique identifier for the display */
  id: number;
  /** The screen bounds as { x, y, width, height } */
  bounds: Rectangle;
  /** The work area (excluding taskbar/dock) as { x, y, width, height } */
  workArea: Rectangle;
  /** The device pixel ratio (e.g., 1 for standard, 2 for Retina) */
  scaleFactor: number;
  /** The rotation of the display (0, 90, 180, 270) */
  rotation: number;
  /** The touch support availability */
  touchSupport: TouchSupport;
}

/**
 * Display metrics that can change
 */
export type DisplayMetric = "bounds" | "workArea" | "scaleFactor" | "rotation";

/**
 * Event data types for screen module
 */
export interface ScreenEventData {
  "screen.display-added": Display;
  "screen.display-removed": Display;
  "screen.display-metrics-changed": {
    display: Display;
    changedMetrics: DisplayMetric[];
  };
}

/**
 * Event callback types for screen module
 */
export interface ScreenEventCallbacks {
  "display-added": (display: Display) => void;
  "display-removed": (display: Display) => void;
  "display-metrics-changed": (data: { display: Display; changedMetrics: DisplayMetric[] }) => void;
}
