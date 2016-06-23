import fs from 'fs'

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

export function stripResource (path) {
  return path.replace(/^.+:\//, '')
}

export function savePathFromResponse (response, destinationDir) {
  const extension = /image\/(\w+)\b/.exec(response.headers['content-type'])[1]
  const filename = response.headers['meme-text'].replace(/[^A-Za-z+]/g, '').replace(/\+/g, '-')
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

export function splitByDelimeters (templateText, options = {delimiters: ['{', '}']}) {
  const [open, close] = options.delimiters.map(del => RegExp(del))
  const fields = []
  let position = 0
  let reg = ''

  for (let i in templateText) {
    const c = templateText[i]

    if (open.test(c) && i > 0) {
      fields.push({pos: position, isInside: false, value: reg})
      position += 1
      reg = ''
    } else if (close.test(c)) {
      fields.push({pos: position, isInside: true, value: reg})
      position += 1
      reg = ''
    } else {
      if (!open.test(c)) reg += c
    }
  }

  if (!_.isEmpty(reg)) fields.push({pos: position, isInside: false, value: reg})

  return fields
}
