/**
 * Global type declarations for electron-main-bridge renderer process
 *
 * The RPC client is exposed via preload script at window.rpc
 * This file centralizes the Window.rpc interface declaration to avoid duplication
 */

declare global {
  interface Window {
    rpc: {
      call: (method: string, ...params: unknown[]) => Promise<unknown>;
      notify: (method: string, ...params: unknown[]) => void;
      on: (event: string, callback: (...args: unknown[]) => void) => () => void;
      once: (event: string, callback: (...args: unknown[]) => void) => void;
      off: (event: string, callback?: (...args: unknown[]) => void) => void;
    };
  }
}

export {};
