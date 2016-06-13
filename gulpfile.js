'use strict'

const gulp = require('gulp')
const electron = require('electron-connect').server.create()

gulp.task('serve', function () {
  // Start browser process
  electron.start()

  // Restart browser process
  gulp.watch('src/main/**/*.js', electron.restart)

  // Reload renderer process
  gulp.watch(['src/renderer/**/*.js', 'src/renderer/**/*.html'], electron.reload)
})

gulp.task('reload:browser', function () {
  // Restart main process
  electron.restart()
})

gulp.task('reload:renderer', function () {
  // Reload renderer process
  electron.reload()
})

gulp.task('default', ['serve'])
