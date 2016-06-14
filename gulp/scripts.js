'use strict'

const gulp = require('gulp')
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const notify = require('gulp-notify')

const sources = ['src/**/*.js']

gulp.task('scripts', () => {
  return gulp
    .src(sources)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .on('error', notify.onError({title: 'scripts'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp'))
})

gulp.task('scripts:watch', () => {
  return gulp.watch(sources, ['scripts'])
})
