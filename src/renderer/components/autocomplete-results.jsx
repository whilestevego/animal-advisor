// React and Components
import React, {PropTypes} from 'react'
import AutocompleteResult from './autocomplete-result'

// Packaged Library
import _ from 'lodash'

export default function AutocompleteResults ({results, selectionIndex}) {
  let style = {}
  if (_.isEmpty(results)) { style.display = 'none' }

  if (!_.isEmpty(results) &&
      !_.inRange(selectionIndex, 0, results.length)) {
    throw new Error('selectionIndex is out of bounds')
  }

  return (
    <ul className='autocomplete-results list-group' style={style}>
      {
        results.map((result, i) => (
          <AutocompleteResult
            key={i}
            isSelected={selectionIndex == i}
            {...result} />
          ))
      }
    </ul>
  )
}

AutocompleteResults.propTypes = {
  results: PropTypes.array.isRequired,
  selectionIndex: PropTypes.number
}
