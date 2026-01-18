/**
 * Main process handlers for path module
 */

import type { RpcServer } from "electron-json-rpc/main";

import * as parse from "./parse.js";
import * as join from "./join.js";
import * as component from "./component.js";
import * as property from "./property.js";
import * as win32 from "./win32.js";
import * as posix from "./posix.js";

const RPC_METHOD_PREFIX = "path";

/**
 * Register all path module RPC handlers
 */
export function registerPathModule(rpc: RpcServer): void {
  // Path parsing and formatting
  rpc.register(`${RPC_METHOD_PREFIX}.parse`, parse.parseHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.format`, parse.formatHandler);

  // Path joining and resolving
  rpc.register(`${RPC_METHOD_PREFIX}.join`, join.joinHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.resolve`, join.resolveHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.normalize`, join.normalizeHandler);

  // Path components
  rpc.register(`${RPC_METHOD_PREFIX}.dirname`, component.dirnameHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.basename`, component.basenameHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.extname`, component.extnameHandler);

  // Path properties
  rpc.register(`${RPC_METHOD_PREFIX}.relative`, property.relativeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isAbsolute`, property.isAbsoluteHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.sep`, property.sepHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.delimiter`, property.delimiterHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.cwd`, property.cwdHandler);

  // Windows-specific
  rpc.register(`${RPC_METHOD_PREFIX}.win32.basename`, win32.win32BasenameHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.win32.dirname`, win32.win32DirnameHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.win32.extname`, win32.win32ExtnameHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.win32.join`, win32.win32JoinHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.win32.normalize`, win32.win32NormalizeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.win32.parse`, win32.win32ParseHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.win32.format`, win32.win32FormatHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.win32.isAbsolute`, win32.win32IsAbsoluteHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.win32.relative`, win32.win32RelativeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.win32.resolve`, win32.win32ResolveHandler);

  // POSIX-specific
  rpc.register(`${RPC_METHOD_PREFIX}.posix.basename`, posix.posixBasenameHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.posix.dirname`, posix.posixDirnameHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.posix.extname`, posix.posixExtnameHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.posix.join`, posix.posixJoinHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.posix.normalize`, posix.posixNormalizeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.posix.parse`, posix.posixParseHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.posix.format`, posix.posixFormatHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.posix.isAbsolute`, posix.posixIsAbsoluteHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.posix.relative`, posix.posixRelativeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.posix.resolve`, posix.posixResolveHandler);
}
