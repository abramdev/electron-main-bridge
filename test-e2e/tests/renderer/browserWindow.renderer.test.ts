/**
 * BrowserWindow module renderer layer tests
 * Tests the high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("browserWindow module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });
  test("should expose renderer BrowserWindow API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererBrowserWindow = await window.evaluate(() => {
      return typeof (window as any).rendererBrowserWindow !== "undefined";
    });
    expect(hasRendererBrowserWindow).toBe(true);
  });

  test("should have all expected BrowserWindow methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererBrowserWindow;
      return {
        create: typeof api.create === "function",
        close: typeof api.close === "function",
        destroy: typeof api.destroy === "function",
        show: typeof api.show === "function",
        hide: typeof api.hide === "function",
        minimize: typeof api.minimize === "function",
        maximize: typeof api.maximize === "function",
        getTitle: typeof api.getTitle === "function",
        setTitle: typeof api.setTitle === "function",
        getBounds: typeof api.getBounds === "function",
        setBounds: typeof api.setBounds === "function",
        isMaximized: typeof api.isMaximized === "function",
        isMinimized: typeof api.isMinimized === "function",
        isVisible: typeof api.isVisible === "function",
        executeJavaScript: typeof api.executeJavaScript === "function",
        on: typeof api.on === "function",
        once: typeof api.once === "function",
        off: typeof api.off === "function",
      };
    });

    expect(methods.create).toBe(true);
    expect(methods.close).toBe(true);
    expect(methods.destroy).toBe(true);
    expect(methods.show).toBe(true);
    expect(methods.hide).toBe(true);
    expect(methods.minimize).toBe(true);
    expect(methods.maximize).toBe(true);
    expect(methods.getTitle).toBe(true);
    expect(methods.setTitle).toBe(true);
    expect(methods.getBounds).toBe(true);
    expect(methods.setBounds).toBe(true);
    expect(methods.isMaximized).toBe(true);
    expect(methods.isMinimized).toBe(true);
    expect(methods.isVisible).toBe(true);
    expect(methods.executeJavaScript).toBe(true);
    expect(methods.on).toBe(true);
    expect(methods.once).toBe(true);
    expect(methods.off).toBe(true);
  });

  test("should call getAllWindows using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererBrowserWindow;
      await api.getAllWindows();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "browserWindow.getAllWindows",
        params: [],
      },
    ]);
  });

  test("should call getFocusedWindow using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererBrowserWindow;
      await api.getFocusedWindow();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "browserWindow.getFocusedWindow",
        params: [],
      },
    ]);
  });

  test("should call create using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererBrowserWindow;
      await api.create({ width: 400, height: 300 });
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "browserWindow.create",
        params: [{ width: 400, height: 300 }],
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
      const api = (window as any).rendererBrowserWindow;
      await api.getTitle(1);
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "browserWindow.getTitle",
        params: [1],
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
      const api = (window as any).rendererBrowserWindow;
      await api.setTitle(1, "Test Title");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "browserWindow.setTitle",
        params: [1, "Test Title"],
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
      const api = (window as any).rendererBrowserWindow;
      await api.getBounds(1);
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "browserWindow.getBounds",
        params: [1],
      },
    ]);
  });

  test("should call executeJavaScript using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererBrowserWindow;
      await api.executeJavaScript(1, "1 + 1");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "browserWindow.executeJavaScript",
        params: [1, "1 + 1"],
      },
    ]);
  });

  test("should subscribe to window events using on", async () => {
    const window = electronApp.windows()[0];
    const result = await window.evaluate(async () => {
      const api = (window as any).rendererBrowserWindow;
      const unsubscribe = api.on(1, "ready-to-show", () => {
        // Handler
      });
      return typeof unsubscribe === "function";
    });

    expect(result).toBe(true);
  });

  test("should subscribe once to window events using once", async () => {
    const window = electronApp.windows()[0];
    const result = await window.evaluate(async () => {
      const api = (window as any).rendererBrowserWindow;
      api.once(1, "blur", () => {
        // Handler
      });
      return true;
    });

    expect(result).toBe(true);
  });

  test("should unsubscribe from window events using off", async () => {
    const window = electronApp.windows()[0];
    const result = await window.evaluate(async () => {
      const api = (window as any).rendererBrowserWindow;
      api.off(1, "ready-to-show");
      return true;
    });

    expect(result).toBe(true);
  });
});
