/**
 * App information handlers
 */

import { app } from "electron";

export async function getNameHandler(): Promise<string> {
  return app.getName();
}

export async function setNameHandler(...params: unknown[]): Promise<void> {
  const [name] = params as [string];
  app.setName(name);
}

export async function getVersionHandler(): Promise<string> {
  return app.getVersion();
}

export async function getAppPathHandler(): Promise<string> {
  return app.getAppPath();
}

export async function getLocaleHandler(): Promise<string> {
  return app.getLocale();
}

export async function getSystemLocaleHandler(): Promise<string> {
  return app.getSystemLocale();
}

export async function getPreferredSystemLanguagesHandler(): Promise<string[]> {
  return app.getPreferredSystemLanguages();
}

export async function getLocaleCountryCodeHandler(): Promise<string> {
  return app.getLocaleCountryCode();
}

export async function isReadyHandler(): Promise<boolean> {
  return app.isReady();
}
