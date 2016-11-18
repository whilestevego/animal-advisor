'use strict'

const gulp = require('gulp')
const packager = require('electron-packager')
const install = require('gulp-install')
const runSequence = require('run-sequence')
const info = require('../package.json')
const electronInfo = require('../node_modules/electron/package.json')

gulp.task('install', () => {
  return gulp
    .src(['.tmp/package.json'])
    .pipe(install({production: true}))
})

gulp.task('release', callback => {
  return runSequence.use(gulp)('build', 'install', () => {
    packager({
      dir: '.tmp',
      name: info.name,
      platform: 'darwin',
      arch: 'ia32,x64',
      version: electronInfo.version,
      out: 'release',
      cache: '.cache'
    }, callback)
  })
})
