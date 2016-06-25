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

const pathTo = remote.getGlobal('pathTo')

export default class Consultation extends Component {
  constructor (props) {
    super(props)

    this.state = {
      sentence: '',
      error: null,
      imagePath: '',
      isLoading: false
    }
  }

  getImageMacro = (event) => {
    this.setState({isLoading: true, error: null, imagePath: ''})

    Advice
      .find(event.target.value)
      .then(advice => advice.generate(pathTo.cache))
      .then(imagePath => {
        this.setState({imagePath, sentence: null, isLoading: false})
        clipboard.writeImage(imagePath)
        sendNotification(imagePath)
      })
      .catch(error => {
        this.setState({error, isLoading: false})
      })
  }

  updateDynamicPrompt = (event) => {
    this.setState({sentence: event.target.value})
  }

  get errorMsg () {
    return this.state.error ? this.state.error.message : ''
  }

  render() {
    return (
      <section className="consultation">
        <div>{this.errorMsg}</div>
        <Autocomplete onSuggestionChoice={this.updateDynamicPrompt}>
          <DynamicPrompt
            onSubmit={this.getImageMacro}
            sentence={this.state.sentence} />
        </Autocomplete>
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
