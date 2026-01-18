/**
 * Type guard utilities for RPC parameter validation
 */

/**
 * Check if a value is a Buffer-like object (Buffer or Uint8Array)
 */
export function isBufferLike(val: unknown): val is Buffer | Uint8Array {
  return val instanceof Buffer || val instanceof Uint8Array;
}

/**
 * Check if a value is a plain object (not null)
 */
export function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null;
}

/**
 * Check if a value is a string
 */
export function isString(val: unknown): val is string {
  return typeof val === "string";
}

/**
 * Check if a value is a number
 */
export function isNumber(val: unknown): val is number {
  return typeof val === "number";
}

/**
 * Check if a value is a boolean
 */
export function isBoolean(val: unknown): val is boolean {
  return typeof val === "boolean";
}
