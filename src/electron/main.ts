import { app, ipcMain } from "electron"
import * as fse from "fs-extra"
import * as Path from "path"
import { aCreateEyedropper, showEyedropper } from "./eyedropper"
import { initMainMenu } from "./main-menu"
import { aCreateMainWindow, getMainWindow } from "./main-window"
import { initServer } from "./server"

interface AppDebug {
  showDevTools?: boolean
}

export const appDebug: AppDebug = {}

async function aLoadDebugFile() {
  try {
    const file = Path.join(app.getPath("desktop"), "pre-debug.json")
    const debug = await fse.readJson(file)
    appDebug.showDevTools = debug.showDevTools
  } catch (e) {
    // ignore
  }
}

async function aOnReady() {
  await aLoadDebugFile()
  initMainMenu()
  aCreateMainWindow()
  aCreateEyedropper()
  initServer()
}
// 确保单例
const shouldQuit = app.makeSingleInstance(function(commandLine, _workingDirectory) {
  console.info("makeSingleInstance commands", commandLine)
  aCreateMainWindow()
  aCreateEyedropper()
})
if (shouldQuit) {
  console.info("quit for single instance!")
  app.quit()
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on("ready", () => {
  console.info("\n\nReadyReadyReady\n\n")
  aOnReady().catch(err => console.error("After ready", err))
})

// 当全部窗口关闭时退出。
app.on("window-all-closed", () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// macOS only 
app.on("activate", () => {
  // 在 macOS 上，当单击 dock 图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  aCreateMainWindow()
  aCreateEyedropper()
})

ipcMain.on("show-eyedropper", () => {
  console.log("main main process got : show-eyedropper")
  showEyedropper()
})

ipcMain.on("color-picked", (_e: any, color: string) => {
  console.log("main main process got : color-picked", color)
  setLatestPickedColor(color)
  const mainWin = getMainWindow()
  if (mainWin) mainWin.webContents.send("color-picked-to-js", color)
})

let latestPickedColor = ""

export function setLatestPickedColor(color: string) {
  latestPickedColor = color
}

export function getLatestPickedColor() {
  return latestPickedColor
}
