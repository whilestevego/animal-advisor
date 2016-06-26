// React and Components
import React, {PropTypes, Component} from 'react'
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
      selectedIndex: null,
      results: []
    }
  }

  fetchSuggestions (query) {
    Advice
      .search(query, {limit: 10, allowBlank: false})
      .then(results => {this.setState({results, selectedIndex: 0})})
  }

  // EVENT HANDLERS
  chooseSuggestion = event => {
    const {selectedIndex, results} = this.state

    this.setState({results: [], selectedIndex: 0})

    if (this.props.onSuggestionSelect) {
      this.props.onSuggestionSelect({
        target: {
          value: results[selectedIndex].help
        }
      })
    }
  }

  handleKeyDown = event => {
    if (_(keyMaps).keys().includes(event.key)) {
      event.stopPropagation()

      let {selectedIndex, results} = this.state
      if (selectedIndex === null) selectedIndex = 0

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

  componentWillReceiveProps (nextProps) {
    this.fetchSuggestions(nextProps.query)
  }

  render () {
    return (
      <section
        className='autocomplete'
        onKeyDown={this.handleKeyDown}>
        <AutocompleteResults
          selectedIndex={this.state.selectedIndex}
          results={this.state.results} />
      </section>
    )
  }
}

Autocomplete.propTypes = {
  query: PropTypes.string,
  onSuggestionSelect: PropTypes.func
}
