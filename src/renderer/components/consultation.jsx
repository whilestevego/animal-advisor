/*global Notification */
// Electron Modules
import {clipboard, remote} from 'electron'

// React and Components
import React, {Component} from 'react'
import DynamicPrompt from './dynamic-prompt'
import ImageMacro from './image-macro'
import Autocomplete from './autocomplete'

// Internal Libraries
import Advice from '../../lib/advice'

// Internal Libraries
import Sentence from '../../lib/sentence'

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

  getImageMacro = (event) => {
    this.setState({error: null, isLoading: true, imagePath: ''})

    Advice
      .find(event.target.value)
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

  // DYNAMIC PROMPT HANDLERS
  handleOnChange = event => {
    const {target} = event
    const pos = target.getAttribute('data-pos')
    const value = target.textContent

    this.setState({
      sentence: this.state.sentence.assocAt(pos, value)
    })
  }

  // AUTOCOMPLETE EVENT HANDLERS
  handleSuggestionSelect = (selection) => {
    this.setState({sentence: Sentence.fromTemplate(selection)})
  }

  render() {
    return (
      <section className="consultation">
        <div>{this.errorMessage}</div>
        <DynamicPrompt
          onChange={this.handleOnChange}
          sentence={this.state.sentence} />
        <Autocomplete
          query={this.state.sentence.toPlainText()}
          onSuggestionSelect={this.updateDynamicPrompt} />
        <ImageMacro
          imagePath={this.state.imagePath}
          isLoading={this.state.isLoading} />
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
