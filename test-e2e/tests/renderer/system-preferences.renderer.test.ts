/**
 * System preferences module renderer layer tests
 * Tests high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("system-preferences module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });

  test("should expose renderer SystemPreferences API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererSystemPreferences = await window.evaluate(() => {
      return typeof (window as any).rendererSystemPreferences !== "undefined";
    });
    expect(hasRendererSystemPreferences).toBe(true);
  });

  test("should have all expected SystemPreferences methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererSystemPreferences;
      return {
        isSwipeTrackingFromScrollEventsEnabled:
          typeof api.isSwipeTrackingFromScrollEventsEnabled === "function",
        postNotification: typeof api.postNotification === "function",
        postLocalNotification: typeof api.postLocalNotification === "function",
        postWorkspaceNotification: typeof api.postWorkspaceNotification === "function",
        subscribeNotification: typeof api.subscribeNotification === "function",
        subscribeLocalNotification: typeof api.subscribeLocalNotification === "function",
        subscribeWorkspaceNotification: typeof api.subscribeWorkspaceNotification === "function",
        unsubscribeNotification: typeof api.unsubscribeNotification === "function",
        unsubscribeLocalNotification: typeof api.unsubscribeLocalNotification === "function",
        unsubscribeWorkspaceNotification:
          typeof api.unsubscribeWorkspaceNotification === "function",
        registerDefaults: typeof api.registerDefaults === "function",
        getUserDefault: typeof api.getUserDefault === "function",
        setUserDefault: typeof api.setUserDefault === "function",
        removeUserDefault: typeof api.removeUserDefault === "function",
        getAccentColor: typeof api.getAccentColor === "function",
        getColor: typeof api.getColor === "function",
        getSystemColor: typeof api.getSystemColor === "function",
        getEffectiveAppearance: typeof api.getEffectiveAppearance === "function",
        canPromptTouchID: typeof api.canPromptTouchID === "function",
        promptTouchID: typeof api.promptTouchID === "function",
        isTrustedAccessibilityClient: typeof api.isTrustedAccessibilityClient === "function",
        getMediaAccessStatus: typeof api.getMediaAccessStatus === "function",
        askForMediaAccess: typeof api.askForMediaAccess === "function",
        getAnimationSettings: typeof api.getAnimationSettings === "function",
        on: typeof api.on === "function",
        once: typeof api.once === "function",
        off: typeof api.off === "function",
      };
    });

    expect(methods.isSwipeTrackingFromScrollEventsEnabled).toBe(true);
    expect(methods.postNotification).toBe(true);
    expect(methods.postLocalNotification).toBe(true);
    expect(methods.postWorkspaceNotification).toBe(true);
    expect(methods.subscribeNotification).toBe(true);
    expect(methods.subscribeLocalNotification).toBe(true);
    expect(methods.subscribeWorkspaceNotification).toBe(true);
    expect(methods.unsubscribeNotification).toBe(true);
    expect(methods.unsubscribeLocalNotification).toBe(true);
    expect(methods.unsubscribeWorkspaceNotification).toBe(true);
    expect(methods.registerDefaults).toBe(true);
    expect(methods.getUserDefault).toBe(true);
    expect(methods.setUserDefault).toBe(true);
    expect(methods.removeUserDefault).toBe(true);
    expect(methods.getAccentColor).toBe(true);
    expect(methods.getColor).toBe(true);
    expect(methods.getSystemColor).toBe(true);
    expect(methods.getEffectiveAppearance).toBe(true);
    expect(methods.canPromptTouchID).toBe(true);
    expect(methods.promptTouchID).toBe(true);
    expect(methods.isTrustedAccessibilityClient).toBe(true);
    expect(methods.getMediaAccessStatus).toBe(true);
    expect(methods.askForMediaAccess).toBe(true);
    expect(methods.getAnimationSettings).toBe(true);
    expect(methods.on).toBe(true);
    expect(methods.once).toBe(true);
    expect(methods.off).toBe(true);
  });

  test("should call isSwipeTrackingFromScrollEventsEnabled using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.isSwipeTrackingFromScrollEventsEnabled();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.isSwipeTrackingFromScrollEventsEnabled",
        params: [],
      },
    ]);
  });

  test("should call postNotification using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.postNotification("test-event", { key: "value" }, true);
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.postNotification",
        params: ["test-event", { key: "value" }, true],
      },
    ]);
  });

  test("should call postLocalNotification using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.postLocalNotification("test-event", { key: "value" });
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.postLocalNotification",
        params: ["test-event", { key: "value" }],
      },
    ]);
  });

  test("should call postWorkspaceNotification using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.postWorkspaceNotification("test-event", { key: "value" });
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.postWorkspaceNotification",
        params: ["test-event", { key: "value" }],
      },
    ]);
  });

  test("should call subscribeNotification using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.subscribeNotification("test-event");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.subscribeNotification",
        params: ["test-event"],
      },
    ]);
  });

  test("should call unsubscribeNotification using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.unsubscribeNotification(123);
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.unsubscribeNotification",
        params: [123],
      },
    ]);
  });

  test("should call registerDefaults using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.registerDefaults({ key: "value", enabled: true });
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.registerDefaults",
        params: [{ key: "value", enabled: true }],
      },
    ]);
  });

  test("should call getUserDefault using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.getUserDefault("test-key", "string");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.getUserDefault",
        params: ["test-key", "string"],
      },
    ]);
  });

  test("should call setUserDefault using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.setUserDefault("test-key", "string", "test-value");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.setUserDefault",
        params: ["test-key", "string", "test-value"],
      },
    ]);
  });

  test("should call removeUserDefault using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.removeUserDefault("test-key");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.removeUserDefault",
        params: ["test-key"],
      },
    ]);
  });

  test("should call getAccentColor using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.getAccentColor();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.getAccentColor",
        params: [],
      },
    ]);
  });

  test("should call getColor using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.getColor("window");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.getColor",
        params: ["window"],
      },
    ]);
  });

  test("should call getSystemColor using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.getSystemColor("blue");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.getSystemColor",
        params: ["blue"],
      },
    ]);
  });

  test("should call getEffectiveAppearance using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.getEffectiveAppearance();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.getEffectiveAppearance",
        params: [],
      },
    ]);
  });

  test("should call canPromptTouchID using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.canPromptTouchID();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.canPromptTouchID",
        params: [],
      },
    ]);
  });

  test("should call promptTouchID using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.promptTouchID("Please authenticate");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.promptTouchID",
        params: ["Please authenticate"],
      },
    ]);
  });

  test("should call isTrustedAccessibilityClient using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.isTrustedAccessibilityClient(true);
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.isTrustedAccessibilityClient",
        params: [true],
      },
    ]);
  });

  test("should call getMediaAccessStatus using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.getMediaAccessStatus("microphone");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.getMediaAccessStatus",
        params: ["microphone"],
      },
    ]);
  });

  test("should call askForMediaAccess using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.askForMediaAccess("camera");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.askForMediaAccess",
        params: ["camera"],
      },
    ]);
  });

  test("should call getAnimationSettings using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererSystemPreferences;
      await api.getAnimationSettings();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "systemPreferences.getAnimationSettings",
        params: [],
      },
    ]);
  });
});
