'use strict'

const gulp = require('gulp')
const runSequence = require('run-sequence')

gulp.task('build', callback => {
  return runSequence.use(gulp)(
    'clean',
    ['html'],
    ['scripts', 'styles', 'copy'],
    callback
  )
})
