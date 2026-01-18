/**
 * Shell module renderer layer tests
 * Tests the high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("shell module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });
  test("should expose renderer Shell API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererShell = await window.evaluate(() => {
      return typeof (window as any).rendererShell !== "undefined";
    });
    expect(hasRendererShell).toBe(true);
  });

  test("should have all expected Shell methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererShell;
      return {
        beep: typeof api.beep === "function",
        openPath: typeof api.openPath === "function",
        showItemInFolder: typeof api.showItemInFolder === "function",
        openExternal: typeof api.openExternal === "function",
        trashItem: typeof api.trashItem === "function",
        writeShortcutLink: typeof api.writeShortcutLink === "function",
        readShortcutLink: typeof api.readShortcutLink === "function",
      };
    });

    expect(methods.beep).toBe(true);
    expect(methods.openPath).toBe(true);
    expect(methods.showItemInFolder).toBe(true);
    expect(methods.openExternal).toBe(true);
    expect(methods.trashItem).toBe(true);
    expect(methods.writeShortcutLink).toBe(true);
    expect(methods.readShortcutLink).toBe(true);
  });

  test("should call beep using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererShell;
      await api.beep();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "shell.beep",
        params: [],
      },
    ]);
  });

  test("should call openPath with parameter using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererShell;
      await api.openPath("/tmp/test.txt");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "shell.openPath",
        params: ["/tmp/test.txt"],
      },
    ]);
  });

  test("should call openExternal with parameter using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererShell;
      await api.openExternal("https://example.com");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "shell.openExternal",
        params: ["https://example.com"],
      },
    ]);
  });

  test("should call trashItem with parameter using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererShell;
      await api.trashItem("/tmp/test.txt");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "shell.trashItem",
        params: ["/tmp/test.txt"],
      },
    ]);
  });
});
