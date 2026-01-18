/**
 * Shared types for notification module
 */

export interface NotificationOptions {
  title?: string;
  subtitle?: string; // macOS
  body?: string;
  silent?: boolean;
  icon?: string; // NativeImage | string
  hasReply?: boolean; // macOS
  timeoutType?: "default" | "never"; // Linux, Windows
  replyPlaceholder?: string; // macOS
  sound?: string; // macOS
  urgency?: "normal" | "critical" | "low"; // Linux
  actions?: NotificationAction[]; // macOS
  closeButtonText?: string; // macOS
  toastXml?: string; // Windows
}

export interface NotificationAction {
  type?: "button" | "text";
  text?: string;
  placeholder?: string;
  icon?: string; // NativeImage | string
}

export interface NotificationEventData {
  title?: string;
  subtitle?: string;
  body?: string;
  silent?: boolean;
  replyPlaceholder?: string;
  sound?: string;
  closeButtonText?: string;
  hasReply?: boolean;
  urgency?: "normal" | "critical" | "low";
  timeoutType?: "default" | "never";
  actions?: NotificationAction[];
  toastXml?: string;
}

export interface NotificationEventCallbacks {
  "notification.show": () => void;
  "notification.click": () => void;
  "notification.close": () => void;
  "notification.reply": (reply: string) => void; // macOS
  "notification.action": (index: number) => void; // macOS
  "notification.failed": (error: string) => void; // Windows
}
