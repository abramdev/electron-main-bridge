/**
 * Shared types for autoUpdater module
 */

// ============================================================================
// Feed URL Configuration
// ============================================================================

export interface AutoUpdaterFeedURLOptions {
  url: string;
  headers?: Record<string, string>;
  serverType?: "json" | "default";
}

// ============================================================================
// Update Information
// ============================================================================

export interface UpdateInfo {
  releaseNotes: string;
  releaseName: string;
  releaseDate: string; // ISO date string
  updateURL: string;
}

// ============================================================================
// Update Error
// ============================================================================

export interface UpdateError {
  message: string;
  stack?: string;
}
