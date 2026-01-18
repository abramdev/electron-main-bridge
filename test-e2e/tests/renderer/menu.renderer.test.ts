/**
 * Menu module renderer layer tests
 * Tests the high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("menu module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });
  test("should expose renderer Menu API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererMenu = await window.evaluate(() => {
      return typeof (window as any).rendererMenu !== "undefined";
    });
    expect(hasRendererMenu).toBe(true);
  });

  test("should have all expected Menu methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererMenu;
      return {
        getItems: typeof api.getItems === "function",
        getMenuItemById: typeof api.getMenuItemById === "function",
        append: typeof api.append === "function",
        insert: typeof api.insert === "function",
        on: typeof api.on === "function",
        once: typeof api.once === "function",
        off: typeof api.off === "function",
      };
    });

    expect(methods.getItems).toBe(true);
    expect(methods.getMenuItemById).toBe(true);
    expect(methods.append).toBe(true);
    expect(methods.insert).toBe(true);
    expect(methods.on).toBe(true);
    expect(methods.once).toBe(true);
    expect(methods.off).toBe(true);
  });

  test("should call getItems using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererMenu;
      await api.getItems();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "menu.getItems",
        params: [],
      },
    ]);
  });

  test("should call getMenuItemById using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererMenu;
      await api.getMenuItemById("test-id");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "menu.getMenuItemById",
        params: ["test-id"],
      },
    ]);
  });

  test("should call buildFromTemplate using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererMenu;
      await api.buildFromTemplate([{ label: "Item 1" }]);
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "menu.buildFromTemplate",
        params: [[{ label: "Item 1" }]],
      },
    ]);
  });

  test("should subscribe to menu events using on", async () => {
    const window = electronApp.windows()[0];
    const result = await window.evaluate(async () => {
      const api = (window as any).rendererMenu;
      const unsubscribe = api.on("menu-will-show", () => {
        // Handler
      });
      return typeof unsubscribe === "function";
    });

    expect(result).toBe(true);
  });

  test("should subscribe once to menu events using once", async () => {
    const window = electronApp.windows()[0];
    const result = await window.evaluate(async () => {
      const api = (window as any).rendererMenu;
      api.once("menu-will-close", () => {
        // Handler
      });
      return true;
    });

    expect(result).toBe(true);
  });

  test("should unsubscribe from menu events using off", async () => {
    const window = electronApp.windows()[0];
    const result = await window.evaluate(async () => {
      const api = (window as any).rendererMenu;
      api.off("menu-will-show");
      return true;
    });

    expect(result).toBe(true);
  });
});
