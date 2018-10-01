import { clipboard, ipcRenderer } from "electron"
import * as SimpleScrollBar from "simple-scrollbar"
import * as tc2 from "tinycolor2"

const listNode = document.querySelector(".color-list") as HTMLElement

const listParentNode = document.querySelector(".color-list-parent") as HTMLElement
SimpleScrollBar.initEl(listParentNode)

const colorsStr = localStorage.getItem("eyedropper-colors")
const colors = colorsStr && JSON.parse(colorsStr) || []

showList()

const pickBtn = document.querySelector(".pick") as HTMLElement
pickBtn.addEventListener("click", () => {
  ipcRenderer.send("show-eyedropper")
})

listNode.addEventListener("click", e => {
  const target = e.target as HTMLElement
  let value = ""
  if (target.matches(".rgb")) {
    value = target.textContent || ""
  } else if (target.matches(".hex")) {
    value = target.textContent || ""
  }
  value = value.trim()
  if (value) {
    clipboard.writeText(value)
    showToast(value + " 已复制到剪贴板")
  }
})

function showList() {
  listNode.innerHTML = ""
  let html = ""
  for (const color of colors) {
    const ci = tc2(color)
    const rgb = ci.toRgbString().replace(/\s/g, "")
    const hex = ci.toHexString()
    const dark = ci.isDark()
    html += ST.ColorShow({ rgb, hex, dark })
  }
  listNode.innerHTML = html
}

ipcRenderer.on("color-picked-to-js", (_e: any, color: string) => {
  colors.splice(0, 0, color)
  clipboard.writeText(color)
  if (colors.length > 20) colors.length = 20
  localStorage.setItem("eyedropper-colors", JSON.stringify(colors))
  showList()
})

const toastNode = document.querySelector(".toast") as HTMLElement
toastNode.style.display = "none"

function showToast(toast: string) {
  toastNode.textContent = toast
  toastNode.style.display = ""
  setTimeout(() => { toastNode.style.display = "none" }, 4000)
}
