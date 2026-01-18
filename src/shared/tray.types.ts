/**
 * Shared types for tray module
 */

import type { Rectangle, Point } from "electron";

// ============================================================================
// Display Balloon Options (Windows)
// ============================================================================

export interface DisplayBalloonOptions {
  /** NativeImage | string */
  icon?: string;
  iconType?: "none" | "info" | "warning" | "error" | "custom";
  title: string;
  content: string;
  largeIcon?: boolean;
  noSound?: boolean;
  respectQuietTime?: boolean;
}

// ============================================================================
// Set Title Options (macOS)
// ============================================================================

export interface SetTitleOptions {
  fontType?: "monospaced" | "monospacedDigit";
}

export interface TrayBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ============================================================================
// Event Data Types
// ============================================================================

export interface TrayClickEvent {
  bounds: Rectangle;
  position?: Point;
}

export interface TrayMouseEvent {
  position: Point;
}

// ============================================================================
// Tray Event Callbacks
// ============================================================================

export interface TrayEventCallbacks {
  "tray.click": (data: TrayClickEvent) => void;
  "tray.right-click": (data: TrayClickEvent) => void;
  "tray.double-click": (data: TrayClickEvent) => void;
  "tray.middle-click": (data: TrayClickEvent) => void;
  "tray.mouse-up": (data: TrayMouseEvent) => void;
  "tray.mouse-down": (data: TrayMouseEvent) => void;
  "tray.mouse-enter": (data: TrayMouseEvent) => void;
  "tray.mouse-leave": (data: TrayMouseEvent) => void;
  "tray.mouse-move": (data: TrayMouseEvent) => void;
  "tray.balloon-show": () => void;
  "tray.balloon-click": () => void;
  "tray.balloon-closed": () => void;
}
