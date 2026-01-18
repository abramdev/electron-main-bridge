/**
 * Renderer process API for safeStorage module
 * Usage in renderer process:
 *
 * import * as safeStorage from 'electron-main-bridge/renderer/safeStorage';
 *
 * if (await safeStorage.isEncryptionAvailable()) {
 *   const encrypted = await safeStorage.encryptString('my secret');
 *   const decrypted = await safeStorage.decryptString(encrypted);
 * }
 */

import type { StorageBackend } from "@shared/safe-storage.types.js";

/**
 * Check if encryption is available on the current platform
 */
export async function isEncryptionAvailable(): Promise<boolean> {
  return (await window.rpc.call("safeStorage.isEncryptionAvailable")) as boolean;
}

/**
 * Encrypt a string for secure storage
 * @param plainText The string to encrypt
 * @returns Base64-encoded encrypted data
 */
export async function encryptString(plainText: string): Promise<string> {
  return (await window.rpc.call("safeStorage.encryptString", plainText)) as string;
}

/**
 * Decrypt a string that was encrypted with encryptString
 * @param encryptedBase64 Base64-encoded encrypted data
 * @returns The decrypted plain text string
 */
export async function decryptString(encryptedBase64: string): Promise<string> {
  return (await window.rpc.call("safeStorage.decryptString", encryptedBase64)) as string;
}

/**
 * On Linux, force the use of an in-memory password for encryption
 * No-op on Windows and macOS
 * @param usePlainText Whether to use plain text encryption
 */
export async function setUsePlainTextEncryption(usePlainText: boolean): Promise<void> {
  await window.rpc.call("safeStorage.setUsePlainTextEncryption", usePlainText);
}

/**
 * On Linux, get the name of the password manager being used
 * Returns "unknown" if called before app ready
 */
export async function getSelectedStorageBackend(): Promise<StorageBackend> {
  return (await window.rpc.call("safeStorage.getSelectedStorageBackend")) as StorageBackend;
}
