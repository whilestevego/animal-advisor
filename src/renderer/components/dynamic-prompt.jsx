// React and Components
import React, {PropTypes} from 'react'
import EditableDiv from './editable-div'
import Ico from './ico'

// Packaged Libraries
import genClass from 'classnames'

// Internal Libraries
import Sentence from '../../lib/sentence'

export default function DynamicPrompt (props) {
  const renderFields = () => {
    const {disabled, onChange, sentence} = props

    let tabIndexCount = 0
    return sentence.map(
      ({_id, isDelimited, value}, pos) => {
        if (isDelimited) tabIndexCount += 1

        return (
          <EditableDiv
            toFocus={tabIndexCount === 1 && isDelimited}
            key={_id}
            pos={pos}
            onChange={onChange}
            active={!disabled && isDelimited}
            tabIndex={tabIndexCount}>
            {value}
          </EditableDiv>
        )
      }
    )
  }

  const cn = genClass({
    'dynamic-prompt': true,
    'disabled': props.disabled
  })

  return (
    <div className={cn}>
      <Ico name='rocket' />
      <div className='dynamic-prompt-fields'>
        { renderFields() }
      </div>
    </div>
  )
}

DynamicPrompt.propTypes = {
  sentence: PropTypes.instanceOf(Sentence),
  onChange: PropTypes.func,
  disabled: PropTypes.bool
}

DynamicPrompt.defaultProps = {
  sentence: Sentence.ofOne(),
  disabled: false
}
