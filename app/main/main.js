"use strict";

const Path          = require("path");
const App           = require("app");
const BrowserWindow = require("browser-window");

// Setting Paths
const appRoot = Path.resolve(__dirname, "../..");
global.pathTo = {
  images:   Path.resolve(appRoot, "app/assets/images"),
  renderer: Path.resolve(appRoot, "app/renderer"),
  root:     Path.resolve(appRoot)
}

App.on("ready", function () {
  // Once app is loaded & ready, create a mainWindow.
  // BrowserWindow loads it in a new renderer process.
  const mainWindow = new BrowserWindow({
    frame: true,
    resizable: true,
  });

  mainWindow.loadURL(`file://${pathTo.renderer}/main/index.html`);
});
