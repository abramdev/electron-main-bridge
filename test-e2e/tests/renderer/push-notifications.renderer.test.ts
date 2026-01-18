/**
 * Push notifications module renderer layer tests
 * Tests high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("push-notifications module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });

  test("should expose renderer PushNotifications API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererPushNotifications = await window.evaluate(() => {
      return typeof (window as any).rendererPushNotifications !== "undefined";
    });
    expect(hasRendererPushNotifications).toBe(true);
  });

  test("should have all expected PushNotifications methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererPushNotifications;
      return {
        registerForAPNSNotifications: typeof api.registerForAPNSNotifications === "function",
        unregisterForAPNSNotifications: typeof api.unregisterForAPNSNotifications === "function",
        on: typeof api.on === "function",
        once: typeof api.once === "function",
        off: typeof api.off === "function",
      };
    });

    expect(methods.registerForAPNSNotifications).toBe(true);
    expect(methods.unregisterForAPNSNotifications).toBe(true);
    expect(methods.on).toBe(true);
    expect(methods.once).toBe(true);
    expect(methods.off).toBe(true);
  });

  test("should call registerForAPNSNotifications using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPushNotifications;
      await api.registerForAPNSNotifications();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "pushNotifications.registerForAPNSNotifications",
        params: [],
      },
    ]);
  });

  test("should call unregisterForAPNSNotifications using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPushNotifications;
      await api.unregisterForAPNSNotifications();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "pushNotifications.unregisterForAPNSNotifications",
        params: [],
      },
    ]);
  });
});
