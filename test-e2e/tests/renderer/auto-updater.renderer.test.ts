/**
 * Auto updater module renderer layer tests
 * Tests high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("auto-updater module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });

  test("should expose renderer AutoUpdater API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererAutoUpdater = await window.evaluate(() => {
      return typeof (window as any).rendererAutoUpdater !== "undefined";
    });
    expect(hasRendererAutoUpdater).toBe(true);
  });

  test("should have all expected AutoUpdater methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererAutoUpdater;
      return {
        checkForUpdates: typeof api.checkForUpdates === "function",
        quitAndInstall: typeof api.quitAndInstall === "function",
        setFeedURL: typeof api.setFeedURL === "function",
        getFeedURL: typeof api.getFeedURL === "function",
        on: typeof api.on === "function",
        once: typeof api.once === "function",
        off: typeof api.off === "function",
      };
    });

    expect(methods.checkForUpdates).toBe(true);
    expect(methods.quitAndInstall).toBe(true);
    expect(methods.setFeedURL).toBe(true);
    expect(methods.getFeedURL).toBe(true);
    expect(methods.on).toBe(true);
    expect(methods.once).toBe(true);
    expect(methods.off).toBe(true);
  });

  test("should call checkForUpdates using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererAutoUpdater;
      await api.checkForUpdates();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "autoUpdater.checkForUpdates",
        params: [],
      },
    ]);
  });

  test("should call quitAndInstall using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererAutoUpdater;
      await api.quitAndInstall();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "autoUpdater.quitAndInstall",
        params: [],
      },
    ]);
  });

  test("should call setFeedURL using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererAutoUpdater;
      await api.setFeedURL({
        url: "https://example.com/updates",
      });
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "autoUpdater.setFeedURL",
        params: [
          {
            url: "https://example.com/updates",
          },
        ],
      },
    ]);
  });

  test("should call getFeedURL using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererAutoUpdater;
      await api.getFeedURL();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "autoUpdater.getFeedURL",
        params: [],
      },
    ]);
  });
});
