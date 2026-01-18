import { BrowserWindow, Menu, MenuItem } from "electron";
import type { RpcServer } from "electron-json-rpc/main";
import type {
  MenuItemConstructorOptions,
  MenuItemData,
  MenuData,
  PopupOptions,
} from "@shared/menu.types.js";

let menuInstance: Menu | null = null;
let rpcInstance: RpcServer | null = null;

const RPC_METHOD_PREFIX = "menu";

function serializeMenuItem(menuItem: MenuItem): MenuItemData {
  return {
    id: menuItem.id,
    label: menuItem.label,
    sublabel: menuItem.sublabel,
    toolTip: menuItem.toolTip,
    accelerator: menuItem.accelerator,
    type: menuItem.type,
    role: menuItem.role,
    enabled: menuItem.enabled,
    visible: menuItem.visible,
    checked: menuItem.checked,
    registerAccelerator: menuItem.registerAccelerator,
    submenu: menuItem.submenu ? menuItem.submenu.items.map(serializeMenuItem) : undefined,
    commandId: menuItem.commandId,
  };
}

function setupMenuEvents(menu: Menu): void {
  menu.on("menu-will-show", () => {
    rpcInstance?.publish("menu.menu-will-show");
  });
  menu.on("menu-will-close", () => {
    rpcInstance?.publish("menu.menu-will-close");
  });
}

async function setApplicationMenuHandler(...params: unknown[]): Promise<void> {
  const [template] = params as [MenuItemConstructorOptions[] | null];
  if (!template) {
    Menu.setApplicationMenu(null);
    return;
  }
  const menu = Menu.buildFromTemplate(template as Electron.MenuItemConstructorOptions[]);
  Menu.setApplicationMenu(menu);
}

async function getApplicationMenuHandler(): Promise<MenuData | null> {
  const menu = Menu.getApplicationMenu();
  if (!menu) return null;
  return { items: menu.items.map(serializeMenuItem) };
}

async function buildFromTemplateHandler(...params: unknown[]): Promise<MenuData> {
  const [template] = params as [MenuItemConstructorOptions[]];
  const menu = Menu.buildFromTemplate(template as Electron.MenuItemConstructorOptions[]);
  return { items: menu.items.map(serializeMenuItem) };
}

async function sendActionToFirstResponderHandler(...params: unknown[]): Promise<void> {
  const [action] = params as [string];
  Menu.sendActionToFirstResponder(action);
}

async function popupHandler(...params: unknown[]): Promise<void> {
  const [options] = params as [PopupOptions?];
  if (!menuInstance) throw new Error("Menu instance not provided during registration");
  if (!options) {
    menuInstance.popup();
    return;
  }
  const { windowId, ...rest } = options;
  const hasWindowId = windowId !== undefined && windowId !== null;
  const window = hasWindowId ? (BrowserWindow.fromId(windowId) ?? undefined) : undefined;
  const popupOptions = window ? { ...rest, window } : rest;
  menuInstance.popup(popupOptions as Electron.PopupOptions);
}

async function closePopupHandler(...params: unknown[]): Promise<void> {
  const [windowId] = params as [number?];
  if (!menuInstance) throw new Error("Menu instance not provided during registration");
  if (windowId === undefined || windowId === null) {
    menuInstance.closePopup();
    return;
  }
  const window = BrowserWindow.fromId(windowId);
  if (!window) return;
  menuInstance.closePopup(window);
}

async function appendHandler(...params: unknown[]): Promise<void> {
  const [menuItemOptions] = params as [MenuItemConstructorOptions];
  if (!menuInstance) throw new Error("Menu instance not provided during registration");
  const menuItem = new MenuItem(menuItemOptions);
  menuInstance.append(menuItem);
}

async function getMenuItemByIdHandler(...params: unknown[]): Promise<MenuItemData | null> {
  const [id] = params as [string];
  if (!menuInstance) throw new Error("Menu instance not provided during registration");
  const menuItem = menuInstance.getMenuItemById(id);
  return menuItem ? serializeMenuItem(menuItem) : null;
}

async function insertHandler(...params: unknown[]): Promise<void> {
  const [pos, menuItemOptions] = params as [number, MenuItemConstructorOptions];
  if (!menuInstance) throw new Error("Menu instance not provided during registration");
  const menuItem = new MenuItem(menuItemOptions);
  menuInstance.insert(pos, menuItem);
}

async function getItemsHandler(): Promise<MenuItemData[]> {
  if (!menuInstance) throw new Error("Menu instance not provided during registration");
  return menuInstance.items.map(serializeMenuItem);
}

export function registerMenuModule(rpc: RpcServer, menu: Menu): void {
  rpcInstance = rpc;
  menuInstance = menu;
  setupMenuEvents(menu);

  rpc.register(`${RPC_METHOD_PREFIX}.setApplicationMenu`, setApplicationMenuHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getApplicationMenu`, getApplicationMenuHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.buildFromTemplate`, buildFromTemplateHandler);
  rpc.register(
    `${RPC_METHOD_PREFIX}.sendActionToFirstResponder`,
    sendActionToFirstResponderHandler,
  );
  rpc.register(`${RPC_METHOD_PREFIX}.popup`, popupHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.closePopup`, closePopupHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.append`, appendHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getMenuItemById`, getMenuItemByIdHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.insert`, insertHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getItems`, getItemsHandler);
}
