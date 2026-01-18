/**
 * Main process handlers for safeStorage module
 * Provides simple encryption and decryption of strings for secure storage
 */

import { safeStorage } from "electron";
import type { RpcServer } from "electron-json-rpc/main";

const RPC_METHOD_PREFIX = "safeStorage";

/**
 * Check if encryption is available on the current platform
 */
export async function isEncryptionAvailableHandler(): Promise<boolean> {
  return safeStorage.isEncryptionAvailable();
}

/**
 * Encrypt a string for secure storage
 * Returns a base64-encoded string representing the encrypted data
 */
export async function encryptStringHandler(...params: unknown[]): Promise<string> {
  const [plainText] = params as [string];
  const buffer = safeStorage.encryptString(plainText);
  // Convert Buffer to base64 for IPC serialization
  return buffer.toString("base64");
}

/**
 * Decrypt an encrypted string back to plain text
 * Expects a base64-encoded string
 */
export async function decryptStringHandler(...params: unknown[]): Promise<string> {
  const [encryptedBase64] = params as [string];
  // Convert base64 back to Buffer
  const encryptedBuffer = Buffer.from(encryptedBase64, "base64");
  return safeStorage.decryptString(encryptedBuffer);
}

/**
 * On Linux, force the use of an in-memory password for encryption
 * No-op on Windows and macOS
 */
export async function setUsePlainTextEncryptionHandler(...params: unknown[]): Promise<void> {
  const [usePlainText] = params as [boolean];
  safeStorage.setUsePlainTextEncryption(usePlainText);
}

/**
 * On Linux, get the name of the password manager being used
 * Returns "unknown" if called before app ready
 */
export async function getSelectedStorageBackendHandler(): Promise<string> {
  return safeStorage.getSelectedStorageBackend();
}

/**
 * Register all safeStorage module RPC handlers
 */
export function registerSafeStorageModule(rpc: RpcServer): void {
  rpc.register(`${RPC_METHOD_PREFIX}.isEncryptionAvailable`, isEncryptionAvailableHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.encryptString`, encryptStringHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.decryptString`, decryptStringHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setUsePlainTextEncryption`, setUsePlainTextEncryptionHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getSelectedStorageBackend`, getSelectedStorageBackendHandler);
}
