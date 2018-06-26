const gulp = require('gulp')
const flowRemoveTypes = require('gulp-flow-remove-types')
const babel = require('gulp-babel')

gulp.task('scripts', function () {
  gulp
    .src(['src/**/*.js'])
    .pipe(flowRemoveTypes({
      // pretty: true
    }))
    .pipe(babel({
      presets: ['react-native']
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('images', function () {
  gulp
    .src(['src/**/*.png'])
    .pipe(flowRemoveTypes())
    .pipe(gulp.dest('dist'))
})

gulp.task('default', ['scripts', 'images'])
