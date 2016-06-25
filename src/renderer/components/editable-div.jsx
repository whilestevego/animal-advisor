/*global Range*/
// React and Components
import React, {PropTypes, Component} from 'react'

// Packaged Libraries
import genClass from 'classnames'

export default class EditableDiv extends Component {
  constructor (props) {
    super(props)
  }

  focusSelf = () => {
    const {toFocus, active} = this.props
    if (toFocus === true && active === true) {
      this.refs.base.focus()
    }
  }

  // EVENT HANDLERS
  // Pre-select all `contentEditable` contents when focused
  selectEditableContents = event => {
    selectNodeContents(event.target)
  }

  // Without clearing ranges, blurred `contentEditable` fields remain
  // inputable
  clearSelectionRanges = event => {
    window.getSelection().removeAllRanges()
  }

  preventNewLine = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  // LIFECYCLE EVENTS
  componentDidMount () {
    this.focusSelf()
  }

  componentDidUpdate () {
    this.focusSelf()
  }

  render () {
    const {children, active, tabIndex, ...restProps} = this.props
    const {
      clearSelectionRanges,
      selectEditableContents,
      preventNewLine
    } = this

    let activeProps = {}
    if (active) {
      activeProps = {
        onBlur: clearSelectionRanges,
        onFocus: selectEditableContents,
        onKeyDown: preventNewLine,
        tabIndex: tabIndex || 1,
        contentEditable: true,
        placeholder: children
      }
    }

    const cn = genClass({
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
