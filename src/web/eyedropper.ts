import { ipcRenderer, remote } from "electron"
import * as robot from "robotjs"

const windowSize = 100
const windowHalfSize = windowSize / 2

let showing = false
let mouseX = 0, mouseY = 0

let text: SVGTextElement
let circle: SVGElement

let color = ""

const robotScreenSize = robot.getScreenSize()
console.info("robotjs screen size", robotScreenSize)
console.info("webcontent screen size", screen.width, screen.height)
const pixelRatioW = robotScreenSize.width / screen.width
const pixelRatioH = robotScreenSize.height / screen.height

document.addEventListener("DOMContentLoaded", () => {
  circle = document.querySelector<SVGElement>("#c1") as SVGElement
  text = document.querySelector<SVGTextElement>("text") as SVGTextElement

  listen()

  window.addEventListener("keydown", e => {
    if (e.keyCode === 27) { // ESC
      hide()
    }
  })

  window.addEventListener("mousedown", () => {
    hide()
    ipcRenderer.send("color-picked", color)
  })
})

function hide() {
  console.info("hide eyedropper")
  showing = false
  const win = remote.getCurrentWindow()
  win.hide()
}

function show() {
  const win = remote.getCurrentWindow()
  win.setSize(windowSize, windowSize)
  showing = true
  color = ""
  loop()
  win.focus()
  // document.focus()

}

function listen() {
  ipcRenderer.on("show-eyedropper-to-js", () => { show() })
}

function loop() {
  console.debug("eyedropper loop start")
  const mouse = robot.getMousePos()
  console.debug("mouse", mouse)

  if (mouse.x === mouseX && mouse.y === mouseY) {
    if (showing) requestAnimationFrame(loop)
    return
  }

  mouseX = mouse.x
  mouseY = mouse.y

  color = robot.getPixelColor(mouseX, mouseY)
  color = "#" + color
  circle.style.stroke = color
  text.textContent = color.toUpperCase()

  const win = remote.getCurrentWindow()
  // WIndows 下必须用整数，用小数会引发BUG但不报告任何错误
  const winX = Math.round(mouseX / pixelRatioW - windowHalfSize)
  const winY = Math.round(mouseY / pixelRatioH - windowHalfSize)
  console.debug("win pos", win.getPosition(), { winX, winY })
  win.setPosition(winX, winY, false)
  console.debug("eyedropper, after set position")
  win.show()

  console.debug("eyedropper loop end")
  if (showing) requestAnimationFrame(loop)
}
