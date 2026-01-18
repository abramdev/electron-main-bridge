import type {
  MenuItemConstructorOptions,
  MenuItemData,
  MenuData,
  PopupOptions,
  MenuEventCallbacks,
} from "@shared/menu.types.js";

export async function setApplicationMenu(
  template: MenuItemConstructorOptions[] | null,
): Promise<void> {
  await window.rpc.call("menu.setApplicationMenu", template);
}

export async function getApplicationMenu(): Promise<MenuData | null> {
  return (await window.rpc.call("menu.getApplicationMenu")) as MenuData | null;
}

export async function buildFromTemplate(template: MenuItemConstructorOptions[]): Promise<MenuData> {
  return (await window.rpc.call("menu.buildFromTemplate", template)) as MenuData;
}

export async function sendActionToFirstResponder(action: string): Promise<void> {
  await window.rpc.call("menu.sendActionToFirstResponder", action);
}

export async function popup(options?: PopupOptions): Promise<void> {
  await window.rpc.call("menu.popup", options);
}

export async function closePopup(windowId?: number): Promise<void> {
  await window.rpc.call("menu.closePopup", windowId);
}

export async function append(menuItem: MenuItemConstructorOptions): Promise<void> {
  await window.rpc.call("menu.append", menuItem);
}

export async function getMenuItemById(id: string): Promise<MenuItemData | null> {
  return (await window.rpc.call("menu.getMenuItemById", id)) as MenuItemData | null;
}

export async function insert(pos: number, menuItem: MenuItemConstructorOptions): Promise<void> {
  await window.rpc.call("menu.insert", pos, menuItem);
}

export async function getItems(): Promise<MenuItemData[]> {
  return (await window.rpc.call("menu.getItems")) as MenuItemData[];
}

export function on<K extends keyof MenuEventCallbacks>(
  event: K,
  callback: MenuEventCallbacks[K],
): () => void {
  return window.rpc.on(`menu.${event}`, callback as (...args: unknown[]) => void);
}

export function once<K extends keyof MenuEventCallbacks>(
  event: K,
  callback: MenuEventCallbacks[K],
): void {
  window.rpc.once(`menu.${event}`, callback as (...args: unknown[]) => void);
}

export function off<K extends keyof MenuEventCallbacks>(
  event: K,
  callback?: MenuEventCallbacks[K],
): void {
  window.rpc.off(`menu.${event}`, callback as ((...args: unknown[]) => void) | undefined);
}
