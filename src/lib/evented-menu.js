const {Menu} = require('electron').remote
const _ = require('lodash')

class EventedMenu {
  constructor (template) {
    this._events = {}
    this.template = template

    _.each(this.template, menuItem => {
      menuItem.click = this._dispatch(_.kebabCase(menuItem.label))
    })

    this._dispatch = this._dispatch.bind(this)
  }

  _dispatch (eventName) {
    return () => {
      const eventHandler = this._events[eventName]

      if (_.isFunction(eventHandler)) {
        eventHandler()
      } else {
        throw new TypeError(`${eventName} is not a function`)
      }
    }
  }

  get menu () {
    if (this._menu) return this._menu

    this._menu = Menu.buildFromTemplate(this.template)
    return this._menu
  }

  on (eventName, callback) {
    this._events[eventName] = callback
  }
}

module.exports = EventedMenu
