/**
 * Dialog module RPC layer tests
 * Tests the low-level RPC API (window.rpc.call) directly
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("dialog module - RPC layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });
  test("should call dialog.showOpenDialog via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("dialog.showOpenDialog", {
        properties: ["openFile"],
      });
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "dialog.showOpenDialog",
        params: [{ properties: ["openFile"] }],
      },
    ]);
  });

  test("should call dialog.showSaveDialog via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("dialog.showSaveDialog", {
        defaultPath: "test.txt",
      });
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "dialog.showSaveDialog",
        params: [{ defaultPath: "test.txt" }],
      },
    ]);
  });

  test("should call dialog.showMessageBox via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("dialog.showMessageBox", {
        type: "info",
        title: "Test",
        message: "Test message",
      });
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "dialog.showMessageBox",
        params: [{ type: "info", title: "Test", message: "Test message" }],
      },
    ]);
  });

  test("should call dialog.showErrorBox via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("dialog.showErrorBox", "Error Title", "Error Content");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "dialog.showErrorBox",
        params: ["Error Title", "Error Content"],
      },
    ]);
  });
});
