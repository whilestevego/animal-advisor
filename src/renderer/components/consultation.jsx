/*global Notification */
// Electron Components
import {clipboard} from 'electron'
// React and Components
import React, {Component} from 'react'
import Ask from './ask.js'
import Advice from './advice.js'

// Internal Libraries
import {generateFromSentence} from '../../lib/generator.js'

// Electron
import {remote} from 'electron'
const pathTo = remote.getGlobal('pathTo')

export default class Consultation extends Component {
  constructor (props) {
    super(props)

    this.state = {
      question: '',
      error: null,
      imagePath: '',
      isLoading: false
    }
  }

  getAdvice = (question) => {
    this.setState({isLoading: true, error: null, imagePath: ''})
    try {
      generateFromSentence(question, pathTo.cache)
        .then(path => {
          this.setState({imagePath: path, isLoading: false})
          clipboard.writeImage(path)
          sendNotification(path)
        })
        .catch(error => {
          this.setState({error, isLoading: false})
        })
    // TODO: unify error promise style
    } catch (error) {
      this.setState({error, isLoading: false})
    }
  }

  get errorMsg () {
    return this.state.error ? this.state.error.message : ''
  }

  render() {
    return (
      <section className="consultation">
        <div>{this.errorMsg}</div>
        <Ask onSubmit={this.getAdvice}/>
        <Advice
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
