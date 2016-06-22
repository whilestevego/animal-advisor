// React and Components
import React, {PropTypes} from 'react'
import AutocompleteResult from './autocomplete-result'

// Packaged Library
import _ from 'lodash'

export default function AutocompleteResults ({results, selectedIndex}) {
  let style = {}
  if (_.isEmpty(results)) { style.display = 'none' }

  if (!_.isEmpty(results) &&
      !_.inRange(selectedIndex, 0, results.length)) {
    throw new Error('selectedIndex is out of bounds')
  }

  return (
    <ul className='autocomplete-results list-group' style={style}>
      {
        results.map((result, i) => (
          <AutocompleteResult
            key={i}
            isSelected={selectedIndex == i}
            {...result} />
          ))
      }
    </ul>
  )
}

AutocompleteResults.propTypes = {
  results: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number
}
