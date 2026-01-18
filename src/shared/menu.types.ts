export type MenuItemType = "normal" | "separator" | "submenu" | "checkbox" | "radio";

export type MenuItemRole =
  | "undo"
  | "redo"
  | "cut"
  | "copy"
  | "paste"
  | "pasteAndMatchStyle"
  | "delete"
  | "selectAll"
  | "reload"
  | "forceReload"
  | "toggleDevTools"
  | "resetZoom"
  | "zoomIn"
  | "zoomOut"
  | "toggleSpellChecker"
  | "togglefullscreen"
  | "window"
  | "minimize"
  | "close"
  | "help"
  | "about"
  | "services"
  | "hide"
  | "hideOthers"
  | "unhide"
  | "quit"
  | "showSubstitutions"
  | "toggleSmartQuotes"
  | "toggleSmartDashes"
  | "toggleTextReplacement"
  | "startSpeaking"
  | "stopSpeaking"
  | "zoom"
  | "front"
  | "appMenu"
  | "fileMenu"
  | "editMenu"
  | "viewMenu"
  | "shareMenu"
  | "recentDocuments"
  | "toggleTabBar"
  | "selectNextTab"
  | "selectPreviousTab"
  | "showAllTabs"
  | "mergeAllWindows"
  | "clearRecentDocuments"
  | "moveTabToNewWindow"
  | "windowMenu";

export interface MenuItemConstructorOptions {
  role?: MenuItemRole;
  type?: MenuItemType;
  label?: string;
  sublabel?: string;
  toolTip?: string;
  accelerator?: string;
  icon?: string;
  enabled?: boolean;
  acceleratorWorksWhenHidden?: boolean;
  visible?: boolean;
  checked?: boolean;
  registerAccelerator?: boolean;
  submenu?: MenuItemConstructorOptions[];
  id?: string;
  before?: string[];
  after?: string[];
  beforeGroupContaining?: string[];
  afterGroupContaining?: string[];
}

export interface MenuItemData {
  id?: string;
  label?: string;
  sublabel?: string;
  toolTip?: string;
  accelerator?: string;
  icon?: string;
  type?: MenuItemType;
  role?: MenuItemRole;
  enabled?: boolean;
  visible?: boolean;
  checked?: boolean;
  registerAccelerator?: boolean;
  submenu?: MenuItemData[];
  commandId?: number;
}

export interface MenuData {
  items: MenuItemData[];
}

export interface PopupOptions {
  windowId?: number;
  x?: number;
  y?: number;
  positioningItem?: number;
  sourceType?:
    | "none"
    | "mouse"
    | "keyboard"
    | "touch"
    | "touchMenu"
    | "longPress"
    | "longTap"
    | "touchHandle"
    | "stylus"
    | "adjustSelection"
    | "adjustSelectionReset";
}

export interface MenuEventCallbacks {
  "menu-will-show": () => void;
  "menu-will-close": () => void;
}
