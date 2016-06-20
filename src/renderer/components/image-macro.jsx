import path from 'path'
import {copyFile} from '../../lib/utils'
import {clipboard, remote, shell} from 'electron'
import React, {PropTypes} from 'react'
import ImageMacroMenu from '../menus/animal-advice.js'

const {dialog} = remote
const currentWindow = remote.getCurrentWindow()

export default function ImageMacro ({imagePath}) {
  ImageMacroMenu.on('reset', () => {})
  ImageMacroMenu.on('save-image-as', () => {
    showSaveImageAsDialog(imagePath)
  })
  ImageMacroMenu.on('copy', () => {
    clipboard.writeImage(imagePath)
  })

  const handleContextMenu = () => {
    // TODO: Delegate `popup` to menu
    ImageMacroMenu.popup(currentWindow)
  }

  return (
    <img
      alt="Advisor Logo"
      id="advice-animal"
      className="placeholder"
      onContextMenu={handleContextMenu}
      src={imagePath ? imagePath : "../assets/images/doge-icon-512.png"}
    />
  )
}

ImageMacro.propTypes = {
  imagePath: PropTypes.string
}

function showSaveImageAsDialog (sourcePath) {
  dialog.showSaveDialog(
    currentWindow,
    {title: 'Save Image as...'},
    destination => { saveImageAs(sourcePath, destination) }
  )
}

function saveImageAs (sourcePath, destinationPath) {
  const ext = path.extname(sourcePath)
  const destinationPathWithExt = `${destinationPath}${ext}`

  copyFile(sourcePath, destinationPathWithExt).then(shell.showItemInFolder)
}
