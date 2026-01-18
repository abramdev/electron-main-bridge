/**
 * Shared types for path module
 */

// ============================================================================
// path module types
// ============================================================================

export type PathPlatform = "win32" | "posix";

/**
 * Result of path.parse() - represents path components
 */
export interface ParsedPath {
  root: string;
  dir: string;
  base: string;
  ext: string;
  name: string;
}
