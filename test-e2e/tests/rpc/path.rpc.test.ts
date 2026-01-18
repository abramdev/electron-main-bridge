/**
 * Path module RPC layer tests
 * Tests the low-level RPC API (window.rpc.call) directly
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行主进程接口
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("path module - RPC layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });
  test("should call path.parse with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testPath = "/home/user/docs/file.txt";

    await window.evaluate(async (path) => {
      const rpc = (window as any).rpc;
      await rpc.call("path.parse", path);
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

  test("should call path.format with correct parameters via RPC", async () => {
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
      const rpc = (window as any).rpc;
      await rpc.call("path.format", obj);
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

  test("should call path.join with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("path.join", "/home", "user", "docs");
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

  test("should call path.resolve with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("path.resolve", "src", "..", "dist");
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

  test("should call path.normalize with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testPath = "/home/user/../user/./docs/";

    await window.evaluate(async (path) => {
      const rpc = (window as any).rpc;
      await rpc.call("path.normalize", path);
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

  test("should call path.dirname with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testPath = "/home/user/docs/file.txt";

    await window.evaluate(async (path) => {
      const rpc = (window as any).rpc;
      await rpc.call("path.dirname", path);
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

  test("should call path.basename with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testPath = "/home/user/docs/file.txt";

    await window.evaluate(async (path) => {
      const rpc = (window as any).rpc;
      await rpc.call("path.basename", path);
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

  test("should call path.basename with extension parameter via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testPath = "/home/user/docs/file.txt";

    await window.evaluate(async (path) => {
      const rpc = (window as any).rpc;
      await rpc.call("path.basename", path, ".txt");
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

  test("should call path.extname with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testPath = "/home/user/docs/file.txt";

    await window.evaluate(async (path) => {
      const rpc = (window as any).rpc;
      await rpc.call("path.extname", path);
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

  test("should call path.relative with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("path.relative", "/data/orandea/test/aaa", "/data/orandea/impl/bbb");
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

  test("should call path.isAbsolute with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("path.isAbsolute", "/home/user/docs");
      await rpc.call("path.isAbsolute", "user/docs");
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

  test("should call path.sep via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("path.sep");
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

  test("should call path.delimiter via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("path.delimiter");
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

  test("should call path.cwd via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("path.cwd");
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

  test.describe("win32 namespace", () => {
    test("should call path.win32.join with correct parameters via RPC", async () => {
      const window = electronApp.windows()[0];

      await window.evaluate(async () => {
        const rpc = (window as any).rpc;
        await rpc.call("test.clearSpyLog");
      });

      await window.evaluate(async () => {
        const rpc = (window as any).rpc;
        await rpc.call("path.win32.join", "C:", "Users", "Documents");
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

    test("should call path.win32.isAbsolute with correct parameters via RPC", async () => {
      const window = electronApp.windows()[0];

      await window.evaluate(async () => {
        const rpc = (window as any).rpc;
        await rpc.call("test.clearSpyLog");
      });

      await window.evaluate(async () => {
        const rpc = (window as any).rpc;
        await rpc.call("path.win32.isAbsolute", "C:\\Users\\Documents");
      });

      const spyLog = await window.evaluate(async () => {
        const rpc = (window as any).rpc;
        return await rpc.call("test.getSpyLog");
      });

      expect(spyLog).toEqual([
        {
          method: "path.win32.isAbsolute",
          params: ["C:\\Users\\Documents"],
        },
      ]);
    });
  });

  test.describe("posix namespace", () => {
    test("should call path.posix.join with correct parameters via RPC", async () => {
      const window = electronApp.windows()[0];

      await window.evaluate(async () => {
        const rpc = (window as any).rpc;
        await rpc.call("test.clearSpyLog");
      });

      await window.evaluate(async () => {
        const rpc = (window as any).rpc;
        await rpc.call("path.posix.join", "/home", "user", "docs");
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

    test("should call path.posix.isAbsolute with correct parameters via RPC", async () => {
      const window = electronApp.windows()[0];

      await window.evaluate(async () => {
        const rpc = (window as any).rpc;
        await rpc.call("test.clearSpyLog");
      });

      await window.evaluate(async () => {
        const rpc = (window as any).rpc;
        await rpc.call("path.posix.isAbsolute", "/home/user/docs");
      });

      const spyLog = await window.evaluate(async () => {
        const rpc = (window as any).rpc;
        return await rpc.call("test.getSpyLog");
      });

      expect(spyLog).toEqual([
        {
          method: "path.posix.isAbsolute",
          params: ["/home/user/docs"],
        },
      ]);
    });
  });
});
