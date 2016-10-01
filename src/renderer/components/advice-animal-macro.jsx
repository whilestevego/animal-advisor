/* global Image */
// Electron Modules
import {clipboard, remote, shell} from 'electron'
import {each, omit, range, reduce} from 'lodash'

// Node Modules
import path from 'path'

// Packaged Library
import genClass from 'classnames'

// React and Components
import React, {Component, PropTypes} from 'react'
import ImageMacroMenu from '../menus/animal-advice.js'

// Internal Modules
import {copyFile} from '../../lib/utils'
import Advice from '../../lib/advice'

const {dialog} = remote
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

  componentDidMount () {
    ImageMacroMenu.on('reset', () => {})
    ImageMacroMenu.on('save-image-as', () => {})
    ImageMacroMenu.on('copy', () => {})

    getImage(this.props.imagePath)
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

  componentWillUpdate (nextProps) {
    if (this.writer) {
      this.writer({
        top: nextProps.advice.topCaption,
        bottom: nextProps.advice.bottomCaption
      })
    }
  }

  render () { 
    const cn = genClass({
      [this.constructor.name]: true
    })

    return (
      <section className={cn}>
        <canvas
          width={this.state.width}
          height={this.state.height}
          ref='canvas'
          onContextMenu={this.handleContextMenu}>
        </canvas>
      </section>
    )
  }
}

AdviceAnimalMacro.propTypes = {
  imagePath: PropTypes.string,
  advice: PropTypes.instanceOf(Advice)
}

AdviceAnimalMacro.defaultProps = {
  imagePath: 'http://i.imgur.com/yvFmCfU.jpg',
  advice: new Advice()
}

function getImage(src) {
  return new Promise ((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => {
      resolve(image)
    })

    image.addEventListener('error', error => {
      reject(error)
    })

    image.src = src
  })
}

function createWriter (cvs, image, font = 'Impact', fontSize = 100) {
  return text => {
    const ctx = cvs.getContext('2d')
    ctx.clearRect(0, 0, cvs.width, cvs.height)

    if (image) ctx.drawImage(image, 0, 0, cvs.width, cvs.height)

    caption(text.top, {textBaseline: 'top'}).draw(cvs)
    caption(text.bottom, {textBaseline: 'bottom'}).draw(cvs)
  }
}

const defaultCaptionOpts = {
  fontName: 'Impact',
  fontSize: 10,
  margin: 30,
  lineWidth: 5,
  lineJoin: 'bevel',
  textAlign: 'center',
  fillStyle: 'white',
  textBaseline: 'bottom'
}

function caption (text, options) {
  const opts = Object.assign({}, defaultCaptionOpts, options)

  return {
    draw(cvs) {
      const {height, width} = cvs
      const {fontSize, fontName, margin} = opts
      const ctx = cvs.getContext('2d')

      // Consider fontSize a percentage of Canvas height
      const fontSizeInPX = fontSize / 100 * height
      const font = `${fontSizeInPX}px ${fontName}`

      // Set style properties on drawing context
      Object.assign(ctx, omit(opts, ['margin','fontName', 'fontSize']), {font})

      const lines = splitIntoLines(text, width - margin * 2, fontName, fontSizeInPX)

      const verticalLinePos = {
        top: lineNumber => 0 + margin + lineNumber * fontSizeInPX,
        middle: lineNumber => height/2 - (lines.length * fontSizeInPX)/2 + lineNumber * fontSizeInPX + fontSizeInPX/2,
        bottom: lineNumber => height - margin - (lines.length - lineNumber - 1) * fontSizeInPX
      }

      each(lines, (line, lineNumber) => {
        ctx.strokeText(line, cvs.width/2, verticalLinePos[opts.textBaseline](lineNumber))
        ctx.fillText(line, cvs.width/2, verticalLinePos[opts.textBaseline](lineNumber))
      })
    }
  }
}

function splitIntoLines (text, width, fontName, fontSize) {
  if (width.toString() === 'NaN' || typeof width !== 'number') {
    throw new TypeError('width must be a number')
  }
  const measure = rulerFor(fontName, fontSize)
  const spaceLength = measure(' ')

  let cumulativeLength = 0
  const linesOfWords = partitionBy(text.split(' '),
    word => {
      cumulativeLength += measure(word) + spaceLength
      return Math.ceil((cumulativeLength - spaceLength) / width)
    }
  )

  return linesOfWords.map(words => words.join(' '))
}

function rulerFor (fontName, fontSize) {
  return text => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    ctx.font = `${fontSize}px ${fontName}`
    return ctx.measureText(text).width
  }
}

function showSaveImageAsDialog (sourcePath) {
  dialog.showSaveDialog(
    currentWindow,
    {title: 'Save Image as...'},
    destination => { saveImageAs(sourcePath, destination) }
  )
}

function pushInLast (arr, val) {
  if (arr.length <= 0) {
    arr.push([])
    return pushInLast(arr, val)
  }
  return arr[arr.length - 1].push(val)
}

function partitionBy (obj, fn) {
  let prevTest

  return reduce(obj, (newArr, val, key) => {
    const currentTest = fn(val)
    if (currentTest === prevTest) {
      pushInLast(newArr, val)
    } else {
      newArr.push([val])
    }
    prevTest = currentTest
    return newArr
  }, [])
}

function saveImageAs (sourcePath, destinationPath) {
  const ext = path.extname(sourcePath)
  const destinationPathWithExt = `${destinationPath}${ext}`

  copyFile(sourcePath, destinationPathWithExt).then(shell.showItemInFolder)
}
