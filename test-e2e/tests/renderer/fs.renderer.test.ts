/**
 * FS module renderer layer tests
 * Tests the high-level renderer API that users actually use
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行文件操作
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("fs module - renderer layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });
  test("should expose renderer Fs API", async () => {
    const window = electronApp.windows()[0];
    const hasRendererFs = await window.evaluate(() => {
      return typeof (window as any).rendererFs !== "undefined";
    });
    expect(hasRendererFs).toBe(true);
  });

  test("should have all expected FS methods", async () => {
    const window = electronApp.windows()[0];
    const methods = await window.evaluate(() => {
      const api = (window as any).rendererFs;
      return {
        readFile: typeof api.readFile === "function",
        writeFile: typeof api.writeFile === "function",
        unlink: typeof api.unlink === "function",
        exists: typeof api.exists === "function",
        stat: typeof api.stat === "function",
        mkdir: typeof api.mkdir === "function",
        rmdir: typeof api.rmdir === "function",
        readdir: typeof api.readdir === "function",
        appendFile: typeof api.appendFile === "function",
        copyFile: typeof api.copyFile === "function",
      };
    });

    expect(methods.readFile).toBe(true);
    expect(methods.writeFile).toBe(true);
    expect(methods.unlink).toBe(true);
    expect(methods.exists).toBe(true);
    expect(methods.stat).toBe(true);
    expect(methods.mkdir).toBe(true);
    expect(methods.rmdir).toBe(true);
    expect(methods.readdir).toBe(true);
    expect(methods.appendFile).toBe(true);
    expect(methods.copyFile).toBe(true);
  });

  test("should call writeFile with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testFilePath = "/tmp/test-write-file.txt";
    const testContent = "Hello from renderer API!";

    await window.evaluate(
      async ({ filePath, content }) => {
        const api = (window as any).rendererFs;
        await api.writeFile(filePath, content);
      },
      { filePath: testFilePath, content: testContent },
    );

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "fs.writeFile",
        params: [testFilePath, testContent],
      },
    ]);
  });

  test("should call readFile with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testFilePath = "/tmp/test-read-file.txt";

    await window.evaluate(async (filePath) => {
      const api = (window as any).rendererFs;
      await api.readFile(filePath, "utf-8");
    }, testFilePath);

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "fs.readFile",
        params: [testFilePath, "utf-8"],
      },
    ]);
  });

  test("should call exists with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testFilePath = "/tmp/test-exists.txt";

    await window.evaluate(async (filePath) => {
      const api = (window as any).rendererFs;
      await api.exists(filePath);
    }, testFilePath);

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "fs.exists",
        params: [testFilePath],
      },
    ]);
  });

  test("should call stat with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testFilePath = "/tmp/test-stat.txt";

    await window.evaluate(async (filePath) => {
      const api = (window as any).rendererFs;
      await api.stat(filePath);
    }, testFilePath);

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "fs.stat",
        params: [testFilePath],
      },
    ]);
  });

  test("should call unlink with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testFilePath = "/tmp/test-unlink.txt";

    await window.evaluate(async (filePath) => {
      const api = (window as any).rendererFs;
      await api.unlink(filePath);
    }, testFilePath);

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "fs.unlink",
        params: [testFilePath],
      },
    ]);
  });

  test("should call mkdir with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testDirPath = "/tmp/test-mkdir";

    await window.evaluate(async (dirPath) => {
      const api = (window as any).rendererFs;
      await api.mkdir(dirPath);
    }, testDirPath);

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "fs.mkdir",
        params: [testDirPath],
      },
    ]);
  });

  test("should call rmdir with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testDirPath = "/tmp/test-rmdir";

    await window.evaluate(async (dirPath) => {
      const api = (window as any).rendererFs;
      await api.rmdir(dirPath);
    }, testDirPath);

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "fs.rmdir",
        params: [testDirPath],
      },
    ]);
  });

  test("should call readdir with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testDirPath = "/tmp/test-readdir";

    await window.evaluate(async (dirPath) => {
      const api = (window as any).rendererFs;
      await api.readdir(dirPath);
    }, testDirPath);

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "fs.readdir",
        params: [testDirPath],
      },
    ]);
  });

  test("should call appendFile with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testFilePath = "/tmp/test-append.txt";
    const testContent = "Appended content";

    await window.evaluate(
      async ({ filePath, content }) => {
        const api = (window as any).rendererFs;
        await api.appendFile(filePath, content);
      },
      { filePath: testFilePath, content: testContent },
    );

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "fs.appendFile",
        params: [testFilePath, testContent],
      },
    ]);
  });

  test("should call copyFile with correct parameters using renderer API", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const srcPath = "/tmp/test-src.txt";
    const destPath = "/tmp/test-dest.txt";

    await window.evaluate(
      async ({ src, dest }) => {
        const api = (window as any).rendererFs;
        await api.copyFile(src, dest);
      },
      { src: srcPath, dest: destPath },
    );

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toEqual([
      {
        method: "fs.copyFile",
        params: [srcPath, destPath],
      },
    ]);
  });
});
