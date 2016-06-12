/*global Notification */
'use strict'

// Node Modules
const FS = require('fs')
const Path = require('path')

// Electron Modules
const {clipboard, shell, remote} = require('electron')
const {Menu, dialog} = remote

const pathTo = remote.getGlobal('pathTo')
const {generateFromSentence} = require(`${pathTo.lib}/animal-advisor`)

const currentWindow = remote.getCurrentWindow()
const searchQueryInput = document.querySelector('#search-query')
const adviceAnimalImg = document.querySelector('#advice-animal')

searchQueryInput.addEventListener('input', function (event) {
  global.adviceAnimalQuestion = event.target.value
})

searchQueryInput.addEventListener('keydown', function (event) {
  if (event.keyCode === 13) {
    loading()
    try {
      generateFromSentence(global.adviceAnimalQuestion, pathTo.cache)
        .then(setImage)
        .catch(error => {
          console.error(error)
          resetLogo()
        })
    // TODO: unify error promise style
    } catch (error) {
      // Like, meme not found
      // TODO: notify user
      console.warn(error)
      resetLogo()
    }
  }
})

function setImage (path) {
  adviceAnimalImg.src = path
  adviceAnimalImg.className = ''
  clipboard.writeImage(path)
  sendNotification(path)
}

function resetLogo () {
  adviceAnimalImg.src = `${pathTo.images}/doge-icon-512.png`
  adviceAnimalImg.className = 'placeholder'
}

function loading () {
  adviceAnimalImg.src = `${pathTo.images}/doge-icon-512.png`
  adviceAnimalImg.className = 'loading'
}

function sendNotification (path) {
  const title = 'Animal Advisor'
  const options = {
    body: 'Copied advice animal to clipboard',
    icon: path
  }
  return new Notification(title, options)
}

// Context Menu

function createContextMenuFor (event) {
  const contextMenuTemplate = [
    {
      label: 'Reset',
      click: resetLogo
    }, {
      label: 'Save Image as...',
      click () { showSaveImageAsDialog(stripResource(event.target.src)) },
      accelerator: 'Command+Shift+S'
    }, {
      type: 'separator'
    }, {
      label: 'Copy',
      click () { copyToClipboard(stripResource(event.target.src)) },
      accelerator: 'Command+C'
    }
  ]

  const adviceAnimalMenu = Menu.buildFromTemplate(contextMenuTemplate)
  adviceAnimalMenu.popup(currentWindow)
}

adviceAnimalImg.addEventListener('contextmenu', function (event) {
  event.preventDefault()
  createContextMenuFor(event)
}, false)

// Copy to Clipboard
function copyToClipboard (imagePath) {
  clipboard.writeImage(imagePath)
}

// Save Image as... Dialog
function showSaveImageAsDialog (sourcePath) {
  dialog.showSaveDialog(
    currentWindow,
    {title: 'Save Image as...'},
    destination => { saveImageAs(sourcePath, destination) }
  )
}

function saveImageAs (sourcePath, destinationPath) {
  const ext = Path.extname(sourcePath)
  const destinationPathWithExt = `${destinationPath}${ext}`

  copyFile(sourcePath, destinationPathWithExt).then(shell.showItemInFolder)
}

// Utility
function copyFile (sourcePath, destinationPath) {
  return new Promise((resolve, reject) => {
    const readStream = FS.createReadStream(sourcePath)
    readStream.on('error', error => { reject(error) })

    const writeStream = FS.createWriteStream(destinationPath)
    writeStream.on('error', error => { reject(error) })
    writeStream.on(
      'close',
      exception => { exception ? reject(exception) : resolve(destinationPath) }
    )

    readStream.pipe(writeStream)
  })
}

function stripResource (path) {
  return path.replace(/^.+:\//, '')
}
