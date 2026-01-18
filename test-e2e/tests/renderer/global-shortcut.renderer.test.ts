/**
 * Global shortcut module renderer layer tests
 * Tests high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("global-shortcut module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });

  test("should expose renderer GlobalShortcut API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererGlobalShortcut = await window.evaluate(() => {
      return typeof (window as any).rendererGlobalShortcut !== "undefined";
    });
    expect(hasRendererGlobalShortcut).toBe(true);
  });

  test("should have all expected GlobalShortcut methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererGlobalShortcut;
      return {
        register: typeof api.register === "function",
        registerAll: typeof api.registerAll === "function",
        isRegistered: typeof api.isRegistered === "function",
        unregister: typeof api.unregister === "function",
        unregisterAll: typeof api.unregisterAll === "function",
        onAccelerator: typeof api.onAccelerator === "function",
      };
    });

    expect(methods.register).toBe(true);
    expect(methods.registerAll).toBe(true);
    expect(methods.isRegistered).toBe(true);
    expect(methods.unregister).toBe(true);
    expect(methods.unregisterAll).toBe(true);
    expect(methods.onAccelerator).toBe(true);
  });

  test("should call register using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererGlobalShortcut;
      await api.register("CommandOrControl+Shift+A");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "globalShortcut.register",
        params: ["CommandOrControl+Shift+A"],
      },
    ]);
  });

  test("should call registerAll using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererGlobalShortcut;
      await api.registerAll(["CommandOrControl+Shift+A", "CommandOrControl+Shift+B"]);
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "globalShortcut.registerAll",
        params: [["CommandOrControl+Shift+A", "CommandOrControl+Shift+B"]],
      },
    ]);
  });

  test("should call unregister using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererGlobalShortcut;
      await api.unregister("CommandOrControl+Shift+A");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "globalShortcut.unregister",
        params: ["CommandOrControl+Shift+A"],
      },
    ]);
  });

  test("should call unregisterAll using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererGlobalShortcut;
      await api.unregisterAll();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "globalShortcut.unregisterAll",
        params: [],
      },
    ]);
  });

  test("should call isRegistered using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererGlobalShortcut;
      await api.isRegistered("CommandOrControl+Shift+A");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "globalShortcut.isRegistered",
        params: ["CommandOrControl+Shift+A"],
      },
    ]);
  });
});
