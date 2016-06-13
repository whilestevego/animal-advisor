const { Menu } = require('electron')

function createTrayMenu (win) {
  const template = [
    {
      label: 'Show All',
      role: 'unhide'
    }, {
      label: 'Toggle DevTools',
      accelerator: 'Alt+Command+I',
      click () {
        win.show()
        win.toggleDevTools()
      }
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      selector: 'terminate:'
    }
  ]

  return Menu.buildFromTemplate(template)
}

module.exports = {createTrayMenu}
