import Captain from 'node-memecaptain-api'
import jimp from 'jimp'
import {savePathFromResponse, timeout, delay} from './utils'

export function generate (memeCaptainParams, destinationDir) {
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
        console.warn(error)

        resolve(Promise.resolve(sourceUrl).then(delay(200)).then(verify))
      })
    })
  }

  function save (destination) {
    return image => {
      return new Promise((resolve, reject) => {
        image.write(destination, (error, image) => {
          if (error) reject(new Error(error))

          console.info('Image saved!')
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
