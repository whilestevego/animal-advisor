// React and Components
import React, {PropTypes} from 'react'

// Packaged Library
import genClass from 'classnames'
import {random} from 'lodash'

const stages = new Map([
  [0, {r: '2.75', filter: 'url(#gb0)'}],
  [1, {r: '2', filter: 'url(#gb1)'}],
  [2, {r: '1.25', filter: 'url(#gb2)'}],
  [3, {r: '0.75', filter: 'url(#gb3)'}]
])

export default function Star ({depth, pos}) {
  const cn = genClass({
    'star': true
  })

  const style = {
    animation: `${Math.pow((depth + 1), 1.5)}s linear ${random(5, true)}s infinite StarStreak`
  }

  return (
    <circle
      style={style}
      className={cn}
      cx={pos.x}
      cy={pos.y}
      {...stages.get(depth)}
      fill='White' />
  )
}

Star.propTypes = {
}
