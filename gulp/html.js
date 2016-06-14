'use strict'

const gulp = require('gulp')
const inject = require('gulp-inject')
const rename = require('gulp-rename')

gulp.task('html', () => {
  return gulp
    .src('src/renderer/**/*.html')
    .pipe(
      inject(
        gulp
          .src(['src/assets/**/*.scss'], {read: false})
          .pipe(rename({extname: '.css'})),
          {relative: true}
      )
    )
    .pipe(gulp.dest('.tmp/renderer'))
})
