/**
 * Login item handlers
 */

import { app } from "electron";
import type {
  LoginItemSettings,
  LoginItemSettingsOptions,
  SetLoginItemSettingsOptions,
} from "@shared/app.types.js";

export async function getLoginItemSettingsHandler(
  ...params: unknown[]
): Promise<LoginItemSettings> {
  const [options] = params as [LoginItemSettingsOptions?];
  const result = app.getLoginItemSettings(options as any);
  return {
    openAtLogin: result.openAtLogin,
    openAsHidden: result.openAsHidden,
  };
}

export async function setLoginItemSettingsHandler(...params: unknown[]): Promise<void> {
  const [settings] = params as [SetLoginItemSettingsOptions];
  app.setLoginItemSettings(settings as any);
}
