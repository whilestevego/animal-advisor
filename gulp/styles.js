'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const notify = require('gulp-notify')

const sources = ['src/assets/**/*.scss']

gulp.task('styles', () => {
  return gulp
    .src(sources)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', notify.onError({title: 'styles'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/assets/'))
})

gulp.task('styles:watch', () => {
  return gulp.watch(sources, ['styles'])
})
