// React and Components
import React, {PropTypes} from 'react'

// Packaged Library
import classnames from 'classnames'

export default function AutocompleteResult ({
  name, help, pattern, url, isSelected
}) {
  const cn = classnames({
    'autocomplete-result': true,
    'list-group-item': true,
    'selected': isSelected
  })

  return (
    <li className={cn}>
      <div><strong>{name}</strong></div>
      <div>{help}</div>
    </li>
  )
}

AutocompleteResult.propTypes = {
  name: PropTypes.string,
  help: PropTypes.string,
  pattern: PropTypes.object,
  url: PropTypes.string,
  isSelected: PropTypes.bool
}

AutocompleteResult.defaultProps = {
  isSelected: false
}
