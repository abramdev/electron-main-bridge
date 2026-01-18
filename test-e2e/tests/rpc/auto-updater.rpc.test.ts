/**
 * Auto updater module RPC layer tests
 * Tests low-level RPC API (window.rpc.call) directly
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("auto-updater module - RPC layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });

  test("should call autoUpdater.checkForUpdates via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("autoUpdater.checkForUpdates");
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

  test("should call autoUpdater.quitAndInstall via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("autoUpdater.quitAndInstall");
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

  test("should call autoUpdater.setFeedURL via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("autoUpdater.setFeedURL", {
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

  test("should call autoUpdater.getFeedURL via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("autoUpdater.getFeedURL");
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
