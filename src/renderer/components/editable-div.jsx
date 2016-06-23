/*global Range*/
// React and Components
import React, {PropTypes, Component} from 'react'

// Packaged Library
import classnames from 'classnames'

export default class EditableDiv extends Component {
  constructor (props) {
    super(props)
  }

  // EVENT HANDLERS
  // Highjack clipboard paste event to only allow text input
  // (May not be necessary)
  whitelistText = event => {
    event.preventDefault()

    const text = event.clipboardData.getData('text/plain')
    document.execCommand('insertHTML', false, text)
  }

  // Pre-select all `contentEditable` contents when focused
  selectEditableContents = event => {
    selectNodeContents(event.target)
  }

  // Without clearing ranges, blurred `contentEditable` fields remain
  // inputable
  clearSelectionRanges = event => {
    window.getSelection().removeAllRanges()
  }

  // LIFECYCLE CONTROL
  componentDidMount () {
    if (this.props.toFocus === true) {
      this.refs.base.focus()
    }
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const {children, active, tabIndex, ...restProps} = this.props
    const {clearSelectionRanges, selectEditableContents, whitelistText} = this

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
        ref='base'
        className={cn}
        {...activeProps}
        {...restProps}>
        { !active ? children : null }
      </div>
    )
  }
}

EditableDiv.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.string,
  tabIndex: PropTypes.number,
  toFocus: PropTypes.bool,
  onExpand: PropTypes.func
}

EditableDiv.defaultProps = {
  active: true
}

function selectNodeContents (node) {
  const range = new Range()
  range.selectNodeContents(node)

  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}
