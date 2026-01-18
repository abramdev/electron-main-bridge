import type { RpcServer } from "electron-json-rpc/main";

import {
  setRpcServer,
  createHandler,
  closeHandler,
  destroyHandler,
  showHandler,
  hideHandler,
  minimizeHandler,
  maximizeHandler,
  unmaximizeHandler,
  restoreHandler,
  setFullScreenHandler,
  isFullScreenHandler,
  focusHandler,
  blurHandler,
  setTitleHandler,
  getTitleHandler,
  getBoundsHandler,
  setBoundsHandler,
  getSizeHandler,
  setSizeHandler,
  getPositionHandler,
  setPositionHandler,
  centerHandler,
  getMinimumSizeHandler,
  setMinimumSizeHandler,
  getMaximumSizeHandler,
  setMaximumSizeHandler,
  setResizableHandler,
  isResizableHandler,
  setMovableHandler,
  isMovableHandler,
  setMinimizableHandler,
  isMinimizableHandler,
  setMaximizableHandler,
  isMaximizableHandler,
  setClosableHandler,
  isClosableHandler,
  setFocusableHandler,
  isFocusableHandler,
  setAlwaysOnTopHandler,
  isAlwaysOnTopHandler,
  setMenuBarVisibilityHandler,
  isMenuBarVisibleHandler,
  setAutoHideMenuBarHandler,
  isMenuBarAutoHideHandler,
  loadURLHandler,
  loadFileHandler,
  reloadHandler,
  openDevToolsHandler,
  closeDevToolsHandler,
  isDevToolsOpenedHandler,
  executeJavaScriptHandler,
  getAllWindowsHandler,
  getFocusedWindowHandler,
  isMaximizedHandler,
  isMinimizedHandler,
  isVisibleHandler,
  isFocusedHandler,
  setProgressBarHandler,
  flashFrameHandler,
  setBackgroundColorHandler,
  setOpacityHandler,
  getOpacityHandler,
  setKioskHandler,
  isKioskHandler,
  setSimpleFullScreenHandler,
  isSimpleFullScreenHandler,
  setSkipTaskbarHandler,
  setContentProtectionHandler,
  existsHandler,
  subscribeEventHandlerRpc,
  unsubscribeEventHandlerRpc,
} from "./handlers.js";

const RPC_METHOD_PREFIX = "browserWindow";

export function registerBrowserWindowModule(rpc: RpcServer): void {
  setRpcServer(rpc);

  rpc.register(`${RPC_METHOD_PREFIX}.create`, createHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.close`, closeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.destroy`, destroyHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.show`, showHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.hide`, hideHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.minimize`, minimizeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.maximize`, maximizeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.unmaximize`, unmaximizeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.restore`, restoreHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setFullScreen`, setFullScreenHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isFullScreen`, isFullScreenHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.focus`, focusHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.blur`, blurHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setTitle`, setTitleHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getTitle`, getTitleHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getBounds`, getBoundsHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setBounds`, setBoundsHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getSize`, getSizeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setSize`, setSizeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getPosition`, getPositionHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setPosition`, setPositionHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.center`, centerHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getMinimumSize`, getMinimumSizeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setMinimumSize`, setMinimumSizeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getMaximumSize`, getMaximumSizeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setMaximumSize`, setMaximumSizeHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setResizable`, setResizableHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isResizable`, isResizableHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setMovable`, setMovableHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isMovable`, isMovableHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setMinimizable`, setMinimizableHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isMinimizable`, isMinimizableHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setMaximizable`, setMaximizableHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isMaximizable`, isMaximizableHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setClosable`, setClosableHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isClosable`, isClosableHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setFocusable`, setFocusableHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isFocusable`, isFocusableHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setAlwaysOnTop`, setAlwaysOnTopHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isAlwaysOnTop`, isAlwaysOnTopHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setMenuBarVisibility`, setMenuBarVisibilityHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isMenuBarVisible`, isMenuBarVisibleHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setAutoHideMenuBar`, setAutoHideMenuBarHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isMenuBarAutoHide`, isMenuBarAutoHideHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.loadURL`, loadURLHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.loadFile`, loadFileHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.reload`, reloadHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.openDevTools`, openDevToolsHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.closeDevTools`, closeDevToolsHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isDevToolsOpened`, isDevToolsOpenedHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.executeJavaScript`, executeJavaScriptHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getAllWindows`, getAllWindowsHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getFocusedWindow`, getFocusedWindowHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.exists`, existsHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isMaximized`, isMaximizedHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isMinimized`, isMinimizedHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isVisible`, isVisibleHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isFocused`, isFocusedHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setProgressBar`, setProgressBarHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.flashFrame`, flashFrameHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setBackgroundColor`, setBackgroundColorHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setOpacity`, setOpacityHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.getOpacity`, getOpacityHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setKiosk`, setKioskHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isKiosk`, isKioskHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setSimpleFullScreen`, setSimpleFullScreenHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.isSimpleFullScreen`, isSimpleFullScreenHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setSkipTaskbar`, setSkipTaskbarHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.setContentProtection`, setContentProtectionHandler);
  rpc.register(`${RPC_METHOD_PREFIX}.subscribeEvent`, subscribeEventHandlerRpc);
  rpc.register(`${RPC_METHOD_PREFIX}.unsubscribeEvent`, unsubscribeEventHandlerRpc);
}
