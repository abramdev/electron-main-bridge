/**
 * Shared types for BrowserWindow module
 */

// ============================================================================
// Constructor Options
// ============================================================================

/**
 * BrowserWindow constructor options (IPC serializable subset)
 */
export interface BrowserWindowConstructorOptions {
  // Size and Position
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;

  // Appearance
  title?: string;
  icon?: string;
  show?: boolean;
  frame?: boolean;
  transparent?: boolean;
  resizable?: boolean;
  maximizable?: boolean;
  minimizable?: boolean;
  closable?: boolean;
  focusable?: boolean;
  alwaysOnTop?: boolean;
  fullscreenable?: boolean;
  kiosk?: boolean;
  titleBarStyle?: "default" | "hidden" | "hiddenInset" | "customButtonsOnHover";
  backgroundColor?: string;
  vibrancy?:
    | "appearance-based"
    | "light"
    | "dark"
    | "titlebar"
    | "selection"
    | "menu"
    | "popover"
    | "sidebar"
    | "medium-light"
    | "ultra-dark"
    | "header"
    | "sheet"
    | "content"
    | "under-window"
    | "under-page";
  hasShadow?: boolean;
  opacity?: number;
  roundedCorners?: boolean;
  thickFrame?: boolean;

  // Window Behavior
  parent?: number;
  modal?: boolean;
  autoHideMenuBar?: boolean;
  enableLargerThanScreen?: boolean;
  paintWhenInitiallyHidden?: boolean;

  // Content Loading
  webPreferences?: WebPreferences;
}

/**
 * WebPreferences (IPC serializable subset)
 */
export interface WebPreferences {
  nodeIntegration?: boolean;
  nodeIntegrationInWorker?: boolean;
  contextIsolation?: boolean;
  preload?: string;
  sandbox?: boolean;
  webSecurity?: boolean;
  allowRunningInsecureContent?: boolean;
  javascript?: boolean;
  images?: boolean;
  plugins?: boolean;
  devTools?: boolean;
  spellcheck?: boolean;
  defaultFontFamily?: {
    standard?: string;
    serif?: string;
    sansSerif?: string;
    monospace?: string;
    cursive?: string;
    fantasy?: string;
  };
  defaultEncoding?: string;
  defaultFontSize?: number;
  defaultMonospaceFontSize?: number;
  minimumFontSize?: number;
  standardFontFamily?: string;
  serifFontFamily?: string;
  sansSerifFontFamily?: string;
  monospaceFontFamily?: string;
  cursiveFontFamily?: string;
  fantasyFontFamily?: string;
  zoomFactor?: number;
  blinkFeatures?: string[];
}

// ============================================================================
// Window Info
// ============================================================================

/**
 * BrowserWindow information
 */
export interface BrowserWindowInfo {
  id: number;
  title: string;
  url: string;
  bounds: Rectangle;
  isMaximized: boolean;
  isMinimized: boolean;
  isFullscreen: boolean;
  isResizable: boolean;
  isMovable: boolean;
  isClosable: boolean;
  isFocused: boolean;
  isVisible: boolean;
}

// ============================================================================
// Geometry Types
// ============================================================================

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
 * A size with width and height
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * A point with x and y coordinates
 */
export interface Point {
  x: number;
  y: number;
}

// ============================================================================
// Event Data Types
// ============================================================================

/**
 * Event data types for BrowserWindow module
 */
export interface BrowserWindowEventData {
  "window.{id}.close": { id: number };
  "window.{id}.closed": { id: number };
  "window.{id}.focus": { id: number };
  "window.{id}.blur": { id: number };
  "window.{id}.ready-to-show": { id: number };
  "window.{id}.maximize": { id: number };
  "window.{id}.unmaximize": { id: number };
  "window.{id}.minimize": { id: number };
  "window.{id}.restore": { id: number };
  "window.{id}.move": { id: number; bounds: Rectangle };
  "window.{id}.resize": { id: number; bounds: Rectangle };
  "window.{id}.enter-full-screen": { id: number };
  "window.{id}.leave-full-screen": { id: number };
  "window.{id}.page-title-updated": { id: number; title: string };
  "window.{id}.unresponsive": { id: number };
  "window.{id}.responsive": { id: number };
  "window.{id}.show": { id: number };
  "window.{id}.hide": { id: number };
  "window.{id}.app-command": { id: number; command: string };
}

// ============================================================================
// Event Callback Types
// ============================================================================

/**
 * Event callback types for BrowserWindow module
 */
export interface BrowserWindowEventCallbacks {
  close: (data: { id: number }) => void;
  closed: (data: { id: number }) => void;
  focus: (data: { id: number }) => void;
  blur: (data: { id: number }) => void;
  "ready-to-show": (data: { id: number }) => void;
  maximize: (data: { id: number }) => void;
  unmaximize: (data: { id: number }) => void;
  minimize: (data: { id: number }) => void;
  restore: (data: { id: number }) => void;
  move: (data: { id: number; bounds: Rectangle }) => void;
  resize: (data: { id: number; bounds: Rectangle }) => void;
  "enter-full-screen": (data: { id: number }) => void;
  "leave-full-screen": (data: { id: number }) => void;
  "page-title-updated": (data: { id: number; title: string }) => void;
  unresponsive: (data: { id: number }) => void;
  responsive: (data: { id: number }) => void;
  show: (data: { id: number }) => void;
  hide: (data: { id: number }) => void;
  "app-command": (data: { id: number; command: string }) => void;
}
