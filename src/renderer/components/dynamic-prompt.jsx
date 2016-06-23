// React and Components
import React, {PropTypes, Component} from 'react'
import EditableDiv from './editable-div'

// Packaged Libraries
import _ from 'lodash'

export default class DynamicPrompt extends Component {
  constructor (props) {
    super(props)

    this.state = {sentence: props.sentence}
  }

  clear = () => {
    this.setState({sentence: ''})
    this.forceUpdate(
      () => { this.props.onChange({target: {value: ''}})}
    )
  }

  // EVENT HANDLERS
  submitOnEnter = event => {
    const {onSubmit} = this.props
    const {textContent} = event.currentTarget

    if (event.key === 'Enter') {
      event.preventDefault()

      if (onSubmit) onSubmit({target: {value: textContent}})
    }
  }

  manageKeyInput = event => {
    const {onChange} = this.props
    const {textContent} = event.currentTarget
    const {key, ctrlKey} = event

    if (/Esc/.test(key) || (ctrlKey && /c/.test(key))) {
      this.clear()
    } else if (!/Arrow|Enter/.test(key) && onChange) {
      onChange({target: {value: textContent}})
    }
  }

  // SUB-RENDER
  renderDynamicField () {
    const {sentence} = this.state
    let tabIndexCount = 0

    if (!_.isEmpty(sentence)) {
      return splitByDelimeters(sentence).map(
        ({isInside, pos, value}) => {
          if (isInside) tabIndexCount += 1

          return (
            <EditableDiv
              toFocus={tabIndexCount == 1}
              key={pos}
              active={isInside}
              tabIndex={tabIndexCount}>
              {value}
            </EditableDiv>
          )
        }
      )
    } else {
      return (
        <EditableDiv
          toFocus={true}
          tabIndex={1} />
      )
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({sentence: nextProps.sentence})
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.sentence === this.props.sentence) {
      return false
    }
    return true
  }

  render () {
    return (
      <div
        className='dynamic-prompt form-control'
        onKeyDown={this.submitOnEnter}
        onKeyUp={this.manageKeyInput}>
        { this.renderDynamicField() }
      </div>
    )
  }
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
