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
const {createApplicationMenuFor} = require('./menus/application.js')
const {createTrayMenu} = require('./menus/tray.js')

// Set Paths
const appRoot = Path.resolve(__dirname, '../')
const pathTo = {
  images: Path.resolve(appRoot, 'assets/images'),
  cache: Path.resolve(appRoot, '../cache'),
  lib: Path.resolve(appRoot, 'lib'),
  renderer: Path.resolve(appRoot, 'renderer'),
  root: Path.resolve(appRoot)
}

const client = require('electron-connect').client

global.pathTo = pathTo

const trayIconPath = `${pathTo.images}/tray.png`

app.on('ready', function () {
  let mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    frame: true,
    resizable: false
  })
  mainWindow.loadURL(`file://${pathTo.renderer}/index.html`)
  mainWindow.on('closed', () => { mainWindow = null })

  // [electron-connect] Connect to server process
  client.create(mainWindow)

  createApplicationMenuFor(app, mainWindow)

  const trayIcon = new Tray(trayIconPath)
  trayIcon.setToolTip('Animal Advisor')
  trayIcon.setContextMenu(createTrayMenu(mainWindow))
})
