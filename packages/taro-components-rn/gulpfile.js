const gulp = require('gulp')
const flowRemoveTypes = require('gulp-flow-remove-types')
const babel = require('gulp-babel')
const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json')

gulp.task('scripts', function () {
  gulp
    .src(['src/**/*.js'])
    .pipe(flowRemoveTypes({
      pretty: true
    }))
    .pipe(babel({
      presets: ['react-native']
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('typescripts', function () {
  tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(babel({
      presets: ['react-native']
    })).pipe(gulp.dest('dist'))
})

gulp.task('images', function () {
  gulp
    .src(['src/**/*.png'])
    .pipe(gulp.dest('dist'))
})

gulp.task('default', ['scripts', 'typescripts', 'images'])
