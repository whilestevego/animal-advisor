// Electron Modules
import {clipboard, remote, shell} from 'electron'

// Node Modules
import path from 'path'

// Packaged Library
import genClass from 'classnames'

// React and Components
import React, {PropTypes} from 'react'
import ImageMacroMenu from '../menus/animal-advice.js'

// Internal Modules
import {copyFile} from '../../lib/utils'


const {dialog} = remote
const currentWindow = remote.getCurrentWindow()

export default function ImageMacro ({imagePath, isLoading}) {
  ImageMacroMenu.on('reset', () => {})
  ImageMacroMenu.on('save-image-as', () => {
    showSaveImageAsDialog(imagePath)
  })
  ImageMacroMenu.on('copy', () => {
    clipboard.writeImage(imagePath)
  })

  const handleContextMenu = () => {
    ImageMacroMenu.popup(currentWindow)
  }

  const cn = genClass({
    'image-macro': true,
    'loading': isLoading
  })

  return (
    <section className={cn}>
      <img
        onContextMenu={handleContextMenu}
        src={imagePath ? imagePath : ''} />
    </section>
  )
}

ImageMacro.propTypes = {
  isLoading: PropTypes.bool,
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
