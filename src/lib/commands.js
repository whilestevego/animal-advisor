/* global Event KeyboardEvent */
import {identity, isMap, isEmpty} from 'lodash'

export const keyBindings = new Map ([
  ['arrowdown', 'next-suggestion'],
  ['arrowup', 'previous-suggestion'],
  ['arrowright', 'choose-suggestion'],
  ['ctrl+c', 'clear-sentence'],
  ['esc', 'clear-sentence'],
  ['backspace', 'join-left']
])

export function getEvent (keyCombo) {
  if (!isMap(window._memoiz)) {
    window._memoiz = new Map()
  }

  if (window._memoiz.has(keyCombo)) {
    return window._memoiz.get(keyCombo)
  }

  window._memoiz.set(
    keyCombo,
    new Event(keyBindings.get(keyCombo), {bubbles: true})
  )
  return getEvent(keyCombo)
}

export function hasKeyCombo (keyCombo) {
  return keyBindings.has(keyCombo)
}

export function toKeyCombo (keyboardEvent) {
  if (!keyboardEvent instanceof KeyboardEvent) {
    throw new TypeError(`Expected Event instead got ${typeof keyboardEvent}`)
  }

  const {key} = keyboardEvent
  const prefix = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey']
    .map(
      val => {
        if (keyboardEvent[val] === true) {
          return val.slice(0, -3)
        }
        return null
      })
    .filter(identity)
    .join('+')

  return (isEmpty(prefix) ? '' : `${prefix}+`) + key.toLowerCase()
}
