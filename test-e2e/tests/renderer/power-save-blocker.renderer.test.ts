/**
 * Power save blocker module renderer layer tests
 * Tests the high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("power-save-blocker module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });

  test("should expose renderer PowerSaveBlocker API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererPowerSaveBlocker = await window.evaluate(() => {
      return typeof (window as any).rendererPowerSaveBlocker !== "undefined";
    });
    expect(hasRendererPowerSaveBlocker).toBe(true);
  });

  test("should have all expected PowerSaveBlocker methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererPowerSaveBlocker;
      return {
        start: typeof api.start === "function",
        stop: typeof api.stop === "function",
        isStarted: typeof api.isStarted === "function",
      };
    });

    expect(methods.start).toBe(true);
    expect(methods.stop).toBe(true);
    expect(methods.isStarted).toBe(true);
  });

  test("should call start using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPowerSaveBlocker;
      await api.start("prevent-app-suspension");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "powerSaveBlocker.start",
        params: ["prevent-app-suspension"],
      },
    ]);
  });

  test("should call stop using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPowerSaveBlocker;
      await api.stop(123);
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "powerSaveBlocker.stop",
        params: [123],
      },
    ]);
  });

  test("should call isStarted using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPowerSaveBlocker;
      await api.isStarted(123);
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "powerSaveBlocker.isStarted",
        params: [123],
      },
    ]);
  });
});
