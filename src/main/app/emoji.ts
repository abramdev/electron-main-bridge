/**
 * Emoji panel handlers
 */

import { app } from "electron";

export async function isEmojiPanelSupportedHandler(): Promise<boolean> {
  return app.isEmojiPanelSupported();
}

export async function showEmojiPanelHandler(): Promise<void> {
  app.showEmojiPanel();
}
