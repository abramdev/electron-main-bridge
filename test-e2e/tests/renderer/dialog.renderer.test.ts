/**
 * Dialog module renderer layer tests
 * Tests the high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("dialog module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });
  test("should expose renderer Dialog API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererDialog = await window.evaluate(() => {
      return typeof (window as any).rendererDialog !== "undefined";
    });
    expect(hasRendererDialog).toBe(true);
  });

  test("should have all expected Dialog methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererDialog;
      return {
        showOpenDialog: typeof api.showOpenDialog === "function",
        showSaveDialog: typeof api.showSaveDialog === "function",
        showMessageBox: typeof api.showMessageBox === "function",
        showErrorBox: typeof api.showErrorBox === "function",
      };
    });

    expect(methods.showOpenDialog).toBe(true);
    expect(methods.showSaveDialog).toBe(true);
    expect(methods.showMessageBox).toBe(true);
    expect(methods.showErrorBox).toBe(true);
  });

  test("should call showOpenDialog using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererDialog;
      await api.showOpenDialog({ properties: ["openFile"] });
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "dialog.showOpenDialog",
        params: [{ properties: ["openFile"] }],
      },
    ]);
  });

  test("should call showSaveDialog using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererDialog;
      await api.showSaveDialog({ defaultPath: "test.txt" });
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "dialog.showSaveDialog",
        params: [{ defaultPath: "test.txt" }],
      },
    ]);
  });

  test("should call showMessageBox using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererDialog;
      await api.showMessageBox({
        type: "info",
        title: "Test",
        message: "Test message",
      });
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "dialog.showMessageBox",
        params: [{ type: "info", title: "Test", message: "Test message" }],
      },
    ]);
  });
});
