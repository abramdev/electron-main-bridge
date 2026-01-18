/**
 * Menu module RPC layer tests
 * Tests the low-level RPC API (window.rpc.call) directly
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("menu module - RPC layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });
  test("should call menu.getItems via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("menu.getItems");
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

  test("should call menu.getMenuItemById via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("menu.getMenuItemById", "test-id");
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

  test("should call menu.buildFromTemplate via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("menu.buildFromTemplate", [{ label: "Item 1" }]);
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

  test("should call menu.append via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("menu.append", { label: "Test Item" });
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "menu.append",
        params: [{ label: "Test Item" }],
      },
    ]);
  });

  test("should call menu.insert via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("menu.insert", 0, { label: "Test Item" });
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "menu.insert",
        params: [0, { label: "Test Item" }],
      },
    ]);
  });
});
