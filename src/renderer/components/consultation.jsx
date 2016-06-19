/*global Notification */
// Electron Components
import {clipboard} from 'electron'
// React and Components
import React, {Component} from 'react'
import Ask from './ask'
import ImageMacro from './image-macro'
import Advice from '../../lib/advice'

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

  getImageMacro = (sentence) => {
    this.setState({isLoading: true, error: null, imagePath: ''})

    Advice.find(sentence)
      .then(advice => advice.generate(pathTo.cache))
      .then(imagePath => {
        this.setState({imagePath, isLoading: false})
        clipboard.writeImage(imagePath)
        sendNotification(imagePath)
      })
      .catch(error => {
        this.setState({error, isLoading: false})
      })
  }

  get errorMsg () {
    return this.state.error ? this.state.error.message : ''
  }

  render() {
    return (
      <section className="consultation">
        <div>{this.errorMsg}</div>
        <Ask onSubmit={this.getImageMacro}/>
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
