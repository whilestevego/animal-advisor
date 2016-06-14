'use strict'

const gulp = require('gulp')

const sources = ['src/assets/**/*.{png,gif,jpg,jpeg,woff}']

gulp.task('copy', () => gulp.src(sources).pipe(gulp.dest('.tmp/assets')))
gulp.task('copy:watch', () => gulp.watch(sources, ['copy']))
