// React and Components
import React, {Component} from 'react'
import DynamicPrompt from './dynamic-prompt'
import AdviceAnimalMacro from './advice-animal-macro'
import Autocomplete from './autocomplete'
import Starfield from './starfield'

// Internal Libraries
import Advice from '../../lib/advice'
import Sentence from '../../lib/sentence'
import {
  onCommand,
  getCommandEvent,
  hasKeyCombo,
  toKeyCombo
} from '../../lib/commands'

export default class Consultation extends Component {
  constructor (props) {
    super(props)

    this.state = {
      advice: new Advice(),
      sentence: Sentence.ofOne(),
      error: null,
      imagePath: '',
      isLoading: false
    }
  }

  get errorMessage () {
    return this.state.error ? this.state.error.message : ''
  }

  hasSuggestion = () => {
    return this.state.sentence.hasUneditables()
  }

  // DYNAMIC PROMPT HANDLERS
  handleOnChange = event => {
    const {target} = event
    const pos = target.getAttribute('data-pos')
    const value = target.textContent

    this.setState({
      sentence: this.state.sentence.assocAt(pos, value),
      advice: Advice.find(this.state.sentence.toPlainText())
    })
  }

  resetMacro = () => {
    this.setState({
      sentence: Sentence.ofOne(),
      advice: new Advice(),
      error: null
    })
  }

  // AUTOCOMPLETE EVENT HANDLERS
  fillPrompt = selection => {
    this.setState({sentence: Sentence.fromTemplate(selection.help)})
  }

  handleGlobalKeyDown = event => {
    if (hasKeyCombo(toKeyCombo(event))) {
      event.preventDefault()
      event.stopPropagation()

      event.target.dispatchEvent(getCommandEvent(toKeyCombo(event)))
    }
  }

  // THE CYCLE OF LIFE
  componentDidMount () {
    document.body.addEventListener('keydown', this.handleGlobalKeyDown)

    onCommand('reset-macro', this.resetMacro)
  }

  componentWillUnmount () {
    document.body.removeEventListener('keydown', this.handleGlobalKeyDown)
  }

  render() {
    let query = ''
    if (!this.hasSuggestion()) {
      query = this.state.sentence.toPlainText()
    }

    return (
      <section className="consultation">
        <div>{this.errorMessage}</div>
        <DynamicPrompt
          disabled={this.state.isLoading}
          onChange={this.handleOnChange}
          sentence={this.state.sentence} />
        <Autocomplete
          query={query}
          onSuggestionSelect={this.fillPrompt} />
        <AdviceAnimalMacro advice={this.state.advice} />
        <Starfield />
      </section>
    )
  }
}
