const EventedMenu = require('../../lib/evented-menu')

const template = [
  {
    label: 'Reset'
  }, {
    label: 'Save Image as...',
    accelerator: 'Command+Shift+S'
  }, {
    type: 'separator'
  }, {
    label: 'Copy',
    accelerator: 'Command+Shift+C'
  }
]

module.exports = new EventedMenu(template)
