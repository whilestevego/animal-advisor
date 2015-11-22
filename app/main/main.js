"use strict";

const App           = require("app");
const BrowserWindow = require("browser-window");
const Path          = require("path");
const Tray          = require("tray");
const Menu          = require("menu");

// Set Paths
const appRoot = Path.resolve(__dirname, "../..");
global.pathTo = {
  images:   Path.resolve(appRoot, "app/assets/images"),
  cache:    Path.resolve(appRoot, "cache"),
  lib:      Path.resolve(appRoot, "lib"),
  renderer: Path.resolve(appRoot, "app/renderer"),
  root:     Path.resolve(appRoot)
}
const trayIconPath = `${pathTo.images}/tray.png`;

App.on("ready", function () {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    frame: true,
    resizable: false
  });
  mainWindow.loadURL(`file://${pathTo.renderer}/main/index.html`);

  const menuConfig = [ {
    label: "Toggle DevTools",
    accelerator: "Alt+Command+I",
    click: function() {
      mainWindow.show();
      mainWindow.toggleDevTools();
    }
  }, {
    label: "Quit",
    accelerator: "Command+Q",
    selector: "terminate:"
  } ];
  const contextMenu = Menu.buildFromTemplate(menuConfig);

  const trayIcon = new Tray(trayIconPath);
  trayIcon.setToolTip("Animal Advisor");
  trayIcon.setContextMenu(contextMenu);
});
