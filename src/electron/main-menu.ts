import { Menu, MenuItemConstructorOptions } from "electron"

interface MenuItem {
  label: string
  command?: string
  role?: string
}

const menuBar: { label: string; items: MenuItem[] }[] = []

if (process.platform === "darwin") {
  menuBar.push({
    label: "PR Eyedropper", items: [
      { label: "设置", command: "Settings" },
      { label: "---" },
      { label: "服务", role: "services" },
      { label: "---" },
      { label: "隐藏", role: "hide" },
      { label: "隐藏其他", role: "hideothers" },
      { label: "显示", role: "unhide" },
      { label: "---" },
      { label: "退出", role: "quit" }
    ]
  })
}

let mainMenu: Menu

export function initMainMenu() {
  if (process.platform === "darwin") {
    buildOSMenu()
    showMainMenu()
  } else {
    Menu.setApplicationMenu(null)
  }
}

export function showMainMenu() {
  if (process.platform === "darwin") {
    Menu.setApplicationMenu(mainMenu)
  } else {
    Menu.setApplicationMenu(null)
  }
}

function buildOSMenu() {
  const template: MenuItemConstructorOptions[] = []
  for (const m of menuBar) {
    template.push({
      label: m.label,
      submenu: m.items.map<MenuItemConstructorOptions>(mi => {
        if (mi.label === "---") return { type: "separator" }
        const o: MenuItemConstructorOptions = { label: mi.label, role: mi.role }
        return o
      })
    })
  }
  mainMenu = Menu.buildFromTemplate(template)
}
