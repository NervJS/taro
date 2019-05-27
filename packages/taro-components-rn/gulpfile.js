const { src, dest, parallel } = require('gulp')
const ts = require('gulp-typescript')

const tsProject = ts.createProject('tsconfig.json')
const distPath = 'dist'

function typescripts () {
  return tsProject
    .src()
    .pipe(tsProject())
    .on('error', (err) => {
      console.log(err)
    })
    .pipe(dest(distPath))
}

function images () {
  return src(['src/**/*.png'])
    .pipe(dest(distPath))
}

exports.default = parallel(typescripts, images)
