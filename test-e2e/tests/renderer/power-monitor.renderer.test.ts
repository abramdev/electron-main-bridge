/**
 * Power monitor module renderer layer tests
 * Tests high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("power-monitor module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });

  test("should expose renderer PowerMonitor API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererPowerMonitor = await window.evaluate(() => {
      return typeof (window as any).rendererPowerMonitor !== "undefined";
    });
    expect(hasRendererPowerMonitor).toBe(true);
  });

  test("should have all expected PowerMonitor methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererPowerMonitor;
      return {
        getSystemIdleState: typeof api.getSystemIdleState === "function",
        getSystemIdleTime: typeof api.getSystemIdleTime === "function",
        getCurrentThermalState: typeof api.getCurrentThermalState === "function",
        isOnBatteryPower: typeof api.isOnBatteryPower === "function",
        on: typeof api.on === "function",
        once: typeof api.once === "function",
        off: typeof api.off === "function",
      };
    });

    expect(methods.getSystemIdleState).toBe(true);
    expect(methods.getSystemIdleTime).toBe(true);
    expect(methods.getCurrentThermalState).toBe(true);
    expect(methods.isOnBatteryPower).toBe(true);
    expect(methods.on).toBe(true);
    expect(methods.once).toBe(true);
    expect(methods.off).toBe(true);
  });

  test("should call getSystemIdleState using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPowerMonitor;
      await api.getSystemIdleState(60);
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "powerMonitor.getSystemIdleState",
        params: [60],
      },
    ]);
  });

  test("should call getSystemIdleTime using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPowerMonitor;
      await api.getSystemIdleTime();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "powerMonitor.getSystemIdleTime",
        params: [],
      },
    ]);
  });

  test("should call getCurrentThermalState using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPowerMonitor;
      await api.getCurrentThermalState();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "powerMonitor.getCurrentThermalState",
        params: [],
      },
    ]);
  });

  test("should call isOnBatteryPower using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPowerMonitor;
      await api.isOnBatteryPower();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "powerMonitor.isOnBatteryPower",
        params: [],
      },
    ]);
  });
});
