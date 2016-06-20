import _ from 'lodash'
import {Menu} from 'electron'

export function createApplicationMenuFor (app, win) {
  const appName = _.startCase(app.getName())

  const template = [
    {
      label: appName,
      submenu: [
        {
          label: `About ${appName}`,
          role: 'about'
        }, {
          type: 'separator'
        }, {
          label: 'Services',
          role: 'services',
          submenu: []
        }, {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Command+I',
          click () {
            win.show()
            win.toggleDevTools()
          }
        }, {
          type: 'separator'
        }, {
          label: `Hide ${appName}`,
          accelerator: 'Command+H',
          role: 'hide'
        }, {
          label: 'Show All',
          role: 'unhide'
        }, {
          type: 'separator'
        }, {
          label: 'Quit',
          accelerator: 'Command+Q',
          click () { app.quit() }
        }
      ]
    },

    // Edit Menu – Needed to get all OS editing goodies
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        }, {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        }, {
          type: 'separator'
        }, {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        }, {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        }, {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        }, {
          label: 'Paste and Match Style',
          accelerator: 'Shift+Command+V',
          role: 'pasteandmatchstyle'
        }, {
          label: 'Delete',
          role: 'delete'
        }, {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        }
      ]
    },

    // Window Menu – OS standard window actions 
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        }, {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }, {
          type: 'separator'
        }, {
          label: 'Bring All to Front',
          role: 'front'
        }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  return Menu
}
