/**
 * File icon handlers
 */

import { app } from "electron";
import type { GetFileIconOptions, SerializedNativeImage } from "@shared/app.types.js";

export async function getFileIconHandler(...params: unknown[]): Promise<SerializedNativeImage> {
  const [path, options] = params as [string, GetFileIconOptions?];
  const icon = await app.getFileIcon(path, options as any);
  const buffer = icon.toPNG();
  return {
    _data: new Uint8Array(buffer),
    toPNG: () => new Uint8Array(buffer),
    toDataURL: () => icon.toDataURL(),
    size: icon.getSize(),
  };
}
