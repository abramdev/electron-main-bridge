/**
 * Path module renderer layer tests
 * Tests the high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("path module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });
  test("should expose renderer Path API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererPath = await window.evaluate(() => {
      return typeof (window as any).rendererPath !== "undefined";
    });
    expect(hasRendererPath).toBe(true);
  });

  test("should have all expected Path methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererPath;
      return {
        parse: typeof api.parse === "function",
        format: typeof api.format === "function",
        join: typeof api.join === "function",
        resolve: typeof api.resolve === "function",
        normalize: typeof api.normalize === "function",
        dirname: typeof api.dirname === "function",
        basename: typeof api.basename === "function",
        extname: typeof api.extname === "function",
        relative: typeof api.relative === "function",
        isAbsolute: typeof api.isAbsolute === "function",
        sep: typeof api.sep === "function",
        delimiter: typeof api.delimiter === "function",
        cwd: typeof api.cwd === "function",
      };
    });

    expect(methods.parse).toBe(true);
    expect(methods.format).toBe(true);
    expect(methods.join).toBe(true);
    expect(methods.resolve).toBe(true);
    expect(methods.normalize).toBe(true);
    expect(methods.dirname).toBe(true);
    expect(methods.basename).toBe(true);
    expect(methods.extname).toBe(true);
    expect(methods.relative).toBe(true);
    expect(methods.isAbsolute).toBe(true);
    expect(methods.sep).toBe(true);
    expect(methods.delimiter).toBe(true);
    expect(methods.cwd).toBe(true);
  });

  test("should have win32 and posix namespaces", async () => {
    const window = electronApp.windows()[0];
    const hasNamespaces = await window.evaluate(() => {
      const api = (window as any).rendererPath;
      return typeof api.win32 === "object" && typeof api.posix === "object";
    });

    expect(hasNamespaces).toBe(true);
  });

  test("should call path.parse with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testPath = "/home/user/docs/file.txt";

    await window.evaluate(async (path) => {
      const api = (window as any).rendererPath;
      await api.parse(path);
    }, testPath);

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "path.parse",
        params: [testPath],
      },
    ]);
  });

  test("should call path.format with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const pathObj = {
      root: "/",
      dir: "/home/user/docs",
      base: "file.txt",
      ext: ".txt",
      name: "file",
    };

    await window.evaluate(async (obj) => {
      const api = (window as any).rendererPath;
      await api.format(obj);
    }, pathObj);

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "path.format",
        params: [pathObj],
      },
    ]);
  });

  test("should call path.join with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPath;
      await api.join("/home", "user", "docs");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "path.join",
        params: ["/home", "user", "docs"],
      },
    ]);
  });

  test("should call path.resolve with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPath;
      await api.resolve("src", "..", "dist");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "path.resolve",
        params: ["src", "..", "dist"],
      },
    ]);
  });

  test("should call path.normalize with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testPath = "/home/user/../user/./docs/";

    await window.evaluate(async (path) => {
      const api = (window as any).rendererPath;
      await api.normalize(path);
    }, testPath);

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "path.normalize",
        params: [testPath],
      },
    ]);
  });

  test("should call path.dirname with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testPath = "/home/user/docs/file.txt";

    await window.evaluate(async (path) => {
      const api = (window as any).rendererPath;
      await api.dirname(path);
    }, testPath);

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "path.dirname",
        params: [testPath],
      },
    ]);
  });

  test("should call path.basename with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testPath = "/home/user/docs/file.txt";

    await window.evaluate(async (path) => {
      const api = (window as any).rendererPath;
      await api.basename(path);
    }, testPath);

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "path.basename",
        params: [testPath],
      },
    ]);
  });

  test("should call path.basename with extension parameter using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testPath = "/home/user/docs/file.txt";

    await window.evaluate(async (path) => {
      const api = (window as any).rendererPath;
      await api.basename(path, ".txt");
    }, testPath);

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "path.basename",
        params: [testPath, ".txt"],
      },
    ]);
  });

  test("should call path.extname with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testPath = "/home/user/docs/file.txt";

    await window.evaluate(async (path) => {
      const api = (window as any).rendererPath;
      await api.extname(path);
    }, testPath);

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "path.extname",
        params: [testPath],
      },
    ]);
  });

  test("should call path.relative with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPath;
      await api.relative("/data/orandea/test/aaa", "/data/orandea/impl/bbb");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "path.relative",
        params: ["/data/orandea/test/aaa", "/data/orandea/impl/bbb"],
      },
    ]);
  });

  test("should call path.isAbsolute with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPath;
      await api.isAbsolute("/home/user/docs");
      await api.isAbsolute("user/docs");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "path.isAbsolute",
        params: ["/home/user/docs"],
      },
      {
        method: "path.isAbsolute",
        params: ["user/docs"],
      },
    ]);
  });

  test("should call path.sep using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPath;
      await api.sep();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "path.sep",
        params: [],
      },
    ]);
  });

  test("should call path.delimiter using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPath;
      await api.delimiter();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "path.delimiter",
        params: [],
      },
    ]);
  });

  test("should call path.cwd using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPath;
      await api.cwd();
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "path.cwd",
        params: [],
      },
    ]);
  });

  test("should use win32 namespace methods using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPath;
      await api.win32.join("C:", "Users", "Documents");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "path.win32.join",
        params: ["C:", "Users", "Documents"],
      },
    ]);
  });

  test("should use posix namespace methods using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const api = (window as any).rendererPath;
      await api.posix.join("/home", "user", "docs");
    });

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "path.posix.join",
        params: ["/home", "user", "docs"],
      },
    ]);
  });
});
