/**
 * Shared types for powerMonitor module
 */

// ============================================================================
// System Idle State
// ============================================================================

export type SystemIdleState = "active" | "idle" | "locked" | "unknown";

// ============================================================================
// Thermal State (macOS only)
// ============================================================================

export type ThermalState = "unknown" | "nominal" | "fair" | "serious" | "critical";

// ============================================================================
// Event data types
// ============================================================================

export interface PowerMonitorEventData {
  "powerMonitor.suspend": void;
  "powerMonitor.resume": void;
  "powerMonitor.on-ac": void;
  "powerMonitor.on-battery": void;
  "powerMonitor.thermal-state-change": { state: ThermalState };
  "powerMonitor.speed-limit-change": { limit: number };
  "powerMonitor.shutdown": void;
  "powerMonitor.lock-screen": void;
  "powerMonitor.unlock-screen": void;
  "powerMonitor.user-did-become-active": void;
  "powerMonitor.user-did-resign-active": void;
}
