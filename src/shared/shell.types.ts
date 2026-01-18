/**
 * Shared types for shell module
 */

// ============================================================================
// Open External Options
// ============================================================================

export interface OpenExternalOptions {
  /** @default true (macOS) - Brings the opened application to the foreground */
  activate?: boolean;
  /** Windows: The working directory */
  workingDirectory?: string;
  /** @default false (Windows) - Indicates a user initiated launch */
  logUsage?: boolean;
}

// ============================================================================
// Shortcut Details (Windows)
// ============================================================================

export interface ShortcutDetails {
  target?: string;
  cwd?: string;
  args?: string;
  description?: string;
  icon?: string;
  iconIndex?: number;
  appUserModelId?: string;
}

export type ShortcutLinkOperation = "create" | "update" | "replace";
