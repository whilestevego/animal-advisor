/*global Notification */
// Electron Modules
import {clipboard, remote} from 'electron'

// React and Components
import React, {Component} from 'react'
import DynamicPrompt from './dynamic-prompt'
import ImageMacro from './image-macro'
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

const pathTo = remote.getGlobal('pathTo')

export default class Consultation extends Component {
  constructor (props) {
    super(props)

    this.state = {
      sentence: Sentence.ofOne(),
      error: null,
      imagePath: '',
      isLoading: false
    }
  }

  get errorMessage () {
    return this.state.error ? this.state.error.message : ''
  }

  getImageMacro = () => {
    this.setState({error: null, isLoading: true, imagePath: ''})

    Advice
      .find(this.state.sentence.toPlainText())
      .then(advice => advice.generate(pathTo.cache))
      .then(imagePath => {
        this.setState({
          imagePath,
          sentence: Sentence.ofOne(),
          isLoading: false
        })

        clipboard.writeImage(imagePath)
        sendNotification(imagePath)
      })
      .catch(error => {
        this.setState({
          error,
          sentence: Sentence.ofOne(),
          isLoading: false
        })
      })
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
      sentence: this.state.sentence.assocAt(pos, value)
    })
  }

  clearSentence = () => {
    this.setState({
      sentence: Sentence.ofOne(),
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

    onCommand('generate-image', this.getImageMacro)
    onCommand('clear-sentence', this.clearSentence)
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
          onChange={this.handleOnChange}
          sentence={this.state.sentence} />
        <Autocomplete
          query={query}
          onSuggestionSelect={this.fillPrompt} />
        <ImageMacro
          imagePath={this.state.imagePath}
          isLoading={this.state.isLoading} />
        <Starfield />
      </section>
    )
  }
}

function sendNotification (path) {
  const title = 'Animal Advisor'
  const options = {
    body: 'Copied advice animal to clipboard',
    icon: path
  }
  return new Notification(title, options)
}
