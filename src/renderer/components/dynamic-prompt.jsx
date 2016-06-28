// React and Components
import React, {PropTypes} from 'react'
import EditableDiv from './editable-div'
import Ico from './ico'

// Internal Libraries
import Sentence from '../../lib/sentence'

export default function DynamicPrompt (props) {
  const renderFields = () => {
    const {onChange, sentence} = props
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
            active={isDelimited}
            tabIndex={tabIndexCount}>
            {value}
          </EditableDiv>
        )
      }
    )
  }

  return (
    <div className='dynamic-prompt'>
      <Ico name='eye' />
      { renderFields() }
    </div>
  )
}

DynamicPrompt.propTypes = {
  sentence: PropTypes.instanceOf(Sentence),
  onChange: PropTypes.func
}

DynamicPrompt.defaultProps = {
  sentence: Sentence.ofOne()
}
