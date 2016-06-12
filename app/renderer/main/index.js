/*global Notification */
'use strict'

// Node Modules
const FS = require('fs')
const Path = require('path')

// Electron Modules
const {clipboard, shell, remote} = require('electron')
const {Menu, dialog} = remote

const pathTo = remote.getGlobal('pathTo')
const AnimalAdvisor = require(`${pathTo.lib}/animal-advisor`)

const currentWindow = remote.getCurrentWindow()
const searchQueryInput = document.querySelector('#search-query')
const adviceAnimalImg = document.querySelector('#advice-animal')

searchQueryInput.addEventListener('input', function (event) {
  global.adviceAnimalQuestion = event.target.value
})

searchQueryInput.addEventListener('keydown', function (event) {
  if (event.keyCode === 13) {
    loading()
    const advisor = AnimalAdvisor.create(pathTo.cache)
    advisor.say(global.adviceAnimalQuestion).then(setImage).done()
  }
})

function setImage (path) {
  console.log('Setting image...')
  adviceAnimalImg.src = path
  adviceAnimalImg.className = ''
  clipboard.writeImage(path)
  sendNotification(path)
}

function resetAdviceAnimal () {
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
      click: resetAdviceAnimal
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
    destination => { saveImage(sourcePath, destination) }
  )
}

function saveImage (sourcePath, destinationPath) {
  const ext = Path.extname(sourcePath)
  const destinationPathWithExt = `${destinationPath}${ext}`

  copyFile(sourcePath,
           destinationPathWithExt,
           handleFileCopy(destinationPathWithExt))
}

function handleFileCopy (path) {
  return function (error) {
    if (error) {
      dialog.showErrorBox('Save Image as... failed', error)
    } else if (path) {
      shell.showItemInFolder(path)
    }
  }
}

function copyFile (source, target, callback) {
  let callbackCalled = false

  const readStream = FS.createReadStream(source)
  readStream.on('error', function (error) { done(error) })

  const writeStream = FS.createWriteStream(target)
  writeStream.on('error', function (error) { done(error) })
  writeStream.on('close', function (ex) { done() })

  readStream.pipe(writeStream)

  function done (error) {
    if (!callbackCalled && callback) {
      callback(error)
      callbackCalled = true
    }
  }
}

// Utility
function stripResource (path) {
  return path.replace(/^.+:\//, '')
}
