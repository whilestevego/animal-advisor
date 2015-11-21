"use strict";

const Path          = require("path");
const App           = require("app");
const BrowserWindow = require("browser-window");

// Set Paths
const appRoot = Path.resolve(__dirname, "../..");
global.pathTo = {
  images:   Path.resolve(appRoot, "app/assets/images"),
  cache:    Path.resolve(appRoot, "cache"),
  lib:      Path.resolve(appRoot, "lib"),
  renderer: Path.resolve(appRoot, "app/renderer"),
  root:     Path.resolve(appRoot)
}

App.on("ready", function () {
  // Once app is loaded & ready, create a mainWindow.
  // BrowserWindow loads it in a new renderer process.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    frame: true,
    resizable: false
  });

  mainWindow.loadURL(`file://${pathTo.renderer}/main/index.html`);
});
