// General Modules
import {client} from 'electron-connect'

// Electron Modules
import {app, BrowserWindow, Tray} from 'electron'

// Node Modules
import Path from 'path'

// Internal Modules
import {createApplicationMenuFor} from './menus/application.js'
import {createTrayMenu} from './menus/tray.js'

// Set Paths
const appRoot = Path.resolve(__dirname, '../')
const pathTo = {
  images: Path.resolve(appRoot, 'assets/images'),
  cache: Path.resolve(appRoot, '../cache'),
  lib: Path.resolve(appRoot, 'lib'),
  renderer: Path.resolve(appRoot, 'renderer'),
  root: Path.resolve(appRoot)
}

// Adding pathTo to global object to make it available
// to renderer
global.pathTo = pathTo

const trayIconPath = `${pathTo.images}/tray.png`

let mainWindow

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    frame: true,
    resizable: false
  })
  mainWindow.loadURL(`file://${pathTo.renderer}/index.html`)

  // [electron-connect] Connect to server process

  if (process.env.NODE_ENV !== 'production') {
    client.create(mainWindow)
    mainWindow.openDevTools()
  }

  createApplicationMenuFor(app, mainWindow)
  const trayIcon = new Tray(trayIconPath)
  trayIcon.setToolTip('Animal Advisor')
  trayIcon.setContextMenu(createTrayMenu(mainWindow))
})
