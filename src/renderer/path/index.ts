/**
 * Renderer process API for path module
 * Usage in renderer process:
 *
 * import * as path from 'electron-main-bridge/renderer/path';
 * const full = path.join('/home', 'user', 'docs');
 */

import type { ParsedPath } from "@shared/path.types.js";

// ============================================================================
// Path parsing and formatting
// ============================================================================

export async function parse(p: string): Promise<ParsedPath> {
  return (await window.rpc.call("path.parse", p)) as ParsedPath;
}

export async function format(pathObject: ParsedPath): Promise<string> {
  return (await window.rpc.call("path.format", pathObject)) as string;
}

// ============================================================================
// Path joining and resolving
// ============================================================================

export async function join(...segments: string[]): Promise<string> {
  return (await window.rpc.call("path.join", ...segments)) as string;
}

export async function resolve(...segments: string[]): Promise<string> {
  return (await window.rpc.call("path.resolve", ...segments)) as string;
}

export async function normalize(p: string): Promise<string> {
  return (await window.rpc.call("path.normalize", p)) as string;
}

// ============================================================================
// Path components
// ============================================================================

export async function dirname(p: string): Promise<string> {
  return (await window.rpc.call("path.dirname", p)) as string;
}

export async function basename(p: string, ext?: string): Promise<string> {
  return (await window.rpc.call("path.basename", p, ext)) as string;
}

export async function extname(p: string): Promise<string> {
  return (await window.rpc.call("path.extname", p)) as string;
}

// ============================================================================
// Path properties
// ============================================================================

export async function relative(from: string, to: string): Promise<string> {
  return (await window.rpc.call("path.relative", from, to)) as string;
}

export async function isAbsolute(p: string): Promise<boolean> {
  return (await window.rpc.call("path.isAbsolute", p)) as boolean;
}

export async function sep(): Promise<string> {
  return (await window.rpc.call("path.sep")) as string;
}

export async function delimiter(): Promise<string> {
  return (await window.rpc.call("path.delimiter")) as string;
}

export async function cwd(): Promise<string> {
  return (await window.rpc.call("path.cwd")) as string;
}

// ============================================================================
// Windows-specific
// ============================================================================

export const win32 = {
  basename: async (p: string, ext?: string): Promise<string> => {
    return (await window.rpc.call("path.win32.basename", p, ext)) as string;
  },

  dirname: async (p: string): Promise<string> => {
    return (await window.rpc.call("path.win32.dirname", p)) as string;
  },

  extname: async (p: string): Promise<string> => {
    return (await window.rpc.call("path.win32.extname", p)) as string;
  },

  join: async (...segments: string[]): Promise<string> => {
    return (await window.rpc.call("path.win32.join", ...segments)) as string;
  },

  normalize: async (p: string): Promise<string> => {
    return (await window.rpc.call("path.win32.normalize", p)) as string;
  },

  parse: async (p: string): Promise<ParsedPath> => {
    return (await window.rpc.call("path.win32.parse", p)) as ParsedPath;
  },

  format: async (pathObject: ParsedPath): Promise<string> => {
    return (await window.rpc.call("path.win32.format", pathObject)) as string;
  },

  isAbsolute: async (p: string): Promise<boolean> => {
    return (await window.rpc.call("path.win32.isAbsolute", p)) as boolean;
  },

  relative: async (from: string, to: string): Promise<string> => {
    return (await window.rpc.call("path.win32.relative", from, to)) as string;
  },

  resolve: async (...segments: string[]): Promise<string> => {
    return (await window.rpc.call("path.win32.resolve", ...segments)) as string;
  },
};

// ============================================================================
// POSIX-specific
// ============================================================================

export const posix = {
  basename: async (p: string, ext?: string): Promise<string> => {
    return (await window.rpc.call("path.posix.basename", p, ext)) as string;
  },

  dirname: async (p: string): Promise<string> => {
    return (await window.rpc.call("path.posix.dirname", p)) as string;
  },

  extname: async (p: string): Promise<string> => {
    return (await window.rpc.call("path.posix.extname", p)) as string;
  },

  join: async (...segments: string[]): Promise<string> => {
    return (await window.rpc.call("path.posix.join", ...segments)) as string;
  },

  normalize: async (p: string): Promise<string> => {
    return (await window.rpc.call("path.posix.normalize", p)) as string;
  },

  parse: async (p: string): Promise<ParsedPath> => {
    return (await window.rpc.call("path.posix.parse", p)) as ParsedPath;
  },

  format: async (pathObject: ParsedPath): Promise<string> => {
    return (await window.rpc.call("path.posix.format", pathObject)) as string;
  },

  isAbsolute: async (p: string): Promise<boolean> => {
    return (await window.rpc.call("path.posix.isAbsolute", p)) as boolean;
  },

  relative: async (from: string, to: string): Promise<string> => {
    return (await window.rpc.call("path.posix.relative", from, to)) as string;
  },

  resolve: async (...segments: string[]): Promise<string> => {
    return (await window.rpc.call("path.posix.resolve", ...segments)) as string;
  },
};
