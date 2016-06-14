/*global Notification */
// Node Modules
import Path from 'path'

// Electron Modules
import {clipboard, shell, remote} from 'electron'

// Internal Modules
import {stripResource, copyFile} from '../lib/utils'
import {generateFromSentence} from '../lib/generator'
import AnimalAdviceMenu from './menus/animal-advice.js'

const {dialog} = remote
const pathTo = remote.getGlobal('pathTo')
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

adviceAnimalImg.addEventListener('contextmenu', function (event) {
  event.preventDefault()

  AnimalAdviceMenu.on('reset', resetLogo)
  AnimalAdviceMenu.on('save-image-as', () => {
    showSaveImageAsDialog(stripResource(event.target.src))
  })
  AnimalAdviceMenu.on('copy', () => {
    clipboard.writeImage(stripResource(event.target.src))
  })

  // TODO: Delegate popup to menu in EventedMenu
  AnimalAdviceMenu.menu.popup(currentWindow)
}, false)

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
