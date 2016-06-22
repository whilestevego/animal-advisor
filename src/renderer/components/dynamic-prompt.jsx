/*global Range*/
// React and Components
import React, {PropTypes} from 'react'

import _ from 'lodash'

export default function DynamicPrompt ({onSubmit, onChange, sentence}) {

  const submitOnEnter = event => {
    const {textContent} = event.currentTarget

    if (event.key === 'Enter') {
      event.preventDefault()
      if (onSubmit) onSubmit({target: {value: textContent}})
    }
  }

  const manageKeyInput = event => {
    const {textContent} = event.currentTarget

    if (!/Arrow|Enter|Esc/.test(event.key) && onChange) {
      onChange({target: {value: textContent}})
    }
  }

  // Highjack clipboard paste event to only allow text input
  const whitelistText = event => {
    event.preventDefault()

    const text = event.clipboardData.getData('text/plain')
    document.execCommand('insertHTML', false, text)
  }

  // Pre-select all `contentEditable` contents when focuses
  const selectContents = event => {
    selectNodeContents(event.target)
  }

  // Without clearing ranges, blurred `contentEditable` fields remain
  // inputable
  const clearSelectionRanges = event => {
    window.getSelection().removeAllRanges()
  }

  let dynamicField

  if (!_.isEmpty(sentence)) {
    dynamicField = splitByDelimeters(sentence).map(
      metaText => {
        if (metaText.isInside) {
          return (
            <div
              key={metaText.pos}
              className='editable'
              onBlur={clearSelectionRanges}
              onFocus={selectContents}
              onPaste={whitelistText}
              placeholder={metaText.value}
              tabIndex={metaText.pos + 1}
              contentEditable>
            </div>
          )
        } else {
          return (
            <div
              key={metaText.pos}>
              {metaText.value}
            </div>
          )
        }
      }
    )
  } else {
    dynamicField = (
      <div
        onBlur={clearSelectionRanges}
        onFocus={selectContents}
        onPaste={whitelistText}
        tabIndex={1}
        contentEditable>
      </div>
    )
  }


  return (
    <div
      className='dynamic-prompt form-control'
      onKeyDown={submitOnEnter}
      onKeyUp={manageKeyInput}>
      { dynamicField }
    </div>
  )
}

DynamicPrompt.propTypes = {
  sentence: PropTypes.string,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func
}

DynamicPrompt.defaultProps = {
  sentence: ''
}

function splitByDelimeters (templateText, options = {delimiters: [/{/, /}/]}) {
  const [open, close] = options.delimiters
  const fields = []
  let position = 0
  let reg = ''

  for (let i in templateText) {
    const c = templateText[i]

    if (open.test(c) && i > 0) {
      fields.push({pos: position, isInside: false, value: reg})
      position += 1
      reg = ''
    } else if (close.test(c)) {
      fields.push({pos: position, isInside: true, value: reg})
      position += 1
      reg = ''
    } else {
      if (!open.test(c)) reg += c
    }
  }

  if (!_.isEmpty(reg)) fields.push({pos: position, isInside: false, value: reg})

  return fields
}

function selectNodeContents (node) {
  const range = new Range()
  range.selectNodeContents(node)

  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}
