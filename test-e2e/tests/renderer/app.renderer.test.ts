/**
 * App module renderer layer tests
 * Tests the high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("app module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });
  test("should expose renderer App API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererApp = await window.evaluate(() => {
      return typeof (window as any).rendererApp !== "undefined";
    });
    expect(hasRendererApp).toBe(true);
  });

  test("should have all expected App methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererApp;
      return {
        getName: typeof api.getName === "function",
        getVersion: typeof api.getVersion === "function",
        getAppPath: typeof api.getAppPath === "function",
        getLocale: typeof api.getLocale === "function",
        getPath: typeof api.getPath === "function",
        setBadgeCount: typeof api.setBadgeCount === "function",
        getBadgeCount: typeof api.getBadgeCount === "function",
        on: typeof api.on === "function",
        once: typeof api.once === "function",
        off: typeof api.off === "function",
      };
    });

    expect(methods.getName).toBe(true);
    expect(methods.getVersion).toBe(true);
    expect(methods.getAppPath).toBe(true);
    expect(methods.getLocale).toBe(true);
    expect(methods.getPath).toBe(true);
    expect(methods.setBadgeCount).toBe(true);
    expect(methods.getBadgeCount).toBe(true);
    expect(methods.on).toBe(true);
    expect(methods.once).toBe(true);
    expect(methods.off).toBe(true);
  });

  test("should call app.getName using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererApp;
      await api.getName();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "app.getName",
        params: [],
      },
    ]);
  });

  test("should call app.getVersion using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererApp;
      await api.getVersion();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "app.getVersion",
        params: [],
      },
    ]);
  });

  test("should call app.getPath with parameter using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererApp;
      await api.getPath("home");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "app.getPath",
        params: ["home"],
      },
    ]);
  });

  test("should call app.setBadgeCount with parameter using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererApp;
      await api.setBadgeCount(42);
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "app.setBadgeCount",
        params: [42],
      },
    ]);
  });

  test("should call app.getBadgeCount using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererApp;
      await api.getBadgeCount();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "app.getBadgeCount",
        params: [],
      },
    ]);
  });

  test("should subscribe to app events using on", async () => {
    const window = electronApp.windows()[0];
    const result = await window.evaluate(async () => {
      const api = (window as any).rendererApp;
      const unsubscribe = api.on("window-all-closed", () => {
        // Handler
      });
      return typeof unsubscribe === "function";
    });

    expect(result).toBe(true);
  });

  test("should subscribe once to app events using once", async () => {
    const window = electronApp.windows()[0];
    const result = await window.evaluate(async () => {
      const api = (window as any).rendererApp;
      api.once("window-all-closed", () => {
        // Handler
      });
      return true;
    });

    expect(result).toBe(true);
  });

  test("should unsubscribe from app events using off", async () => {
    const window = electronApp.windows()[0];
    const result = await window.evaluate(async () => {
      const api = (window as any).rendererApp;
      api.off("window-all-closed");
      return true;
    });

    expect(result).toBe(true);
  });
});
