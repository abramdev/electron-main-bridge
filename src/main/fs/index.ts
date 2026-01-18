import { RpcServer } from "electron-json-rpc/main";
import { readFileHandler, readlinkHandler, realpathHandler } from "./read.js";
import { writeFileHandler, appendFileHandler, copyFileHandler } from "./write.js";
import {
  unlinkHandler,
  renameHandler,
  truncateHandler,
  statHandler,
  lstatHandler,
  existsHandler,
  accessHandler,
  chmodHandler,
  chownHandler,
  utimesHandler,
} from "./file.js";
import { mkdirHandler, readdirHandler, rmdirHandler, rmHandler, cpHandler } from "./dir.js";
import { linkHandler, symlinkHandler } from "./link.js";

const RPC_METHOD_PREFIX = "fs";

export function registerFsModule(rpc: RpcServer): void {
  // Read operations
  rpc.register(`${RPC_METHOD_PREFIX}.readFile`, readFileHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.readlink`, readlinkHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.realpath`, realpathHandler);

  // Write operations
  rpc.register(`${RPC_METHOD_PREFIX}.writeFile`, writeFileHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.appendFile`, appendFileHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.copyFile`, copyFileHandler);

  // File operations
  rpc.register(`${RPC_METHOD_PREFIX}.unlink`, unlinkHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.rename`, renameHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.truncate`, truncateHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.stat`, statHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.lstat`, lstatHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.exists`, existsHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.access`, accessHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.chmod`, chmodHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.chown`, chownHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.utimes`, utimesHandler);

  // Directory operations
  rpc.register(`${RPC_METHOD_PREFIX}.mkdir`, mkdirHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.readdir`, readdirHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.rmdir`, rmdirHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.rm`, rmHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.cp`, cpHandler);

  // Link operations
  rpc.register(`${RPC_METHOD_PREFIX}.link`, linkHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.symlink`, symlinkHandler);
}

// Re-export handlers for testing
export {
  readFileHandler,
  readlinkHandler,
  realpathHandler,
  writeFileHandler,
  appendFileHandler,
  copyFileHandler,
  unlinkHandler,
  renameHandler,
  truncateHandler,
  statHandler,
  lstatHandler,
  existsHandler,
  accessHandler,
  chmodHandler,
  chownHandler,
  utimesHandler,
  mkdirHandler,
  readdirHandler,
  rmdirHandler,
  rmHandler,
  cpHandler,
  linkHandler,
  symlinkHandler,
};
