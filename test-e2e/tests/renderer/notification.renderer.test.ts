/**
 * Notification module renderer layer tests
 * Tests the high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("notification module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });
  test("should expose renderer Notification API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererNotification = await window.evaluate(() => {
      return typeof (window as any).rendererNotification !== "undefined";
    });
    expect(hasRendererNotification).toBe(true);
  });

  test("should have all expected Notification methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererNotification;
      return {
        show: typeof api.show === "function",
        close: typeof api.close === "function",
        getTitle: typeof api.getTitle === "function",
        getBody: typeof api.getBody === "function",
        getSilent: typeof api.getSilent === "function",
      };
    });

    expect(methods.show).toBe(true);
    expect(methods.close).toBe(true);
    expect(methods.getTitle).toBe(true);
    expect(methods.getBody).toBe(true);
    expect(methods.getSilent).toBe(true);
  });

  test("should call getTitle using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererNotification;
      await api.getTitle();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "notification.getTitle",
        params: [],
      },
    ]);
  });

  test("should call getBody using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererNotification;
      await api.getBody();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "notification.getBody",
        params: [],
      },
    ]);
  });

  test("should call show using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererNotification;
      await api.show();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "notification.show",
        params: [],
      },
    ]);
  });
});
