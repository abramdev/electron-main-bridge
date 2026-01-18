/**
 * Session module renderer layer tests
 * Tests the high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("session module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });
  test("should expose renderer Session API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererSession = await window.evaluate(() => {
      return typeof (window as any).rendererSession !== "undefined";
    });
    expect(hasRendererSession).toBe(true);
  });

  test("should have all expected Session methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererSession;
      return {
        getCacheSize: typeof api.getCacheSize === "function",
        clearCache: typeof api.clearCache === "function",
        getSessionHash: typeof api.getSessionHash === "function",
        getStoragePath: typeof api.getStoragePath === "function",
        isPersistent: typeof api.isPersistent === "function",
        getUserAgent: typeof api.getUserAgent === "function",
        setUserAgent: typeof api.setUserAgent === "function",
        setDownloadPath: typeof api.setDownloadPath === "function",
        onWillDownload: typeof api.onWillDownload === "function",
        onDownloadProgress: typeof api.onDownloadProgress === "function",
        onDownloadDone: typeof api.onDownloadDone === "function",
      };
    });

    expect(methods.getCacheSize).toBe(true);
    expect(methods.clearCache).toBe(true);
    expect(methods.getSessionHash).toBe(true);
    expect(methods.getStoragePath).toBe(true);
    expect(methods.isPersistent).toBe(true);
    expect(methods.getUserAgent).toBe(true);
    expect(methods.setUserAgent).toBe(true);
    expect(methods.setDownloadPath).toBe(true);
    expect(methods.onWillDownload).toBe(true);
    expect(methods.onDownloadProgress).toBe(true);
    expect(methods.onDownloadDone).toBe(true);
  });

  test("should call getCacheSize using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSession;
      await api.getCacheSize();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "session.getCacheSize",
        params: [],
      },
    ]);
  });

  test("should call getSessionHash using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSession;
      await api.getSessionHash();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "session.getSessionHash",
        params: [],
      },
    ]);
  });

  test("should call getUserAgent using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSession;
      await api.getUserAgent();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "session.getUserAgent",
        params: [],
      },
    ]);
  });

  test("should call setUserAgent using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSession;
      await api.setUserAgent({ userAgent: "Test Agent" });
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "session.setUserAgent",
        params: [{ userAgent: "Test Agent" }],
      },
    ]);
  });

  test("should call clearCache using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSession;
      await api.clearCache();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "session.clearCache",
        params: [],
      },
    ]);
  });

  test("should subscribe to download events using onWillDownload", async () => {
    const window = electronApp.windows()[0];
    const result = await window.evaluate(async () => {
      const api = (window as any).rendererSession;
      const unsubscribe = api.onWillDownload(() => {
        // Handler
      });
      return typeof unsubscribe === "function";
    });

    expect(result).toBe(true);
  });
});
