import { BrowserWindow } from "electron"
import * as Path from "path"
import * as URL from "url"
import { appDebug } from "./main"

// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let window: BrowserWindow | null = null

export async function aCreateMainWindow() {
  if (window) return

  console.log("create main window")

  const win = new BrowserWindow({ width: 260, height: 320 })
  window = win

  const pathname = Path.join(__dirname, "../main.html")
  win.loadURL(URL.format({ pathname, protocol: "file:", slashes: true }))

  // 打开开发者工具。
  if (appDebug.showDevTools) win.webContents.openDevTools({ mode: "detach" })

  // 当 window 被关闭，这个事件会被触发。
  win.on("closed", () => { onWindowClose() })
}

export function getMainWindow() {
  return window
}

function onWindowClose() {
  console.info("main win on close")
  window = null
}

