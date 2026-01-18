/**
 * Shared types for shareMenu module (macOS only)
 */

/**
 * Item to share via the system share sheet
 */
export interface SharingItem {
  /** An array of text to share */
  texts?: string[];
  /** An array of file paths to share */
  filePaths?: string[];
  /** An array of URLs to share */
  urls?: string[];
}

/**
 * Options for popping up the share menu
 */
export interface PopupOptions {
  /** The BrowserWindow id to pop up the menu in (default: focused window) */
  browserWindow?: number;
  /** The x position to pop up the menu (default: current mouse cursor position) */
  x?: number;
  /** The y position to pop up the menu (default: current mouse cursor position) */
  y?: number;
  /** The index of the menu item to position under the mouse cursor (macOS only) */
  positioningItem?: number;
}
