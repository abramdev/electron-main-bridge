/**
 * Tray module renderer layer tests
 * Tests the high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("tray module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });
  test("should expose renderer Tray API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererTray = await window.evaluate(() => {
      return typeof (window as any).rendererTray !== "undefined";
    });
    expect(hasRendererTray).toBe(true);
  });

  test("should have all expected Tray methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererTray;
      return {
        destroy: typeof api.destroy === "function",
        setImage: typeof api.setImage === "function",
        setToolTip: typeof api.setToolTip === "function",
        setTitle: typeof api.setTitle === "function",
        getTitle: typeof api.getTitle === "function",
        getBounds: typeof api.getBounds === "function",
        isDestroyed: typeof api.isDestroyed === "function",
        setContextMenu: typeof api.setContextMenu === "function",
      };
    });

    expect(methods.destroy).toBe(true);
    expect(methods.setImage).toBe(true);
    expect(methods.setToolTip).toBe(true);
    expect(methods.setTitle).toBe(true);
    expect(methods.getTitle).toBe(true);
    expect(methods.getBounds).toBe(true);
    expect(methods.isDestroyed).toBe(true);
    expect(methods.setContextMenu).toBe(true);
  });

  test("should call setToolTip using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererTray;
      await api.setToolTip("Test Tooltip");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "tray.setToolTip",
        params: ["Test Tooltip"],
      },
    ]);
  });

  test("should call getTitle using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererTray;
      await api.getTitle();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "tray.getTitle",
        params: [],
      },
    ]);
  });

  test("should call setTitle using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererTray;
      await api.setTitle("Test Title");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "tray.setTitle",
        params: ["Test Title"],
      },
    ]);
  });

  test("should call getBounds using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererTray;
      await api.getBounds();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "tray.getBounds",
        params: [],
      },
    ]);
  });

  test("should call isDestroyed using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererTray;
      await api.isDestroyed();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "tray.isDestroyed",
        params: [],
      },
    ]);
  });

  test("should call setContextMenu using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererTray;
      await api.setContextMenu([{ label: "Item 1" }]);
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "tray.setContextMenu",
        params: [[{ label: "Item 1" }]],
      },
    ]);
  });
});
