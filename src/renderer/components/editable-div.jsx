/*global Range*/
// React and Components
import React, {PropTypes} from 'react'

// Packaged Library
import classnames from 'classnames'

export default function EditableDiv (props = {active: true}) {
  const {children, active, tabIndex, ...restProps} = props

  // EVENT HANDLERS
  // Highjack clipboard paste event to only allow text input
  const whitelistText = event => {
    event.preventDefault()

    const text = event.clipboardData.getData('text/plain')
    document.execCommand('insertHTML', false, text)
  }

  // Pre-select all `contentEditable` contents when focused
  const selectEditableContents = event => {
    selectNodeContents(event.target)
  }

  // Without clearing ranges, blurred `contentEditable` fields remain
  // inputable
  const clearSelectionRanges = event => {
    window.getSelection().removeAllRanges()
  }

  let activeProps = {}
  if (active) {
    activeProps = {
      onBlur: clearSelectionRanges,
      onFocus: selectEditableContents,
      onPaste: whitelistText,
      tabIndex: tabIndex || 1,
      contentEditable: true,
      placeholder: children
    }
  }

  const cn = classnames({
    'editable-div': true,
    'active': active
  })

  return (
    <div
      className={cn}
      {...activeProps}
      {...restProps}>
      { !active ? children : null }
    </div>
  )
}

EditableDiv.propTypes = {
  children: PropTypes.string,
  active: PropTypes.bool,
  tabIndex: PropTypes.number
}

function selectNodeContents (node) {
  const range = new Range()
  range.selectNodeContents(node)

  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}
