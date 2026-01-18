/**
 * Safe storage module renderer layer tests
 * Tests high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("safe-storage module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });

  test("should expose renderer SafeStorage API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererSafeStorage = await window.evaluate(() => {
      return typeof (window as any).rendererSafeStorage !== "undefined";
    });
    expect(hasRendererSafeStorage).toBe(true);
  });

  test("should have all expected SafeStorage methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererSafeStorage;
      return {
        encryptString: typeof api.encryptString === "function",
        decryptString: typeof api.decryptString === "function",
        isEncryptionAvailable: typeof api.isEncryptionAvailable === "function",
        setUsePlainTextEncryption: typeof api.setUsePlainTextEncryption === "function",
        getSelectedStorageBackend: typeof api.getSelectedStorageBackend === "function",
      };
    });

    expect(methods.encryptString).toBe(true);
    expect(methods.decryptString).toBe(true);
    expect(methods.isEncryptionAvailable).toBe(true);
    expect(methods.setUsePlainTextEncryption).toBe(true);
    expect(methods.getSelectedStorageBackend).toBe(true);
  });

  test("should call encryptString using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSafeStorage;
      await api.encryptString("plaintext");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "safeStorage.encryptString",
        params: ["plaintext"],
      },
    ]);
  });

  test("should call decryptString using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSafeStorage;
      await api.decryptString("encrypted-base64");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "safeStorage.decryptString",
        params: ["encrypted-base64"],
      },
    ]);
  });

  test("should call isEncryptionAvailable using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSafeStorage;
      await api.isEncryptionAvailable();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "safeStorage.isEncryptionAvailable",
        params: [],
      },
    ]);
  });

  test("should call setUsePlainTextEncryption using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSafeStorage;
      await api.setUsePlainTextEncryption(true);
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "safeStorage.setUsePlainTextEncryption",
        params: [true],
      },
    ]);
  });

  test("should call getSelectedStorageBackend using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSafeStorage;
      await api.getSelectedStorageBackend();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "safeStorage.getSelectedStorageBackend",
        params: [],
      },
    ]);
  });
});
