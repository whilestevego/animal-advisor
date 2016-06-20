// React and Components
import React, {PropTypes, Component, cloneElement} from 'react'

import _ from 'lodash'
import classnames from 'classnames'

// Internal Libraries
import Advice from '../../lib/advice'

const keyMaps = {
  'ArrowDown': index => index + 1,
  'ArrowUp': index => index - 1
}

// TODO: Autocomplete represents a generic component, yet this component will 
// currently only function with Advice style data. Do something about this!
export default class Autocomplete extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedIndex: 0,
      results: props.results
    }
    this.updateCompletions = this.updateCompletions.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  get childProps () {
    return this.props.children.props
  }

  // Event Handlers
  updateCompletions (event) {
    const {onChange} = this.childProps
    const sentence = event.target.value

    Advice
      .search(sentence, {limit: 5, allowBlank: false})
      .then(results => {this.setState({results, selectedIndex: 0})})

    // Keep "bubbling" child onChange event to parent component
    if (onChange) onChange(event)
  }

  handleKeyDown (event) {
    event.stopPropagation()

    if (_(keyMaps).keys().includes(event.key)) {
      const {selectedIndex, results} = this.state

      this.setState({
        // *clamp* keeps index inside result bounds
        selectedIndex: _.clamp(
          keyMaps[event.key](selectedIndex),
          0,
          results.length - 1
        )
      })
    }
  }

  render () {
    const child = cloneElement(
      this.props.children,
      {onChange: this.updateCompletions}
    )

    return (
      <div className='autocomplete' onKeyDown={this.handleKeyDown}>
        {child}
        <AutocompleteResults
          selectedIndex={this.state.selectedIndex}
          results={this.state.results} />
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

function AutocompleteResults ({results, selectedIndex}) {
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

function AutocompleteResult ({name, help, pattern, url, isSelected}) {
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
