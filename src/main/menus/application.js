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
    }, {
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
