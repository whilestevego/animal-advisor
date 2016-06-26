// React and Components
import React, {PropTypes, Component} from 'react'
import EditableDiv from './editable-div'
import Ico from './ico'

// Internal Libraries
import Sentence from '../../lib/sentence'

export default class DynamicPrompt extends Component {
  // EVENT HANDLERS
  renderFields () {
    const {onChange, sentence} = this.props
    let tabIndexCount = 0

    if (sentence) {
      return sentence.map(
        ({isDelimited, value}, pos) => {
          if (isDelimited) tabIndexCount += 1

          return (
            <EditableDiv
              toFocus={tabIndexCount === 1 && isDelimited}
              key={pos}
              pos={pos}
              onChange={onChange}
              active={isDelimited}
              tabIndex={tabIndexCount}>
              {value}
            </EditableDiv>
          )
        }
      )
    } else {
      return (
        <EditableDiv
          pos={1}
          onChange={onChange}
          toFocus={true}
          tabIndex={1} />
      )
    }
  }

  render () {
    return (
      <div
        className='dynamic-prompt'
        onKeyUp={this.manageKeyInput}>
        <Ico name='eye' />
        { this.renderFields() }
      </div>
    )
  }
}

DynamicPrompt.propTypes = {
  sentence: PropTypes.instanceOf(Sentence),
  onChange: PropTypes.func
}

DynamicPrompt.defaultProps = {
  sentence: Sentence.ofOne()
}
