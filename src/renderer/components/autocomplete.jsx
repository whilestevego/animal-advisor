// React and Components
import React, {PropTypes, Component, cloneElement} from 'react'

import _ from 'lodash'

// Internal Libraries
import Advice from '../../lib/advice'

export default class Autocomplete extends Component {
  constructor (props) {
    super(props)

    this.state = {results: props.results}
    this.updateCompletions = this.updateCompletions.bind(this)
  }

  get childProps () {
    return this.props.children.props
  }

  updateCompletions (event) {
    const {onChange} = this.childProps
    const sentence = event.target.value

    Advice
      .search(sentence, {limit: 5, allowBlank: false})
      .then(results => {this.setState({results})})

    if (onChange) onChange(event)
  }

  render () {
    const child = cloneElement(
      this.props.children,
      {onChange: this.updateCompletions}
    )

    return (
      <div className="autocomplete">
        {child}
        <AutocompleteResults results={this.state.results} />
      </div>
    )
  }
}

Autocomplete.propTypes = {
  // Verify that children contains only one
  children: PropTypes.element.isRequired,
  results: PropTypes.array
}

Autocomplete.defaultProps = {
  results: []
}

function AutocompleteResults ({results}) {
  let style = {}
  if (_.isEmpty(results)) { style.display = 'none' }

  return (
    <ul className="autocomplete-results list-group" style={style}>
      {
        results.map(
          (result, i) => (
            <li className="list-group-item" key={i}>
              <div><strong>{result.name}</strong></div>
              <div>{result.help}</div>
            </li>
            )
        )
      }
    </ul>
  )
}

AutocompleteResults.propTypes = {
  results: PropTypes.array.isRequired
}
