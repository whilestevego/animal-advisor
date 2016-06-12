'use strict'

const Captain = require('node-memecaptain-api')
const Request = require('request')
const _ = require('lodash')
const fs = require('fs')
const jimp = require('jimp')
const MemeDefinitions = require('./meme-definitions.js')

function create (cachePath) {
  function say (what) {
    what = what ? what.trim() : null

    if (what) {
      let match

      let adviceAnimal = _.find(MemeDefinitions, function (value) {
        match = value.pattern.exec(what)
        return !!match
      })

      if (match) {
        _.forOwn(match, function (value, key) { adviceAnimal['$' + key] = value })
        return adviceAnimal.run(generate)
      } else {
        // TODO: Resolve as a promise
        return 'Sorry, I didn\'t understand that'
      }
    }
  }

  function generate (sourceImage, topText, bottomText) {
    console.log(`Generating ${sourceImage}`)
    return Captain.createMeme(sourceImage, topText, bottomText).then(delay(200)).then(downloadImage)
  }

  function downloadImage (response) {
    return new Promise(function (resolve, reject) {
      const url = response.request.href

      if (response.statusCode === 404) {
        console.log('404 – Not Found; Trying again...')
        resolve(Promise.resolve(url).then(getResponse))
      } else {
        const extension = /image\/(\w+)\b/.exec(response.headers['content-type'])[1]
        const filename = response.headers['meme-text'].replace(/[^A-Za-z+]/g, '').replace(/\+/g, '-')
        const location = `${cachePath}/${filename}.${extension}`
        const writeStream = fs.createWriteStream(location)

        console.log(`Downloading ${url}...`)
        Request(url).pipe(writeStream)

        writeStream.on('finish', function () {
          this.originResponse = response
          resolve(verifyImage(this))
        })

        writeStream.on('error', function (error) { reject(new Error(error)) })
      }
    })
  }

  function getResponse (url) {
    return new Promise(function (resolve, reject) {
      console.log('Getting response...')
      Request(url, function (error, response) {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(Promise.resolve(response).then(delay(200)).then(downloadImage))
        }
      })
    })
  }

  function verifyImage (writeStream) {
    return new Promise(function (resolve, reject) {
      jimp.read(writeStream.path, function (err, image) {
        if (err) {
          console.error(err)
          resolve(Promise.resolve(writeStream.originResponse).then(delay(200)).then(downloadImage))
        } else {
          resolve(writeStream.path)
        }
      })
    })
  }

  return { say }
}

// Utility

function delay (milliseconds) {
  return value => {
    return new Promise(resolve => {
      setTimeout(() => { resolve(value) }, milliseconds)
    })
  }
}

exports.create = create
