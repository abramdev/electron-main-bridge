/**
 * Screen module renderer layer tests
 * Tests the high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("screen module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });
  test("should expose renderer Screen API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererScreen = await window.evaluate(() => {
      return typeof (window as any).rendererScreen !== "undefined";
    });
    expect(hasRendererScreen).toBe(true);
  });

  test("should have all expected Screen methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererScreen;
      return {
        getCursorScreenPoint: typeof api.getCursorScreenPoint === "function",
        getPrimaryDisplay: typeof api.getPrimaryDisplay === "function",
        getAllDisplays: typeof api.getAllDisplays === "function",
        getDisplayNearestPoint: typeof api.getDisplayNearestPoint === "function",
        screenToDipPoint: typeof api.screenToDipPoint === "function",
        dipToScreenPoint: typeof api.dipToScreenPoint === "function",
        on: typeof api.on === "function",
        once: typeof api.once === "function",
        off: typeof api.off === "function",
      };
    });

    expect(methods.getCursorScreenPoint).toBe(true);
    expect(methods.getPrimaryDisplay).toBe(true);
    expect(methods.getAllDisplays).toBe(true);
    expect(methods.getDisplayNearestPoint).toBe(true);
    expect(methods.screenToDipPoint).toBe(true);
    expect(methods.dipToScreenPoint).toBe(true);
    expect(methods.on).toBe(true);
    expect(methods.once).toBe(true);
    expect(methods.off).toBe(true);
  });

  test("should call getCursorScreenPoint using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererScreen;
      await api.getCursorScreenPoint();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "screen.getCursorScreenPoint",
        params: [],
      },
    ]);
  });

  test("should call getPrimaryDisplay using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererScreen;
      await api.getPrimaryDisplay();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "screen.getPrimaryDisplay",
        params: [],
      },
    ]);
  });

  test("should call getAllDisplays using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererScreen;
      await api.getAllDisplays();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "screen.getAllDisplays",
        params: [],
      },
    ]);
  });

  test("should call getDisplayNearestPoint with parameter using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererScreen;
      await api.getDisplayNearestPoint({ x: 0, y: 0 });
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "screen.getDisplayNearestPoint",
        params: [{ x: 0, y: 0 }],
      },
    ]);
  });

  test("should subscribe to screen events using on", async () => {
    const window = electronApp.windows()[0];
    const result = await window.evaluate(async () => {
      const api = (window as any).rendererScreen;
      const unsubscribe = api.on("display-added", () => {
        // Handler
      });
      return typeof unsubscribe === "function";
    });

    expect(result).toBe(true);
  });

  test("should subscribe once to screen events using once", async () => {
    const window = electronApp.windows()[0];
    const result = await window.evaluate(async () => {
      const api = (window as any).rendererScreen;
      api.once("display-removed", () => {
        // Handler
      });
      return true;
    });

    expect(result).toBe(true);
  });

  test("should unsubscribe from screen events using off", async () => {
    const window = electronApp.windows()[0];
    const result = await window.evaluate(async () => {
      const api = (window as any).rendererScreen;
      api.off("display-metrics-changed");
      return true;
    });

    expect(result).toBe(true);
  });
});
