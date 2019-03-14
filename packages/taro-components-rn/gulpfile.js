const { src, dest, parallel, watch } = require('gulp')
const flowRemoveTypes = require('gulp-flow-remove-types')
const babel = require('gulp-babel')
const ts = require('gulp-typescript')

const tsProject = ts.createProject('tsconfig.json')

const compatibleJsFiles = 'src/**/*.js'
const staticFiles = 'src/**/*.png'

function scripts () {
  return src([compatibleJsFiles])
    .pipe(flowRemoveTypes({
      pretty: true
    }))
    .pipe(babel({
      presets: ['module:metro-react-native-babel-preset']
    }))
    .pipe(dest('dist'))
}

function typescripts () {
  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(babel({
      presets: ['module:metro-react-native-babel-preset']
    })).pipe(dest('dist'))
}

function images () {
  return src([staticFiles])
    .pipe(dest('dist'))
}

// watch(compatibleJsFiles, scripts)

// watch(staticFiles, images)

exports.default = parallel(scripts, typescripts, images)
