// React and Components
import React, {PropTypes, Component} from 'react'
import AutocompleteResults from './autocomplete-results'

// External Libraries
import {clamp, isFunction} from 'lodash'

// Internal Libraries
import Advice from '../../lib/advice'
import {onCommand} from '../../lib/commands'

// TODO: Autocomplete represents a generic component, yet this component will 
// currently only function with Advice style data. Do something about this!
export default class Autocomplete extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectionIndex: 0,
      results: []
    }
  }

  fetchSuggestions (query) {
    Advice
      .search(query, {limit: 10, allowBlank: false})
      .then(results => {this.setState({results, selectedIndex: 0})})
  }

  // EVENT HANDLERS
  componentWillReceiveProps (nextProps) {
    const {query} = this.state

    if (query !== nextProps.query) {
      this.fetchSuggestions(nextProps.query)
    }
  }

  incrementIndex = event => {
    const {results, selectionIndex} = this.state
    this.setState({
      selectionIndex: clamp(selectionIndex + 1, 0, results.length - 1)
    })
  }

  decrementIndex = event => {
    const {results, selectionIndex} = this.state
    this.setState({
      selectionIndex: clamp(selectionIndex - 1, 0, results.length - 1)
    })
  }

  chooseSuggestion = event => {
    const {results, selectionIndex} = this.state
    const {onSuggestionSelect} = this.props

    if (isFunction(onSuggestionSelect)) {
      this.setState({selectionIndex: 0, results: []})
      this.props.onSuggestionSelect(results[selectionIndex])
    }
  }

  // THE CYCLE OF LIFE
  componentDidMount () {
    onCommand('next-suggestion', this.incrementIndex)
    onCommand('previous-suggestion', this.decrementIndex)
    onCommand('choose-suggestion', this.chooseSuggestion)
  }

  render () {
    return (
      <section className='autocomplete'>
        <AutocompleteResults
          selectionIndex={this.state.selectionIndex}
          results={this.state.results} />
      </section>
    )
  }
}

Autocomplete.propTypes = {
  query: PropTypes.string,
  selectionIndex: PropTypes.number,
  onSuggestionSelect: PropTypes.func
}
