/**
 * Shared test utilities for E2E tests
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { _electron as electron } from "@playwright/test";
import fs from "node:fs/promises";
import os from "node:os";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use system temp directory with unique subdirectory per test session
export const TMP_DIR = path.join(
  os.tmpdir(),
  `electron-main-bridge-e2e-${crypto.randomBytes(8).toString("hex")}`,
);

export async function getElectronPath(): Promise<string> {
  try {
    const electronModule = await import("electron");
    const electronPath = electronModule.default || electronModule;
    if (electronPath && typeof electronPath === "string") {
      return electronPath;
    }
  } catch {}

  // Try to get from node_modules
  try {
    const electronPath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "..",
      "..",
      "..",
      "node_modules",
      "electron",
      "dist",
      process.platform === "win32" ? "electron.exe" : "Electron.app/Contents/MacOS/Electron",
    );
    // Check if file exists
    await fs.access(electronPath);
    return electronPath;
  } catch {}

  throw new Error(
    "Cannot find Electron executable. Please set ELECTRON_PATH environment variable.",
  );
}

export async function launchTestApp() {
  const executablePath = await getElectronPath();
  const electronApp = electron.launch({
    executablePath,
    args: [path.join(__dirname, "..", "..", "fixtures", "test-app.cjs")],
  });

  // Wait for renderer modules to be loaded
  const app = await electronApp;
  const window = app.windows()[0];

  // Wait for the signal that renderer modules are ready
  await window.evaluate(() => {
    return new Promise<void>((resolve) => {
      if ((window as any).rendererModulesReady) {
        resolve();
      } else {
        const checkInterval = setInterval(() => {
          if ((window as any).rendererModulesReady) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 50);
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve(); // Continue anyway to avoid hanging
        }, 5000);
      }
    });
  });

  return app;
}

export async function loadRendererApi(window: any, moduleName: string) {
  const apiPath = path.join(__dirname, "..", "..", "..", "dist", "renderer", `${moduleName}.mjs`);
  const apiCode = await fs.readFile(apiPath, "utf-8");

  // Execute the ESM code in the window context
  // The renderer modules export functions that call window.rpc
  await window.evaluate((code: string) => {
    // Wrap in an async IIFE to handle top-level awaits
    const wrappedCode = `(async () => { ${code} })();`;
    new Function(wrappedCode)();
  }, apiCode);
}

export async function setupTempDir() {
  await fs.mkdir(TMP_DIR, { recursive: true });
}

export async function cleanupTempDir() {
  await fs.rm(TMP_DIR, { recursive: true, force: true }).catch(() => {
    // Ignore cleanup errors
  });
}
