import { BrowserWindow } from "electron";
import type { RpcServer } from "electron-json-rpc/main";

const windowEventSubscribers = new Map<number, Map<string, number>>();
const windowEventHandlers = new Map<number, Map<string, (...args: unknown[]) => void>>();

function getOrCreateSubscriberMap(windowId: number): Map<string, number> {
  if (!windowEventSubscribers.has(windowId)) {
    windowEventSubscribers.set(windowId, new Map());
  }
  return windowEventSubscribers.get(windowId)!;
}

function getOrCreateHandlerMap(windowId: number): Map<string, (...args: unknown[]) => void> {
  if (!windowEventHandlers.has(windowId)) {
    windowEventHandlers.set(windowId, new Map());
  }
  return windowEventHandlers.get(windowId)!;
}

export async function subscribeEventHandler(
  rpc: RpcServer,
  windowId: number,
  eventName: string,
): Promise<void> {
  const window = BrowserWindow.fromId(windowId);
  if (!window) {
    throw new Error(`Window ${windowId} not found`);
  }

  const subscribers = getOrCreateSubscriberMap(windowId);
  const currentCount = subscribers.get(eventName) || 0;
  subscribers.set(eventName, currentCount + 1);

  if (currentCount === 0) {
    const handlers = getOrCreateHandlerMap(windowId);

    const handler = (...args: unknown[]) => {
      rpc.publish(`window.${windowId}.${eventName}`, { id: windowId, ...args });
    };

    handlers.set(eventName, handler);
    window.on(eventName as any, handler);
  }
}

export async function unsubscribeEventHandler(windowId: number, eventName: string): Promise<void> {
  const window = BrowserWindow.fromId(windowId);
  if (!window) {
    return;
  }

  const subscribers = windowEventSubscribers.get(windowId);
  if (!subscribers) {
    return;
  }

  const currentCount = subscribers.get(eventName) || 0;
  if (currentCount <= 1) {
    subscribers.delete(eventName);

    const handlers = windowEventHandlers.get(windowId);
    if (handlers) {
      const handler = handlers.get(eventName);
      if (handler) {
        window.removeListener(eventName as any, handler);
        handlers.delete(eventName);
      }

      if (handlers.size === 0) {
        windowEventHandlers.delete(windowId);
        windowEventSubscribers.delete(windowId);
      }
    }
  } else {
    subscribers.set(eventName, currentCount - 1);
  }
}

export function cleanupWindowEvents(windowId: number): void {
  windowEventSubscribers.delete(windowId);
  windowEventHandlers.delete(windowId);
}

export function setupWindowCleanup(window: BrowserWindow): void {
  window.on("closed", () => {
    cleanupWindowEvents(window.id);
  });
}
