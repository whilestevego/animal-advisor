/* global Image */
import {each, omit, reduce} from 'lodash'
// Electron Modules
import {remote, shell} from 'electron'
// Node Modules
import path from 'path'
import fs from 'fs'

const {dialog} = remote
const currentWindow = remote.getCurrentWindow()

// This module contains a variety of unrelated utility functions. They should
// organized into seperate files and possibly refactored
export function copyFile (sourcePath, destinationPath) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(sourcePath)
    readStream.on('error', error => { reject(error) })

    const writeStream = fs.createWriteStream(destinationPath)
    writeStream.on('error', error => { reject(error) })
    writeStream.on(
      'close',
      exception => { exception ? reject(exception) : resolve(destinationPath) }
    )

    readStream.pipe(writeStream)
  })
}

export function savePathFromResponse (response, destinationDir) {
  const extension = /image\/(\w+)\b/.exec(response.headers['content-type'])[1]
  const filename = response.headers['meme-name'].replace(/[^A-Za-z+]/g, '').replace(/\+/g, '-')
  return `${destinationDir}/${filename}.${extension}`
}

export function timeout (promise, milliseconds) {
  return new Promise((resolve, reject) => {
    promise.then(resolve)

    Promise
      .resolve(new Error(`Timeout after ${milliseconds}ms`))
      .then(delay(milliseconds))
      .then(reject)
  })
}

export function delay (milliseconds) {
  return value => {
    return new Promise(resolve => {
      setTimeout(() => { resolve(value) }, milliseconds)
    })
  }
}

export function getImage(src) {
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

export function createWriter (cvs, image, font = 'Impact', fontSize = 100) {
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
  margin: 15,
  lineWidth: 5,
  lineJoin: 'bevel',
  textAlign: 'center',
  fillStyle: 'white',
  textBaseline: 'bottom'
}

export function caption (text, options) {
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

export function splitIntoLines (text, width, fontName, fontSize) {
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

export function rulerFor (fontName, fontSize) {
  return text => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    ctx.font = `${fontSize}px ${fontName}`
    return ctx.measureText(text).width
  }
}

export function showSaveImageAsDialog (sourcePath) {
  dialog.showSaveDialog(
    currentWindow,
    {title: 'Save Image as...'},
    destination => { saveImageAs(sourcePath, destination) }
  )
}

export function pushInLast (arr, val) {
  if (arr.length <= 0) {
    arr.push([])
    return pushInLast(arr, val)
  }
  return arr[arr.length - 1].push(val)
}

export function partitionBy (obj, fn) {
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

export function saveImageAs (sourcePath, destinationPath) {
  const ext = path.extname(sourcePath)
  const destinationPathWithExt = `${destinationPath}${ext}`

  copyFile(sourcePath, destinationPathWithExt).then(shell.showItemInFolder)
}
