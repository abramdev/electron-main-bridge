/**
 * Shared types for dialog module
 */

// ============================================================================
// File Filter
// ============================================================================

export interface FileFilter {
  name: string;
  extensions: string[];
}

// ============================================================================
// Open Dialog
// ============================================================================

export type OpenDialogOptions = {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  filters?: FileFilter[];
  properties?: Array<
    | "openFile"
    | "openDirectory"
    | "multiSelections"
    | "showHiddenFiles"
    | "createDirectory"
    | "promptToCreate"
    | "noResolveAliases"
    | "treatPackageAsDirectory"
    | "dontAddToRecent"
  >;
  message?: string;
  securityScopedBookmarks?: boolean;
};

export interface OpenDialogReturnValue {
  canceled: boolean;
  filePaths: string[];
  bookmarks?: string[];
}

// ============================================================================
// Save Dialog
// ============================================================================

export type SaveDialogOptions = {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  filters?: FileFilter[];
  message?: string;
  nameFieldLabel?: string;
  showsTagField?: boolean;
  properties?: Array<
    | "showHiddenFiles"
    | "createDirectory"
    | "treatPackageAsDirectory"
    | "showOverwriteConfirmation"
    | "dontAddToRecent"
  >;
  securityScopedBookmarks?: boolean;
};

export interface SaveDialogReturnValue {
  canceled: boolean;
  filePath: string;
  bookmark?: string;
}

// ============================================================================
// Message Box
// ============================================================================

export type MessageBoxOptions = {
  message: string;
  type?: "none" | "info" | "error" | "question" | "warning";
  buttons?: string[];
  defaultId?: number;
  title?: string;
  detail?: string;
  checkboxLabel?: string;
  checkboxChecked?: boolean;
  icon?: string;
  textWidth?: number;
  cancelId?: number;
  noLink?: boolean;
  normalizeAccessKeys?: boolean;
};

export interface MessageBoxReturnValue {
  response: number;
  checkboxChecked: boolean;
}
