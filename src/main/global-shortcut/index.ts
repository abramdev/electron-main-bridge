import type { RpcServer } from "electron-json-rpc/main";

import {
  registerHandler,
  registerAllHandler,
  isRegisteredHandler,
  unregisterHandler,
  unregisterAllHandler,
  setRpcServer,
} from "./register.js";

const RPC_METHOD_PREFIX = "globalShortcut";

/**
 * 注册所有 globalShortcut 模块 RPC 处理器并设置事件转发
 */
export function registerGlobalShortcutModule(rpc: RpcServer): void {
  setRpcServer(rpc);

  rpc.register(`${RPC_METHOD_PREFIX}.register`, registerHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.registerAll`, registerAllHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isRegistered`, isRegisteredHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.unregister`, unregisterHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.unregisterAll`, unregisterAllHandler);
}

// Re-export handlers for testing
export {
  registerHandler,
  registerAllHandler,
  isRegisteredHandler,
  unregisterHandler,
  unregisterAllHandler,
};
