/**
 * Shared types for app module
 */

// ============================================================================
// Path names for getPath()
// ============================================================================

export type AppPathName =
  | "home"
  | "appData"
  | "userData"
  | "sessionData"
  | "temp"
  | "exe"
  | "module"
  | "desktop"
  | "documents"
  | "downloads"
  | "music"
  | "pictures"
  | "videos"
  | "logs"
  | "crashDumps";

// ============================================================================
// Login item settings
// ============================================================================

export interface LoginItemSettings {
  openAtLogin: boolean;
  openAsHidden: boolean;
}

export type LoginItemSettingsOptions = {
  /**
   * The type of login item settings to get.
   * - 'current' (default): The settings that apply to the current user.
   * - 'legacy': The settings that apply to all users (may not be writable).
   */
  type?: "current" | "legacy";
};

export type SetLoginItemSettingsOptions = {
  openAtLogin?: boolean;
  openAsHidden?: boolean;
  name?: string;
  path?: string;
  args?: string[];
  icon?: string;
};

// ============================================================================
// GPU feature status
// ============================================================================

export type GPUFeatureStatus = Partial<
  Record<
    "2d_canvas" | "webgl" | "webgl2" | "webgpu" | "vulkan",
    "software-rendered" | "hardware-accelerated" | "unavailable" | "disabled"
  >
>;

// ============================================================================
// Process metric
// ============================================================================

export interface ProcessMetric {
  pid: number;
  type: string;
  memory?: {
    workingSetSize: number;
    peakWorkingSetSize: number;
  };
  cpu?: {
    percent: number;
    idleWakeupsPerSecond: number;
  };
}

// ============================================================================
// About panel options
// ============================================================================

export interface AboutPanelOptions {
  name?: string;
  version?: string;
  copyright?: string;
  website?: string;
  credits?: string;
  license?: string;
  authors?: string[];
  iconPath?: string;
  executableVersion?: string;
  buildNumber?: string;
}

// ============================================================================
// File icon options
// ============================================================================

export type GetFileIconOptions = {
  size?: "normal" | "small" | "large";
};

/**
 * Serialized NativeImage - can be converted back to buffer or data URL
 */
export interface SerializedNativeImage {
  toPNG(): Uint8Array;
  toDataURL(): string;
  size: { width: number; height: number };
  _data: Uint8Array;
}

// ============================================================================
// Relaunch options
// ============================================================================

export interface RelaunchOptions {
  execPath?: string;
  args?: string[];
}

// ============================================================================
// Focus options
// ============================================================================

export type FocusOptions = {
  steal?: boolean;
};

// ============================================================================
// Event data types
// ============================================================================

export interface AppEventData {
  // Lifecycle events
  "app.window-all-closed": void;
  "app.quit": { exitCode: number };

  // Window events (simplified - only ID and title)
  "app.browser-window-created": { id: number; title: string };
  "app.browser-window-focus": { id: number; title: string };
  "app.browser-window-blur": { id: number; title: string };
  "app.web-contents-created": { id: number };

  // File/URL events
  "app.open-file": { path: string };
  "app.open-url": { url: string };
  "app.second-instance": { argv: string[]; workingDirectory: string };

  // Accessibility
  "app.accessibility-support-changed": { enabled: boolean };
}
