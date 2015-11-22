"use strict";

const _             = require("lodash");
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

  const appName = _.startCase(App.getName());
  const applicationMenuConfig = [
    {
      label: appName,
      submenu: [
        {
          label: `About ${appName}`,
          role: "about"
        }, {
          type: "separator"
        }, {
          label: "Services",
          role: "services",
          submenu: []
        }, {
          label: "Toggle DevTools",
          accelerator: "Alt+Command+I",
          click: function() {
            mainWindow.show();
            mainWindow.toggleDevTools();
          }
        }, {
          type: "separator"
        }, {
          label: `Hide ${appName}`,
          accelerator: "Command+H",
          role: "hide"
        }, {
          label: "Show All",
          role: "unhide"
        }, {
          type: "separator"
        }, {
          label: "Quit",
          accelerator: "Command+Q",
          click: function() { App.quit(); }
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
  ];

  const applicationMenu = Menu.buildFromTemplate(applicationMenuConfig);
  Menu.setApplicationMenu(applicationMenu);

  const menuConfig = [ {
    label: "Show All",
    role: "unhide"
  }, {
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
