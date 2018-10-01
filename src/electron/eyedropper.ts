import { BrowserWindow } from "electron"
import * as Path from "path"
import * as URL from "url"
import { appDebug } from "./main"

let window: BrowserWindow | null = null

export function aCreateEyedropper() {
  if (window) return

  console.log("create eyedropper window")

  const win = new BrowserWindow({
    frame: false, transparent: true, modal: true, hasShadow: false, show: false,
    skipTaskbar: true
  })
  window = win

  const pathname = Path.join(__dirname, "../eyedropper.html")
  win.loadURL(URL.format({ pathname, protocol: "file:", slashes: true }))

  if (appDebug.showDevTools) win.webContents.openDevTools({ mode: "detach" })

  // 当 window 被关闭，这个事件会被触发。
  win.on("closed", () => { onWindowClose() })
}

function onWindowClose() {
  console.info("eyedropper win on close")
  window = null
}

export function showEyedropper() {
  if (!window) aCreateEyedropper()
  if (window) window.webContents.send("show-eyedropper-to-js")
}

export function getEyedropperWindow() {
  return window
}
