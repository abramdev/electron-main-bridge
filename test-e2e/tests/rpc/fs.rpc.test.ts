/**
 * FS module RPC layer tests
 * Tests the low-level RPC API (window.rpc.call) directly
 *
 * 使用 mock 模式：只验证参数是否正确传递，不实际执行文件操作
 */

import { test, expect } from "@playwright/test";
import { launchTestApp, setupTempDir, cleanupTempDir } from "../helpers/setup.js";

test.describe("fs module - RPC layer", () => {
  let electronApp: Awaited<ReturnType<typeof launchTestApp>>;

  test.beforeAll(async () => {
    await setupTempDir();
    electronApp = await launchTestApp();
  });

  test.afterAll(async () => {
    await electronApp.close();
    await cleanupTempDir();
  });
  test("should access window.rpc", async () => {
    const window = electronApp.windows()[0];
    const hasRpc = await window.evaluate(() => {
      return typeof (window as any).rpc !== "undefined";
    });
    expect(hasRpc).toBe(true);
  });

  test("should call writeFile with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    // 清空 spy 记录
    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    // 调用 writeFile
    const testFilePath = "/tmp/test-write-file.txt";
    const testContent = "Hello from RPC test!";

    await window.evaluate(
      async ({ filePath, content }) => {
        const rpc = (window as any).rpc;
        await rpc.call("fs.writeFile", filePath, content);
      },
      { filePath: testFilePath, content: testContent },
    );

    // 获取 spy 记录
    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    // 验证调用参数
    expect(spyLog).toEqual([
      {
        method: "fs.writeFile",
        params: [testFilePath, testContent],
      },
    ]);
  });

  test("should call readFile with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testFilePath = "/tmp/test-read-file.txt";

    await window.evaluate(async (filePath) => {
      const rpc = (window as any).rpc;
      await rpc.call("fs.readFile", filePath, "utf-8");
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

  test("should call exists with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testFilePath = "/tmp/test-exists.txt";

    await window.evaluate(async (filePath) => {
      const rpc = (window as any).rpc;
      await rpc.call("fs.exists", filePath);
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

  test("should call stat with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testFilePath = "/tmp/test-stat.txt";

    await window.evaluate(async (filePath) => {
      const rpc = (window as any).rpc;
      await rpc.call("fs.stat", filePath);
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

  test("should call unlink with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testFilePath = "/tmp/test-unlink.txt";

    await window.evaluate(async (filePath) => {
      const rpc = (window as any).rpc;
      await rpc.call("fs.unlink", filePath);
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

  test("should call mkdir with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testDirPath = "/tmp/test-mkdir";

    await window.evaluate(async (dirPath) => {
      const rpc = (window as any).rpc;
      await rpc.call("fs.mkdir", dirPath);
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

  test("should call rmdir with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testDirPath = "/tmp/test-rmdir";

    await window.evaluate(async (dirPath) => {
      const rpc = (window as any).rpc;
      await rpc.call("fs.rmdir", dirPath);
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

  test("should call readdir with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testDirPath = "/tmp/test-readdir";

    await window.evaluate(async (dirPath) => {
      const rpc = (window as any).rpc;
      await rpc.call("fs.readdir", dirPath);
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

  test("should call appendFile with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testFilePath = "/tmp/test-append.txt";
    const testContent = "Appended content";

    await window.evaluate(
      async ({ filePath, content }) => {
        const rpc = (window as any).rpc;
        await rpc.call("fs.appendFile", filePath, content);
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

  test("should call copyFile with correct parameters via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const srcPath = "/tmp/test-src.txt";
    const destPath = "/tmp/test-dest.txt";

    await window.evaluate(
      async ({ src, dest }) => {
        const rpc = (window as any).rpc;
        await rpc.call("fs.copyFile", src, dest);
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

  test("should pass binary buffer parameters correctly via RPC", async () => {
    const window = electronApp.windows()[0];

    await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      await rpc.call("test.clearSpyLog");
    });

    const testFilePath = "/tmp/test-binary.bin";

    await window.evaluate(async (filePath) => {
      const rpc = (window as any).rpc;
      await rpc.call("fs.writeFile", filePath, new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05]));
    }, testFilePath);

    const spyLog = await window.evaluate(async () => {
      const rpc = (window as any).rpc;
      return await rpc.call("test.getSpyLog");
    });

    expect(spyLog).toHaveLength(1);
    expect(spyLog[0].method).toBe("fs.writeFile");
    expect(spyLog[0].params[0]).toBe(testFilePath);
    expect(spyLog[0].params[1]).toEqual("[Uint8Array length=5]");
  });
});
