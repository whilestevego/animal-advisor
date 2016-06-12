'use strict'

const Captain = require('node-memecaptain-api')
const jimp = require('jimp')
const MemeDefinition = require('./meme-definition.js')

function generateFromSentence (sentence, destinationDir) {
  return generate(
    MemeDefinition.find(sentence).toMemeCaptainParams(),
    destinationDir
  )
}

function generate (memeCaptainParams, destinationDir) {
  return new Promise((resolve, reject) => {
    timeout(Promise.resolve(Captain.createMeme(...memeCaptainParams)), 20000)
      .then(delay(200))
      .then(downloadImage(destinationDir))
      .then(destination => { resolve(destination) })
      .catch(reject)
  })
}

function downloadImage (destinationDir) {
  function verify (sourceUrl) {
    return new Promise((resolve, reject) => {
      jimp.read(sourceUrl).then(image => {
        resolve(image)
      }).catch(error => {
        console.error(error)

        resolve(Promise.resolve(sourceUrl).then(delay(200)).then(verify))
      })
    })
  }

  function save (destination) {
    return image => {
      return new Promise((resolve, reject) => {
        image.write(destination, (error, image) => {
          if (error) reject(new Error(error))

          console.log('Image saved!')
          resolve(image)
        })
      })
    }
  }

  return response => {
    return new Promise(function (resolve, reject) {
      const url = response.request.href
      const destination = savePathFromResponse(response, destinationDir)

      verify(url)
        .then(save(destination))
        .then(() => { resolve(destination) })
    })
  }
}

// Utility
function savePathFromResponse (response, destinationDir) {
  const extension = /image\/(\w+)\b/.exec(response.headers['content-type'])[1]
  const filename = response.headers['meme-text'].replace(/[^A-Za-z+]/g, '').replace(/\+/g, '-')
  return `${destinationDir}/${filename}.${extension}`
}

function timeout (promise, milliseconds) {
  return new Promise((resolve, reject) => {
    promise.then(resolve)

    Promise
      .resolve(new Error(`Timeout after ${milliseconds}ms`))
      .then(delay(milliseconds))
      .then(reject)
  })
}

function delay (milliseconds) {
  return value => {
    return new Promise(resolve => {
      setTimeout(() => { resolve(value) }, milliseconds)
    })
  }
}

module.exports.generateFromSentence = generateFromSentence
