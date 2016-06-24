// React and Components
import React, {PropTypes, Component} from 'react'
import EditableDiv from './editable-div'
import Ico from './ico'

// Packaged Libraries
import _ from 'lodash'

import {splitByDelimeters} from '../../lib/utils'

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
        <Ico name='eye' />
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
