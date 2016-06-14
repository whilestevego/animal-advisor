import EventedMenu from '../../lib/evented-menu'

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

export default new EventedMenu(template)
