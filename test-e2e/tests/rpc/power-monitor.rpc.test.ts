/**
 * Power monitor module RPC layer tests
 * Tests low-level RPC API (window.rpc.call) directly
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("power-monitor module - RPC layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });

  test("should call powerMonitor.getSystemIdleState via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("powerMonitor.getSystemIdleState", 60);
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

  test("should call powerMonitor.getSystemIdleTime via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("powerMonitor.getSystemIdleTime");
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

  test("should call powerMonitor.getCurrentThermalState via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("powerMonitor.getCurrentThermalState");
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

  test("should call powerMonitor.isOnBatteryPower via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("powerMonitor.isOnBatteryPower");
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
