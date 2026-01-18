/**
 * Shared types for safeStorage module
 */

// Linux only - password manager backend names
export type StorageBackend =
  | "basic_text"
  | "gnome_libsecret"
  | "kwallet"
  | "kwallet5"
  | "kwallet6"
  | "unknown";

// Encrypted data as base64 string for IPC serialization
export type EncryptedData = string;
