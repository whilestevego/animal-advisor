// React and Components
import React, {PropTypes, Component, cloneElement} from 'react'
import AutocompleteResults from './autocomplete-results'

// Packaged Libraries
import _ from 'lodash'

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
  }

  get childProps () {
    return this.props.children.props
  }

  // Event Handlers
  updateCompletions = event => {
    const {onChange} = this.childProps
    const sentence = event.target.value

    Advice
      .search(sentence, {limit: 5, allowBlank: false})
      .then(results => {this.setState({results, selectedIndex: 0})})

    // Keep "bubbling" child onChange event to parent component
    if (onChange) onChange(event)
  }

  chooseSuggestion = event => {
    const {onSubmit} = this.childProps

    // While results suggestions are up, prevent *Enter* key from triggering 
    // onSubmit
    if (_.isEmpty(this.state.results) && onSubmit) {
      // Keep "bubbling" to child onChange to parent if results is clear
      onSubmit(event)
    } else {
      const {selectedIndex, results} = this.state

      this.setState({results: [], selectedIndex: 0})

      if (this.props.onSuggestionChoice) {
        this.props.onSuggestionChoice({
          target: {
            value: results[selectedIndex].help
          }
        })
      }
    }
  }

  handleKeyDown = event => {
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
      {
        onChange: this.updateCompletions,
        onSubmit: this.chooseSuggestion
      }
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
  onSuggestionChoice: PropTypes.func,
  children: PropTypes.element.isRequired,
  results: PropTypes.array
}

Autocomplete.defaultProps = {
  results: []
}
