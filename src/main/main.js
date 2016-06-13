'use strict'

// Electron Modules
const {
  app,
  BrowserWindow,
  Tray
} = require('electron')

// Node Modules
const Path = require('path')

// Internal Modules
const {createApplicationMenuFor} = require('../menus/application.js')
const {createTrayMenu} = require('../menus/tray.js')

// Set Paths
const appRoot = Path.resolve(__dirname, '../..')
const pathTo = {
  images: Path.resolve(appRoot, 'src/assets/images'),
  cache: Path.resolve(appRoot, 'cache'),
  lib: Path.resolve(appRoot, 'src/lib'),
  renderers: Path.resolve(appRoot, 'src/renderers'),
  root: Path.resolve(appRoot)
}

global.pathTo = pathTo

const trayIconPath = `${pathTo.images}/tray.png`

app.on('ready', function () {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    frame: true,
    resizable: false
  })
  mainWindow.loadURL(`file://${pathTo.renderers}/main/index.html`)

  createApplicationMenuFor(app, mainWindow)

  const trayIcon = new Tray(trayIconPath)
  trayIcon.setToolTip('Animal Advisor')
  trayIcon.setContextMenu(createTrayMenu(mainWindow))
})
