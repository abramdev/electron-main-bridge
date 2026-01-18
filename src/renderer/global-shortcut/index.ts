/**
 * Register a single global shortcut
 * @param accelerator - Shortcut like "CommandOrControl+X"
 * @returns Whether registration was successful
 */
export async function register(accelerator: string): Promise<boolean> {
  return (await window.rpc.call("globalShortcut.register", accelerator)) as boolean;
}

/**
 * Register multiple global shortcuts
 * @param accelerators - Array of shortcuts
 * @returns Array of registration results for each shortcut
 */
export async function registerAll(accelerators: string[]): Promise<boolean[]> {
  return (await window.rpc.call("globalShortcut.registerAll", accelerators)) as boolean[];
}

/**
 * Check if a shortcut is registered
 * @param accelerator - Shortcut to check
 * @returns Whether the shortcut is registered
 */
export async function isRegistered(accelerator: string): Promise<boolean> {
  return (await window.rpc.call("globalShortcut.isRegistered", accelerator)) as boolean;
}

/**
 * Unregister a specific shortcut
 * @param accelerator - Shortcut to unregister
 */
export async function unregister(accelerator: string): Promise<void> {
  await window.rpc.call("globalShortcut.unregister", accelerator);
}

/**
 * Unregister all shortcuts
 */
export async function unregisterAll(): Promise<void> {
  await window.rpc.call("globalShortcut.unregisterAll");
}

/**
 * Listen for accelerator events
 * @param callback - Callback function that receives the accelerator
 * @returns Unsubscribe function
 */
export function onAccelerator(callback: (accelerator: string) => void): () => void {
  return window.rpc.on("globalShortcut.accelerator", (args: unknown) => {
    const { accelerator } = args as { accelerator: string };
    callback(accelerator);
  });
}
