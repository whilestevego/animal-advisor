/* global Event KeyboardEvent */
import {identity, isMap, isString, isEmpty} from 'lodash'

export const keyBinds = new Map ([
  ['arrowdown', 'next-suggestion'],
  ['arrowup', 'previous-suggestion'],
  ['arrowright', 'choose-suggestion'],
  ['ctrl+c', 'clear-sentence'],
  ['escape', 'clear-sentence'],
  ['enter', 'generate-image']
  //['backspace', 'join-left']
])

export const commandBinds = (() => {
  const newMap = new Map()
  for (let [key, val] of keyBinds.entries()) {
    newMap.set(val, key)
  }

  return newMap
})()

export function onCommand (command, callback) {
  if (!isString(command)) {
    throw new TypeError(`Expected string instead got ${typeof combo}`)
  }

  if (!hasCommand(command)) {
    throw new Error(`Key combo, ${command}, is not bound`)
  }

  return document.body.addEventListener(command, callback)
}

export function getCommandEvent (keyCombo) {
  if (!isMap(window._memoiz)) {
    window._memoiz = new Map()
  }

  if (window._memoiz.has(keyCombo)) {
    return window._memoiz.get(keyCombo)
  }

  window._memoiz.set(
    keyCombo,
    new CommandEvent(keyBinds.get(keyCombo), {bubbles: true})
  )
  return getCommandEvent(keyCombo)
}

export function hasKeyCombo (keyCombo) {
  return keyBinds.has(keyCombo)
}

export function hasCommand (keyCombo) {
  return commandBinds.has(keyCombo)
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

class CommandEvent extends Event {}
