/**
 * Shared types for pushNotifications module (macOS only)
 */

export type ApnsUserInfo = Record<string, unknown>;

export interface PushNotificationsEventData {
  "pushNotifications.received-apns-notification": ApnsUserInfo;
}

export interface PushNotificationsEventCallbacks {
  "received-apns-notification": (userInfo: ApnsUserInfo) => void;
}
