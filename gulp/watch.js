'use strict'

const gulp = require('gulp')

gulp.task('watch', [
  'copy:watch',
  'eslint:watch',
  'scripts:watch',
  'styles:watch'
])
