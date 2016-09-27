// React and Components
import React, {Component} from 'react'
import Star from './star'

// Packaged Library
import genClass from 'classnames'
import _, {range, random} from 'lodash'

export default class Starfield extends Component {
  shouldComponentUpdate () {
    return false
  }

  render () {
    const cn = genClass({
      'starfield': true
    })

    // TODO: Do not animate forever
    // Create a new star at a new position everytime 
    // a star reaches the end of the screen
    const renderStars = () => {
      return _(range(50))
        .map(() => random(100))
        .map((pos, index) => {
          return (
            <Star
              key={index}
              pos={{x: `${pos}vw`, y: '-2vh'}}
              depth={random(3)} />
          )
        }).value()
    }

    return (
      <section className={cn}>
        <svg
          height='100%'
          width='100%'
          xmlns='http://www.w3.org/2000/svg'>

          <DefGaussianBlur id='gb0' stdDeviation='0.4' />
          <DefGaussianBlur id='gb1' stdDeviation='0.5' />
          <DefGaussianBlur id='gb2' stdDeviation='0.7' />
          <DefGaussianBlur id='gb3' stdDeviation='0' />

          { renderStars() }
        </svg>
      </section>
    )
  }
}

function DefGaussianBlur ({id, stdDeviation}) {
  return (
    <defs>
      <filter id={id}>
        <feGaussianBlur
          in='SourceGraphic'
          stdDeviation={stdDeviation} />
      </filter>
    </defs>
  )
}
