/**
 * Shared types for systemPreferences module
 */

// ============================================================================
// UserDefault Types (macOS)
// ============================================================================

export type UserDefaultType =
  | "string"
  | "boolean"
  | "integer"
  | "float"
  | "double"
  | "url"
  | "array"
  | "dictionary";

export type UserDefaultTypes = {
  string: string;
  boolean: boolean;
  integer: number;
  float: number;
  double: number;
  url: string;
  array: unknown[];
  dictionary: Record<string, unknown>;
};

// ============================================================================
// Media Access Types
// ============================================================================

export type MediaAccessType = "microphone" | "camera" | "screen";

export type MediaAccessStatus = "not-determined" | "granted" | "denied" | "restricted" | "unknown";

// ============================================================================
// Animation Settings
// ============================================================================

export interface AnimationSettings {
  shouldRenderRichAnimation: boolean;
  scrollAnimationsEnabledBySystem: boolean;
  prefersReducedMotion: boolean;
}

// ============================================================================
// Appearance
// ============================================================================

export type EffectiveAppearance = "dark" | "light" | "unknown";

// ============================================================================
// Windows Color Values
// ============================================================================

export type WindowsColor =
  | "3d-dark-shadow"
  | "3d-face"
  | "3d-highlight"
  | "3d-light"
  | "3d-shadow"
  | "active-border"
  | "active-caption"
  | "active-caption-gradient"
  | "app-workspace"
  | "button-text"
  | "caption-text"
  | "desktop"
  | "disabled-text"
  | "highlight"
  | "highlight-text"
  | "hotlight"
  | "inactive-border"
  | "inactive-caption"
  | "inactive-caption-gradient"
  | "inactive-caption-text"
  | "info-background"
  | "info-text"
  | "menu"
  | "menu-highlight"
  | "menubar"
  | "menu-text"
  | "scrollbar"
  | "window"
  | "window-frame"
  | "window-text";

// ============================================================================
// macOS Color Values
// ============================================================================

export type MacOsColor =
  | "control-background"
  | "control"
  | "control-text"
  | "disabled-control-text"
  | "find-highlight"
  | "grid"
  | "header-text"
  | "highlight"
  | "keyboard-focus-indicator"
  | "label"
  | "link"
  | "placeholder-text"
  | "quaternary-label"
  | "scrubber-textured-background"
  | "secondary-label"
  | "selected-content-background"
  | "selected-control"
  | "selected-control-text"
  | "selected-menu-item-text"
  | "selected-text-background"
  | "selected-text"
  | "separator"
  | "shadow"
  | "tertiary-label"
  | "text-background"
  | "text"
  | "under-page-background"
  | "unemphasized-selected-content-background"
  | "unemphasized-selected-text-background"
  | "unemphasized-selected-text"
  | "window-background"
  | "window-frame-text";

// ============================================================================
// macOS System Color Values
// ============================================================================

export type MacOsSystemColor =
  | "blue"
  | "brown"
  | "gray"
  | "green"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "yellow";

// ============================================================================
// Notification Event Data (macOS)
// ============================================================================

export interface NotificationEventData {
  event: string;
  userInfo: Record<string, unknown>;
}

// ============================================================================
// System Preferences Event Callbacks
// ============================================================================

export interface SystemPreferencesEventCallbacks {
  "accent-color-changed": (newColor: string) => void;
  "color-changed": () => void;
}
