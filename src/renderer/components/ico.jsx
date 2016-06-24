// React and Components
import React, {PropTypes} from 'react'

// Packaged Library
import genClass from 'classnames'

// Internal Module
import icoNames from '../../constants/ico-names'

export default function Ico (props) {
  const {name, classNames, ...restProps} = props
  const cn = genClass([
    'icon', `icon-${name}`, ...classNames.split(' ')
  ])

  return <span className={cn} {...restProps}></span>
}

Ico.propTypes = {
  classNames: PropTypes.string,
  name: PropTypes.oneOf(icoNames)
}

Ico.defaultProps = {
  classNames: ''
}
