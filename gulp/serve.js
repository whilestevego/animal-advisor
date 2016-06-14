'use strict'

const gulp = require('gulp')
const electronServer = require('electron-connect').server

gulp.task('serve',
  [
    'copy:watch',
    'scripts:watch',
    'styles:watch'
  ],
  () => {
    const electron = electronServer.create()

    electron.start(null, () => {})

    gulp.watch(['.tmp/main/**/*.js'], electron.restart)
    gulp.watch([
      '.tmp/**/*.css',
      '.tmp/renderer/**/*.html',
      '.tmp/renderer/**/*.js'
    ], electron.reload)
  })
