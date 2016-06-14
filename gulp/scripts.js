'use strict'

const gulp = require('gulp')
const babel = require('gulp-babel')
const changed = require('gulp-changed')
const sourcemaps = require('gulp-sourcemaps')
const notify = require('gulp-notify')

const sources = ['src/**/*.{js,jsx}']
const destination = '.tmp'

gulp.task('scripts', () => {
  return gulp
    .src(sources)
    .pipe(changed(destination))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .on('error', notify.onError({title: 'scripts'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destination))
})

gulp.task('scripts:watch', () => {
  return gulp.watch(sources, ['scripts'])
})
