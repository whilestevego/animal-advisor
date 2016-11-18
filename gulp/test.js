'use strict'

const gulp = require('gulp')
const babel = require('babel-register')
const mocha = require('gulp-mocha')
const notify = require('gulp-notify')

const sources = [
  'test/**/*.test.js'
]

gulp.task('test', () => {
  return gulp
    .src(sources)
    .pipe(mocha({compilers: babel}))
    .on('error', notify.onError({title: 'test'}))
})

gulp.task('test:watch', () => {
  return gulp.watch(sources, ['test'])
})
