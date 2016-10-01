/* global Notification */
import {kebabCase} from 'lodash'
// Electron Modules
import {clipboard, remote, nativeImage} from 'electron'
// React and Components
import React, {Component, PropTypes} from 'react'
import ImageMacroMenu from '../menus/animal-advice.js'

// Internal Modules
import Advice from '../../lib/advice'
import {
  getImage,
  createWriter
} from '../../lib/utils'
import {onCommand} from '../../lib/commands'

const currentWindow = remote.getCurrentWindow()

export default class AdviceAnimalMacro extends Component {
  constructor (props) {
    super(props)

    this.state = {
      width: 0,
      height: 0
    }
  }

  handleContextMenu = () => {
    ImageMacroMenu.popup(currentWindow)
  }

  saveImage = () => {
    const {canvas} = this.refs
    const image = nativeImage.createFromDataURL(canvas.toDataURL());

    clipboard.writeImage(image)
    sendNotification(canvas.toDataURL())
  }

  loadImage = url => {
    getImage(url)
      .then(image => {
        this.setState({
          height: image.height,
          width: image.width
        })

        this.writer = createWriter(this.refs.canvas, image)

        this.writer({
          top: this.props.advice.topCaption,
          bottom: this.props.advice.bottomCaption
        })
      })
  }

  componentDidMount () {
    ImageMacroMenu.on('reset', () => {})
    ImageMacroMenu.on('save-image-as', () => {})
    ImageMacroMenu.on('copy', () => {})

    onCommand('save-image', this.saveImage)
  }

  componentWillUpdate (nextProps) {
    if (nextProps.advice.imageUrl != this.props.advice.imageUrl) {
      this.loadImage(nextProps.advice.imageUrl)
    }

    if (this.writer) {
      this.writer({
        top: nextProps.advice.topCaption,
        bottom: nextProps.advice.bottomCaption
      })
    }
  }

  render () {
    return (
      <section className={kebabCase(this.constructor.name)}>
        <canvas
          width={this.state.width * 1.5}
          height={this.state.height * 1.5}
          ref='canvas'
          onContextMenu={this.handleContextMenu}>
        </canvas>
      </section>
    )
  }
}

AdviceAnimalMacro.propTypes = {
  advice: PropTypes.instanceOf(Advice)
}

AdviceAnimalMacro.defaultProps = {
  advice: new Advice()
}

function sendNotification (path) {
  const title = 'Animal Advisor'
  const options = {
    body: 'Copied advice animal to clipboard',
    icon: path
  }
  return new Notification(title, options)
}
