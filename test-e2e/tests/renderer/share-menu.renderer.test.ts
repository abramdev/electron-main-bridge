/**
 * Share menu module renderer layer tests
 * Tests high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("share-menu module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });

  test("should expose renderer ShareMenu API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererShareMenu = await window.evaluate(() => {
      return typeof (window as any).rendererShareMenu !== "undefined";
    });
    expect(hasRendererShareMenu).toBe(true);
  });

  test("should have all expected ShareMenu methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererShareMenu;
      return {
        popup: typeof api.popup === "function",
        closePopup: typeof api.closePopup === "function",
      };
    });

    expect(methods.popup).toBe(true);
    expect(methods.closePopup).toBe(true);
  });

  test("should call popup using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererShareMenu;
      await api.popup({
        urls: ["https://example.com"],
      });
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "shareMenu.popup",
        params: [
          {
            urls: ["https://example.com"],
          },
        ],
      },
    ]);
  });

  test("should call popup with options using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererShareMenu;
      await api.popup(
        {
          texts: ["Hello, world!"],
        },
        { x: 100, y: 100 },
      );
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "shareMenu.popup",
        params: [
          {
            texts: ["Hello, world!"],
          },
          { x: 100, y: 100 },
        ],
      },
    ]);
  });

  test("should call closePopup using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererShareMenu;
      await api.closePopup(123);
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "shareMenu.closePopup",
        params: [123],
      },
    ]);
  });
});
